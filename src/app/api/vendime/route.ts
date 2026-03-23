import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/vendime - Search court decisions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const court = searchParams.get('court');
    const college = searchParams.get('college');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const savedOnly = searchParams.get('saved') === 'true';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { fullText: { contains: search, mode: 'insensitive' } },
        { decisionNumber: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (court) where.court = court;
    if (college) where.college = college;

    if (dateFrom || dateTo) {
      where.decisionDate = {};
      if (dateFrom) (where.decisionDate as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.decisionDate as Record<string, unknown>).lte = new Date(dateTo);
    }

    if (savedOnly) {
      where.savedBy = {
        some: {
          userId: (session.user as { id: string }).id,
        },
      };
    }

    const [decisions, total] = await Promise.all([
      prisma.courtDecision.findMany({
        where,
        include: {
          savedBy: {
            where: {
              userId: (session.user as { id: string }).id,
            },
            select: { id: true },
          },
        },
        orderBy: { decisionDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.courtDecision.count({ where }),
    ]);

    // Map to include isSaved flag
    const mapped = decisions.map((d) => ({
      ...d,
      isSaved: d.savedBy.length > 0,
      savedBy: undefined,
    }));

    return NextResponse.json({
      decisions: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Vendime GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
