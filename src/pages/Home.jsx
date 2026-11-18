import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listings } from '../content/listings';
import { company, tel } from '../config';
import { projects, statusLabel } from '../content/projects';
import { slides } from '../content/slides';
import { NEW, newPhotos, oldPhotos, galleryPhotos } from '../content/images';
import { t } from '../lib/text';
import { useTour } from '../context/TourContext';
import HeroSlider from '../components/HeroSlider';
import Journey from '../components/Journey';
import ListingCard from '../components/ListingCard';
import Lightbox from '../components/Lightbox';
import PhotoGrid from '../components/PhotoGrid';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import { Check, Shield, Bolt, Road, Mountain, Wallet, Home as HomeIcon, Arrow } from '../components/Icons';

const budgets = [[1100000, 'GH₵1,100,000'], [1300000, 'GH₵1,300,000'], [1900000, 'GH₵1,900,000'], [3000000, 'GH₵3,000,000']];
const ticks = ['24/7 security in a gated community', 'Reliable water and electricity', 'Smooth tarred roads', 'Views facing the Aburi hills', 'Bright, airy interiors and ample compound space'];
const stats = [
  { pre: 'Over', to: 20, label: 'years of experience' },
  { pre: 'Over', to: 200, label: 'homes delivered at Adjiringanor' },
  { pre: 'Over', to: 800, label: 'homes planned at City of David' },
  { pre: 'Since', to: 1995, group: false, label: 'building on trust' },
];
const why = [
  [Mountain, 'Perfect location', 'Adenta–Oyibi Road, off Malejor School Junction and just before Valley View University, facing the Aburi hills.'],
  [Shield, 'Secure community', 'A gated community with 24/7 security, so you can relax at home.'],
  [Bolt, 'Fully serviced', 'Reliable water and electricity, ready when you move in.'],
  [Road, 'Smooth tarred roads', 'Well-built roads through the community and to the main road.'],
  [HomeIcon, 'Room for family life', 'Bright, airy interiors and ample compound space. Homes, not flats.'],
  [Wallet, 'Flexible ownership', 'Custom payment plans, and smooth processing for bank mortgage buyers.'],
];
const types = [
  { img: NEW.villa.sm, pos: '50% 60%', title: '3-Bedroom Homes', text: 'Spacious, bright family homes with ample compound space.' },
  { img: NEW.dayRows.sm, pos: '50% 40%', title: '4-Bedroom Homes', text: 'Luxury designs for larger households who want more room.' },
];

export default function Home() {
  const nav = useNavigate();
  const { openTour } = useTour();
  const [open, setOpen] = useState(null);
  const step = useCallback((d) => setOpen((i) => (i + d + galleryPhotos.length) % galleryPhotos.length), []);
  const close = useCallback(() => setOpen(null), []);
  const selling = listings.filter((l) => l.status === 'published').slice(0, 3);

  function onSearch(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) if (v) p.set(k, v);
    nav(`/properties?${p}`);
  }

  return (
    <>
      <HeroSlider slides={slides} />

      <div className="container">
        <form className="searchbar" onSubmit={onSearch}>
          <label className="field">{t('props.beds')}<select name="beds"><option value="">{t('props.any')}</option>{[2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}</select></label>
          <label className="field">{t('search.budget')}<select name="max"><option value="">{t('search.anyBudget')}</option>{budgets.map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>
          <button className="btn btn-primary">{t('search.button')}</button>
        </form>
      </div>

      <section className="stats">
        <div className="container stats-in">
          {stats.map((s, k) => (
            <Reveal key={s.label} delay={k * 90} className="stat">
              <small>{s.pre}</small>
              <strong><Counter to={s.to} group={s.group !== false} /></strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal className="feature-head">
          <div>
            <span className="eyebrow">Newest development</span>
            <h2>Welcome home to Salem Estate</h2>
            <p className="place">Adenta–Oyibi Road, off Malejor School Junction, before Valley View University</p>
            <p>A beautifully designed, gated community of modern single-family homes in a lush, peaceful setting overlooking the Aburi Mountains. Choose from spacious 3 and 4-bedroom luxury designs. These are homes, not flats.</p>
          </div>
          <div>
            <ul className="ticks">{ticks.map((x) => <li key={x}><Check /> {x}</li>)}</ul>
            <p className="hero-cta">
              <Link className="btn btn-primary" to="/projects/salem-estate">View the project</Link>
              <button className="btn btn-ghost" onClick={openTour}>Book a private tour</button>
            </p>
          </div>
        </Reveal>

        <Reveal><PhotoGrid photos={newPhotos} onOpen={setOpen} featured /></Reveal>
        <p className="fineprint">Images are artist’s impressions and may differ from the completed homes.</p>

        <Reveal as="h3" className="grid-sub">From our earlier projects</Reveal>
        <Reveal>
          <PhotoGrid photos={oldPhotos} onOpen={setOpen} offset={newPhotos.length}>
            <li className="pg-more"><Link to="/gallery">View the full gallery <span aria-hidden="true">→</span></Link></li>
          </PhotoGrid>
        </Reveal>
        {open !== null && <Lightbox photos={galleryPhotos} index={open} onClose={close} onStep={step} />}
      </section>

      <section className="band">
        <div className="container">
          <Reveal><span className="eyebrow">Types of homes</span><h2>Find the right fit for your family</h2></Reveal>
          <div className="types">
            {types.map((x, k) => (
              <Reveal key={x.title} delay={k * 120}>
                <Link to="/projects/salem-estate" className="type">
                  <img src={x.img} alt="" loading="lazy" style={{ objectPosition: x.pos }} />
                  <div><h3>{x.title}</h3><p>{x.text}</p><span className="more">Learn more <Arrow /></span></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="section-head"><h2>Explore our home options</h2><Link to="/now-selling">{t('home.seeAll')}</Link></Reveal>
        {selling.length === 0 ? <p className="muted">{t('home.empty')}</p> : (
          <div className="grid">{selling.map((l, k) => <Reveal key={l.id} delay={k * 110}><ListingCard listing={l} /></Reveal>)}</div>
        )}
        <p className="fineprint">Prices are exclusive of taxes and may change without prior notice.</p>
      </section>

      <section className="plans">
        <div className="container">
          <Reveal><span className="eyebrow light">Why Salem Estate</span><h2>Everything a family needs, in one community</h2></Reveal>
          <div className="why">
            {why.map(([Icon, h, d], k) => (
              <Reveal key={h} delay={(k % 3) * 100} className="why-item">
                <span className="why-icon"><Icon /></span>
                <h3>{h}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container">
          <Reveal><span className="eyebrow">Our journey</span><h2>How Salem has grown</h2>
            <p className="muted section-lead">From importing building materials in 1995 to developing gated communities across Accra.</p></Reveal>
          <Reveal><Journey /></Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal><span className="eyebrow">Our projects</span><h2>Communities we build</h2></Reveal>
        <div className="tiles">
          {projects.map((p, k) => (
            <Reveal key={p.slug} delay={k * 110}>
              <Link to={`/projects/${p.slug}`} className="tile">
                <img src={p.thumb} alt="" loading="lazy" />
                <div className="tile-body">
                  <span className={`pill ${p.status}`}>{p.badge || statusLabel[p.status]}</span>
                  <h3>{p.name}</h3>
                  <p>{p.location}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta">
        <Reveal className="container cta-in">
          <div>
            <h2>Find your dream home today. Schedule a tour now.</h2>
            <p>Our properties are selling quickly. Call or WhatsApp our team to discuss payment terms or to arrange a private tour.</p>
          </div>
          <div className="actions">
            <button className="btn btn-gold" onClick={openTour}>Book a tour</button>
            <a className="btn btn-outline" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {company.phone}</a>
            <a className="btn btn-outline" href={`tel:${tel(company.phoneAlt)}`}>Call {company.phoneAlt}</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
