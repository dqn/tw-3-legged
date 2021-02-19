# tw-3-legged

[![CI](https://github.com/dqn/tw-3-legged/workflows/CI/badge.svg)](https://github.com/dqn/tw-3-legged/actions)
[![npm version](https://img.shields.io/npm/v/tw-3-legged.svg)](https://www.npmjs.com/package/tw-3-legged)

Twitter 3-legged OAuth.

## Installation

Using yarn:

```bash
$ yarn add tw-3-legged
```

Using npm:

```bash
$ npm install tw-3-legged
```

## Example

```js
const { generateAuthUrl, getAccessToken } = require("tw-3-legged");

const consumerKey = "XXXXXXXXXXXXXXXXXXXXXXXXX";
const consumerSecret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const callbackUrl = "http://example.com/callback";

const authUrl = await generateAuthUrl(consumerKey, consumerSecret, callbackUrl);

// Authenticate your application by visiting the URL
// and get `oauth_token` and `oauth_verifier`

const oauthToken = "XXXXXXXXXXXXXXXXXXXXXXXXXX";
const oauthVerifier = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

const res = await getAccessToken(oauthToken, oauthVerifier);

console.log(res.oauthToken);
console.log(res.oauthTokenSecret);
console.log(res.userId);
console.log(res.screenName);
```

## License

MIT
