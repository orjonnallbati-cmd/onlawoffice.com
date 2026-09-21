import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { rateLimit, clientIp } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  // Më së shumti 5 tentativa për IP në 15 minuta — përpara çdo kontrolli
  // tjetër, që kodi i ftesës të mos mund të hamendësohet me forcë.
  const limit = rateLimit(`register:${clientIp(request.headers)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Shumë tentativa. Provoni përsëri më vonë.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password, phone, licenseNumber, barAssociation, inviteCode } = body;

    // Platformë e brendshme: çdo llogari kërkon kodin e ftesës të vendosur në
    // REGISTRATION_CODE (Vercel → Environment Variables). Pa këtë variabël,
    // regjistrimi është i mbyllur — asnjë llogari nuk hapet lirisht.
    const expected = process.env.REGISTRATION_CODE;
    if (!expected) {
      return NextResponse.json(
        { error: 'Regjistrimi është i mbyllur. Kontaktoni administratorin e OnLaw Office.' },
        { status: 403 }
      );
    }
    if (typeof inviteCode !== 'string' || inviteCode.length !== expected.length ||
        !timingSafeEqual(Buffer.from(inviteCode), Buffer.from(expected))) {
      return NextResponse.json(
        { error: 'Kodi i ftesës nuk është i saktë' },
        { status: 403 }
      );
    }

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
