import { list, put, del } from '@vercel/blob';

export const WHATSAPP = '5585981700898';

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
export const getLeads = () => readAll('leads/');
export const saveLead = (l) =>
  put(`leads/${l.id}.json`, JSON.stringify(l), {
    access: 'public', contentType: 'application/json', addRandomSuffix: true,
  });

export const isAdmin = (req) =>
  !!process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
