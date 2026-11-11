import { Link } from 'react-router-dom';
import { company, team } from '../config';
import { NEW } from '../content/images';
import Journey from '../components/Journey';

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export default function About() {
  const people = team.filter((m) => m.name && m.name !== 'Add name');
  return (
    <>
      <section className="page-hero" style={{ '--hero': `url(${NEW.day.src})` }}>
        <div className="container"><span className="eyebrow light">About us</span><h1>A Ghanaian home builder</h1></div>
      </section>

      <section className="section container split">
        <div>
          <p>Salem is a private limited company, first registered in 1995 and 100% Ghanaian-owned. We plan to widen our equity base and welcome suitable foreign investment, as permitted by Ghana’s Investment Code, so that we can deliver housing on a larger scale.</p>
          <p>We started by importing and retailing building materials. In 1999 we moved into real estate, and we have since earned a reputation as a dependable supplier of well-made homes for different budgets and clients.</p>
          <p>Our work goes beyond houses. We also build roads, mechanised boreholes and recreational parks for children, and we have won and delivered projects under the Government of Ghana’s MSDI and MBDA programmes. Our team of professionals delivers quality homes on schedule.</p>
        </div>
        <aside className="panel quote">
          <h3>What we aim for</h3>
          <p>Quality housing estates where satisfied customers own wonderful homes, at fair prices, in pristine and beautifully landscaped communities.</p>
          <p className="muted">Active member of GREDA since 1999.</p>
        </aside>
      </section>

      <section className="band">
        <div className="container">
          <span className="eyebrow">Our journey</span>
          <h2>How Salem has grown</h2>
          <Journey />
        </div>
      </section>

      {people.length > 0 && (
        <section className="container section">
          <h2>Meet the team</h2>
          <ul className="team">
            {people.map((m, i) => (
              <li key={i}>
                {m.photo ? <img src={m.photo} alt={m.name} loading="lazy" /> : <span className="avatar" aria-hidden="true">{initials(m.name)}</span>}
                <strong>{m.name}</strong><span className="muted">{m.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="container section"><Link className="btn btn-primary" to="/contact">Talk to {company.name}</Link></section>
    </>
  );
}
