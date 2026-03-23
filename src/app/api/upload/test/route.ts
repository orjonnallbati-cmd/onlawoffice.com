import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET /api/upload/test - Test Supabase Storage configuration
export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MUNGON';
  checks.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MUNGON';

  if (checks.NEXT_PUBLIC_SUPABASE_URL !== 'OK' || checks.SUPABASE_SERVICE_ROLE_KEY !== 'OK') {
    return NextResponse.json({ status: 'GABIM', checks, message: 'Environment variables mungojnë' });
  }

  try {
    const supabase = getSupabase();

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      checks.buckets = `Gabim: ${bucketsError.message}`;
      return NextResponse.json({ status: 'GABIM', checks });
    }

    const docBucket = buckets?.find(b => b.name === 'documents');
    checks.bucket_documents = docBucket ? 'OK' : 'MUNGON - Krijo bucket "documents" në Supabase Storage';

    // Try a test upload
    if (docBucket) {
      const testContent = Buffer.from('test');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload('_test_connection.txt', testContent, {
          contentType: 'text/plain',
          upsert: true,
        });

      if (uploadError) {
        checks.upload_test = `Gabim: ${uploadError.message}`;
      } else {
        checks.upload_test = 'OK';
        // Clean up
        await supabase.storage.from('documents').remove(['_test_connection.txt']);
      }
    }

    return NextResponse.json({ status: checks.upload_test === 'OK' ? 'OK' : 'GABIM', checks });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: 'GABIM', checks, error: msg });
  }
}
