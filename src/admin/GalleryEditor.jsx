import { useRef, useState } from 'react';
import { Field, SaveBar, uid, useSection } from './ui';
import { uploadImage } from '../lib/adminApi';
import { smOf } from '../lib/merge';

export default function GalleryEditor() {
  const s = useSection('gallery');
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (id, patch) => s.setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  async function pick(e) {
    const files = [...e.target.files]; e.target.value = '';
    setErr(''); setBusy(true);
    try { for (const f of files) { const r = await uploadImage(f); s.setItems((list) => [...list, { id: uid('photo'), src: r.src, alt: '', label: '' }]); } }
    catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }
  return (
    <>
      <h1>Gallery</h1>
      <p className="muted">Photos added here appear in a “More photos” section at the bottom of the Gallery page, after the existing photos.</p>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={pick} />
      <p><button type="button" className="btn btn-primary" onClick={() => ref.current.click()} disabled={busy || s.items.length >= 60}>{busy ? 'Uploading…' : '+ Add photos'}</button></p>
      {err && <p className="error">{err}</p>}
      <div className="adm-photos">
        {s.items.map((x) => (
          <section key={x.id} className="panel">
            <img src={smOf(x.src)} alt="" />
            <Field label="Caption"><input maxLength={200} value={x.alt} onChange={(e) => set(x.id, { alt: e.target.value })} /></Field>
            <Field label="Small label"><input maxLength={60} value={x.label} onChange={(e) => set(x.id, { label: e.target.value })} /></Field>
            <button type="button" className="danger" onClick={() => s.setItems(s.items.filter((p) => p.id !== x.id))}>Remove</button>
          </section>
        ))}
      </div>
      {s.items.length === 0 && <div className="panel"><p className="muted">No extra photos yet.</p></div>}
      <SaveBar s={s} />
    </>
  );
}
