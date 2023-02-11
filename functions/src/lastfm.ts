import axios from 'axios';
import {LastFmConfig} from './config';

const TAP_MUSIC_URL =
  'https://www.tapmusic.net/collage.php?user=[user]&type=[type]&size=[size]&caption=[caption]&playcount=[playcount]';

const getUrlWithReplacedParams = (params: LastFmConfig) =>
  TAP_MUSIC_URL.replace('[user]', params.user)
      .replace('[type]', params.type)
      .replace('[size]', params.size)
      .replace('[caption]', Boolean(params.caption).toString())
      .replace('[playcount]', Boolean(params.playcount).toString());

export const getCollageImage =
  async (params: LastFmConfig): Promise<ArrayBuffer> => {
    const url = getUrlWithReplacedParams(params);
    const image = await axios.get<ArrayBuffer>(
        url,
        {responseType: 'arraybuffer'}
    );
    return image.data;
  };
