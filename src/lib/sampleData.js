// Shown until your Supabase database has listings. Run supabase/seed.sql to load these into the database.
import { photo, IMG } from '../content/images';
import { homeFeatures } from '../content/projects';

const base = { currency: 'GHS', listing_type: 'sale', property_type: 'house', status: 'published', featured: true, city: 'Accra', location: 'Malejor, City of David', features: homeFeatures, created_at: '2026-09-01T10:00:00Z' };
export const sampleListings = [
  { ...base, id: 's1', title: 'Three Bedroom Ensuite', price: 1800000, bedrooms: 3, bathrooms: 3, images: [photo(IMG.threeEnsuite)], description: 'A newly built three bedroom ensuite home in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.' },
  { ...base, id: 's2', title: 'Three Bedroom Expanded Detached House', price: 1200000, bedrooms: 3, bathrooms: 2, images: [photo(IMG.room)], description: 'A newly built three bedroom expanded detached house in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.' },
  { ...base, id: 's3', title: 'Two Bedroom Detached Expandable', price: 1053600, bedrooms: 2, bathrooms: 1, images: [photo(IMG.twoBed)], description: 'A newly built two bedroom detached expandable house in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.' },
];
