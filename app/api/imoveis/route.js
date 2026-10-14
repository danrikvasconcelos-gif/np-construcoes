import { NextResponse } from 'next/server';
import { getImoveis, saveImovel, isAdmin, limpar } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getImoveis());
}
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  const d = await req.json();
  if (!d.titulo || !d.fotos?.length) return NextResponse.json({ error: 'Informe título e ao menos uma foto' }, { status: 400 });
  const imovel = { id: Date.now().toString(36), criadoEm: Date.now(), ...limpar(d), fotos: d.fotos.slice(0, 20) };
  await saveImovel(imovel);
  return NextResponse.json(imovel);
}
