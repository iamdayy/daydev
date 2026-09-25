/**
 * Rate limiter sederhana in-memory (fixed window) untuk endpoint sensitif
 * seperti /auth/login. Catatan: in-memory bersifat per-instance. Pada Vercel
 * Fluid compute dengan banyak instance, batas ini tidak global; tetap cukup
 * untuk menaikkan biaya brute-force tanpa infrastruktur tambahan.
 */

import { RateLimitError } from "./http-error";

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

// RateLimitError diimpor dari http-error agar onError global satu sumber.

function now(): number {
  return Date.now();
}

function sweep(): void {
  const cutoff = now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < cutoff) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): void {
  const current = now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < current) {
    bucket = { count: 0, resetAt: current + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.resetAt - current) / 1000),
    );
    throw new RateLimitError(retryAfterSeconds);
  }
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

// Pembersihan berkala supaya Map tidak membesar tak terkendali.
setInterval(sweep, 60 * 1000).unref?.();