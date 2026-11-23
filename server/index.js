import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { init, getContent, setSection, getUsers, saveUsers, UPLOAD_DIR, DATA_DIR } from './store.js';
import { loadSecret, requireAuth, checkLogin, setSessionCookie, clearSessionCookie, hashPassword, verifyPassword } from './auth.js';
import { sections } from './validate.js';
import { saveImage } from './images.js';

// Express 4 does not catch errors in async handlers, so every async route is wrapped.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
process.on('unhandledRejection', (e) => console.error('Unhandled error:', e));

const PORT = Number(process.env.PORT) || 3000;
const DIST = path.resolve('dist');

await init();
await loadSecret();

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', 1); // set when running behind nginx or a hosting proxy so secure cookies work

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"], scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://i0.wp.com', 'https://salemestate.com'],
      connectSrc: ["'self'", 'https://api.web3forms.com'], objectSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'self'"], formAction: ["'self'"],
    },
  },
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' } });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

/* ---------- Public ---------- */
app.get('/api/content', wrap(async (_req, res) => { res.set('Cache-Control', 'no-store'); res.json(await getContent()); }));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '365d', immutable: true, index: false, setHeaders: (r) => r.set('X-Content-Type-Options', 'nosniff') }));

/* ---------- Sign in ---------- */
app.post('/api/login', loginLimiter, wrap(async (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const user = await checkLogin(username, password);
  if (!user) return res.status(401).json({ error: 'Incorrect username or password.' });
  setSessionCookie(req, res, user);
  return res.json({ username: user.username });
}));
app.post('/api/logout', (_req, res) => { clearSessionCookie(res); res.json({ ok: true }); });
app.get('/api/me', requireAuth, (req, res) => res.json({ username: req.user.username }));

app.post('/api/password', requireAuth, loginLimiter, wrap(async (req, res) => {
  const { current = '', next = '' } = req.body || {};
  if (String(next).length < 10) return res.status(400).json({ error: 'The new password must be at least 10 characters.' });
  if (!(await verifyPassword(String(current), req.user.hash))) return res.status(400).json({ error: 'Your current password is not correct.' });
  const users = await getUsers();
  const me = users.find((u) => u.username === req.user.username);
  me.hash = await hashPassword(String(next));
  me.pv = (me.pv || 1) + 1; // signs out every other device
  await saveUsers(users);
  setSessionCookie(req, res, me);
  return res.json({ ok: true });
}));

/* ---------- Admin content ---------- */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 1 } });
const uploadLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 80, standardHeaders: true, legacyHeaders: false });

app.post('/api/admin/upload', requireAuth, uploadLimiter, upload.single('file'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo received.' });
  return res.json(await saveImage(req.file.buffer));
}));
app.put('/api/admin/:section', requireAuth, wrap(async (req, res) => {
  const check = sections[req.params.section];
  if (!check) return res.status(404).json({ error: 'Unknown section.' });
  await setSection(req.params.section, check(req.body));
  return res.json({ ok: true });
}));
app.delete('/api/admin/:section', requireAuth, wrap(async (req, res) => {
  if (!sections[req.params.section]) return res.status(404).json({ error: 'Unknown section.' });
  await setSection(req.params.section, null); // back to the website's original content
  return res.json({ ok: true });
}));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

/* ---------- The website itself ---------- */
app.use('/admin', (_req, res, next) => { res.set('X-Robots-Tag', 'noindex, nofollow'); next(); });
if (fs.existsSync(DIST)) {
  app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '365d', immutable: true }));
  app.use(express.static(DIST, { index: false, maxAge: '1h' }));
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  app.get('*', wrap(async (_req, res) => {
    // The saved content is placed straight into the page so visitors never see a flash of old content.
    const json = JSON.stringify(await getContent()).replace(/</g, '\\u003c');
    res.set('Cache-Control', 'no-cache').type('html').send(html.replace(/(<script id="site-content" type="application\/json">)[\s\S]*?(<\/script>)/, `$1${json}$2`));
  }));
} else {
  console.warn('No "dist" folder found. Run "npm run build" first to serve the website.');
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'That photo is larger than 15 MB. Please choose a smaller one.' });
  if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Salem Estate is running at http://localhost:${PORT}`);
  getUsers().then((u) => { if (!u.length) console.warn('No admin account yet. Create one with:  npm run create-admin'); });
  console.log(`Data folder: ${DATA_DIR}`);
});
