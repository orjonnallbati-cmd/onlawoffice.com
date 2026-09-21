/**
 * Kufizues i thjeshtë tentativash në memorie (dritare fikse për çelës).
 * Në Vercel çdo instancë serverless ka memorien e vet, pra kufiri është
 * "për instancë" — mjafton për të ngadalësuar hamendjen e kodit të ftesës,
 * por nuk zëvendëson një WAF apo një depo të përbashkët (Redis/Upstash).
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
      if (buckets.size >= MAX_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(headers: Headers) {
  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
