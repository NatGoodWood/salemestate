// Calls back once when an element has scrolled into view (or has already been scrolled past).
// One shared scroll listener serves every animated element on the page.
const pending = new Set();
let bound = false;
let raf = 0;

function check() {
  raf = 0;
  const h = window.innerHeight;
  pending.forEach((item) => {
    if (item.el.getBoundingClientRect().top < h * (item.at ?? 0.92)) { pending.delete(item); item.cb(); }
  });
  if (!pending.size && bound) { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); bound = false; }
}
function schedule() { if (!raf) raf = requestAnimationFrame(check); }

export function onceVisible(el, cb, at) {
  const item = { el, cb, at };
  pending.add(item);
  if (!bound) { window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); bound = true; }
  schedule();
  return () => pending.delete(item);
}
