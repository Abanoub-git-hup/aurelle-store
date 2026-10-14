// Lenis smooth scrolling on every device (Q6), driven by GSAP's ticker so ScrollTrigger and
// Lenis stay on the same frame.
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

export function startSmoothScroll() {
  // syncTouch smooths touch scrolling too — Q6 asks for Lenis on touch devices as well.
  const lenis = new Lenis({ autoRaf: false, syncTouch: true });
  const tick = (time) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
