// Edit this file to rebrand the whole site.
export const company = {
  name: 'Salem Estate',
  legalName: 'Salem Investment LTD',
  tagline: 'Real estate developers',
  logoDark: '/images/logo.png',        // for light backgrounds
  logoLight: '/images/logo-light.png', // for dark backgrounds
  phone: '+233 54 759 5308',            // WhatsApp and calls
  phoneAlt: '+233 26 661 4953',
  office: '+233 302 816 218',
  whatsapp: '233547595308', // international format, no + or spaces
  email: 'info@salemestate.com',
  address: 'Salem House, Spintex Road, Accra',
  poBox: 'P.O. Box TNE 209, Accra, Ghana',
  hours: 'Mon to Fri, 9 AM to 5 PM',
  founded: 1995,
};
export const tel = (n) => n.replace(/\s/g, '');
export const cities = ['Accra', 'Tema', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tamale'];
export const propertyTypes = { house: 'House', apartment: 'Apartment', townhouse: 'Townhouse', land: 'Land', commercial: 'Commercial' };
export const USD_TO_GHS = 15; // only used to compare prices when filtering

// Add real team members here. Entries named 'Add name' are hidden on the site.
export const team = [
  { name: 'Add name', role: 'Managing Director', photo: '' },
];
