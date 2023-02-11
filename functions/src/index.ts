import * as functions from 'firebase-functions';
import * as yup from 'yup';

import {config} from './config';
import {getCollageImage} from './lastfm';
import {postTweet, uploadMedia} from './twitter';

export const requestBodySchema = yup.object({
  collage: yup.object({
    type: yup
        .string()
        .oneOf(['7day', '1month', '3month', '6month', '12month', 'overall'])
        .default('7day'),
    size: yup.string().oneOf(['3x3', '4x4', '5x5', '10x10']).default('5x5'),
    caption: yup.boolean().default(false),
    playcount: yup.boolean().default(false),
  }),
});

export const tweetLastFmCollageImage = functions.https.onRequest(
    async (request, response) => {
      const body = requestBodySchema.validateSync(request.body);
      const image = await getCollageImage({
        username: config.lastfm.username,
        ...body.collage,
      });
      const uploadedMediaResponse = await uploadMedia(config.twitter, image);
      const tweetResponseData = await postTweet(
          config.twitter,
          {mediaId: uploadedMediaResponse.media_id_string}
      );
      response.send({tweetId: tweetResponseData.data.id});
    });
