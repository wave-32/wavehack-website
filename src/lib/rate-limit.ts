// Lightweight in-memory IP rate limiter (per process).
// For multi-instance prod, swap with Redis/Upstash — this is fine for a single
// server / dev / free tier deploys and prevents basic spam abuse.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetIn: windowMs };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetIn: bucket.resetAt - now };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: limit - bucket.count,
    resetIn: bucket.resetAt - now,
  };
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for") || headers.get("x-real-ip");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
