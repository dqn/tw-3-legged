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
