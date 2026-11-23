// Plain-file storage: no database to install. Everything lives in the data folder.
import fs from 'node:fs/promises';
import path from 'node:path';

export const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const CONTENT = path.join(DATA_DIR, 'content.json');
const USERS = path.join(DATA_DIR, 'users.json');

let chain = Promise.resolve();
const locked = (fn) => { const run = chain.then(fn, fn); chain = run.catch(() => {}); return run; }; // one write at a time

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return fallback; throw e; }
}
async function writeJson(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file); // atomic: a crash can never leave a half-written file
}

export async function init() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

/* ---------- Content (only what the admin has changed; everything else uses the site's built-in defaults) ---------- */
let cache = null;
export async function getContent() { if (!cache) cache = await readJson(CONTENT, {}); return cache; }

async function backup() {
  try {
    await fs.copyFile(CONTENT, path.join(BACKUP_DIR, `content-${new Date().toISOString().replace(/[:.]/g, '-')}.json`));
    const files = (await fs.readdir(BACKUP_DIR)).filter((f) => f.startsWith('content-')).sort();
    for (const f of files.slice(0, Math.max(0, files.length - 40))) await fs.unlink(path.join(BACKUP_DIR, f));
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
}

export function setSection(name, value) {
  return locked(async () => {
    const cur = await getContent();
    await backup();
    const next = { ...cur };
    if (value === null) delete next[name]; else next[name] = value;
    next.updatedAt = new Date().toISOString();
    await writeJson(CONTENT, next);
    cache = next;
    cleanupUploads().catch(() => {});
    return next;
  });
}

// Deletes uploaded photos nobody uses any more (after 7 days, and never if a recent backup still points to them).
async function cleanupUploads() {
  let refs = JSON.stringify(await getContent());
  for (const f of await fs.readdir(BACKUP_DIR)) refs += await fs.readFile(path.join(BACKUP_DIR, f), 'utf8');
  const used = new Set([...refs.matchAll(/\/uploads\/([a-f0-9]{16})(?:-sm)?\.jpg/g)].map((m) => m[1]));
  for (const f of await fs.readdir(UPLOAD_DIR)) {
    const m = f.match(/^([a-f0-9]{16})(?:-sm)?\.jpg$/);
    if (!m || used.has(m[1])) continue;
    const st = await fs.stat(path.join(UPLOAD_DIR, f));
    if (Date.now() - st.mtimeMs > 7 * 24 * 3600 * 1000) await fs.unlink(path.join(UPLOAD_DIR, f));
  }
}

/* ---------- Admin users ---------- */
export const getUsers = () => readJson(USERS, []);
export const saveUsers = (users) => locked(() => writeJson(USERS, users));
