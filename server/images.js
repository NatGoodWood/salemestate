import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { UPLOAD_DIR } from './store.js';

sharp.cache(false);

// Accepts JPG, PNG or WebP, fixes phone rotation, strips private metadata, and saves a full-size and a small copy.
export async function saveImage(buffer) {
  let meta;
  try { meta = await sharp(buffer, { limitInputPixels: 80e6 }).metadata(); } catch { meta = null; }
  if (!meta || !['jpeg', 'png', 'webp'].includes(meta.format)) throw Object.assign(new Error('Please upload a JPG, PNG or WebP photo.'), { status: 400 });
  const id = crypto.randomBytes(8).toString('hex');
  const base = () => sharp(buffer, { limitInputPixels: 80e6 }).rotate().flatten({ background: '#ffffff' });
  await base().resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(UPLOAD_DIR, `${id}.jpg`));
  await base().resize({ width: 800, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(UPLOAD_DIR, `${id}-sm.jpg`));
  return { src: `/uploads/${id}.jpg`, sm: `/uploads/${id}-sm.jpg` };
}
