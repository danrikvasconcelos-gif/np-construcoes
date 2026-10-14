import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUpload({
      body, request,
      onBeforeGenerateToken: async (_path, clientPayload) => {
        if (!process.env.ADMIN_PASSWORD || (clientPayload || '').trim() !== process.env.ADMIN_PASSWORD.trim())
          throw new Error('Não autorizado');
        return { allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'], addRandomSuffix: true, maximumSizeInBytes: 15 * 1024 * 1024 };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
