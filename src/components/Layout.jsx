import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { company, tel } from '../config';
import { projects } from '../content/projects';
import { t } from '../lib/text';

export function Brand({ light }) {
  const src = light ? company.logoLight : company.logoDark;
  return (
    <Link to="/" className={`brand${light ? ' light' : ''}`}>
      {src ? <img className="logo" src={src} alt={company.name} /> : <><span className="mark" aria-hidden="true" />{company.name}</>}
    </Link>
  );
}

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div className="dd" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="dd-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>{label}</button>
      {open && <ul className="dd-menu">{items.map((i) => <li key={i.to}><Link to={i.to}>{i.label}</Link></li>)}</ul>}
    </div>
  );
}

const WhatsApp = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a14 14 0 0 1-5.5-4.9c-.6-.8-1.2-1.9-1.2-2.9 0-1 .5-1.5.7-1.7.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .5.4l.7 1.7c.1.1.1.3 0 .4l-.3.5-.4.4c-.1.1-.3.3-.1.5.5.8 1.1 1.4 1.8 1.9.5.4 1.1.7 1.6.9.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.1 1z" /></svg>;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  const projectItems = projects.map((p) => ({ to: `/projects/${p.slug}`, label: p.name }));
  const propertyItems = [{ to: '/properties?bedrooms=2', label: t('nav.two') }, { to: '/properties?bedrooms=3', label: t('nav.three') }];

  return (
    <>
      <div className="topbar">
        <div className="container topbar-in">
          <span>{company.address} · {company.hours}</span>
          <span className="topbar-phones"><a href={`tel:${tel(company.phone)}`}>{company.phone}</a><a href={`tel:${tel(company.phoneAlt)}`}>{company.phoneAlt}</a></span>
        </div>
      </div>
      <header className="site-header">
        <div className="container bar">
          <Brand />
          <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? t('nav.close') : t('nav.menu')}</button>
          <nav id="nav" className={open ? 'open' : ''} aria-label="Main">
            <NavLink to="/" end>{t('nav.home')}</NavLink>
            <NavLink to="/about-us">{t('nav.about')}</NavLink>
            <NavLink to="/now-selling">{t('nav.nowSelling')}</NavLink>
            <Dropdown label={t('nav.projects')} items={projectItems} />
            <Dropdown label={t('nav.properties')} items={propertyItems} />
            <NavLink to="/faq">{t('nav.faq')}</NavLink>
            <NavLink to="/gallery">{t('nav.gallery')}</NavLink>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>

      <a className="wa-float" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"><WhatsApp /><span>{t('wa.chat')}</span></a>

      <footer className="site-footer">
        <div className="container foot">
          <div>
            <Brand light />
            <p className="muted-light foot-note">Modern, secure homes in Accra, built by a company with more than two decades of experience.</p>
          </div>
          <div>
            <p className="foot-h">{t('foot.explore')}</p>
            <p><Link to="/now-selling">{t('nav.nowSelling')}</Link></p>
            <p><Link to="/about-us">{t('nav.about')}</Link></p>
            <p><Link to="/faq">{t('nav.faq')}</Link></p>
            <p><Link to="/contact">{t('nav.contact')}</Link></p>
          </div>
          <div>
            <p className="foot-h">{t('foot.visit')}</p>
            <p>{company.address}</p>
            <p>{company.poBox}</p>
            <p><a href={`tel:${tel(company.phone)}`}>{company.phone}</a></p>
            <p><a href={`tel:${tel(company.phoneAlt)}`}>{company.phoneAlt}</a></p>
            <p><a href={`mailto:${company.email}`}>{company.email}</a></p>
          </div>
        </div>
        <div className="container legal">
          <span>© {new Date().getFullYear()} {company.legalName}. |Developed by Pacawood Services &reg; {t('foot.rights')}</span>
          <Link to="/admin">{t('foot.staff')}</Link>
        </div>
      </footer>
    </>
  );
}
