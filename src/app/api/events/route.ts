import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/events - List calendar events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const caseId = searchParams.get('caseId');

    const where: Record<string, unknown> = {
      userId: (session.user as { id: string }).id,
    };

    if (from || to) {
      where.startDate = {};
      if (from) (where.startDate as Record<string, unknown>).gte = new Date(from);
      if (to) (where.startDate as Record<string, unknown>).lte = new Date(to);
    }

    if (caseId) where.caseId = caseId;

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        case: { select: { id: true, title: true, caseNumber: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('[Events GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// POST /api/events - Create a calendar event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startDate, endDate, location, eventType, reminder, caseId } = body;

    if (!title || !startDate) {
      return NextResponse.json(
        { error: 'Titulli dhe data janë të detyrueshme' },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        eventType: eventType || 'MEETING',
        reminder: reminder !== false,
        userId: (session.user as { id: string }).id,
        caseId: caseId || null,
      },
      include: {
        case: { select: { id: true, title: true, caseNumber: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('[Events POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
