import * as functions from 'firebase-functions';
import * as yup from 'yup';

import { config } from './config';
import { getCollageImage } from './lastfm';
import { postTweet, uploadMedia } from './twitter';

const requestHeadersSchema = yup.object({
  secret_key: yup
    .string()
    .test((value) => value === config.secretKey)
    .required(),
});

const requestBodySchema = yup.object({
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

type RequestBody = yup.InferType<typeof requestBodySchema>;

export const tweetLastFmCollageImage = functions.https.onRequest(
  async (request, response) => {
    let body: RequestBody;

    // Validate request headers
    try {
      requestHeadersSchema.validateSync(request.headers);
    } catch (err) {
      response.sendStatus(401);
      return;
    }

    // Validate request body
    try {
      body = requestBodySchema.validateSync(request.body);
    } catch (err) {
      response.sendStatus(400);
      return;
    }

    try {
      // Get last.fm collage image from Tapmusic
      const image = await getCollageImage({
        username: config.lastfm.username,
        ...body.collage,
      });

      // Upload image and post tweet
      const uploadedMediaResponse = await uploadMedia(config.twitter, image);
      const tweetResponseData = await postTweet(config.twitter, {
        mediaId: uploadedMediaResponse.media_id_string,
      });

      response.send({ tweetId: tweetResponseData.data.id });
    } catch (err) {
      response.sendStatus(500);
    }
  }
);
