import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getSupabase } from '@/lib/supabase';

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

    const userId = (session.user as { id: string }).id;

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin';
    const uniqueName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to Supabase Storage
    const supabase = getSupabase();
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(uniqueName, Buffer.from(bytes), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload] Supabase error:', uploadError);
      return NextResponse.json(
        { error: 'Gabim gjatë ngarkimit të skedarit. Sigurohuni që storage është konfiguruar.' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(uniqueName);

    const fileUrl = urlData.publicUrl;

    // Save to database
    const document = await prisma.document.create({
      data: {
        title,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        category: (category || 'OTHER') as 'CONTRACT' | 'COURT_FILING' | 'EVIDENCE' | 'CORRESPONDENCE' | 'POWER_OF_ATTORNEY' | 'DECISION' | 'APPEAL' | 'OTHER',
        userId,
        caseId: caseId || null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('[Upload POST] Error:', error);
    return NextResponse.json({ error: 'Gabim serveri' }, { status: 500 });
  }
}
