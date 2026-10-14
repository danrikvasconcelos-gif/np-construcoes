'use client';
import { useEffect, useState } from 'react';
import { upload } from '@vercel/blob/client';

const H = (s) => ({ 'x-admin-password': s, 'Content-Type': 'application/json' });
const vazio = { titulo: '', tipo: 'Apartamento', preco: '', local: '', quartos: 2, banheiros: 1, area: '', descricao: '' };

export default function Admin() {
  const [senha, setSenha] = useState('');
  const [ok, setOk] = useState(false);
  const [lista, setLista] = useState([]);
  const [leads, setLeads] = useState([]);
  const [f, setF] = useState(vazio);
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function carregar(s) {
    setLista(await (await fetch('/api/imoveis', { cache: 'no-store' })).json());
    const l = await fetch('/api/contato', { headers: H(s) });
    if (l.ok) setLeads(await l.json());
  }
  async function login(s) {
    const r = await fetch('/api/login', { method: 'POST', headers: H(s) });
    if (r.ok) { await carregar(s); return null; }
    return (await r.json().catch(() => ({}))).error || 'Erro no servidor. Veja os logs na Vercel.';
  }
  useEffect(() => {
    const s = sessionStorage.getItem('np-admin');
    if (s) { setSenha(s); login(s).then((e) => e ? sessionStorage.removeItem('np-admin') : setOk(true)); }
  }, []);

  async function entrar(e) {
    e.preventDefault();
    const erro = await login(senha);
    if (!erro) { sessionStorage.setItem('np-admin', senha); setOk(true); setMsg(null); }
    else setMsg({ e: true, t: erro });
  }
  async function publicar(e) {
    e.preventDefault();
    if (!files.length) return setMsg({ e: true, t: 'Escolha ao menos uma foto.' });
    setBusy(true); setMsg(null);
    try {
      const fotos = [];
      for (const file of files) {
        const b = await upload(`fotos/${file.name}`, file, { access: 'public', handleUploadUrl: '/api/upload', clientPayload: senha });
        fotos.push(b.url);
      }
      const r = await fetch('/api/imoveis', { method: 'POST', headers: H(senha), body: JSON.stringify({ ...f, fotos }) });
      if (!r.ok) throw new Error((await r.json()).error);
      setF(vazio); setFiles([]); e.target.reset(); await carregar(senha);
      setMsg({ t: 'Imóvel publicado no site.' });
    } catch (err) { setMsg({ e: true, t: err.message || 'Erro ao publicar.' }); }
    setBusy(false);
  }
  async function excluir(im) {
    if (!confirm(`Excluir "${im.titulo}" e suas fotos?`)) return;
    await fetch(`/api/imoveis/${im.id}`, { method: 'DELETE', headers: H(senha) });
    carregar(senha);
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (!ok) return (
    <main className="wrap adm"><form className="box" onSubmit={entrar} style={{ maxWidth: 380, margin: '60px auto' }}>
      <h2>Painel NP Construções</h2>
      <label>Senha do administrador<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></label>
      <button className="btn">Entrar</button>
      {msg && <div className="msg err">{msg.t}</div>}
    </form></main>
  );

  return (
    <main className="wrap adm">
      <h1 style={{ marginBottom: 20 }}>Painel do administrador</h1>
      <form className="box" onSubmit={publicar}>
        <h2 style={{ fontSize: '1.7rem', marginBottom: 14 }}>Novo imóvel</h2>
        <label>Título<input required value={f.titulo} onChange={set('titulo')} placeholder="Apartamento 2 quartos com varanda" /></label>
        <div className="r3" style={{ margin: '14px 0' }}>
          <label>Tipo<select value={f.tipo} onChange={set('tipo')}><option>Apartamento</option><option>Casa</option></select></label>
          <label>Preço<input value={f.preco} onChange={set('preco')} placeholder="R$ 185.000" /></label>
          <label>Localização<input value={f.local} onChange={set('local')} placeholder="Bairro, cidade" /></label>
        </div>
        <div className="r3" style={{ marginBottom: 14 }}>
          <label>Quartos<input type="number" min="0" value={f.quartos} onChange={set('quartos')} /></label>
          <label>Banheiros<input type="number" min="0" value={f.banheiros} onChange={set('banheiros')} /></label>
          <label>Área (m²)<input type="number" min="0" value={f.area} onChange={set('area')} /></label>
        </div>
        <label>Descrição<textarea rows="3" value={f.descricao} onChange={set('descricao')} /></label>
        <label style={{ margin: '14px 0' }}>Fotos (JPG, PNG ou WebP; a primeira é a capa)
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} />
        </label>
        <div className="prev">{files.map((x) => <img key={x.name + x.size} src={URL.createObjectURL(x)} alt="" />)}</div>
        <button className="btn" disabled={busy} style={{ marginTop: 16 }}>{busy ? 'Enviando fotos...' : 'Publicar imóvel'}</button>
        {msg && <div className={`msg ${msg.e ? 'err' : 'ok'}`} style={{ marginTop: 12 }}>{msg.t}</div>}
      </form>

      <div className="box"><h2 style={{ fontSize: '1.7rem' }}>Imóveis publicados ({lista.length})</h2>
        {lista.map((im) => (
          <div className="row" key={im.id}><div><img src={im.fotos[0]} alt="" /><span>{im.titulo}<br /><small>{im.fotos.length} fotos</small></span></div>
            <button className="btn del" onClick={() => excluir(im)}>Excluir</button></div>
        ))}
      </div>

      <div className="box"><h2 style={{ fontSize: '1.7rem' }}>Propostas recebidas ({leads.length})</h2>
        {leads.map((l) => (
          <div className="row" key={l.id}><span><b>{l.nome}</b> · {l.email}<br /><small>{new Date(l.criadoEm).toLocaleString('pt-BR')}{l.imovel && ` · ${l.imovel}`}{l.mensagem && ` · ${l.mensagem}`}</small></span>
            <a className="btn" href={`https://wa.me/55${l.whatsapp.replace(/^55/, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></div>
        ))}
      </div>
    </main>
  );
}
