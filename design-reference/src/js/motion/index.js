// The motion system. Markup opts in with `data-motion` (several effects may share one element:
// data-motion="reveal parallax"). Content is visible by default; motion is only added on top:
//   - JS off or the bundle fails → nothing is ever hidden (see motion-pending.liquid);
//   - prefers-reduced-motion → no effect, no parallax, no smooth scroll.
// mountMotion(root) returns a destroy() so a port can re-mount one section (Shopify theme editor).
import { gsap, ScrollTrigger } from './gsap.js';
import { word, chars, lines } from './split.js';
import { reveal } from './reveal.js';
import { parallax } from './parallax.js';
import { cards } from './cards.js';
import { startSmoothScroll } from './smooth-scroll.js';
import { MOTION_OK, watchReducedMotion } from './reduced-motion.js';

const effects = { word, chars, lines, reveal, parallax, cards };
const PENDING = 'is-motion-pending';

function fontsReady(timeout = 2500) {
  return Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, timeout))]);
}

export function mountMotion(root = document) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    for (const el of root.querySelectorAll('[data-motion]')) {
      for (const name of el.dataset.motion.split(/\s+/)) effects[name]?.(el);
    }
  });
  // Everything created inside matchMedia (tweens, ScrollTriggers, SplitTexts) is reverted here,
  // and again automatically if the visitor turns on reduced motion mid-visit.
  return () => mm.revert();
}

export async function initMotion() {
  watchReducedMotion();
  // Split text only once the real faces are in, or the masks are measured on the fallback font.
  await fontsReady();

  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => startSmoothScroll());
  mountMotion(document);

  document.documentElement.classList.remove(PENDING);
  ScrollTrigger.refresh();
}
