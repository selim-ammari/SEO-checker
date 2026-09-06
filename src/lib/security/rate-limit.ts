type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const existing = hits.get(key);

  if (!existing || existing.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  hits.set(key, existing);
  return { allowed: true, retryAfterSec: 0 };
}
