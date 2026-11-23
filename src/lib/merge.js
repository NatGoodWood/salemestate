// Combines the website's built-in content with whatever the admin has changed.
import { company as baseCompany } from '../config';
import { slides as baseSlides } from '../content/slides';
import { listings as baseListings } from '../content/listings';
import { projects as baseProjects } from '../content/projects';
import { faqs as baseFaqs } from '../content/faq';

export const smOf = (src = '') => (/^\/uploads\/[a-f0-9]{16}\.jpg$/.test(src) ? src.replace('.jpg', '-sm.jpg') : src);

// The admin offers five focus points; built-in slides use the nearest one.
const POS = [20, 35, 50, 65, 80];
const snapPos = (p = '50% 50%') => { const y = parseInt(String(p).split(' ')[1], 10) || 50; return `50% ${POS.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a))}%`; };

const SETTING_KEYS = ['phone', 'phoneAlt', 'office', 'whatsapp', 'email', 'address', 'poBox', 'hours'];

// What the admin screens start from before anything has been changed.
export const defaults = {
  settings: Object.fromEntries(SETTING_KEYS.map((k) => [k, baseCompany[k] || ''])),
  slides: baseSlides.map((s, i) => ({ id: `slide-${i + 1}`, enabled: true, tag: '', place: '', text: '', cta: '', to: '', action: '', ...s, pos: snapPos(s.pos) })),
  listings: baseListings,
  projects: Object.fromEntries(baseProjects.map((p) => [p.slug, { status: p.status, badge: p.badge || '', tagline: p.tagline, body: p.body, image: p.image }])),
  faqs: baseFaqs.map(([q, a], i) => ({ id: `faq-${i + 1}`, q, a })),
  gallery: [],
};

export function resolve(over = {}) {
  const company = { ...baseCompany, ...(over.settings || {}) };
  const slides = (over.slides ?? defaults.slides).filter((s) => s.enabled !== false);
  const listings = over.listings ?? baseListings;
  const projects = baseProjects.map((p) => {
    const o = over.projects?.[p.slug];
    if (!o) return p;
    return {
      ...p, status: o.status || p.status, badge: o.badge ?? p.badge, tagline: o.tagline || p.tagline,
      body: o.body?.length ? o.body : p.body, ...(o.image ? { image: o.image, thumb: smOf(o.image) } : {}),
    };
  });
  const faqs = (over.faqs ?? defaults.faqs).map((f) => [f.q, f.a]);
  const gallery = (over.gallery ?? []).map((g) => ({ src: g.src, thumb: smOf(g.src), alt: g.alt || 'Salem Estate', label: g.label }));
  return { company, slides, listings, projects, faqs, gallery, getListing: (id) => listings.find((l) => l.id === id) || null };
}
