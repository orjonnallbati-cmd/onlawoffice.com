import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/clients/[id] - Get single client with cases
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { id } = await params;
    const client = await prisma.client.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
      include: {
        cases: {
          include: { case: { select: { id: true, title: true, caseNumber: true, status: true } } },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Klienti nuk u gjet' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('[Client GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// PATCH /api/clients/[id] - Update a client
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.client.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Klienti nuk u gjet' }, { status: 404 });
    }

    const { firstName, lastName, email, phone, address, city, nuis, type, notes } = body;

    const updated = await prisma.client.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(nuis !== undefined && { nuis }),
        ...(type !== undefined && { type }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Client PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.client.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Klienti nuk u gjet' }, { status: 404 });
    }

    await prisma.client.delete({ where: { id } });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[Client DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
