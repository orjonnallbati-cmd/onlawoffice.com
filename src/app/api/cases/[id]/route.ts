import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/cases/[id] - Get single case with full details
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
    const caseData = await prisma.case.findFirst({
      where: {
        id,
        userId: (session.user as { id: string }).id,
      },
      include: {
        clients: { include: { client: true } },
        documents: true,
        events: { orderBy: { startDate: 'asc' } },
        timeEntries: { orderBy: { date: 'desc' } },
        caseNotes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Çështja nuk u gjet' }, { status: 404 });
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error('[Case GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// PATCH /api/cases/[id] - Update a case
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

    // Verify ownership
    const existing = await prisma.case.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Çështja nuk u gjet' }, { status: 404 });
    }

    const {
      title,
      description,
      status,
      caseType,
      caseNumber,
      courtName,
      courtCaseId,
      judge,
      opposingParty,
      opposingLawyer,
      priority,
      nextHearing,
    } = body;

    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(caseType !== undefined && { caseType }),
        ...(caseNumber !== undefined && { caseNumber }),
        ...(courtName !== undefined && { courtName }),
        ...(courtCaseId !== undefined && { courtCaseId }),
        ...(judge !== undefined && { judge }),
        ...(opposingParty !== undefined && { opposingParty }),
        ...(opposingLawyer !== undefined && { opposingLawyer }),
        ...(priority !== undefined && { priority }),
        ...(nextHearing !== undefined && { nextHearing: nextHearing ? new Date(nextHearing) : null }),
        ...(status?.startsWith('CLOSED') && !existing.closedAt && { closedAt: new Date() }),
      },
      include: {
        clients: { include: { client: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Case PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// DELETE /api/cases/[id] - Delete a case
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
    const existing = await prisma.case.findFirst({
      where: { id, userId: (session.user as { id: string }).id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Çështja nuk u gjet' }, { status: 404 });
    }

    await prisma.case.delete({ where: { id } });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[Case DELETE] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
