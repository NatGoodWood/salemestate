import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format';
import { t } from '../lib/text';
import { Bed, Bath, Area, Pin, House } from './Icons';

export default function ListingCard({ listing: l }) {
  const badge = l.status === 'sold' ? t('card.sold') : l.listing_type === 'rent' ? t('card.rent') : t('card.sale');
  return (
    <Link to={`/properties/${l.id}`} className="card">
      <div className="card-media">
        {l.images?.[0] ? <img src={l.images[0]} alt={l.title} loading="lazy" /> : <div className="placeholder"><House /></div>}
        <span className="badge">{badge}</span>
      </div>
      <div className="card-body">
        <p className="price">{formatPrice(l.price, l.currency)}{l.listing_type === 'rent' && <small> {t('card.perMonth')}</small>}</p>
        <h3>{l.title}</h3>
        <p className="muted loc"><Pin /> {l.location}, {l.city}</p>
        <ul className="specs">
          {l.bedrooms != null && <li><Bed /> {t('card.bed', { n: l.bedrooms })}</li>}
          {l.bathrooms != null && <li><Bath /> {t('card.bath', { n: l.bathrooms })}</li>}
          {l.area_sqm != null && <li><Area /> {l.area_sqm} m²</li>}
          <li className="type">{t(`type.${l.property_type}`)}</li>
        </ul>
      </div>
    </Link>
  );
}
