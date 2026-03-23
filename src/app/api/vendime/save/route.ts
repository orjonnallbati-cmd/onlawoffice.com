import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// POST /api/vendime/save - Save/unsave a court decision
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { decisionId, notes } = await request.json();
    const userId = (session.user as { id: string }).id;

    if (!decisionId) {
      return NextResponse.json({ error: 'decisionId mungon' }, { status: 400 });
    }

    // Check if already saved
    const existing = await prisma.savedDecision.findUnique({
      where: {
        userId_decisionId: { userId, decisionId },
      },
    });

    if (existing) {
      // Unsave
      await prisma.savedDecision.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await prisma.savedDecision.create({
        data: {
          userId,
          decisionId,
          notes: notes || null,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error('[Vendime Save] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
