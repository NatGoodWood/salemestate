import { USD_TO_GHS } from '../config';

export function formatPrice(price, currency = 'GHS') {
  const n = new Intl.NumberFormat('en-GH', { maximumFractionDigits: 0 }).format(Number(price) || 0);
  return `${currency === 'USD' ? '$' : 'GH₵'}${n}`;
}
export const toGhs = (l) => (l.currency === 'USD' ? Number(l.price) * USD_TO_GHS : Number(l.price));
export const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Turns 024 000 0000 or +233 24 000 0000 into 233240000000 for wa.me links.
export function waNumber(phone = '') {
  const d = phone.replace(/\D/g, '');
  return d.startsWith('0') ? `233${d.slice(1)}` : d;
}
