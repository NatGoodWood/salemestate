import { useCallback, useState } from 'react';
import { newPhotos, oldPhotos, galleryPhotos } from '../content/images';
import { t } from '../lib/text';
import Lightbox from '../components/Lightbox';
import PhotoGrid from '../components/PhotoGrid';
import Reveal from '../components/Reveal';

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const step = useCallback((d) => setOpen((i) => (i + d + galleryPhotos.length) % galleryPhotos.length), []);
  const close = useCallback(() => setOpen(null), []);
  return (
    <div className="container section">
      <h1>{t('nav.gallery')}</h1>
      <h2 className="grid-sub first">Salem Estate</h2>
      <Reveal><PhotoGrid photos={newPhotos} onOpen={setOpen} featured /></Reveal>
      <p className="fineprint">Images are artist’s impressions and may differ from the completed homes.</p>
      <h2 className="grid-sub">Earlier projects</h2>
      <Reveal><PhotoGrid photos={oldPhotos} onOpen={setOpen} offset={newPhotos.length} /></Reveal>
      {open !== null && <Lightbox photos={galleryPhotos} index={open} onClose={close} onStep={step} />}
    </div>
  );
}
