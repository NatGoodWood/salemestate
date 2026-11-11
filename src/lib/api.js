import { supabase, isConfigured } from './supabase';
import { sampleListings } from './sampleData';

const BUCKET = 'listing-images';
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 12;

const need = () => { if (!isConfigured) throw new Error('Supabase is not configured yet. See the README.'); };
const pathFromUrl = (url) => url.split(`/${BUCKET}/`)[1];

/* ---------- Public ---------- */
export async function getPublicListings() {
  if (!isConfigured) return sampleListings;
  const { data, error } = await supabase.from('listings').select('*').neq('status', 'draft').order('created_at', { ascending: false }).limit(500);
  if (error) throw error;
  return data;
}

export async function getListing(id) {
  if (!isConfigured) return sampleListings.find((l) => l.id === id) || null;
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function submitInquiry({ name, phone, email, message, listing_id }) {
  need();
  const { error } = await supabase.from('inquiries').insert({
    name: name.trim(), phone: phone.trim() || null, email: email.trim() || null, message: message.trim(), listing_id: listing_id || null,
  });
  if (error) throw error;
}

/* ---------- Admin (every call is also enforced by database policies) ---------- */
export async function getAdminListings() {
  need();
  const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveListing(payload, id) {
  need();
  const q = id ? supabase.from('listings').update(payload).eq('id', id) : supabase.from('listings').insert(payload);
  const { error } = await q;
  if (error) throw error;
}

export async function deleteListing(listing) {
  need();
  const { error } = await supabase.from('listings').delete().eq('id', listing.id);
  if (error) throw error;
  await removeImages(listing.images || []);
}

export async function uploadImages(files) {
  need();
  const urls = [];
  try {
    for (const f of files) {
      if (!TYPES[f.type]) throw new Error(`${f.name} is not a JPG, PNG or WebP image.`);
      if (f.size > MAX_IMAGE_BYTES) throw new Error(`${f.name} is larger than 5 MB.`);
      const path = `${crypto.randomUUID()}.${TYPES[f.type]}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type, cacheControl: '31536000' });
      if (error) throw error;
      urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    }
  } catch (err) {
    await removeImages(urls);
    throw err;
  }
  return urls;
}

export async function removeImages(urls) {
  const paths = urls.map(pathFromUrl).filter(Boolean);
  if (isConfigured && paths.length) await supabase.storage.from(BUCKET).remove(paths);
}

export async function getInquiries() {
  need();
  const { data, error } = await supabase.from('inquiries').select('*, listings(title)').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  return data;
}

export async function deleteInquiry(id) {
  need();
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}
