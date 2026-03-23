import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        licenseNumber: true,
        barAssociation: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Përdoruesi nuk u gjet' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[Profile GET] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}

// PATCH /api/profile - Update profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { name, phone, licenseNumber, barAssociation, currentPassword, newPassword } = body;

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Fjalëkalimi aktual është i detyrueshëm' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'Përdoruesi nuk u gjet' }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isValid) {
        return NextResponse.json({ error: 'Fjalëkalimi aktual nuk është i saktë' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { hashedPassword },
      });
    }

    // Update other fields
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(licenseNumber !== undefined && { licenseNumber }),
        ...(barAssociation !== undefined && { barAssociation }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        licenseNumber: true,
        barAssociation: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Profile PATCH] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
