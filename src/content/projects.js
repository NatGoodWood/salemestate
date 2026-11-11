import { photo, IMG, NEW } from './images';

export const homeFeatures = [
  'Built-in wardrobes', 'Ceramic floor tiles in kitchen and bedrooms', 'Coloured long-span roofing', 'Door bell',
  'Fence wall with gate', 'Fitted kitchen with cabinets', 'Gate light', 'Kitchen with cabinets and storeroom',
  'Metal security door (external)', 'Paved drive and walkway', 'Porcelain floor tiles in the porch', 'Sliding windows at the front', 'T&G ceiling throughout',
];

export const communityAmenities = [
  'Spacious gated community', 'Children\u2019s playground', 'Demarcated area for worship', 'Underground drainage',
  'Recreational facilities for adults', 'Shops', 'Police station', 'Nursery and crèche', '24/7 security',
];

export const projects = [
  {
    slug: 'salem-estate', name: 'Salem Estate', status: 'selling', badge: 'Newest development', location: 'Adenta\u2013Oyibi Road, before Valley View University',
    tagline: 'A gated community of modern 3 and 4-bedroom homes, facing the Aburi hills.',
    image: NEW.day.src, thumb: NEW.day.sm,
    gallery: [NEW.villa, NEW.dusk, NEW.day, NEW.night, NEW.dayRows, NEW.nightRows],
    body: [
      'Find your perfect sanctuary just minutes from Valley View University. Salem Estate is our newest development: a beautifully designed, gated community of modern single-family houses in a lush, peaceful setting that overlooks the Aburi Mountains.',
      'Whether you are a young professional buying your first home, a retiree looking for a quiet retreat, or a diaspora buyer seeking a secure, premium investment back home, choose from our spacious 3 and 4-bedroom luxury designs. These are homes, not flats.',
    ],
    facts: [['Location', 'Adenta\u2013Oyibi Road, before Valley View University'], ['Home types', '3 and 4-bedroom houses'], ['Community', 'Gated, with 24/7 security'], ['Experience', '20+ years of real estate delivery']],
    highlights: [
      ['Fully serviced and secure', '24/7 security, reliable water and electricity, and smooth tarred roads.'],
      ['Breathtaking views', 'Wake up to plush green scenery facing the Aburi hills.'],
      ['Generous space', 'Built for family life, with bright, airy interiors and ample compound space.'],
      ['20+ years of trust', 'Your investment is backed by more than two decades of real estate excellence.'],
    ],
    plans: [
      ['Custom payment plans', 'Flexible, tailored instalment terms to suit your financial timeline.'],
      ['Mortgage-friendly', 'Smooth processing for buyers financing through a bank mortgage.'],
    ],
    enquiry: true,
    note: 'Images are artist\u2019s impressions and may differ from the completed homes.',
  },
  {
    slug: 'city-of-david', name: 'City of David', status: 'selling', location: 'Malejor, Greater Accra',
    tagline: 'A planned community of 800+ homes, ten minutes from the Adenta barrier.',
    image: photo(IMG.aerial1), thumb: photo(IMG.aerial1, 800), gallery: [photo(IMG.aerial1), photo(IMG.aerial2), photo(IMG.room)].map((src) => ({ src, alt: 'City of David' })), enquiry: true,
    listingMatch: 'Malejor',
    body: [
      'City of David offers homes with drainage, water and electricity already in place, so you can settle in as soon as you receive your keys.',
      'It is a planned community with space set aside for a police station, a children\u2019s playground, a church, shops, a crèche and recreation for adults, so families do not have to drive into town at weekends.',
      'If you would rather build your own, we also have serviced plots in the community with electricity, water and drainage, and ready for a building permit. Plot owners share the community\u2019s amenities.',
    ],
    facts: [['Homes planned', '800+'], ['Location', 'Malejor, past the Adenta barrier, before Valley View University'], ['Plots', 'Serviced, permit-ready']],
    features: homeFeatures, amenities: communityAmenities, sitePlan: photo(IMG.sitePlan, 900),
  },
  {
    slug: 'adjiringanor', name: 'Adjiringanor', status: 'sold', location: 'East Legon extension, Accra',
    tagline: 'Over 200 homes in a gated community. Completed and sold out.',
    image: photo(IMG.adji), thumb: photo(IMG.adji, 800), gallery: [photo(IMG.adji), photo(IMG.fourBed)].map((src) => ({ src, alt: 'Adjiringanor' })),
    body: [
      'Salem Homes built more than 200 residential homes in this gated community at the East Legon extension, one of the finest residential areas in Accra.',
      'The project was delivered successfully and every home has been sold. Our current development is City of David at Malejor.',
    ],
    facts: [['Homes built', '200+'], ['Location', 'East Legon extension, Adjiringanor'], ['Status', 'Sold out']],
    features: homeFeatures,
  },
];
export const statusLabel = { selling: 'Now selling', sold: 'Sold out', soon: 'Coming soon' };
