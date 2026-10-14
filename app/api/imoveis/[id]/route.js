import { NextResponse } from 'next/server';
import { deleteImovel, isAdmin } from '@/lib/store';

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  await deleteImovel(params.id);
  return NextResponse.json({ ok: true });
}
