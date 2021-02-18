import { createHmac, randomBytes } from "crypto";

function encodeAndJoinArray(arr: string[], separator: string): string {
  return arr.map(encodeURIComponent).join(separator);
}

function makeSignatureBaseString(
  method: string,
  endpoint: string,
  params: Record<string, string>,
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramPairs = sortedKeys.map((key) => [key, params[key]]);
  const paramString = new URLSearchParams(paramPairs).toString();

  return encodeAndJoinArray([method.toUpperCase(), endpoint, paramString], "&");
}

function makeSignatureKey(
  consumerSecret: string,
  accessTokenSecret: string = "",
): string {
  return encodeAndJoinArray([consumerSecret, accessTokenSecret], "&");
}

function oauthParamsToString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ");
}

export function makeAuthorizationHeader(
  method: string,
  endpoint: string,
  consumerKey: string,
  consumerSecret: string,
  additionalParams: Record<string, string> = {},
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1_000).toString(),
    oauth_version: "1.0a",
    oauth_nonce: randomBytes(32).toString("base64"),
    ...additionalParams,
  };

  const key = makeSignatureKey(consumerSecret);
  const base = makeSignatureBaseString(method, endpoint, oauthParams);
  const value = oauthParamsToString({
    ...oauthParams,
    oauth_signature: createHmac("sha1", key).update(base).digest("base64"),
  });

  return "OAuth " + value;
}
