// A tidy grid of photos. `featured` makes the first photo large and the rest fall in a clean grid beside and below it.
export default function PhotoGrid({ photos, onOpen, offset = 0, featured = false, children }) {
  return (
    <ul className={`pg${featured ? ' featured' : ''}`}>
      {photos.map((p, i) => (
        <li key={p.src}>
          <button onClick={() => onOpen(offset + i)} aria-label={`Open photo: ${p.alt}`}>
            <img src={p.thumb || p.src} alt={p.alt} loading="lazy" style={p.pos ? { objectPosition: p.pos } : undefined} />
            {p.label && <span className="pg-label">{p.label}</span>}
          </button>
        </li>
      ))}
      {children}
    </ul>
  );
}
