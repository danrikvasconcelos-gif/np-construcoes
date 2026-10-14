import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/store';

export const maxDuration = 30;

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  try {
    const file = (await req.formData()).get('file');
    if (!file || !file.type?.startsWith('image/')) return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
    const blob = await put(`fotos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`, file, {
      access: 'public', contentType: 'image/jpeg', addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return NextResponse.json({ error: `Falha ao salvar a foto no Blob: ${e.message}` }, { status: 500 });
  }
}
