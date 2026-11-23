import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { resolve } from '../lib/merge';

const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

// The server places the saved content inside the page, so it is available immediately.
function readInline() {
  try {
    const el = document.getElementById('site-content');
    const v = el ? JSON.parse(el.textContent) : null;
    return v && typeof v === 'object' ? v : null;
  } catch { return null; }
}

export function SiteProvider({ children }) {
  const [over, setOver] = useState(() => readInline() || {});

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/content', { cache: 'no-store' });
      if ((r.headers.get('content-type') || '').includes('json')) setOver(await r.json());
    } catch { /* no server (for example plain `npm run dev`): the built-in content is used */ }
  }, []);

  useEffect(() => { if (!readInline()) refresh(); }, [refresh]);

  const value = useMemo(() => ({ ...resolve(over), over, refresh }), [over, refresh]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
