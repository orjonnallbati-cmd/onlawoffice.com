import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH /api/dpo/ropa/[id] - Update a RoPA entry
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
    const existing = await prisma.ropaEntry.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Regjistrimi nuk u gjet' }, { status: 404 });
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

    const updated = await prisma.ropaEntry.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(department !== undefined && { department }),
        ...(purpose !== undefined && { purpose }),
        ...(legalBasis !== undefined && { legalBasis }),
        ...(dataCategories !== undefined && { dataCategories }),
        ...(dataSubjects !== undefined && { dataSubjects }),
        ...(recipients !== undefined && { recipients }),
        ...(transfers !== undefined && { transfers }),
        ...(retention !== undefined && { retention }),
        ...(securityMeasures !== undefined && { securityMeasures }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(clientId !== undefined && { clientId: clientId || null }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[RoPA PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/dpo/ropa/[id] - Delete a RoPA entry
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
    const existing = await prisma.ropaEntry.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Regjistrimi nuk u gjet' }, { status: 404 });
    }

    await prisma.ropaEntry.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[RoPA DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
