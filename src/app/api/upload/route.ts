import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/upload - Upload a document
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Jo i autorizuar' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const caseId = formData.get('caseId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Skedari mungon' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Titulli mungon' }, { status: 400 });
    }

    // If caseId provided, verify ownership
    if (caseId) {
      const existingCase = await prisma.case.findFirst({
        where: { id: caseId, userId: (session.user as { id: string }).id },
      });
      if (!existingCase) {
        return NextResponse.json({ error: 'Çështja nuk u gjet' }, { status: 404 });
      }
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Save to database
    const document = await prisma.document.create({
      data: {
        title,
        fileName: file.name,
        fileUrl: `/uploads/${uniqueName}`,
        fileSize: file.size,
        mimeType: file.type,
        category: (category || 'OTHER') as 'CONTRACT' | 'COURT_FILING' | 'EVIDENCE' | 'CORRESPONDENCE' | 'POWER_OF_ATTORNEY' | 'DECISION' | 'APPEAL' | 'OTHER',
        userId: (session.user as { id: string }).id,
        caseId: caseId || null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('[Upload POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
