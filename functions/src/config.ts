import {readEnv} from 'read-env';
import * as yup from 'yup';
import dotenv from 'dotenv';

dotenv.config();

export const configSchema = yup.object({
  twitter: yup.object({
    userId: yup.string().required(),
    username: yup.string().required(),
    auth: yup.object({
      consumerKey: yup.string().required(),
      consumerSecret: yup.string().required(),
      accessToken: yup.string().required(),
      tokenSecret: yup.string().required(),
    }).required(),
  }),
  lastfm: yup.object({
    username: yup.string().required(),
  }),
}).camelCase();

type Config = yup.InferType<typeof configSchema>;
export type TwitterConfig = Config['twitter'];
export type LastFmConfig = Config['lastfm'];

const rawConfig = readEnv('APP');
export const config = configSchema.validateSync(rawConfig);
