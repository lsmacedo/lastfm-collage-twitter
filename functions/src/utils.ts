import crypto from 'crypto';
import OAuth1a from 'oauth-1.0a';

type OAuthData = {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
};

export const getAuthParamsForRequest = (
  oAuthData: OAuthData,
  request: OAuth1a.RequestOptions
): OAuth1a.Header => {
  const oauth = new OAuth1a({
    consumer: {
      key: oAuthData.consumerKey,
      secret: oAuthData.consumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64');
    },
  });

  const authorization = oauth.authorize(request, {
    key: oAuthData.accessToken,
    secret: oAuthData.tokenSecret,
  });

  return oauth.toHeader(authorization);
};
