# lastfm-collage-twitter

This project contains a [Firebase Cloud Function](https://firebase.google.com/docs/functions)
that, when fired with an HTTP Request, tweets a collage image with albums and
artists from your [Last.fm](https://last.fm) charts. The generated images are
powered by [Tapmusic](https://www.tapmusic.net/).

### Example image

<img src="https://github.com/lsmacedo/lastfm-collage-twitter/blob/main/assets/example-collage.jpeg?raw=true" width=300 height=300 />

# Setup

1. Create a new project on https://developer.twitter.com/
2. Create a new project on http://console.firebase.google.com/
3. Clone this repository
4. Run `firebase init` to associate the directory into a Firebase project
5. Copy the `.env.example` file into a new `.env` file and replace the
   placeholder values with information from your Last.fm account and from your
   Twitter Project

# Deploy

Run `firebase deploy` to deploy the function into your Firebase project.
