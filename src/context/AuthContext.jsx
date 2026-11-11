import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ session: null, isAdmin: false, loading: isConfigured });

  useEffect(() => {
    if (!isConfigured) return;
    async function resolve(session) {
      if (!session) return setState({ session: null, isAdmin: false, loading: false });
      // Convenience only: the database policies decide what an admin can really do.
      const { data } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
      setState({ session, isAdmin: Boolean(data), loading: false });
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setTimeout(() => resolve(session), 0));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Incorrect email or password.');
  };
  const signOut = () => supabase.auth.signOut();

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
}
