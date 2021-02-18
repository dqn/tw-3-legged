import { makeAuthorizationHeader } from "../oauth";
import { getRandomBytes } from "../byte";
import { getNow } from "../date";

jest.mock("./../byte");
const getRandomBytesMock = getRandomBytes as jest.MockedFunction<
  typeof getRandomBytes
>;
getRandomBytesMock.mockImplementation(() => Buffer.from([65]));

jest.mock("./../date");
const getNowMock = getNow as jest.MockedFunction<typeof getNow>;
getNowMock.mockImplementation(() => 1_000);

describe("makeAuthorizationHeader", () => {
  it("test", async () => {
    const authorization = await makeAuthorizationHeader(
      "POST",
      "https://example.com",
      "XXX",
      "YYY",
    );

    expect(authorization).toBe(
      'OAuth oauth_consumer_key="XXX", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1", oauth_version="1.0a", oauth_nonce="QQ%3D%3D", oauth_signature="kyXM2z51SOe1Xa3YYrRzbtKuZKI%3D"',
    );
  });
});
