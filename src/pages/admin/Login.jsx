import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isConfigured } from '../../lib/supabase';

export default function Login() {
  const { session, isAdmin, signIn } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (session && isAdmin) return <Navigate to="/admin" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await signIn(f.email.trim(), f.password); nav('/admin'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="container narrow section">
      <form className="panel form" onSubmit={onSubmit}>
        <h1 className="h2">Staff sign in</h1>
        {!isConfigured && <p className="error">Supabase is not configured yet. See the README.</p>}
        <label className="field">Email<input type="email" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="field">Password<input type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy || !isConfigured}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
