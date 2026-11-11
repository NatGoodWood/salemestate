import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Arrow = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// Slides always advance on their own (every 6 seconds). Visitors can pause, use the arrows or dots, or swipe.
export default function HeroSlider({ slides, interval = 6000 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const touch = useRef(null);
  const n = slides.length;
  const go = (k) => setI((k + n) % n);
  const running = !paused && !kbFocus;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setI((c) => (c + 1) % n), interval);
    return () => clearInterval(id);
  }, [running, n, interval, i]); // restarts the timer after any manual change

  return (
    <section
      className="slider"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onFocus={(e) => setKbFocus(Boolean(e.target.matches?.(':focus-visible')))}
      onBlur={() => setKbFocus(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <h1 className="sr">Salem Estate: modern homes in Accra</h1>
      <div className="track" style={{ transform: `translateX(-${i * 100}%)` }} aria-live={running ? 'off' : 'polite'}>
        {slides.map((s, k) => (
          <div key={s.title} className={`slide${k === i ? ' on' : ''}`} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i}>
            <img src={s.img} alt="" loading={k < 2 ? 'eager' : 'lazy'} style={{ objectPosition: s.pos }} />
            <div className="slide-in">
              <div className="container">
                <div className="slide-copy">
                  <span className="eyebrow light">{s.tag}</span>
                  <p className="slide-title">{s.title}</p>
                  <p className="lead">{s.text}</p>
                  <p className="hero-cta"><Link className="btn btn-gold" to={s.to} tabIndex={k === i ? 0 : -1}>{s.cta}</Link></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-ui container">
        <div className="dots">
          {slides.map((s, k) => <button key={s.title} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={`Show slide ${k + 1}: ${s.title}`} aria-current={k === i} />)}
        </div>
        <div className="arrows">
          <button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? '▶' : '❚❚'}</button>
          <button onClick={() => go(i - 1)} aria-label="Previous slide"><Arrow dir="prev" /></button>
          <button onClick={() => go(i + 1)} aria-label="Next slide"><Arrow dir="next" /></button>
        </div>
      </div>
    </section>
  );
}
