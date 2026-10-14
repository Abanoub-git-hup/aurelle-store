// Text that rises from under a mask — M2 (the wordmark), M3 (section titles), M5 (paragraphs).
// Arabic is never split into letters (it breaks the joins): any element whose text contains
// Arabic script is split into words instead. The Latin wordmark AURELLE keeps letter by letter.
import { gsap, SplitText, ENTER } from './gsap.js';

const ARABIC = /\p{Script=Arabic}/u;

function unitOf(el) {
  return ARABIC.test(el.textContent) ? 'words' : 'chars';
}

// autoSplit re-splits after fonts load and on resize; returning the tween from onSplit lets
// SplitText carry its progress across a re-split. Letters are always split inside words, so a
// line can only break between words, never in the middle of one.
function split(el, type, animate) {
  SplitText.create(el, {
    type: type === 'chars' ? 'words,chars' : type,
    mask: type,
    // Masks inherit these classes + "-mask" (u-split-char-mask …) — styled in motion.css.
    charsClass: 'u-split-char',
    wordsClass: 'u-split-word',
    linesClass: 'u-split-line',
    autoSplit: true,
    onSplit: (self) => animate(self[type]),
  });
}

// M2 — the big wordmark: every letter rises with a soft blur that clears. Plays on load.
export function word(el) {
  const unit = unitOf(el);
  split(el, unit, (parts) =>
    gsap.from(parts, {
      yPercent: 110,
      filter: 'blur(8px)',
      duration: 1.2,
      stagger: 0.06,
      delay: Number(el.dataset.motionDelay || 0),
    }),
  );
}

// M3 — section titles: letter by letter (Arabic: word by word) when the title enters.
export function chars(el) {
  const unit = unitOf(el);
  split(el, unit, (parts) =>
    gsap.from(parts, {
      yPercent: 110,
      duration: 1,
      stagger: unit === 'chars' ? 0.025 : 0.06,
      scrollTrigger: { trigger: el, ...ENTER },
    }),
  );
}

// M5 — paragraphs: line by line when the paragraph enters.
export function lines(el) {
  split(el, 'lines', (parts) =>
    gsap.from(parts, {
      yPercent: 100,
      duration: 1,
      stagger: 0.08,
      scrollTrigger: { trigger: el, ...ENTER },
    }),
  );
}
