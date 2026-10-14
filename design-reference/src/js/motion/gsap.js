// One place that registers the GSAP plugins, so every effect imports the same instance.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'expo.out' }); // design.md: one long, soft exit curve everywhere

// Entrances start when the element's top crosses 85% of the viewport, and play once.
export const ENTER = { start: 'top 85%', once: true };

export { gsap, ScrollTrigger, SplitText };
