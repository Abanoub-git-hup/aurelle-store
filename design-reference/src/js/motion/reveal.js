// M6 — image reveal: the frame opens from the bottom up while the picture settles from 115% to 100%.
// Markup: a frame with one child (the picture).
import { gsap, ENTER } from './gsap.js';

export function reveal(el) {
  const media = el.firstElementChild;
  const scrollTrigger = { trigger: el, ...ENTER };

  gsap.fromTo(
    el,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, scrollTrigger },
  );
  if (media) gsap.from(media, { scale: 1.15, duration: 1.2, scrollTrigger });
}
