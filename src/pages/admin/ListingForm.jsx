import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getListing, saveListing, uploadImages, removeImages, MAX_IMAGES, MAX_IMAGE_BYTES } from '../../lib/api';
import { cities, propertyTypes } from '../../config';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const empty = { title: '', description: '', price: '', currency: 'GHS', listing_type: 'sale', property_type: 'house', bedrooms: '', bathrooms: '', area_sqm: '', location: '', city: 'Accra', features: '', status: 'published', featured: false };
const intOrNull = (v) => (v === '' || v == null ? null : Math.max(0, parseInt(v, 10)));

export default function ListingForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const fileRef = useRef(null);
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState([]); // { url, file? } first one is the cover
  const [removed, setRemoved] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    getListing(id).then((l) => {
      if (!l) setError('Listing not found.');
      else {
        setForm({ ...empty, title: l.title, description: l.description || '', price: String(l.price), currency: l.currency, listing_type: l.listing_type, property_type: l.property_type, bedrooms: l.bedrooms ?? '', bathrooms: l.bathrooms ?? '', area_sqm: l.area_sqm ?? '', location: l.location, city: l.city, features: (l.features || []).join(', '), status: l.status, featured: l.featured });
        setImages((l.images || []).map((url) => ({ url })));
      }
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  function addFiles(e) {
    const picked = [...e.target.files];
    e.target.value = '';
    const next = [...images];
    for (const f of picked) {
      if (!ACCEPT.includes(f.type)) return setError(`${f.name} is not a JPG, PNG or WebP image.`);
      if (f.size > MAX_IMAGE_BYTES) return setError(`${f.name} is larger than 5 MB. Resize it and try again.`);
      if (next.length >= MAX_IMAGES) return setError(`You can add up to ${MAX_IMAGES} photos.`);
      next.push({ url: URL.createObjectURL(f), file: f });
    }
    setError(''); setImages(next);
  }
  const makeCover = (i) => setImages([images[i], ...images.filter((_, n) => n !== i)]);
  function dropImage(i) {
    const img = images[i];
    img.file ? URL.revokeObjectURL(img.url) : setRemoved([...removed, img.url]);
    setImages(images.filter((_, n) => n !== i));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const price = Number(form.price);
    if (!form.title.trim() || !form.location.trim()) return setError('Add a title and a location.');
    if (!(price >= 0) || form.price === '') return setError('Enter a valid price.');
    if (form.status === 'published' && images.length === 0 && !window.confirm('This listing has no photos. Publish anyway?')) return;

    setSaving(true);
    let uploaded = [];
    try {
      uploaded = await uploadImages(images.filter((i) => i.file).map((i) => i.file));
      let k = 0;
      const urls = images.map((i) => (i.file ? uploaded[k++] : i.url));
      await saveListing({
        title: form.title.trim(), description: form.description.trim() || null, price, currency: form.currency,
        listing_type: form.listing_type, property_type: form.property_type,
        bedrooms: intOrNull(form.bedrooms), bathrooms: intOrNull(form.bathrooms), area_sqm: intOrNull(form.area_sqm),
        location: form.location.trim(), city: form.city,
        features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
        images: urls, status: form.status, featured: form.featured,
      }, id);
      await removeImages(removed);
      nav('/admin');
    } catch (err) {
      await removeImages(uploaded).catch(() => {});
      setError(err.message || 'Could not save the listing.');
      setSaving(false);
    }
  }

  if (loading) return <div className="container section"><p className="muted">Loading…</p></div>;

  return (
    <div className="container narrow-lg section">
      <p className="crumb"><Link to="/admin">Admin</Link> / {editing ? 'Edit listing' : 'New listing'}</p>
      <h1>{editing ? 'Edit listing' : 'Add listing'}</h1>
      <form className="form" onSubmit={onSubmit}>
        <fieldset className="panel">
          <legend>Basics</legend>
          <label className="field">Title<input required maxLength={140} value={form.title} onChange={set('title')} placeholder="4-bedroom house with boys quarters" /></label>
          <div className="row3">
            <label className="field">Listing type<select value={form.listing_type} onChange={set('listing_type')}><option value="sale">For sale</option><option value="rent">For rent (per month)</option></select></label>
            <label className="field">Property type<select value={form.property_type} onChange={set('property_type')}>{Object.entries(propertyTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className="field">Status<select value={form.status} onChange={set('status')}><option value="published">Published</option><option value="draft">Draft (hidden)</option><option value="sold">Sold or let</option></select></label>
          </div>
          <div className="row3">
            <label className="field">Price<input required type="number" min="0" step="any" inputMode="decimal" value={form.price} onChange={set('price')} /></label>
            <label className="field">Currency<select value={form.currency} onChange={set('currency')}><option value="GHS">GH₵ (cedis)</option><option value="USD">$ (US dollars)</option></select></label>
            <label className="check"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Show on the home page</label>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>Location and size</legend>
          <div className="row2">
            <label className="field">City<select value={form.city} onChange={set('city')}>{[...new Set([...cities, form.city])].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="field">Area or neighbourhood<input required maxLength={100} value={form.location} onChange={set('location')} placeholder="East Legon" /></label>
          </div>
          <div className="row3">
            <label className="field">Bedrooms<input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} /></label>
            <label className="field">Bathrooms<input type="number" min="0" value={form.bathrooms} onChange={set('bathrooms')} /></label>
            <label className="field">Size (m²)<input type="number" min="0" value={form.area_sqm} onChange={set('area_sqm')} /></label>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>Details</legend>
          <label className="field">Description<textarea rows={6} maxLength={5000} value={form.description} onChange={set('description')} /></label>
          <label className="field">Features<input value={form.features} onChange={set('features')} placeholder="Gated community, Borehole, Standby generator" /><span className="hint">Separate each feature with a comma.</span></label>
        </fieldset>

        <fieldset className="panel">
          <legend>Photos</legend>
          <p className="hint">JPG, PNG or WebP, up to 5 MB each, maximum {MAX_IMAGES}. The first photo is the cover.</p>
          {images.length > 0 && (
            <ul className="img-grid">{images.map((img, i) => (
              <li key={img.url}>
                <img src={img.url} alt={`Photo ${i + 1}`} />
                {i === 0 && <span className="cover">Cover</span>}
                <div className="img-actions">
                  {i !== 0 && <button type="button" onClick={() => makeCover(i)}>Make cover</button>}
                  <button type="button" onClick={() => dropImage(i)}>Remove</button>
                </div>
              </li>))}</ul>
          )}
          <input ref={fileRef} type="file" accept={ACCEPT.join(',')} multiple hidden onChange={addFiles} />
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current.click()}>Add photos</button>
        </fieldset>

        {error && <p className="error" role="alert">{error}</p>}
        <div className="actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : form.status === 'draft' ? 'Save draft' : 'Publish listing'}</button>
          <Link className="btn btn-ghost" to="/admin">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
