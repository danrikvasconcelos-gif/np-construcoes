import { list, put, del } from '@vercel/blob';

export const WHATSAPP = '5585981700898';
export const INSTAGRAM = 'https://instagram.com/np.construtora_';

async function readAll(prefix) {
  const { blobs } = await list({ prefix });
  const items = await Promise.all(
    blobs.map((b) => fetch(b.url, { cache: 'no-store' }).then((r) => r.json()).catch(() => null))
  );
  return items.filter(Boolean).sort((a, b) => b.criadoEm - a.criadoEm);
}
const save = (path, data) =>
  put(path, JSON.stringify(data), {
    access: 'public', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60,
  });

export async function getImoveis() {
  try { return await readAll('imoveis/'); } catch { return []; }
}
export const saveImovel = (i) => save(`imoveis/${i.id}.json`, i);
export async function deleteImovel(id) {
  const all = await getImoveis();
  const item = all.find((i) => i.id === id);
  const { blobs } = await list({ prefix: `imoveis/${id}.json` });
  await del([...blobs.map((b) => b.url), ...(item?.fotos || [])]);
}
export async function getLeads() {
  try { return await readAll('leads/'); } catch { return []; }
}
export const saveLead = (l) =>
  put(`leads/${l.id}.json`, JSON.stringify(l), {
    access: 'public', contentType: 'application/json', addRandomSuffix: true,
  });

export const isAdmin = (req) =>
  !!process.env.ADMIN_PASSWORD?.trim() && (req.headers.get('x-admin-password') || '').trim() === process.env.ADMIN_PASSWORD.trim();

export function limpar(d) {
  return {
    titulo: String(d.titulo || '').slice(0, 120), tipo: d.tipo === 'Casa' ? 'Casa' : 'Apartamento',
    preco: String(d.preco || '').slice(0, 40), local: String(d.local || '').slice(0, 120),
    quartos: Number(d.quartos) || 0, banheiros: Number(d.banheiros) || 0, area: Number(d.area) || 0,
    descricao: String(d.descricao || '').slice(0, 1500),
    vendedor: String(d.vendedor || '').replace(/\D/g, '').slice(0, 15),
  };
}
export async function updateImovel(id, d) {
  const old = (await getImoveis()).find((i) => i.id === id);
  if (!old) return null;
  const fotos = d.fotos?.length ? d.fotos.slice(0, 20) : old.fotos;
  const novo = { ...old, ...limpar(d), id, criadoEm: old.criadoEm, fotos };
  await saveImovel(novo);
  const removidas = old.fotos.filter((u) => !fotos.includes(u));
  if (removidas.length) await del(removidas).catch(() => {});
  return novo;
}
