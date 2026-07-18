import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/dpo/ropa - List RoPA entries for authenticated user
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
        { name: { contains: search, mode: 'insensitive' } },
        { purpose: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ];
    }

    const entries = await prisma.ropaEntry.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('[RoPA GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/dpo/ropa - Create a RoPA entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      department,
      purpose,
      legalBasis,
      dataCategories,
      dataSubjects,
      recipients,
      transfers,
      retention,
      securityMeasures,
      status,
      notes,
      clientId,
    } = body;

    if (!name || !purpose) {
      return NextResponse.json(
        { error: 'Emri dhe qëllimi i përpunimit janë të detyrueshëm' },
        { status: 400 }
      );
    }

    const entry = await prisma.ropaEntry.create({
      data: {
        name,
        department,
        purpose,
        legalBasis: legalBasis || 'CONTRACT',
        dataCategories,
        dataSubjects,
        recipients,
        transfers,
        retention,
        securityMeasures,
        status: status || 'ACTIVE',
        notes,
        clientId: clientId || null,
        userId: (session.user as { id: string }).id,
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[RoPA POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
