import { useEffect, useRef, useState } from 'react';
import { onceVisible } from '../lib/visible';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Fades and lifts its content into view as the visitor scrolls to it.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return undefined;
    if (reduced()) { setSeen(true); return undefined; }
    return onceVisible(ref.current, () => setSeen(true));
  }, []);
  return <Tag ref={ref} className={`reveal${seen ? ' in' : ''} ${className}`.trim()} style={{ '--d': `${delay}ms` }} {...rest}>{children}</Tag>;
}
