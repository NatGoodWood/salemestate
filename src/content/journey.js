import { photo, IMG, NEW } from './images';

export const journey = [
  { year: '1995', title: 'Salem is founded', text: 'Registered as a Ghanaian private limited company, starting as an importer and retailer of building materials.' },
  { year: '1999', title: 'Into real estate', text: 'We move into real estate development and join GREDA, the Ghana Real Estate Developers Association, where we remain an active member.' },
  { year: 'Adjiringanor', tag: 'Completed', title: 'Over 200 homes, sold out', text: 'A gated community at the East Legon extension, one of the finest residential areas in Accra.', img: photo(IMG.adji, 900) },
  { year: 'City of David', tag: 'Now selling', title: 'A planned community of 800+ homes', text: 'Malejor, with drainage, water and electricity in place, plus shops, play areas and 24/7 security.', img: photo(IMG.aerial1, 900) },
  { year: 'Salem Estate', tag: 'Newest', title: 'Modern homes facing the Aburi hills', text: 'Our newest gated community on the Adenta\u2013Oyibi Road, with 3 and 4-bedroom homes backed by over two decades of experience.', img: NEW.day.sm, latest: true },
];
