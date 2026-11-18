import { Link } from 'react-router-dom';
import { formatPrice, hasPrice } from '../lib/format';
import { t } from '../lib/text';
import { useTour } from '../context/TourContext';
import { Bed, Bath, Area, Pin, House, Arrow } from './Icons';

export default function ListingCard({ listing: l }) {
  const { openTour } = useTour();
  const badge = l.status === 'sold' ? t('card.sold') : l.listing_type === 'rent' ? t('card.rent') : t('card.sale');
  const to = `/properties/${l.id}`;
  return (
    <article className="card">
      <Link to={to} className="card-media" tabIndex={-1} aria-hidden="true">
        {l.images?.[0] ? <img src={l.images[0]} alt="" loading="lazy" /> : <div className="placeholder"><House /></div>}
        <span className="badge">{badge}</span>
      </Link>
      <div className="card-body">
        <h3><Link to={to}>{l.title}</Link></h3>
        <ul className="specs">
          {l.bedrooms != null && <li><Bed /> {t('card.bed', { n: l.bedrooms })}</li>}
          {l.bathrooms != null && <li><Bath /> {t('card.bath', { n: l.bathrooms })}</li>}
          {l.area_sqm != null && <li><Area /> {l.area_sqm} sqm</li>}
        </ul>
        <p className="muted loc"><Pin /> {l.location}, {l.city}</p>
        <div className="priceblock">
          {hasPrice(l) && l.status !== 'sold' && <span className="from">Starting at</span>}
          <p className="price">{hasPrice(l) ? formatPrice(l.price, l.currency) : 'Contact for price'}{l.listing_type === 'rent' && hasPrice(l) && <small> {t('card.perMonth')}</small>}</p>
        </div>
        <div className="card-cta">
          <Link to={to} className="more">See details <Arrow /></Link>
          {l.status !== 'sold' && <button className="btn btn-gold btn-sm" onClick={openTour}>I’m interested</button>}
        </div>
      </div>
    </article>
  );
}
