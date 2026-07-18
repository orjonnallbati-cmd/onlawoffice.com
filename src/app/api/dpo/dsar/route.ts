import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

const DSAR_RESPONSE_DAYS = 30; // Afati ligjor i përgjigjes (Ligji 124/2024)

// GET /api/dpo/dsar - List DSAR requests for authenticated user
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
        { subjectName: { contains: search, mode: 'insensitive' } },
        { subjectEmail: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const requests = await prisma.dsarRequest.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('[DSAR GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/dpo/dsar - Register a DSAR request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subjectName,
      subjectEmail,
      type,
      receivedAt,
      dueDate,
      status,
      description,
      notes,
      clientId,
    } = body;

    if (!subjectName || !receivedAt) {
      return NextResponse.json(
        { error: 'Emri i subjektit dhe data e marrjes janë të detyrueshëm' },
        { status: 400 }
      );
    }

    const received = new Date(receivedAt);
    const due = dueDate
      ? new Date(dueDate)
      : new Date(received.getTime() + DSAR_RESPONSE_DAYS * 24 * 60 * 60 * 1000);

    const dsar = await prisma.dsarRequest.create({
      data: {
        subjectName,
        subjectEmail,
        type: type || 'ACCESS',
        receivedAt: received,
        dueDate: due,
        status: status || 'RECEIVED',
        description,
        notes,
        clientId: clientId || null,
        userId: (session.user as { id: string }).id,
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(dsar, { status: 201 });
  } catch (error) {
    console.error('[DSAR POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
