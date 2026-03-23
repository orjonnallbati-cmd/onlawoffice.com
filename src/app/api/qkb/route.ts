import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { searchBusiness } from '@/lib/scraper';

// GET /api/qkb?q=NIPT_OR_NAME - Search QKB business registry
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        { error: 'Shkruani NIPT-in ose emrin e biznesit (min. 2 karaktere)' },
        { status: 400 }
      );
    }

    const businesses = await searchBusiness(q.trim());

    return NextResponse.json({
      query: q,
      results: businesses,
      count: businesses.length,
    });
  } catch (error) {
    console.error('[QKB] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
