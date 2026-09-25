import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

// Password hashing pakai scrypt dari node:crypto, bukan Bun.password:
// supaya runtime-agnostic (Node di Vercel, Bun di lokal/turbo).
// Format: scrypt:N:r:p:salt:key (key hex/base64url).
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

type ScryptParams = { N: number; r: number; p: number };
const scryptAsync = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number,
  options: ScryptParams,
) => Promise<Buffer>;

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const key = await scryptAsync(plain, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `scrypt:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt}:${key.toString("base64url")}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = parts[4];
  const expected = Buffer.from(parts[5], "base64url");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(r) ||
    !Number.isInteger(p) ||
    !salt ||
    expected.length === 0
  ) {
    return false;
  }
  try {
    const derived = await scryptAsync(plain, salt, expected.length, { N: n, r, p });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}