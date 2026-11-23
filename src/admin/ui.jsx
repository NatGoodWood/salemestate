import { useEffect, useRef, useState } from 'react';
import { api, uploadImage } from '../lib/adminApi';
import { useSite } from '../context/SiteContext';
import { defaults, smOf } from '../lib/merge';

const clone = (v) => JSON.parse(JSON.stringify(v));
export const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return arr; const c = [...arr]; [c[i], c[j]] = [c[j], c[i]]; return c; };
export const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// Holds the draft for one part of the website and saves it to the server.
export function useSection(name) {
  const { over, refresh } = useSite();
  const start = over[name] ?? defaults[name];
  const [items, setItems] = useState(() => clone(start));
  const [saved, setSaved] = useState(() => JSON.stringify(start));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const dirty = JSON.stringify(items) !== saved;

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save(valid) {
    const problem = valid?.(items);
    if (problem) return setMsg({ ok: false, text: problem });
    setBusy(true); setMsg(null);
    try {
      await api(`/api/admin/${name}`, { method: 'PUT', json: items });
      await refresh();
      setSaved(JSON.stringify(items));
      setMsg({ ok: true, text: 'Saved. Your website now shows these changes.' });
    } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
    return undefined;
  }
  async function reset() {
    if (!window.confirm('Go back to the original content for this section? Everything you changed here will be removed.')) return;
    setBusy(true); setMsg(null);
    try {
      await api(`/api/admin/${name}`, { method: 'DELETE' });
      await refresh();
      setItems(clone(defaults[name])); setSaved(JSON.stringify(defaults[name]));
      setMsg({ ok: true, text: 'This section is back to its original content.' });
    } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
  }
  return { items, setItems, dirty, busy, msg, save, reset };
}

export function SaveBar({ s, valid }) {
  return (
    <div className="savebar" role="status">
      <span className={s.msg ? (s.msg.ok ? 'ok' : 'bad') : 'muted'}>{s.msg ? s.msg.text : s.dirty ? 'You have unsaved changes.' : 'No changes yet.'}</span>
      <div className="actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={s.reset} disabled={s.busy}>Reset to original</button>
        <button type="button" className="btn btn-primary" onClick={() => s.save(valid)} disabled={s.busy || !s.dirty}>{s.busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>
  );
}

export function ImageField({ value, onChange, label = 'Photo', hint }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setErr(''); setBusy(true);
    try { onChange((await uploadImage(file)).src); } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }
  return (
    <div className="imgfield">
      <span className="lbl">{label}</span>
      <div className="imgbox">{value ? <img src={smOf(value)} alt="" /> : <span className="noimg">No photo yet</span>}</div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pick} />
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => ref.current.click()} disabled={busy}>{busy ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}</button>
      {hint && <span className="hint">{hint}</span>}
      {err && <span className="error">{err}</span>}
    </div>
  );
}

export function MultiImage({ images, onChange, max = 12, label = 'Photos' }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    setErr(''); setBusy(true);
    let next = [...images];
    try {
      for (const f of files) {
        if (next.length >= max) { setErr(`You can add up to ${max} photos.`); break; }
        next = [...next, (await uploadImage(f)).src];
        onChange(next);
      }
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }
  return (
    <div className="multi">
      <span className="lbl">{label} <small className="muted">(the first photo is the cover)</small></span>
      {images.length > 0 && (
        <ul className="thumbs-admin">
          {images.map((src, i) => (
            <li key={src}>
              <img src={smOf(src)} alt={`Photo ${i + 1}`} />
              {i === 0 && <span className="cover">Cover</span>}
              <div className="mini">
                <button type="button" onClick={() => onChange(move(images, i, -1))} disabled={i === 0} aria-label="Move earlier">←</button>
                <button type="button" onClick={() => onChange(move(images, i, 1))} disabled={i === images.length - 1} aria-label="Move later">→</button>
                <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label="Remove photo">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={pick} />
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => ref.current.click()} disabled={busy || images.length >= max}>{busy ? 'Uploading…' : 'Add photos'}</button>
      {err && <span className="error">{err}</span>}
    </div>
  );
}

// A text box that edits a list (features split by commas, or paragraphs split by blank lines).
export function ListText({ value, onChange, split, join, rows, ...rest }) {
  const [text, setText] = useState(() => join(value));
  const Tag = rows ? 'textarea' : 'input';
  return <Tag rows={rows} value={text} onChange={(e) => { setText(e.target.value); onChange(split(e.target.value)); }} {...rest} />;
}
export const commaList = { split: (t) => t.split(',').map((x) => x.trim()).filter(Boolean), join: (a) => (a || []).join(', ') };
export const paragraphs = { split: (t) => t.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean), join: (a) => (a || []).join('\n\n') };

export const Field = ({ label, hint, children, className = '' }) => (
  <label className={`field ${className}`}>{label}{children}{hint && <span className="hint">{hint}</span>}</label>
);
