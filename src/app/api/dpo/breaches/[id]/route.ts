import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH /api/dpo/breaches/[id] - Update a data breach
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
    const existing = await prisma.dataBreach.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Incidenti nuk u gjet' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      occurredAt,
      discoveredAt,
      notifiedAuthorityAt,
      notifiedSubjectsAt,
      severity,
      status,
      affectedSubjects,
      dataCategories,
      measures,
      notes,
      clientId,
    } = body;

    const updated = await prisma.dataBreach.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(occurredAt !== undefined && {
          occurredAt: occurredAt ? new Date(occurredAt) : null,
        }),
        ...(discoveredAt !== undefined && { discoveredAt: new Date(discoveredAt) }),
        ...(notifiedAuthorityAt !== undefined && {
          notifiedAuthorityAt: notifiedAuthorityAt ? new Date(notifiedAuthorityAt) : null,
        }),
        ...(notifiedSubjectsAt !== undefined && {
          notifiedSubjectsAt: notifiedSubjectsAt ? new Date(notifiedSubjectsAt) : null,
        }),
        ...(severity !== undefined && { severity }),
        ...(status !== undefined && { status }),
        ...(affectedSubjects !== undefined && {
          affectedSubjects: affectedSubjects ? parseInt(affectedSubjects) : null,
        }),
        ...(dataCategories !== undefined && { dataCategories }),
        ...(measures !== undefined && { measures }),
        ...(notes !== undefined && { notes }),
        ...(clientId !== undefined && { clientId: clientId || null }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Breaches PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/dpo/breaches/[id] - Delete a data breach
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
    const existing = await prisma.dataBreach.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Incidenti nuk u gjet' }, { status: 404 });
    }

    await prisma.dataBreach.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[Breaches DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
