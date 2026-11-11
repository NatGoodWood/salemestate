import { createClient } from '@supabase/supabase-js';

// Accepts either variable name: Supabase now calls the public key "publishable",
// older projects call it "anon". Both are safe to use in the browser.
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isConfigured = Boolean(url && key);
export const supabase = isConfigured ? createClient(url, key) : null;

if (!isConfigured) {
  console.warn(
    '[Supabase] Not connected. Missing:',
    [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_PUBLISHABLE_KEY'].filter(Boolean).join(', '),
    '. The file must be named ".env" (with the dot) in the project root, and the dev server must be restarted after editing it.'
  );
}
