import axios from 'axios';

const TAP_MUSIC_URL =
  'https://www.tapmusic.net/collage.php?user=[user]&type=[type]&size=[size]';

type CollageSettings = {
  username: string;
  type: string;
  size: string;
  caption: boolean;
  playcount: boolean;
};

const getUrlWithReplacedParams = (params: CollageSettings): string =>
  TAP_MUSIC_URL.replace('[user]', params.username)
    .replace('[type]', params.type)
    .replace('[size]', params.size)
    .concat(params.caption ? '&caption=true' : '')
    .concat(params.playcount ? '&playcount=true' : '');

export const getCollageImage = async (
  params: CollageSettings
): Promise<ArrayBuffer> => {
  const url = getUrlWithReplacedParams(params);
  const image = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });
  return image.data;
};
