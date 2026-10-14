'use client';
import { useEffect, useState } from 'react';

export default function ContatoForm({ titulos }) {
  const [imovel, setImovel] = useState('');
  const [st, setSt] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const h = (e) => setImovel(e.detail);
    window.addEventListener('escolher-imovel', h);
    return () => window.removeEventListener('escolher-imovel', h);
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setBusy(true); setSt(null);
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));
    const r = await fetch('/api/contato', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { form.reset(); setImovel(''); setSt({ ok: true, t: 'Proposta enviada. Nossa equipe vai chamar você no WhatsApp.' }); }
    else setSt({ ok: false, t: j.error || 'Não foi possível enviar. Tente novamente.' });
  }

  return (
    <form onSubmit={enviar}>
      <label>Nome completo<input name="nome" required autoComplete="name" placeholder="Maria da Silva Souza" /></label>
      <label>E-mail<input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" /></label>
      <label>WhatsApp com DDD<input name="whatsapp" type="tel" required autoComplete="tel" placeholder="(85) 98170-0898" /></label>
      <label>Imóvel de interesse
        <select name="imovel" value={imovel} onChange={(e) => setImovel(e.target.value)}>
          <option value="">Ainda não escolhi</option>
          {titulos.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>Mensagem (opcional)<textarea name="mensagem" rows="3" /></label>
      <button className="btn" disabled={busy}>{busy ? 'Enviando...' : 'Enviar proposta'}</button>
      {st && <div className={`msg ${st.ok ? 'ok' : 'err'}`} role="status">{st.t}</div>}
    </form>
  );
}
