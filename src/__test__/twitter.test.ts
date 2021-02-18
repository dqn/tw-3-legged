import { requestToken, generateAuthUrl } from "./../twitter";
import { request } from "./../request";

const consumerKey = process.env.CONSUMER_KEY!;
const consumerSecret = process.env.CONSUMER_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;

jest.mock("./../request");
const requestMock = request as jest.MockedFunction<typeof request>;

const requestActual = jest.requireActual("./../request")
  .request as typeof request;

describe("requestToken", () => {
  it("test", async () => {
    requestMock.mockResolvedValue(
      "oauth_token=XXX&oauth_token_secret=YYY&oauth_callback_confirmed=true",
    );
    const res = await requestToken(consumerKey, consumerSecret, redirectUri);

    expect(res).toEqual({
      oauthToken: "XXX",
      oauthTokenSecret: "YYY",
      oauthCallbackConfirmed: true,
    });
  });

  xit("test actual", async () => {
    requestMock.mockImplementation(requestActual);
    const res = await requestToken(consumerKey, consumerSecret, redirectUri);
    console.log(res);

    expect(res).not.toBeUndefined();
  });
});

describe("generateAuthUrl", () => {
  it("test", () => {
    const url = generateAuthUrl("XXX");

    expect(url).toBe("https://api.twitter.com/oauth/authorize?oauth_token=XXX");
  });

  xit("test actual", async () => {
    requestMock.mockImplementation(requestActual);
    const { oauthToken } = await requestToken(
      consumerKey,
      consumerSecret,
      redirectUri,
    );
    const url = generateAuthUrl(oauthToken);
    console.log(url);

    expect(url).not.toBeUndefined();
  });
});
