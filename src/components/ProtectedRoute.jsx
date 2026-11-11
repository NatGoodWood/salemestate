import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isConfigured } from '../lib/supabase';

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (!isConfigured) return (
    <div className="container narrow section"><div className="panel">
      <h2>Connect your database first</h2>
      <p className="muted">The admin area needs Supabase. Follow the setup steps in the README, add your keys to <code>.env</code>, then restart the dev server.</p>
    </div></div>
  );
  if (loading) return <div className="container section"><p className="muted">Checking your access…</p></div>;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return (
    <div className="container narrow section"><div className="panel">
      <h2>No admin access</h2>
      <p className="muted">You are signed in, but this account is not on the admin list. Ask the site owner to add you.</p>
      <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
    </div></div>
  );
  return children;
}
