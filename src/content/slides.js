import { photo, IMG, NEW } from './images';

// Home page slider: newest project first, then earlier projects.
// A slide can have `to` (a link), `action: 'tour'` (opens the tour form), or no button at all.
export const slides = [
  { img: NEW.logo.src, pos: '50% 50%', tag: 'Welcome to ', title: 'Salem Investment LTD', text: 'We are your trusted real estate developers.' },
  { img: NEW.villa.src, pos: '50% 35%', tag: 'New development', title: 'Salem Estate', place: 'Adenta\u2013Oyibi Road, off Malejor School Junction, before Valley View University', text: 'Modern 3 and 4-bedroom homes in a gated community facing the Aburi hills. These are homes, not flats.', to: '/projects/salem-estate', cta: 'Explore Salem Estate' },
  { img: NEW.day.src, pos: '50% 50%', tag: 'New development', title: 'Fully serviced and secure', text: '24/7 security, reliable water and electricity, and smooth tarred roads, just before Valley View University.', to: '/projects/salem-estate', cta: 'See the community' },
  { img: NEW.night.src, pos: '50% 55%', tag: 'New development', title: 'Flexible ways to own your home', text: 'Custom payment plans, and smooth processing for buyers using a bank mortgage.', action: 'tour', cta: 'Book a private tour' },
  { img: photo(IMG.aerial1, 1800), pos: '50% 50%', tag: '', title: 'City of David, Malejor', text: 'A planned community of over 800 homes, with drainage, water and electricity already in place.', to: '/projects/city-of-david', cta: 'View City of David' },
  { img: photo(IMG.adji, 1800), pos: '50% 50%', tag: 'Sold out', title: 'Adjiringanor, East Legon extension', text: 'Over 200 homes in a gated community, delivered and sold out.', to: '/projects/adjiringanor', cta: 'See the project' },
  { img: NEW.greda.src, pos: '50% 50%', tag: 'Active Member of GREDA', title: 'Since 1999', text: 'Over 20 years of building on trust.' },
  
];
