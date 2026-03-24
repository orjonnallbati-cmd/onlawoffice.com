import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  ALBANIAN_CODES,
  LEGISLATION_SUMMARIES,
  searchLegislation,
} from '@/lib/scraper';

// GET /api/legislation - Get codes, summaries, and search legislation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category'); // codes, summaries, search

    if (category === 'codes' || (!category && !q)) {
      return NextResponse.json({
        codes: ALBANIAN_CODES,
        summaries: LEGISLATION_SUMMARIES,
      });
    }

    if (category === 'summaries') {
      return NextResponse.json({ summaries: LEGISLATION_SUMMARIES });
    }

    if (q) {
      const results = await searchLegislation(q);
      return NextResponse.json({ results });
    }

    return NextResponse.json({
      codes: ALBANIAN_CODES,
      summaries: LEGISLATION_SUMMARIES,
    });
  } catch (error) {
    console.error('[Legislation] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
