import fetch from "node-fetch";
import type { RequestInfo, RequestInit } from "node-fetch";

export async function request(
  url: RequestInfo,
  init?: RequestInit,
): Promise<string> {
  const res = await fetch(url, init);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text);
  }

  return text;
}
