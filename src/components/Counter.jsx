import { useEffect, useRef, useState } from 'react';
import { onceVisible } from '../lib/visible';

// Counts up to a number the first time it scrolls into view.
export default function Counter({ to, suffix = '', group = true, duration = 1600 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce) { setV(to); return undefined; }
    let raf;
    const stop = onceVisible(el, () => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setV(Math.round(to * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 0.85);
    return () => { stop(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref}>{group ? v.toLocaleString('en-GH') : v}{suffix}</span>;
}
