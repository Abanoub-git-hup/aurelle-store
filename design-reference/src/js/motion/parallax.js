// M7 — parallax: the picture drifts inside its frame, about 10% slower than the page.
// Markup: a frame (overflow hidden) whose child is taller than it (see .u-parallax in motion.css).
import { gsap } from './gsap.js';

export function parallax(el) {
  const media = el.firstElementChild;
  if (!media) return;

  gsap.fromTo(
    media,
    { yPercent: -8 },
    {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}
