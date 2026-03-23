import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scrapeAllDecisions, scrapeConstitutionalDecisions } from '@/lib/scraper';
import { prisma } from '@/lib/db/prisma';

// POST /api/scraper - Trigger a scraping run (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';

    // Create scrape log
    const log = await prisma.scrapeLog.create({
      data: {
        source: source === 'kushtetuese' ? 'GJYKATA_KUSHTETUESE' : 'GJYKATA_LARTE',
        status: 'RUNNING',
      },
    });

    let decisions;
    let errors: string[] = [];

    if (source === 'kushtetuese') {
      const result = await scrapeConstitutionalDecisions();
      decisions = result.decisions;
      errors = result.errors;
    } else {
      const [highCourt, constitutional] = await Promise.all([
        scrapeAllDecisions(),
        scrapeConstitutionalDecisions(),
      ]);
      decisions = [...highCourt.decisions, ...constitutional.decisions];
      errors = [...highCourt.errors, ...constitutional.errors];
    }

    // Store decisions in database
    let itemsNew = 0;
    for (const decision of decisions) {
      const existing = await prisma.courtDecision.findFirst({
        where: {
          sourceUrl: decision.sourceUrl,
        },
      });

      if (!existing) {
        await prisma.courtDecision.create({
          data: {
            decisionNumber: decision.decisionNumber,
            caseNumber: decision.caseNumber,
            court: decision.college?.includes('Kushtetuese')
              ? 'GJYKATA_KUSHTETUESE'
              : 'GJYKATA_LARTE',
            college: decision.college,
            decisionType: decision.decisionType,
            decisionDate: decision.decisionDate,
            parties: decision.parties,
            subject: decision.subject,
            summary: decision.summary,
            fullText: decision.fullText,
            pdfUrl: decision.pdfUrl,
            sourceUrl: decision.sourceUrl,
          },
        });
        itemsNew++;
      }
    }

    // Update scrape log
    await prisma.scrapeLog.update({
      where: { id: log.id },
      data: {
        status: errors.length > 0 ? 'FAILED' : 'SUCCESS',
        itemsFound: decisions.length,
        itemsNew,
        error: errors.length > 0 ? errors.join('; ') : null,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      itemsFound: decisions.length,
      itemsNew,
      errors,
    });
  } catch (error) {
    console.error('[Scraper] Error:', error);
    return NextResponse.json({ error: 'Gabim gjatë scraping' }, { status: 500 });
  }
}

// GET /api/scraper - Get scraping logs
export async function GET() {
  try {
    const logs = await prisma.scrapeLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('[Scraper Logs] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
