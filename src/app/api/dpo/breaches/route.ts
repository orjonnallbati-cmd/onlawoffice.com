import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/dpo/breaches - List data breaches for authenticated user
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
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const breaches = await prisma.dataBreach.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { discoveredAt: 'desc' },
    });

    return NextResponse.json(breaches);
  } catch (error) {
    console.error('[Breaches GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/dpo/breaches - Register a data breach
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
      occurredAt,
      discoveredAt,
      severity,
      status,
      affectedSubjects,
      dataCategories,
      measures,
      notes,
      clientId,
    } = body;

    if (!title || !discoveredAt) {
      return NextResponse.json(
        { error: 'Titulli dhe data e zbulimit janë të detyrueshëm' },
        { status: 400 }
      );
    }

    const breach = await prisma.dataBreach.create({
      data: {
        title,
        description,
        occurredAt: occurredAt ? new Date(occurredAt) : null,
        discoveredAt: new Date(discoveredAt),
        severity: severity || 'MEDIUM',
        status: status || 'DETECTED',
        affectedSubjects: affectedSubjects ? parseInt(affectedSubjects) : null,
        dataCategories,
        measures,
        notes,
        clientId: clientId || null,
        userId: (session.user as { id: string }).id,
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(breach, { status: 201 });
  } catch (error) {
    console.error('[Breaches POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
