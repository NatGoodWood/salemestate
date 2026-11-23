import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, Link } from 'react-router-dom';
import './admin.css';
import { api } from '../lib/adminApi';
import { useSite } from '../context/SiteContext';
import SliderEditor from './SliderEditor';
import HomesEditor from './HomesEditor';
import ProjectsEditor from './ProjectsEditor';
import GalleryEditor from './GalleryEditor';
import FaqEditor from './FaqEditor';
import SettingsEditor from './SettingsEditor';
import Account from './Account';

const nav = [
  ['/admin', 'Overview', true], ['/admin/slider', 'Home slider'], ['/admin/homes', 'Homes and prices'], ['/admin/projects', 'Projects'],
  ['/admin/gallery', 'Gallery'], ['/admin/faq', 'FAQ'], ['/admin/settings', 'Contact details'], ['/admin/account', 'My account'],
];

function Login({ onDone }) {
  const [f, setF] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { const d = await api('/api/login', { method: 'POST', json: f }); onDone(d.username); } catch (ex) { setError(ex.message); } finally { setBusy(false); }
  }
  return (
    <div className="adm-center">
      <form className="panel form adm-login" onSubmit={submit}>
        <span className="eyebrow">Salem Estate</span>
        <h1 className="h2">Admin sign in</h1>
        <label className="field">Username<input required autoComplete="username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} /></label>
        <label className="field">Password<input type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="muted small">Back to the website</Link>
      </form>
    </div>
  );
}

function Overview() {
  const { over } = useSite();
  const cards = [
    ['/admin/slider', 'Home slider', 'Change the big pictures and headlines at the top of the home page.'],
    ['/admin/homes', 'Homes and prices', 'Update prices, mark homes as sold, add or remove homes and their photos.'],
    ['/admin/projects', 'Projects', 'Change a project’s status label, description and main photo.'],
    ['/admin/gallery', 'Gallery', 'Add new photos to the gallery page.'],
    ['/admin/faq', 'FAQ', 'Edit the questions and answers.'],
    ['/admin/settings', 'Contact details', 'Phone numbers, WhatsApp, email, address and opening hours.'],
  ];
  return (
    <>
      <h1>Welcome</h1>
      <p className="muted">Pick what you want to change. Nothing goes live until you press <strong>Save changes</strong>, and you can always go back with <strong>Reset to original</strong>.{over.updatedAt && <> Last update: {new Date(over.updatedAt).toLocaleString('en-GB')}.</>}</p>
      <div className="adm-cards">{cards.map(([to, h, d]) => <Link key={to} to={to} className="panel adm-card"><h3>{h}</h3><p className="muted">{d}</p></Link>)}</div>
    </>
  );
}

export default function AdminApp() {
  const [auth, setAuth] = useState({ state: 'loading', user: '' });
  useEffect(() => {
    document.title = 'Admin | Salem Estate';
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m);
    return () => m.remove();
  }, []);
  useEffect(() => {
    api('/api/me').then((d) => setAuth(d?.username ? { state: 'in', user: d.username } : { state: 'noserver' }))
      .catch((e) => setAuth({ state: e.status === 401 ? 'out' : 'noserver' }));
  }, []);

  if (auth.state === 'loading') return <div className="adm-center"><p className="muted">Loading…</p></div>;
  if (auth.state === 'noserver') return (
    <div className="adm-center"><div className="panel narrow"><h1 className="h2">Admin is not available here</h1>
      <p className="muted">The admin needs the Salem Estate server. Start it with <code>npm start</code> (or <code>npm run dev:full</code> while developing) and open this page again.</p></div></div>
  );
  if (auth.state === 'out') return <Login onDone={(user) => setAuth({ state: 'in', user })} />;

  const signOut = async () => { await api('/api/logout', { method: 'POST' }).catch(() => {}); setAuth({ state: 'out', user: '' }); };
  return (
    <div className="adm">
      <aside className="adm-side">
        <p className="adm-brand">Salem Estate<small>Admin</small></p>
        <nav aria-label="Admin">{nav.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}</nav>
        <div className="adm-foot"><Link to="/" target="_blank">View website ↗</Link><button onClick={signOut}>Sign out ({auth.user})</button></div>
      </aside>
      <main className="adm-main">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="slider" element={<SliderEditor />} />
          <Route path="homes" element={<HomesEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="gallery" element={<GalleryEditor />} />
          <Route path="faq" element={<FaqEditor />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="account" element={<Account onSignedOut={signOut} />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </main>
    </div>
  );
}
