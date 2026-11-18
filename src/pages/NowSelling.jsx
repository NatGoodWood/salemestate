import { Link } from 'react-router-dom';
import { listings } from '../content/listings';
import { NEW } from '../content/images';
import { t } from '../lib/text';
import ListingCard from '../components/ListingCard';
import Reveal from '../components/Reveal';

export default function NowSelling() {
  const items = listings.filter((l) => l.status === 'published');
  return (
    <div className="container section">
      <h1>{t('nav.nowSelling')}</h1>

      <Reveal>
        <Link to="/projects/salem-estate" className="promo">
          <img src={NEW.villa.sm} alt="" loading="lazy" />
          <div>
            <span className="eyebrow">Newest development</span>
            <h2>Salem Estate, Adenta–Oyibi Road</h2>
            <p>Modern 3 and 4-bedroom homes in a gated community facing the Aburi hills. Custom payment plans and mortgage-friendly processing. Contact us for prices and availability.</p>
            <span className="btn btn-primary">View the project</span>
          </div>
        </Link>
      </Reveal>

      <h2 className="sub">Homes in City of David, Malejor</h2>
      {items.length === 0 ? <p className="muted">{t('home.empty')}</p> : (
        <div className="grid">{items.map((l, k) => <Reveal key={l.id} delay={k * 100}><ListingCard listing={l} /></Reveal>)}</div>
      )}
      <p className="fineprint">Prices are exclusive of taxes and may change without prior notice.</p>
    </div>
  );
}
