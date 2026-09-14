import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

type Check = { status: 'ok' | 'error'; detail?: string };

/**
 * Keep-alive për projektin Supabase (plani falas pezullon projektet pa
 * "aktivitet" për 7 ditë). Supabase mat kërkesat drejt API-ve të veta
 * (PostgREST, Storage, Auth) — jo lidhjet direkte me Postgres — ndaj ky
 * endpoint bën shprehimisht një kërkesë REST dhe një Storage me çelësin
 * service-role dhe kontrollon statusin HTTP. Thirret çdo ditë nga Vercel
 * Cron (vercel.json) dhe nga GitHub Actions (.github/workflows/keepalive.yml).
 */
export async function GET() {
  const checks: Record<string, Check> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'ok' };
  } catch (e) {
    checks.database = { status: 'error', detail: (e as Error).message };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    checks.supabaseApi = { status: 'error', detail: 'NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY mungojnë' };
  } else {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    try {
      // PostgREST: HEAD mbi tabelën users — vetëm numërim, asnjë e dhënë nuk kthehet
      const rest = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
        method: 'HEAD',
        headers: { ...headers, Prefer: 'count=exact' },
        cache: 'no-store',
      });
      checks.rest = rest.ok
        ? { status: 'ok', detail: `HTTP ${rest.status}` }
        : { status: 'error', detail: `HTTP ${rest.status}` };
    } catch (e) {
      checks.rest = { status: 'error', detail: (e as Error).message };
    }
    try {
      const st = await fetch(`${url}/storage/v1/bucket`, { headers, cache: 'no-store' });
      checks.storage = st.ok
        ? { status: 'ok', detail: `HTTP ${st.status}` }
        : { status: 'error', detail: `HTTP ${st.status}` };
    } catch (e) {
      checks.storage = { status: 'error', detail: (e as Error).message };
    }
  }

  const healthy = Object.values(checks).every((c) => c.status === 'ok');
  return NextResponse.json(
    { status: healthy ? 'ok' : 'degraded', checkedAt: new Date().toISOString(), checks },
    { status: healthy ? 200 : 503 }
  );
}
