import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');

    const where: Record<string, unknown> = {
      userId: (session.user as { id: string }).id,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        _count: { select: { cases: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('[Clients GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, nuis, type, notes } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Emri dhe mbiemri janë të detyrueshme' },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        nuis,
        type: type || 'INDIVIDUAL',
        notes,
        userId: (session.user as { id: string }).id,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('[Clients POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
