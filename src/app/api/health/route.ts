import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Thirret çdo ditë nga Vercel Cron (shih vercel.json) që projekti Supabase
// (plani falas) të regjistrojë aktivitet dhe të mos kalojë në pauzë.
export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  try {
    // Kërkesë në Storage API — Supabase e njeh si aktivitet të projektit
    await getSupabase().storage.listBuckets();
    checks.storage = 'ok';
  } catch {
    checks.storage = 'error';
  }

  const healthy = Object.values(checks).every((v) => v === 'ok');
  return NextResponse.json({ status: healthy ? 'ok' : 'degraded', checks }, {
    status: healthy ? 200 : 503,
  });
}
