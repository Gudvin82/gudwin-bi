const buckets = new Map<string, { count: number; resetAt: number }>();

type RateLimitResult = { allowed: boolean; remaining: number; retryAfterMs?: number };

function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function checkUpstashRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const config = getUpstashConfig();
  if (!config) throw new Error("upstash_not_configured");
  const bucketKey = `rl:${key}`;
  const res = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      ["INCR", bucketKey],
      ["PTTL", bucketKey],
      ["PEXPIRE", bucketKey, windowMs]
    ])
  });
  if (!res.ok) throw new Error("upstash_failed");
  const data = (await res.json()) as Array<{ result: number | string | null }>;
  const count = Number(data?.[0]?.result ?? 0);
  const ttl = Number(data?.[1]?.result ?? windowMs);
  const remaining = Math.max(limit - count, 0);
  if (count > limit) {
    return { allowed: false, remaining: 0, retryAfterMs: ttl > 0 ? ttl : windowMs };
  }
  return { allowed: true, remaining };
}

function checkMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, remaining: Math.max(limit - existing.count, 0) };
}

export async function checkRateLimit(key: string, limit = 20, windowMs = 60_000) {
  try {
    return await checkUpstashRateLimit(key, limit, windowMs);
  } catch {
    return checkMemoryRateLimit(key, limit, windowMs);
  }
}
