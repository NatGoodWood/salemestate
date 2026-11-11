import { photo, IMG, NEW } from './images';

// Home page slider: newest project first, then earlier projects.
export const slides = [
  { img: NEW.villa.src, pos: '50% 35%', tag: 'New development', title: 'Salem Estate, Adenta\u2013Oyibi Road', text: 'Modern 3 and 4-bedroom homes in a gated community facing the Aburi hills. These are homes, not flats.', to: '/projects/salem-estate', cta: 'Explore Salem Estate' },
  { img: NEW.day.src, pos: '50% 50%', tag: 'New development', title: 'Fully serviced and secure', text: '24/7 security, reliable water and electricity, and smooth tarred roads, just before Valley View University.', to: '/projects/salem-estate', cta: 'See the community' },
  { img: NEW.night.src, pos: '50% 55%', tag: 'New development', title: 'Flexible ways to own your home', text: 'Custom payment plans, and smooth processing for buyers using a bank mortgage.', to: '/contact', cta: 'Book a private tour' },
  { img: photo(IMG.aerial1, 1800), pos: '50% 50%', tag: 'Now selling', title: 'City of David, Malejor', text: 'A planned community of 800+ homes, with drainage, water and electricity already in place.', to: '/projects/city-of-david', cta: 'View City of David' },
  { img: photo(IMG.adji, 1800), pos: '50% 50%', tag: 'Sold out', title: 'Adjiringanor, East Legon extension', text: 'Over 200 homes in a gated community, delivered and sold out.', to: '/projects/adjiringanor', cta: 'See the project' },
];
