import { useState } from 'react';
import { Field, ListText, MultiImage, SaveBar, commaList, uid, useSection } from './ui';
import { formatPrice } from '../lib/format';
import { smOf } from '../lib/merge';

const blank = () => ({ id: uid('home'), title: '', price: 0, currency: 'GHS', listing_type: 'sale', property_type: 'house', status: 'draft', featured: false, bedrooms: '', bathrooms: '', area_sqm: '', location: '', city: 'Accra', description: '', features: [], images: [], created_at: new Date().toISOString() });

export default function HomesEditor() {
  const s = useSection('listings');
  const [open, setOpen] = useState(null);
  const set = (id, patch) => s.setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const add = () => { const h = blank(); s.setItems([h, ...s.items]); setOpen(h.id); };
  const valid = (list) => {
    const bad = list.find((x) => !x.title.trim() || !x.location.trim());
    return bad ? `"${bad.title || 'A new home'}" needs a title and an area.` : '';
  };

  return (
    <>
      <h1>Homes and prices</h1>
      <p className="muted">Change a price or mark a home as sold directly in the list. Press <strong>Edit details</strong> for photos, description and other information. Homes set to <em>Draft</em> are hidden from visitors.</p>
      <p><button type="button" className="btn btn-primary" onClick={add}>+ Add a home</button></p>

      {s.items.map((x) => (
        <section key={x.id} className="panel adm-item">
          <div className="home-row">
            <div className="home-thumb">{x.images?.[0] ? <img src={smOf(x.images[0])} alt="" /> : <span className="noimg">No photo</span>}</div>
            <div className="home-main">
              <strong>{x.title || 'Untitled home'}</strong>
              <span className="muted small">{x.location}{x.location && x.city ? ', ' : ''}{x.city}</span>
              <span className="price-now">{Number(x.price) > 0 ? `Shows as: Starting at ${formatPrice(x.price, x.currency)}` : 'Shows as: Contact for price'}</span>
            </div>
            <div className="home-quick">
              <Field label="Price"><input type="number" min="0" step="any" inputMode="decimal" value={x.price} onChange={(e) => set(x.id, { price: e.target.value === '' ? '' : Number(e.target.value) })} /></Field>
              <Field label="Currency"><select value={x.currency} onChange={(e) => set(x.id, { currency: e.target.value })}><option value="GHS">GH₵ cedis</option><option value="USD">$ dollars</option></select></Field>
              <Field label="Status"><select value={x.status} onChange={(e) => set(x.id, { status: e.target.value })}><option value="published">On sale</option><option value="sold">Sold</option><option value="draft">Hidden (draft)</option></select></Field>
            </div>
            <div className="adm-tools">
              <button type="button" onClick={() => setOpen(open === x.id ? null : x.id)}>{open === x.id ? 'Close' : 'Edit details'}</button>
              <button type="button" className="danger" onClick={() => window.confirm(`Delete "${x.title || 'this home'}"?`) && s.setItems(s.items.filter((h) => h.id !== x.id))}>Delete</button>
            </div>
          </div>

          {open === x.id && (
            <div className="form adm-more">
              <Field label="Title"><input maxLength={140} value={x.title} onChange={(e) => set(x.id, { title: e.target.value })} /></Field>
              <div className="row3">
                <Field label="Area or neighbourhood"><input maxLength={100} value={x.location} onChange={(e) => set(x.id, { location: e.target.value })} /></Field>
                <Field label="City"><input maxLength={60} value={x.city} onChange={(e) => set(x.id, { city: e.target.value })} /></Field>
                <Field label="Type"><select value={x.property_type} onChange={(e) => set(x.id, { property_type: e.target.value })}>{['house', 'apartment', 'townhouse', 'land', 'commercial'].map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}</select></Field>
              </div>
              <div className="row3">
                <Field label="Bedrooms"><input type="number" min="0" value={x.bedrooms ?? ''} onChange={(e) => set(x.id, { bedrooms: e.target.value })} /></Field>
                <Field label="Bathrooms"><input type="number" min="0" value={x.bathrooms ?? ''} onChange={(e) => set(x.id, { bathrooms: e.target.value })} /></Field>
                <Field label="Size (square metres)"><input type="number" min="0" value={x.area_sqm ?? ''} onChange={(e) => set(x.id, { area_sqm: e.target.value })} /></Field>
              </div>
              <div className="row2">
                <Field label="For"><select value={x.listing_type} onChange={(e) => set(x.id, { listing_type: e.target.value })}><option value="sale">Sale</option><option value="rent">Rent (price per month)</option></select></Field>
                <label className="check"><input type="checkbox" checked={x.featured} onChange={(e) => set(x.id, { featured: e.target.checked })} /> Show first on the home page</label>
              </div>
              <Field label="Description"><textarea rows={5} maxLength={5000} value={x.description} onChange={(e) => set(x.id, { description: e.target.value })} /></Field>
              <Field label="Features" hint="Separate each feature with a comma."><ListText value={x.features} onChange={(features) => set(x.id, { features })} {...commaList} /></Field>
              <MultiImage images={x.images || []} onChange={(images) => set(x.id, { images })} />
            </div>
          )}
        </section>
      ))}
      {s.items.length === 0 && <div className="panel"><p className="muted">No homes yet. Add your first one.</p></div>}
      <SaveBar s={s} valid={valid} />
    </>
  );
}
