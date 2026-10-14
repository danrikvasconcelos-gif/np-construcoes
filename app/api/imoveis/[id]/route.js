import { NextResponse } from 'next/server';
import { deleteImovel, updateImovel, isAdmin } from '@/lib/store';

export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  const d = await req.json();
  if (!d.titulo) return NextResponse.json({ error: 'Informe o título' }, { status: 400 });
  const r = await updateImovel(params.id, d);
  if (!r) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  return NextResponse.json(r);
}
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  await deleteImovel(params.id);
  return NextResponse.json({ ok: true });
}
