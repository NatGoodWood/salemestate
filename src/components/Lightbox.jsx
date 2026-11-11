import { useEffect } from 'react';

export default function Lightbox({ photos, index, onClose, onStep }) {
  useEffect(() => {
    const key = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onStep(1); if (e.key === 'ArrowLeft') onStep(-1); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [onClose, onStep]);

  const p = photos[index];
  if (!p) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close">×</button>
      <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous photo">‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={p.src} alt={p.alt} />
        <figcaption>{p.label ? `${p.label}. ` : ''}{p.alt} <span>{index + 1} / {photos.length}</span></figcaption>
      </figure>
      <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next photo">›</button>
    </div>
  );
}
