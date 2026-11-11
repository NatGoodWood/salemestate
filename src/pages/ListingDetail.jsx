import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing } from '../lib/api';
import { formatPrice } from '../lib/format';
import { company } from '../config';
import { t } from '../lib/text';
import InquiryForm from '../components/InquiryForm';
import { Bed, Bath, Area, Pin, Check, House } from '../components/Icons';

export default function ListingDetail() {
  const { id } = useParams();
  const [l, setL] = useState(undefined);
  const [i, setI] = useState(0);
  useEffect(() => { setL(undefined); setI(0); getListing(id).then(setL).catch(() => setL(null)); }, [id]);

  if (l === undefined) return <div className="container section"><p className="muted">{t('loading')}</p></div>;
  if (!l) return <div className="container narrow section"><h1>{t('detail.notFound')}</h1><p className="muted">{t('detail.notFoundD')}</p><Link className="btn btn-primary" to="/properties">{t('detail.browse')}</Link></div>;

  const imgs = l.images || [];
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`${l.title} (${formatPrice(l.price, l.currency)})`)}`;

  return (
    <div className="container section">
      <p className="crumb"><Link to="/properties">{t('nav.properties')}</Link> / {l.city}</p>
      <div className="detail">
        <div>
          <div className="gallery">
            <div className="stage">
              {imgs.length ? <img src={imgs[i]} alt={`${l.title}, ${i + 1}/${imgs.length}`} /> : <div className="placeholder"><House /></div>}
              {l.status === 'sold' && <span className="badge">{t('card.sold')}</span>}
            </div>
            {imgs.length > 1 && (
              <div className="thumbs">
                {imgs.map((src, n) => (
                  <button key={src} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`${n + 1}/${imgs.length}`} aria-current={n === i}><img src={src} alt="" loading="lazy" /></button>
                ))}
              </div>
            )}
          </div>

          <h1>{l.title}</h1>
          <p className="muted loc"><Pin /> {l.location}, {l.city}</p>
          <ul className="specs big">
            {l.bedrooms != null && <li><Bed /> {t('detail.bedrooms', { n: l.bedrooms })}</li>}
            {l.bathrooms != null && <li><Bath /> {t('detail.bathrooms', { n: l.bathrooms })}</li>}
            {l.area_sqm != null && <li><Area /> {l.area_sqm} m²</li>}
            <li>{t(`type.${l.property_type}`)}</li>
          </ul>
          {l.description && <><h2>{t('detail.about')}</h2><p className="prose">{l.description}</p></>}
          {l.features?.length > 0 && <><h2>{t('detail.features')}</h2><ul className="features">{l.features.map((f) => <li key={f}><Check /> {f}</li>)}</ul></>}
        </div>

        <aside className="side">
          <div className="panel">
            <p className="price xl">{formatPrice(l.price, l.currency)}{l.listing_type === 'rent' && <small> {t('card.perMonth')}</small>}</p>
            <a className="btn btn-gold block" href={wa} target="_blank" rel="noopener noreferrer">{t('detail.whatsapp')}</a>
            <a className="btn btn-ghost block" href={`tel:${company.phone.replace(/\s/g, '')}`}>{t('detail.call', { phone: company.phone })}</a>
          </div>
          <InquiryForm listing={l} />
        </aside>
      </div>
    </div>
  );
}
