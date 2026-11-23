import { ImageField, SaveBar, Field, move, uid, useSection } from './ui';

const pages = [['/projects/salem-estate', 'Salem Estate project'], ['/projects/city-of-david', 'City of David project'], ['/projects/adjiringanor', 'Adjiringanor project'], ['/now-selling', 'Now Selling'], ['/properties', 'Properties'], ['/gallery', 'Gallery'], ['/about-us', 'About us'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
const focus = [['50% 20%', 'Top'], ['50% 35%', 'Upper middle'], ['50% 50%', 'Middle'], ['50% 65%', 'Lower middle'], ['50% 80%', 'Bottom']];
const kind = (s) => (s.action === 'tour' ? 'tour' : s.to ? 'page' : 'none');

export default function SliderEditor() {
  const s = useSection('slides');
  const set = (i, patch) => s.setItems((list) => list.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const setKind = (i, k) => set(i, k === 'tour' ? { action: 'tour', to: '' } : k === 'page' ? { action: '', to: '/contact' } : { action: '', to: '' });
  const add = () => s.setItems([...s.items, { id: uid('slide'), enabled: true, img: '', pos: '50% 50%', tag: 'New', title: '', place: '', text: '', cta: '', to: '', action: '' }]);
  const valid = (list) => {
    const n = list.findIndex((x) => !x.img || !x.title.trim());
    if (n >= 0) return `Slide ${n + 1} needs a photo and a headline.`;
    return list.filter((x) => x.enabled).length ? '' : 'Keep at least one slide switched on.';
  };

  return (
    <>
      <h1>Home slider</h1>
      <p className="muted">These are the large pictures at the top of the home page. They change automatically every few seconds. Use landscape photos (wider than tall) for the best result.</p>
      {s.items.map((x, i) => (
        <section key={x.id} className={`panel adm-item${x.enabled ? '' : ' off'}`}>
          <header>
            <h2>Slide {i + 1}{!x.enabled && <small> (hidden)</small>}</h2>
            <div className="adm-tools">
              <label className="check"><input type="checkbox" checked={x.enabled} onChange={(e) => set(i, { enabled: e.target.checked })} /> Show on website</label>
              <button type="button" onClick={() => s.setItems(move(s.items, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => s.setItems(move(s.items, i, 1))} disabled={i === s.items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="danger" onClick={() => window.confirm('Delete this slide?') && s.setItems(s.items.filter((_, k) => k !== i))}>Delete</button>
            </div>
          </header>
          <div className="adm-grid">
            <div>
              <ImageField value={x.img} onChange={(img) => set(i, { img })} label="Slide photo" />
              <Field label="Which part of the photo to keep when it is cropped"><select value={x.pos} onChange={(e) => set(i, { pos: e.target.value })}>{focus.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            </div>
            <div className="form">
              <div className="row2">
                <Field label="Small label (for example: New development)"><input maxLength={60} value={x.tag} onChange={(e) => set(i, { tag: e.target.value })} /></Field>
                <Field label="Headline"><input maxLength={120} value={x.title} onChange={(e) => set(i, { title: e.target.value })} /></Field>
              </div>
              <Field label="Location line (optional)"><input maxLength={160} value={x.place} onChange={(e) => set(i, { place: e.target.value })} /></Field>
              <Field label="Text under the headline"><textarea rows={2} maxLength={300} value={x.text} onChange={(e) => set(i, { text: e.target.value })} /></Field>
              <div className="row3">
                <Field label="Button"><select value={kind(x)} onChange={(e) => setKind(i, e.target.value)}><option value="none">No button</option><option value="page">Go to a page</option><option value="tour">Open the tour booking form</option></select></Field>
                {kind(x) !== 'none' && <Field label="Button text"><input maxLength={40} value={x.cta} onChange={(e) => set(i, { cta: e.target.value })} /></Field>}
                {kind(x) === 'page' && <Field label="Page"><select value={pages.some(([v]) => v === x.to) ? x.to : ''} onChange={(e) => set(i, { to: e.target.value })}>{!pages.some(([v]) => v === x.to) && <option value="">{x.to}</option>}{pages.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>}
              </div>
            </div>
          </div>
        </section>
      ))}
      <button type="button" className="btn btn-ghost" onClick={add} disabled={s.items.length >= 12}>+ Add a slide</button>
      <SaveBar s={s} valid={valid} />
    </>
  );
}
