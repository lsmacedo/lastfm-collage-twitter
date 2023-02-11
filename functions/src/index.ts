import * as functions from 'firebase-functions';

import {config} from './config';
import {getCollageImage} from './lastfm';
import {postTweet, uploadMedia} from './twitter';

export const tweetLastFmCollageImage = functions.https.onRequest(
    async (request, response) => {
      const image = await getCollageImage(config.lastfm);
      const uploadedMediaResponse = await uploadMedia(config.twitter, image);
      const tweetResponseData = await postTweet(
          config.twitter,
          {mediaId: uploadedMediaResponse.media_id_string}
      );
      response.send({tweetId: tweetResponseData.data.id});
    });
