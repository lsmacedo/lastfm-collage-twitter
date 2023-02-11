import FormData from 'form-data';
import axios from 'axios';
import {TwitterConfig} from './config';
import {getAuthParamsForRequest} from './utils';

type TwitterUploadMediaPayload = {
  media_id: number;
  media_id_string: string;
  media_key: string;
  size: number;
  expires_after_secs: number;
  image: { image_type: string; w: number; h: number; };
}

type TwitterPostTweetInput = {
  text?: string;
  mediaId?: string;
}

type TwitterPostTweetPayload = {
  data: {
    id: string,
    text: string,
  }
}

const MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json';
const POST_TWEET_URL = 'https://api.twitter.com/2/tweets';

export const uploadMedia = async (
    config: TwitterConfig,
    image: ArrayBuffer
) => {
  const headers = {
    'user_id': config.userId,
    'screen_name': config.username,
    'Content-Type': 'multipart/form-data',
  };

  const formData = new FormData();
  formData.append('media', image, {
    filename: 'image.jpeg',
    contentType: 'image/jpeg',
  });
  formData.append('media_category', 'tweet_image');
  formData.append('additional_owners', headers.user_id);

  const requestData = {
    url: MEDIA_UPLOAD_URL,
    method: 'POST',
    body: formData,
  };

  const authParams = getAuthParamsForRequest(config.auth, requestData);

  const response = await axios.post<TwitterUploadMediaPayload>(
      requestData.url,
      requestData.body,
      {headers: {...headers, ...authParams}}
  );
  return response.data;
};

export const postTweet = async (
    config: TwitterConfig,
    tweetData: TwitterPostTweetInput
) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const body = {
    text: tweetData.text,
    media: tweetData.mediaId ?
      {media_ids: [tweetData.mediaId]} :
      undefined,
  };

  const requestData = {
    url: POST_TWEET_URL,
    method: 'POST',
    body,
  };

  const authParams = getAuthParamsForRequest(config.auth, requestData);

  const response = await axios.post<TwitterPostTweetPayload>(
      requestData.url,
      requestData.body,
      {headers: {...headers, ...authParams}}
  );
  return response.data;
};
