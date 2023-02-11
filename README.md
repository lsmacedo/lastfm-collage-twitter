# lastfm-collage-twitter

This project contains a [Firebase Cloud Function](https://firebase.google.com/docs/functions)
that, when fired with a HTTP Request, tweets a collage image with albums and
artists from your [Last.fm](https://last.fm) charts. The generated images are
powered by [Tapmusic](https://www.tapmusic.net/).

### Example image

<img src="https://github.com/lsmacedo/lastfm-collage-twitter/blob/main/assets/example-collage.jpeg?raw=true" width=300 height=300 />

# Setup

1. Create a new project on https://developer.twitter.com/
2. Create a new project on http://console.firebase.google.com/
3. Clone this repository
4. Run `firebase init` to associate the directory into your Firebase project
5. Copy the `.env.example` file into a new `.env` file and replace the
   placeholder values with information from your [Last.fm](https://last.fm)
   account and from your [Twitter Project](https://developer.twitter.com/en/portal/dashboard)

# Deploy

Run `firebase deploy` to deploy the function into your Firebase project.

# Usage

Make a POST request to `/tweetLastFmCollageImage` to get your image tweeted.

The following optional parameters can be passed in your request body to customize the output collage image:

```js
{
  "collage": {
    "type": "7day", // one of: 7day, 1month, 3month, 6month, 12month, overall
    "size": "5x5", // one of: 3x3, 4x4, 5x5, 10x10
    "caption": false,
    "playcount": false
  }
}
```
