import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicListings } from '../lib/api';
import { NEW } from '../content/images';
import { t } from '../lib/text';
import ListingCard from '../components/ListingCard';

export default function NowSelling() {
  const [list, setList] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => { getPublicListings().then(setList).catch(() => setError(true)); }, []);
  const items = (list || []).filter((l) => l.status === 'published');

  return (
    <div className="container section">
      <h1>{t('nav.nowSelling')}</h1>

      <Link to="/projects/salem-estate" className="promo">
        <img src={NEW.villa.sm} alt="" loading="lazy" />
        <div>
          <span className="eyebrow">Newest development</span>
          <h2>Salem Estate, Adenta–Oyibi Road</h2>
          <p>Modern 3 and 4-bedroom homes in a gated community facing the Aburi hills. Custom payment plans and mortgage-friendly processing. Contact us for prices and availability.</p>
          <span className="btn btn-primary">View the project</span>
        </div>
      </Link>

      <h2 className="sub">Homes in City of David, Malejor</h2>
      {error ? <p className="error">{t('props.error')}</p> : list === null ? <p className="muted">{t('loading')}</p> : items.length === 0 ? <p className="muted">{t('home.empty')}</p> : (
        <div className="grid">{items.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
      )}
      <p className="fineprint">Prices are exclusive of taxes and may change without prior notice.</p>
    </div>
  );
}
