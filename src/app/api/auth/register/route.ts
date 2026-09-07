import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, licenseNumber, barAssociation, inviteCode } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Emri, email dhe fjalëkalimi janë të detyrueshme' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere' },
        { status: 400 }
      );
    }

    // Platformë e brendshme: llogaria e parë hapet lirisht (administratori),
    // çdo llogari tjetër kërkon kodin e ftesës të vendosur në REGISTRATION_CODE.
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      const expected = process.env.REGISTRATION_CODE;
      if (!expected) {
        return NextResponse.json(
          { error: 'Regjistrimi është i mbyllur. Kontaktoni administratorin e OnLaw Office.' },
          { status: 403 }
        );
      }
      if (!inviteCode || inviteCode !== expected) {
        return NextResponse.json(
          { error: 'Kodi i ftesës nuk është i saktë' },
          { status: 403 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ky email është tashmë i regjistruar' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        phone: phone || null,
        licenseNumber: licenseNumber || null,
        barAssociation: barAssociation || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('[Register] Error:', error);
    return NextResponse.json(
      { error: 'Ndodhi një gabim gjatë regjistrimit' },
      { status: 500 }
    );
  }
}
