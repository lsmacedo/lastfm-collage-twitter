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
    user: yup.string().required(),
    type: yup
        .string()
        .oneOf(['7day', '1month', '3month', '6month', '12month', 'overall'])
        .default('7day'),
    size: yup.string().oneOf(['3x3', '4x4', '5x5', '10x10']).default('3x3'),
    caption: yup.boolean().default(true),
    playcount: yup.boolean().default(false),
  }),
}).camelCase();

type Config = yup.InferType<typeof configSchema>;
export type TwitterConfig = Config['twitter'];
export type LastFmConfig = Config['lastfm'];

const rawConfig = readEnv('APP');
export const config = configSchema.validateSync(rawConfig);
