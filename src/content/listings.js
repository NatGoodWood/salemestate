// Homes shown on the "Now Selling" and "Properties" pages. This is a plain list: edit, add or remove entries here.
// Prices are numbers (no commas). Use currency 'GHS' (GH₵) or 'USD' ($). Set price to 0 to show "Contact for price".
import { photo, IMG } from './images';
import { homeFeatures } from './projects';

const base = {
  currency: 'GHS', listing_type: 'sale', property_type: 'house', status: 'published', featured: true,
  city: 'Accra', location: 'Malejor, City of David', features: homeFeatures, created_at: '2026-09-01T10:00:00Z',
};
const note = 'Prices are exclusive of taxes and are subject to change without prior notice.';

export const listings = [
  { ...base, id: 'three-bedroom-ensuite', title: 'Three Bedroom Ensuite', price: 1800000, bedrooms: 3, bathrooms: 3, images: [photo(IMG.threeEnsuite)], description: `A newly built three bedroom ensuite home in the new areas of Malejor, within the City of David community. ${note}` },
  { ...base, id: 'three-bedroom-expanded-detached', title: 'Three Bedroom Expanded Detached House', price: 1200000, bedrooms: 3, bathrooms: 2, images: [photo(IMG.room)], description: `A newly built three bedroom expanded detached house in the new areas of Malejor, within the City of David community. ${note}` },
  { ...base, id: 'two-bedroom-detached-expandable', title: 'Two Bedroom Detached Expandable', price: 1053600, bedrooms: 2, bathrooms: 1, images: [photo(IMG.twoBed)], description: `A newly built two bedroom detached expandable house in the new areas of Malejor, within the City of David community. ${note}` },
];

export const getListing = (id) => listings.find((l) => l.id === id) || null;
