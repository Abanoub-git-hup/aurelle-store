// prefers-reduced-motion → everything is shown at once. The class lets CSS (and later effects
// like the marquee) switch off their own motion too.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export function watchReducedMotion() {
  const query = matchMedia(REDUCED);
  const apply = () => document.documentElement.classList.toggle('is-reduced-motion', query.matches);
  apply();
  query.addEventListener('change', apply);
}
