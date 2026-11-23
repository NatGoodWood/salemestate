import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { DATA_DIR, getUsers } from './store.js';

const SESSION_MS = 8 * 3600 * 1000;
let secret = process.env.SESSION_SECRET || null;

export async function loadSecret() {
  if (secret) return;
  const file = path.join(DATA_DIR, 'secret.key');
  try { secret = (await fs.readFile(file, 'utf8')).trim(); }
  catch { secret = crypto.randomBytes(48).toString('hex'); await fs.writeFile(file, secret, { mode: 0o600 }); }
}

const hmac = (body) => crypto.createHmac('sha256', secret).update(body).digest('base64url');

export function makeToken(user) {
  const body = Buffer.from(JSON.stringify({ u: user.username, pv: user.pv, exp: Date.now() + SESSION_MS })).toString('base64url');
  return `${body}.${hmac(body)}`;
}

function readToken(token) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const want = Buffer.from(hmac(body)), got = Buffer.from(sig);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch { return null; }
}

function cookie(req, name) {
  const m = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(`${name}=`));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : '';
}

export const setSessionCookie = (req, res, user) =>
  res.cookie('sid', makeToken(user), { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/', maxAge: SESSION_MS });
export const clearSessionCookie = (res) => res.clearCookie('sid', { path: '/' });

const DUMMY = bcrypt.hashSync('not-a-real-password', 12);
export async function checkLogin(username, password) {
  const user = (await getUsers()).find((u) => u.username.toLowerCase() === String(username).trim().toLowerCase());
  const ok = await bcrypt.compare(String(password), user ? user.hash : DUMMY); // same work whether or not the user exists
  return user && ok ? user : null;
}
export const hashPassword = (pw) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

// Requires a valid session. Changing requests must also carry the custom header, which other websites cannot add.
export function requireAuth(req, res, next) {
  authenticate(req, res, next).catch(next);
}
async function authenticate(req, res, next) {
  const p = readToken(cookie(req, 'sid'));
  const user = p && (await getUsers()).find((u) => u.username === p.u && u.pv === p.pv);
  if (!user) return res.status(401).json({ error: 'Please sign in.' });
  if (!['GET', 'HEAD'].includes(req.method) && req.get('x-requested-with') !== 'fetch') return res.status(403).json({ error: 'Blocked request.' });
  req.user = user;
  return next();
}
