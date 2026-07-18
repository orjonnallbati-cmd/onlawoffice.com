import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/dpo/dpia - List DPIAs for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const search = searchParams.get('q');

    const where: Record<string, unknown> = {
      userId: (session.user as { id: string }).id,
    };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { processName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const dpias = await prisma.dpia.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(dpias);
  } catch (error) {
    console.error('[DPIA GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/dpo/dpia - Create a DPIA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      processName,
      description,
      riskLevel,
      status,
      mitigations,
      consultedAuthority,
      reviewDate,
      notes,
      clientId,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Titulli është i detyrueshëm' }, { status: 400 });
    }

    const dpia = await prisma.dpia.create({
      data: {
        title,
        processName,
        description,
        riskLevel: riskLevel || 'MEDIUM',
        status: status || 'DRAFT',
        mitigations,
        consultedAuthority: Boolean(consultedAuthority),
        reviewDate: reviewDate ? new Date(reviewDate) : null,
        notes,
        clientId: clientId || null,
        userId: (session.user as { id: string }).id,
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(dpia, { status: 201 });
  } catch (error) {
    console.error('[DPIA POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
