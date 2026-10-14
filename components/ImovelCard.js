'use client';
import { useState } from 'react';

export default function ImovelCard({ im, whatsapp }) {
  const num = (im.vendedor || whatsapp).replace(/\D/g, '').replace(/^(?!55)/, '55');
  const zap = `https://wa.me/${num}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel "${im.titulo}"${im.preco ? ` (${im.preco})` : ''} que vi no site da NP Construções. Pode me passar mais informações?`)}`;
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(0);
  const f = im.fotos;
  return (
    <article className="card">
      <button className="ph" onClick={() => { setN(0); setOpen(true); }} aria-label={`Ver fotos de ${im.titulo}`}>
        <img src={f[0]} alt={im.titulo} loading="lazy" />
        <span className="tag">{im.tipo}</span>
        {f.length > 1 && <span className="cnt">{f.length} fotos</span>}
      </button>
      <div className="bd">
        <h3>{im.titulo}</h3>
        {im.local && <div className="meta">{im.local}</div>}
        {im.preco && <div className="preco">{im.preco}</div>}
        <div className="meta">
          {im.quartos > 0 && <span>{im.quartos} quartos</span>}
          {im.banheiros > 0 && <span>{im.banheiros} banheiros</span>}
          {im.area > 0 && <span>{im.area} m²</span>}
        </div>
        {im.descricao && <p style={{ fontSize: '.95rem' }}>{im.descricao}</p>}
        <a className="btn" href={zap} target="_blank" rel="noopener noreferrer">Quero uma proposta</a>
      </div>
      {open && (
        <div className="lb" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button className="btn x" onClick={() => setOpen(false)}>Fechar</button>
          <img src={f[n]} alt={`${im.titulo}, foto ${n + 1}`} onClick={(e) => e.stopPropagation()} />
          <div className="nv" onClick={(e) => e.stopPropagation()}>
            <button className="btn" onClick={() => setN((n + f.length - 1) % f.length)}>Anterior</button>
            <span>{n + 1} / {f.length}</span>
            <button className="btn" onClick={() => setN((n + 1) % f.length)}>Próxima</button>
          </div>
          <div className="th" onClick={(e) => e.stopPropagation()}>
            {f.map((u, i) => <img key={u} src={u} alt="" className={i === n ? 'on' : ''} onClick={() => setN(i)} />)}
          </div>
        </div>
      )}
    </article>
  );
}
