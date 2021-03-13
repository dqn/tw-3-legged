import { getRequestToken, generateAuthUrl, getAccessToken } from "./../twitter";
import { request } from "./../request";

const consumerKey = process.env.CONSUMER_KEY!;
const consumerSecret = process.env.CONSUMER_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;
const oauthToken = process.env.OAUTH_TOKEN!;
const oauthVerifier = process.env.OAUTH_VERIFIER!;

jest.mock("./../request");
const requestMock = request as jest.MockedFunction<typeof request>;

const requestActual = jest.requireActual("./../request")
  .request as typeof request;

describe("requestToken", () => {
  it("test", async () => {
    requestMock.mockResolvedValue(
      "oauth_token=XXX&oauth_token_secret=YYY&oauth_callback_confirmed=true",
    );
    const res = await getRequestToken(consumerKey, consumerSecret, redirectUri);

    expect(res).toEqual({
      oauthToken: "XXX",
      oauthTokenSecret: "YYY",
      oauthCallbackConfirmed: true,
    });
  });

  xit("test actual", async () => {
    requestMock.mockImplementation(requestActual);
    const res = await getRequestToken(consumerKey, consumerSecret, redirectUri);
    console.log(res);

    expect(res).not.toBeUndefined();
  });
});

describe("generateAuthUrl", () => {
  it("test", async () => {
    requestMock.mockResolvedValue(
      "oauth_token=XXX&oauth_token_secret=YYY&oauth_callback_confirmed=true",
    );
    const url = await generateAuthUrl("XXX", "YYY", "ZZZ");

    expect(url).toBe("https://api.twitter.com/oauth/authorize?oauth_token=XXX");
  });

  xit("test actual", async () => {
    requestMock.mockImplementation(requestActual);
    const url = await generateAuthUrl(consumerKey, consumerSecret, redirectUri);
    console.log(url);

    expect(url).not.toBeUndefined();
  });
});

describe("accessToken", () => {
  it("test", async () => {
    requestMock.mockResolvedValue(
      "oauth_token=XXX&oauth_token_secret=YYY&user_id=42&screen_name=foo",
    );
    const res = await getAccessToken("XXX", "YYY");

    expect(res).toEqual({
      oauthToken: "XXX",
      oauthTokenSecret: "YYY",
      userId: "42",
      screenName: "foo",
    });
  });

  xit("test actual", async () => {
    requestMock.mockImplementation(requestActual);
    const res = await getAccessToken(oauthToken, oauthVerifier);
    console.log(res);

    expect(res).not.toBeUndefined();
  });
});
