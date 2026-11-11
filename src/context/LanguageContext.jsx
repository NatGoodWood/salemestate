import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);
export const useT = () => useContext(LanguageContext);

const read = () => { try { return localStorage.getItem('lang') === 'tw' ? 'tw' : 'en'; } catch { return 'en'; } };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(read);
  useEffect(() => {
    document.documentElement.lang = lang === 'tw' ? 'ak' : 'en'; // ISO code for Akan/Twi
    try { localStorage.setItem('lang', lang); } catch { /* storage blocked: ignore */ }
  }, [lang]);

  const t = useCallback((key, vars) => {
    let s = translations[lang][key] ?? translations.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
    return s;
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, t, toggle: () => setLang(lang === 'en' ? 'tw' : 'en') }}>{children}</LanguageContext.Provider>;
}
