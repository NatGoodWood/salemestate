// Checks and cleans everything the admin sends before it is saved.
const bad = (m) => Object.assign(new Error(m), { status: 400 });
const str = (v, max, label, required = false) => {
  const s = (v == null ? '' : String(v)).replace(/\u0000/g, '').trim();
  if (s.length > max) throw bad(`${label} is too long (maximum ${max} characters).`);
  if (required && !s) throw bad(`${label} is required.`);
  return s;
};
const oneOf = (v, list, label) => { if (!list.includes(v)) throw bad(`${label} is not valid.`); return v; };
const intOrNull = (v, label) => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0 || n > 100000) throw bad(`${label} must be a whole number.`);
  return n;
};
const arr = (v, max, label) => { if (!Array.isArray(v)) throw bad(`${label} is not valid.`); if (v.length > max) throw bad(`Too many items in ${label} (maximum ${max}).`); return v; };
const id = (v, label = 'ID') => { const s = str(v, 60, label, true); if (!/^[a-z0-9][a-z0-9-]*$/i.test(s)) throw bad(`${label} is not valid.`); return s; };
const img = (v, label = 'Image', required = false) => {
  const s = str(v, 400, label, required);
  if (!s) return '';
  if (/^\/(uploads|images)\/[\w.-]+$/.test(s) || /^https:\/\/(i0\.wp\.com|salemestate\.com)\/[\w\-./%?=&]+$/.test(s)) return s;
  throw bad(`${label} is not valid. Please upload the photo again.`);
};
const link = (v) => { const s = str(v, 200, 'Button link'); if (s && !/^\/[\w\-/?=&#.]*$/.test(s)) throw bad('Button link must be a page on this site, like /contact.'); return s; };
const phone = (v, label) => { const s = str(v, 30, label); if (s && !/^[+\d\s()-]{6,30}$/.test(s)) throw bad(`${label} can only contain numbers, spaces, + ( ) and -.`); return s; };

export const sections = {
  slides: (v) => arr(v, 12, 'Slides').map((s) => ({
    id: id(s.id, 'Slide ID'), enabled: s.enabled !== false, img: img(s.img, 'Slide image', true),
    pos: oneOf(s.pos || '50% 50%', ['50% 20%', '50% 35%', '50% 50%', '50% 65%', '50% 80%'], 'Image focus'),
    tag: str(s.tag, 60, 'Label'), title: str(s.title, 120, 'Headline', true), place: str(s.place, 160, 'Location line'),
    text: str(s.text, 300, 'Text'), cta: str(s.cta, 40, 'Button text'), to: link(s.to), action: s.action === 'tour' ? 'tour' : '',
  })),

  listings: (v) => arr(v, 150, 'Homes').map((l) => {
    const price = Number(l.price);
    if (!Number.isFinite(price) || price < 0 || price > 1e12) throw bad('Price must be a number (use 0 to show "Contact for price").');
    return {
      id: id(l.id, 'Home ID'), title: str(l.title, 140, 'Title', true), price,
      currency: oneOf(l.currency, ['GHS', 'USD'], 'Currency'), listing_type: oneOf(l.listing_type, ['sale', 'rent'], 'Listing type'),
      property_type: oneOf(l.property_type, ['house', 'apartment', 'townhouse', 'land', 'commercial'], 'Property type'),
      status: oneOf(l.status, ['published', 'draft', 'sold'], 'Status'), featured: Boolean(l.featured),
      bedrooms: intOrNull(l.bedrooms, 'Bedrooms'), bathrooms: intOrNull(l.bathrooms, 'Bathrooms'), area_sqm: intOrNull(l.area_sqm, 'Size'),
      location: str(l.location, 100, 'Area', true), city: str(l.city, 60, 'City', true), description: str(l.description, 5000, 'Description'),
      features: arr(l.features || [], 40, 'Features').map((f) => str(f, 80, 'Feature')).filter(Boolean),
      images: arr(l.images || [], 12, 'Photos').map((i) => img(i, 'Photo', true)),
      created_at: /^\d{4}-\d{2}-\d{2}/.test(l.created_at || '') ? l.created_at : new Date().toISOString(),
    };
  }),

  projects: (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw bad('Projects are not valid.');
    const out = {};
    for (const [slug, p] of Object.entries(v)) {
      if (!/^[a-z0-9-]{1,40}$/.test(slug)) throw bad('Project name is not valid.');
      out[slug] = {
        status: oneOf(p.status, ['selling', 'sold', 'soon'], 'Project status'), badge: str(p.badge, 40, 'Label'), tagline: str(p.tagline, 300, 'Tagline'),
        body: arr(p.body || [], 8, 'Description').map((b) => str(b, 2000, 'Description')).filter(Boolean), image: img(p.image, 'Project image'),
      };
    }
    return out;
  },

  faqs: (v) => arr(v, 40, 'Questions').map((f) => ({ id: id(f.id, 'Question ID'), q: str(f.q, 200, 'Question', true), a: str(f.a, 2000, 'Answer', true) })),

  gallery: (v) => arr(v, 60, 'Photos').map((g) => ({ id: id(g.id, 'Photo ID'), src: img(g.src, 'Photo', true), alt: str(g.alt, 200, 'Caption'), label: str(g.label, 60, 'Label') })),

  settings: (v) => {
    if (!v || typeof v !== 'object') throw bad('Settings are not valid.');
    const email = str(v.email, 120, 'Email', true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw bad('Email address is not valid.');
    const whatsapp = str(v.whatsapp, 20, 'WhatsApp number', true).replace(/\D/g, '');
    if (whatsapp.length < 9 || whatsapp.length > 15) throw bad('WhatsApp number must be in international format, like 233547595308.');
    return {
      phone: phone(v.phone, 'Phone'), phoneAlt: phone(v.phoneAlt, 'Second phone'), office: phone(v.office, 'Office phone'), whatsapp, email,
      address: str(v.address, 160, 'Address'), poBox: str(v.poBox, 120, 'P.O. Box'), hours: str(v.hours, 80, 'Opening hours'),
    };
  },
};
