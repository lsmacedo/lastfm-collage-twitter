import FormData from 'form-data';
import axios from 'axios';
import crypto from 'crypto';
import OAuth1a from 'oauth-1.0a';
import {TwitterConfig} from './config';

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

const getAuthHeaderForRequest = (
    config: TwitterConfig,
    request: OAuth1a.RequestOptions
) => {
  const oauth = new OAuth1a({
    consumer: {
      key: config.auth.consumerKey,
      secret: config.auth.consumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
    },
  });

  const authorization = oauth.authorize(request, {
    key: config.auth.accessToken,
    secret: config.auth.tokenSecret,
  });

  return oauth.toHeader(authorization);
};

export const uploadMedia = async (
    config: TwitterConfig,
    image: ArrayBuffer
): Promise<TwitterUploadMediaPayload> => {
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

  const authParams = getAuthHeaderForRequest(config, requestData);

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
): Promise<TwitterPostTweetPayload> => {
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

  const authParams = getAuthHeaderForRequest(config, requestData);

  const response = await axios.post<TwitterPostTweetPayload>(
      requestData.url,
      requestData.body,
      {headers: {...headers, ...authParams}}
  );
  return response.data;
};
