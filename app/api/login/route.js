import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/store';

export async function POST(req) {
  if (!process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'A variável ADMIN_PASSWORD não está configurada na Vercel (ou falta um Redeploy).' }, { status: 500 });
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  return NextResponse.json({ ok: true });
}
