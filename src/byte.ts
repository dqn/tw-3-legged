import { randomBytes } from "crypto";

export function getRandomBytes(size: number): Buffer {
  return randomBytes(size);
}
