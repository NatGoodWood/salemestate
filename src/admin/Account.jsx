import { useState } from 'react';
import { api } from '../lib/adminApi';

export default function Account({ onSignedOut }) {
  const [f, setF] = useState({ current: '', next: '', again: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (f.next !== f.again) return setMsg({ ok: false, text: 'The two new passwords do not match.' });
    setBusy(true); setMsg(null);
    try { await api('/api/password', { method: 'POST', json: { current: f.current, next: f.next } }); setF({ current: '', next: '', again: '' }); setMsg({ ok: true, text: 'Password changed. Any other device that was signed in has been signed out.' }); }
    catch (ex) { setMsg({ ok: false, text: ex.message }); } finally { setBusy(false); }
    return undefined;
  }
  return (
    <>
      <h1>My account</h1>
      <form className="panel form narrow-form" onSubmit={submit}>
        <h2 className="h2">Change password</h2>
        <label className="field">Current password<input type="password" required autoComplete="current-password" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></label>
        <label className="field">New password<input type="password" required minLength={10} autoComplete="new-password" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /><span className="hint">At least 10 characters. A few random words is a strong choice.</span></label>
        <label className="field">Repeat the new password<input type="password" required minLength={10} autoComplete="new-password" value={f.again} onChange={(e) => setF({ ...f, again: e.target.value })} /></label>
        {msg && <p className={msg.ok ? 'ok' : 'error'} role="status">{msg.text}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
      </form>
      <p><button className="btn btn-ghost" onClick={onSignedOut}>Sign out</button></p>
    </>
  );
}
