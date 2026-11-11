import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects, statusLabel } from '../content/projects';
import { getPublicListings } from '../lib/api';
import { company, tel } from '../config';
import { t } from '../lib/text';
import ListingCard from '../components/ListingCard';
import InquiryForm from '../components/InquiryForm';
import { Check } from '../components/Icons';

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  const [homes, setHomes] = useState([]);
  useEffect(() => {
    if (!p?.listingMatch) return;
    getPublicListings().then((all) => setHomes(all.filter((l) => l.status === 'published' && `${l.location} ${l.title}`.includes(p.listingMatch)))).catch(() => {});
  }, [p]);

  if (!p) return <div className="container narrow section"><h1>{t('detail.notFound')}</h1><Link className="btn btn-primary" to="/projects">{t('nav.projects')}</Link></div>;

  return (
    <>
      <section className="page-hero" style={{ '--hero': `url(${p.image})` }}>
        <div className="container">
          <span className={`pill ${p.status}`}>{p.badge || statusLabel[p.status]}</span>
          <h1>{p.name}</h1>
          <p className="lead">{p.tagline}</p>
        </div>
      </section>

      <section className="section container split">
        <div>
          {p.body.map((para, i) => <p key={i}>{para}</p>)}
          {p.enquiry && (
            <p className="hero-cta">
              <a className="btn btn-primary" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {company.phone}</a>
              <a className="btn btn-ghost" href={`tel:${tel(company.phoneAlt)}`}>Call {company.phoneAlt}</a>
            </p>
          )}
        </div>
        <dl className="facts panel">{p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </section>

      {p.gallery.length > 1 && (
        <section className="container">
          <ul className="pgrid">
            {p.gallery.map((g, i) => (
              <li key={g.src} className={i === 0 ? 'wide' : ''}><img src={g.sm || g.src} alt={g.alt} loading="lazy" /></li>
            ))}
          </ul>
          {p.note && <p className="fineprint">{p.note}</p>}
        </section>
      )}

      {p.highlights && (
        <section className="section container">
          <h2>Designed for comfort and peace of mind</h2>
          <div className="hl">{p.highlights.map(([h, d]) => <div key={h}><h3>{h}</h3><p>{d}</p></div>)}</div>
        </section>
      )}

      {homes.length > 0 && (
        <section className="section container">
          <div className="section-head"><h2>Homes available</h2><Link to="/now-selling">{t('home.seeAll')}</Link></div>
          <div className="grid">{homes.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
          <p className="fineprint">Prices are exclusive of taxes and may change without prior notice.</p>
        </section>
      )}

      {p.features && (
        <section className="band">
          <div className="container split">
            <div><h2>Features and facilities</h2><ul className="features">{p.features.map((f) => <li key={f}><Check /> {f}</li>)}</ul></div>
            {p.amenities && <div><h2>In the community</h2><ul className="features one">{p.amenities.map((f) => <li key={f}><Check /> {f}</li>)}</ul></div>}
          </div>
        </section>
      )}

      {p.plans && (
        <section className="plans">
          <div className="container plans-in">
            <div><span className="eyebrow light">Made for you</span><h2>Flexible options</h2></div>
            {p.plans.map(([h, d]) => <div className="plan" key={h}><h3>{h}</h3><p>{d}</p></div>)}
          </div>
        </section>
      )}

      {p.sitePlan && (
        <section className="section container">
          <h2>Site plan</h2>
          <p className="muted">Space is set aside for a school, shops, offices and a clinic, a nursery and worship centre, and an adult playground.</p>
          <img className="siteplan" src={p.sitePlan} alt={`Site plan of ${p.name}`} loading="lazy" />
        </section>
      )}

      {p.enquiry && p.status !== 'sold' && (
        <section className="section container split-contact">
          <div>
            <span className="eyebrow">Reserve your home</span>
            <h2>Book a private tour</h2>
            <p>Our properties are selling quickly. Send us a message to discuss payment terms or to schedule a private tour of {p.name}.</p>
            <p><a href={`tel:${tel(company.phone)}`}>{company.phone}</a> (WhatsApp)<br /><a href={`tel:${tel(company.phoneAlt)}`}>{company.phoneAlt}</a></p>
          </div>
          <InquiryForm heading="Enquire about this project" viewing defaultMessage={`Hello, I would like to know more about ${p.name}.`} />
        </section>
      )}
    </>
  );
}
