import { useCallback, useEffect, useState } from 'react';
import { getPublicListings } from '../lib/api';
import { newPhotos, oldPhotos } from '../content/images';
import { t } from '../lib/text';
import Lightbox from '../components/Lightbox';
import PhotoGrid from '../components/PhotoGrid';

export default function Gallery() {
  const [extra, setExtra] = useState([]);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    getPublicListings().then((all) => setExtra(all.flatMap((l) => (l.images || []).map((src) => ({ src, alt: l.title, label: 'Available homes' }))))).catch(() => {});
  }, []);

  const seen = new Set([...newPhotos, ...oldPhotos].map((p) => p.src.split('?')[0]));
  const listing = extra.filter((p) => { const k = p.src.split('?')[0]; if (seen.has(k)) return false; seen.add(k); return true; });
  const photos = [...newPhotos, ...oldPhotos, ...listing];

  const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className="container section">
      <h1>{t('nav.gallery')}</h1>
      <h2 className="grid-sub first">Salem Estate</h2>
      <PhotoGrid photos={newPhotos} onOpen={setOpen} featured />
      <p className="fineprint">Images are artist’s impressions and may differ from the completed homes.</p>
      <h2 className="grid-sub">Earlier projects</h2>
      <PhotoGrid photos={oldPhotos} onOpen={setOpen} offset={newPhotos.length} />
      {listing.length > 0 && (<><h2 className="grid-sub">Available homes</h2><PhotoGrid photos={listing} onOpen={setOpen} offset={newPhotos.length + oldPhotos.length} /></>)}
      {open !== null && <Lightbox photos={photos} index={open} onClose={close} onStep={step} />}
    </div>
  );
}
