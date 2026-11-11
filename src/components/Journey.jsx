import { journey } from '../content/journey';

export default function Journey() {
  return (
    <ol className="journey">
      {journey.map((s) => (
        <li key={s.year} className={s.latest ? 'latest' : ''}>
          <div className="jr-when">
            <strong>{s.year}</strong>
            {s.tag && <span className="pill">{s.tag}</span>}
          </div>
          <div className="jr-what">
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
          {s.img ? <img className="jr-img" src={s.img} alt="" loading="lazy" /> : <span className="jr-img none" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
