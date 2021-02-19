import * as z from "zod";
import { makeAuthorizationHeader } from "./oauth";
import { request } from "./request";

export type RequestTokenResponse = {
  oauthToken: string;
  oauthTokenSecret: string;
  oauthCallbackConfirmed: boolean;
};

export async function requestToken(
  consumerKey: string,
  consumerSecret: string,
  callbackUrl: string,
): Promise<RequestTokenResponse> {
  const method = "POST";
  const endpoint = "https://api.twitter.com/oauth/request_token";

  const authorization = makeAuthorizationHeader(
    method,
    endpoint,
    consumerKey,
    consumerSecret,
    { oauth_callback: callbackUrl },
  );

  const res = await request(endpoint, {
    method,
    headers: {
      Authorization: authorization,
    },
  });

  const params = new URLSearchParams(res);

  return {
    oauthToken: z.string().parse(params.get("oauth_token")),
    oauthTokenSecret: z.string().parse(params.get("oauth_token_secret")),
    oauthCallbackConfirmed:
      z.string().parse(params.get("oauth_callback_confirmed")) === "true",
  };
}

export async function generateAuthUrl(
  consumerKey: string,
  consumerSecret: string,
  callbackUrl: string,
): Promise<string> {
  const { oauthToken } = await requestToken(
    consumerKey,
    consumerSecret,
    callbackUrl,
  );

  const url = new URL("https://api.twitter.com/oauth/authorize");
  url.search = new URLSearchParams({ oauth_token: oauthToken }).toString();

  return url.toString();
}

export type AccessTokenResponse = {
  oauthToken: string;
  oauthTokenSecret: string;
  userId: number;
  screenName: string;
};

export async function accessToken(
  oauthToken: string,
  oauthVerifier: string,
): Promise<AccessTokenResponse> {
  const url = new URL("https://api.twitter.com/oauth/access_token");
  url.search = new URLSearchParams({
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
  }).toString();

  const res = await request(url, { method: "POST" });

  const params = new URLSearchParams(res);

  return {
    oauthToken: z.string().parse(params.get("oauth_token")),
    oauthTokenSecret: z.string().parse(params.get("oauth_token_secret")),
    userId: Number(z.string().parse(params.get("user_id"))),
    screenName: z.string().parse(params.get("screen_name")),
  };
}
