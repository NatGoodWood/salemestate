import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicListings } from '../lib/api';
import { company, tel } from '../config';
import { projects, statusLabel } from '../content/projects';
import { slides } from '../content/slides';
import { newPhotos, oldPhotos, galleryPhotos } from '../content/images';
import { t } from '../lib/text';
import HeroSlider from '../components/HeroSlider';
import Journey from '../components/Journey';
import ListingCard from '../components/ListingCard';
import Lightbox from '../components/Lightbox';
import PhotoGrid from '../components/PhotoGrid';
import { Check } from '../components/Icons';

const budgets = [[1100000, 'GH₵1,100,000'], [1300000, 'GH₵1,300,000'], [1900000, 'GH₵1,900,000'], [3000000, 'GH₵3,000,000']];
const ticks = ['24/7 security in a gated community', 'Reliable water and electricity', 'Smooth tarred roads', 'Views facing the Aburi hills', 'Bright, airy interiors and ample compound space'];

export default function Home() {
  const nav = useNavigate();
  const [listings, setListings] = useState(null);
  const [open, setOpen] = useState(null);
  const step = useCallback((d) => setOpen((i) => (i + d + galleryPhotos.length) % galleryPhotos.length), []);
  const close = useCallback(() => setOpen(null), []);
  useEffect(() => { getPublicListings().then(setListings).catch(() => setListings([])); }, []);
  const selling = (listings || []).filter((l) => l.status === 'published').sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);

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

      <section className="section container">
        <div className="feature-head">
          <div>
            <span className="eyebrow">Newest development</span>
            <h2>Welcome home to Salem Estate</h2>
            <p className="place">Adenta–Oyibi Road, before Valley View University</p>
            <p>A beautifully designed, gated community of modern single-family homes in a lush, peaceful setting overlooking the Aburi Mountains. Choose from spacious 3 and 4-bedroom luxury designs. These are homes, not flats.</p>
          </div>
          <div>
            <ul className="ticks">{ticks.map((x) => <li key={x}><Check /> {x}</li>)}</ul>
            <p className="hero-cta">
              <Link className="btn btn-primary" to="/projects/salem-estate">View the project</Link>
              <Link className="btn btn-ghost" to="/contact">Book a private tour</Link>
            </p>
          </div>
        </div>

        <PhotoGrid photos={newPhotos} onOpen={setOpen} featured />
        <p className="fineprint">Images are artist’s impressions and may differ from the completed homes.</p>

        <h3 className="grid-sub">From our earlier projects</h3>
        <PhotoGrid photos={oldPhotos} onOpen={setOpen} offset={newPhotos.length}>
          <li className="pg-more"><Link to="/gallery">View the full gallery <span aria-hidden="true">→</span></Link></li>
        </PhotoGrid>
        {open !== null && <Lightbox photos={galleryPhotos} index={open} onClose={close} onStep={step} />}
      </section>

      <section className="plans">
        <div className="container plans-in">
          <div>
            <span className="eyebrow light">Made for you</span>
            <h2>Owning your dream home should be stress-free</h2>
          </div>
          <div className="plan"><h3>Custom payment plans</h3><p>Flexible, tailored instalment terms to suit your financial timeline.</p></div>
          <div className="plan"><h3>Mortgage-friendly</h3><p>Smooth processing for buyers financing through a bank mortgage.</p></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>{t('nav.nowSelling')}</h2><Link to="/now-selling">{t('home.seeAll')}</Link></div>
        {listings === null ? <p className="muted">{t('home.loading')}</p> : selling.length === 0 ? <p className="muted">{t('home.empty')}</p> : (
          <div className="grid">{selling.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
        )}
        <p className="fineprint">Prices are exclusive of taxes and may change without prior notice.</p>
      </section>

      <section className="band">
        <div className="container">
          <span className="eyebrow">Our journey</span>
          <h2>How Salem has grown</h2>
          <p className="muted section-lead">From importing building materials in 1995 to developing gated communities across Accra.</p>
          <Journey />
        </div>
      </section>

      <section className="section container">
        <span className="eyebrow">Our projects</span>
        <h2>Communities we build</h2>
        <div className="tiles">
          {projects.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className="tile">
              <img src={p.thumb} alt="" loading="lazy" />
              <div className="tile-body">
                <span className={`pill ${p.status}`}>{p.badge || statusLabel[p.status]}</span>
                <h3>{p.name}</h3>
                <p>{p.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="container cta-in">
          <div>
            <h2>Reserve your home today</h2>
            <p>Our properties are selling quickly. Call or WhatsApp our team to discuss payment terms or to schedule a private tour.</p>
          </div>
          <div className="actions">
            <a className="btn btn-gold" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {company.phone}</a>
            <a className="btn btn-outline" href={`tel:${tel(company.phoneAlt)}`}>Call {company.phoneAlt}</a>
          </div>
        </div>
      </section>
    </>
  );
}
