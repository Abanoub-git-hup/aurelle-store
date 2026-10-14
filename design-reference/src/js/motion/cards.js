// M8 — cards enter one after another (rise 40px + fade in). Markup: a grid whose children are the cards.
// ScrollTrigger.batch groups the cards that enter together so a row staggers as one.
import { gsap, ScrollTrigger } from './gsap.js';

export function cards(el) {
  const items = [...el.children];
  if (!items.length) return;

  gsap.set(items, { y: 40, opacity: 0 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }),
  });
}
