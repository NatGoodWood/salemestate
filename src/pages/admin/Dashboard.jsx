import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminListings, deleteListing, getInquiries, deleteInquiry } from '../../lib/api';
import { formatPrice, formatDate, waNumber } from '../../lib/format';

export default function Dashboard() {
  const { signOut, session } = useAuth();
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState(null);
  const [inquiries, setInquiries] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminListings().then(setListings).catch((e) => setError(e.message));
    getInquiries().then(setInquiries).catch((e) => setError(e.message));
  }, []);

  async function remove(l) {
    if (!window.confirm(`Delete "${l.title}"? This also deletes its photos and cannot be undone.`)) return;
    try { await deleteListing(l); setListings((x) => x.filter((i) => i.id !== l.id)); }
    catch (e) { setError(e.message); }
  }
  async function removeInquiry(q) {
    if (!window.confirm(`Delete the message from ${q.name}?`)) return;
    try { await deleteInquiry(q.id); setInquiries((x) => x.filter((i) => i.id !== q.id)); }
    catch (e) { setError(e.message); }
  }

  return (
    <div className="container section">
      <div className="admin-head">
        <div><h1>Admin</h1><p className="muted">Signed in as {session.user.email}</p></div>
        <div className="actions">
          <Link className="btn btn-primary" to="/admin/listings/new">Add listing</Link>
          <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'listings'} className={tab === 'listings' ? 'on' : ''} onClick={() => setTab('listings')}>Listings {listings && `(${listings.length})`}</button>
        <button role="tab" aria-selected={tab === 'inquiries'} className={tab === 'inquiries' ? 'on' : ''} onClick={() => setTab('inquiries')}>Inquiries {inquiries && `(${inquiries.length})`}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      {tab === 'listings' && (listings === null ? <p className="muted">Loading…</p> : listings.length === 0 ? (
        <div className="panel"><h3>No listings yet</h3><p className="muted">Add your first property to show it on the website.</p><Link className="btn btn-primary" to="/admin/listings/new">Add listing</Link></div>
      ) : (
        <div className="table-wrap"><table>
          <thead><tr><th>Property</th><th>Price</th><th>Status</th><th>Added</th><th><span className="sr">Actions</span></th></tr></thead>
          <tbody>{listings.map((l) => (
            <tr key={l.id}>
              <td><div className="cell-prop">{l.images?.[0] ? <img src={l.images[0]} alt="" /> : <span className="thumb-empty" />}<div><strong>{l.title}</strong><br /><span className="muted">{l.location}, {l.city}</span></div></div></td>
              <td>{formatPrice(l.price, l.currency)}{l.listing_type === 'rent' && ' /mo'}</td>
              <td><span className={`status ${l.status}`}>{l.status}</span>{l.featured && <span className="status featured">featured</span>}</td>
              <td>{formatDate(l.created_at)}</td>
              <td className="row-actions"><Link to={`/properties/${l.id}`}>View</Link><Link to={`/admin/listings/${l.id}`}>Edit</Link><button className="link-danger" onClick={() => remove(l)}>Delete</button></td>
            </tr>))}</tbody>
        </table></div>
      ))}

      {tab === 'inquiries' && (inquiries === null ? <p className="muted">Loading…</p> : inquiries.length === 0 ? <div className="panel"><h3>No messages yet</h3><p className="muted">Messages from the website forms will appear here.</p></div> : (
        <div className="inbox">{inquiries.map((q) => (
          <article key={q.id} className="panel">
            <div className="inbox-top"><strong>{q.name}</strong><span className="muted">{formatDate(q.created_at)}</span></div>
            <p className="muted">{[q.phone && <a key="p" href={`tel:${q.phone}`}>{q.phone}</a>, q.email && <a key="e" href={`mailto:${q.email}`}>{q.email}</a>].filter(Boolean).reduce((a, b) => [a, ' · ', b])}</p>
            {q.listings?.title && <p className="muted">About: {q.listings.title}</p>}
            <p className="prose">{q.message}</p>
            <div className="row-actions">
              {q.phone && <a className="btn btn-gold btn-sm" href={`https://wa.me/${waNumber(q.phone)}?text=${encodeURIComponent(`Hello ${q.name}, thank you for your enquiry.`)}`} target="_blank" rel="noopener noreferrer">Reply on WhatsApp</a>}
              {q.email && <a className="btn btn-ghost btn-sm" href={`mailto:${q.email}`}>Reply by email</a>}
              <button className="link-danger" onClick={() => removeInquiry(q)}>Delete</button>
            </div>
          </article>))}</div>
      ))}
    </div>
  );
}
