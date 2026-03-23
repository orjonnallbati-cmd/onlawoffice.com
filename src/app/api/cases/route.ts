import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/cases - List all cases for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const caseType = searchParams.get('type');
    const search = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {
      userId: (session.user as { id: string }).id,
    };

    if (status) where.status = status;
    if (caseType) where.caseType = caseType;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          clients: {
            include: { client: true },
          },
          _count: {
            select: { documents: true, events: true, timeEntries: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Cases GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/cases - Create a new case
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      caseType,
      caseNumber,
      courtName,
      courtCaseId,
      judge,
      opposingParty,
      opposingLawyer,
      priority,
      nextHearing,
      clientIds,
    } = body;

    if (!title || !caseType) {
      return NextResponse.json(
        { error: 'Titulli dhe lloji i çështjes janë të detyrueshme' },
        { status: 400 }
      );
    }

    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        caseType,
        caseNumber,
        courtName,
        courtCaseId,
        judge,
        opposingParty,
        opposingLawyer,
        priority: priority || 'MEDIUM',
        nextHearing: nextHearing ? new Date(nextHearing) : null,
        userId: (session.user as { id: string }).id,
        clients: clientIds?.length
          ? {
              create: clientIds.map((clientId: string) => ({
                clientId,
              })),
            }
          : undefined,
      },
      include: {
        clients: { include: { client: true } },
      },
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('[Cases POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
