import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import InquiryForm from '../components/InquiryForm';

const TourContext = createContext({ openTour: () => {} });
export const useTour = () => useContext(TourContext);

export function TourProvider({ children }) {
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  const box = useRef(null);
  const openTour = useCallback(() => { opener.current = document.activeElement; setOpen(true); }, []);
  const close = useCallback(() => { setOpen(false); opener.current?.focus?.(); }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    box.current?.querySelector('input, textarea, button')?.focus();
    const key = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && box.current) {
        const f = [...box.current.querySelectorAll('a[href], button:not([disabled]), input:not(.hp), select, textarea')];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [open, close]);

  return (
    <TourContext.Provider value={{ openTour }}>
      {children}
      {open && (
        <div className="modal" onMouseDown={close}>
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="tour-h" ref={box} onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={close} aria-label="Close">×</button>
            <span className="eyebrow">Salem Estate</span>
            <h2 id="tour-h">Schedule a tour</h2>
            <p className="muted">Tell us when suits you and a member of our sales team will confirm your private tour.</p>
            <InquiryForm bare viewing defaultMessage="Hello, I would like to schedule a tour of Salem Estate." />
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}
