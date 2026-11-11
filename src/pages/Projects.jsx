import { Link } from 'react-router-dom';
import { projects, statusLabel } from '../content/projects';
import { t } from '../lib/text';

export default function Projects() {
  return (
    <div className="container section">
      <h1>{t('nav.projects')}</h1>
      <div className="tiles">
        {projects.map((p) => (
          <Link key={p.slug} to={`/projects/${p.slug}`} className="tile">
            <img src={p.thumb} alt="" loading="lazy" />
            <div className="tile-body"><span className={`pill ${p.status}`}>{p.badge || statusLabel[p.status]}</span><h3>{p.name}</h3><p>{p.tagline}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
