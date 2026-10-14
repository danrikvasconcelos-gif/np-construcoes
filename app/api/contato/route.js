import { NextResponse } from 'next/server';
import { saveLead, getLeads, isAdmin } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  return NextResponse.json(await getLeads());
}
export async function POST(req) {
  const d = await req.json();
  const nome = String(d.nome || '').trim().slice(0, 120);
  const email = String(d.email || '').trim().slice(0, 120);
  const whatsapp = String(d.whatsapp || '').replace(/\D/g, '').slice(0, 15);
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (nome.split(/\s+/).length < 2 || !re.test(email) || whatsapp.length < 10)
    return NextResponse.json({ error: 'Preencha nome completo, e-mail válido e WhatsApp com DDD.' }, { status: 400 });
  const lead = { id: Date.now().toString(36), criadoEm: Date.now(), nome, email, whatsapp,
    imovel: String(d.imovel || '').slice(0, 120), mensagem: String(d.mensagem || '').slice(0, 1000) };
  await saveLead(lead);
  if (process.env.RESEND_API_KEY && process.env.EMAIL_DESTINO) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NP Construções <onboarding@resend.dev>', to: [process.env.EMAIL_DESTINO],
        subject: `Nova proposta: ${nome}`,
        text: `Nome: ${nome}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\nImóvel: ${lead.imovel || '-'}\nMensagem: ${lead.mensagem || '-'}`,
      }),
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
