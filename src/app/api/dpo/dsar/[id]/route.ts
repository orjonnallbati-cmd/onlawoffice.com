import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH /api/dpo/dsar/[id] - Update a DSAR request
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
    const existing = await prisma.dsarRequest.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Kërkesa nuk u gjet' }, { status: 404 });
    }

    const body = await request.json();
    const {
      subjectName,
      subjectEmail,
      type,
      receivedAt,
      dueDate,
      completedAt,
      status,
      description,
      response,
      notes,
      clientId,
    } = body;

    const updated = await prisma.dsarRequest.update({
      where: { id },
      data: {
        ...(subjectName !== undefined && { subjectName }),
        ...(subjectEmail !== undefined && { subjectEmail }),
        ...(type !== undefined && { type }),
        ...(receivedAt !== undefined && { receivedAt: new Date(receivedAt) }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
        ...(status !== undefined && { status }),
        ...(description !== undefined && { description }),
        ...(response !== undefined && { response }),
        ...(notes !== undefined && { notes }),
        ...(clientId !== undefined && { clientId: clientId || null }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[DSAR PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/dpo/dsar/[id] - Delete a DSAR request
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
    const existing = await prisma.dsarRequest.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Kërkesa nuk u gjet' }, { status: 404 });
    }

    await prisma.dsarRequest.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DSAR DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
