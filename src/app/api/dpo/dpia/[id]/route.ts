import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH /api/dpo/dpia/[id] - Update a DPIA
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
    const existing = await prisma.dpia.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Vlerësimi nuk u gjet' }, { status: 404 });
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
      completedAt,
      reviewDate,
      notes,
      clientId,
    } = body;

    const updated = await prisma.dpia.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(processName !== undefined && { processName }),
        ...(description !== undefined && { description }),
        ...(riskLevel !== undefined && { riskLevel }),
        ...(status !== undefined && { status }),
        ...(mitigations !== undefined && { mitigations }),
        ...(consultedAuthority !== undefined && {
          consultedAuthority: Boolean(consultedAuthority),
        }),
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
        ...(reviewDate !== undefined && {
          reviewDate: reviewDate ? new Date(reviewDate) : null,
        }),
        ...(notes !== undefined && { notes }),
        ...(clientId !== undefined && { clientId: clientId || null }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[DPIA PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/dpo/dpia/[id] - Delete a DPIA
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
    const existing = await prisma.dpia.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Vlerësimi nuk u gjet' }, { status: 404 });
    }

    await prisma.dpia.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DPIA DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
