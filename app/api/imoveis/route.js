import { NextResponse } from 'next/server';
import { getImoveis, saveImovel, isAdmin } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getImoveis());
}
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  const d = await req.json();
  if (!d.titulo || !d.fotos?.length) return NextResponse.json({ error: 'Informe título e ao menos uma foto' }, { status: 400 });
  const imovel = {
    id: Date.now().toString(36), criadoEm: Date.now(),
    titulo: String(d.titulo).slice(0, 120), tipo: d.tipo === 'Casa' ? 'Casa' : 'Apartamento',
    preco: String(d.preco || '').slice(0, 40), local: String(d.local || '').slice(0, 120),
    quartos: Number(d.quartos) || 0, banheiros: Number(d.banheiros) || 0, area: Number(d.area) || 0,
    descricao: String(d.descricao || '').slice(0, 1500), fotos: d.fotos.slice(0, 20),
  };
  await saveImovel(imovel);
  return NextResponse.json(imovel);
}
