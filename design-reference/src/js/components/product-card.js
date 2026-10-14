// Product card — prd.md FR-1 + FR-2.
// Hovering a swatch previews that colour's pictures; leaving the swatches goes back to the chosen
// colour. Choosing a swatch (click, tap, or arrow keys on the radios) makes it the card's colour:
// pictures, colour name, and the ?color= on the card's links. All picture URLs are already on the
// swatches, so nothing is fetched except the images themselves (preloaded on first approach).

function setImage(img, src, srcset) {
  if (!img) return;
  if (!src) {
    img.hidden = true; // this colour has no second picture
    return;
  }
  img.hidden = false;
  if (srcset) img.srcset = srcset;
  else img.removeAttribute('srcset');
  img.src = src;
}

export function mount(card) {
  const swatches = card.querySelector('[data-swatches]');
  if (!swatches) return;

  const main = card.querySelector('.c-card__img--main');
  const hover = card.querySelector('.c-card__img--hover');
  const name = card.querySelector('[data-colour-name]');
  const links = card.querySelectorAll('[data-card-link]');
  const checked = () => swatches.querySelector('input:checked');
  let preloaded = false;

  function show(input) {
    const d = input.dataset;
    setImage(main, d.mainSrc, d.mainSrcset);
    setImage(hover, d.hoverSrc, d.hoverSrcset);
  }

  function choose(input) {
    show(input);
    card.dataset.color = input.value;
    if (name) name.textContent = input.dataset.label;
    for (const link of links) {
      const url = new URL(link.href);
      url.searchParams.set('color', input.value);
      link.href = url.pathname + url.search;
    }
  }

  // FR-1.5: fetch every colour's pictures the first time the visitor approaches the swatches.
  function preload() {
    if (preloaded) return;
    preloaded = true;
    for (const input of swatches.querySelectorAll('input')) {
      for (const src of [input.dataset.mainSrc, input.dataset.hoverSrc]) if (src) new Image().src = src;
    }
  }

  const onEnter = (event) => {
    const input = event.target.closest?.('.c-swatch')?.querySelector('input');
    if (input) show(input);
  };
  const onLeave = () => {
    const input = checked();
    if (input) show(input);
  };
  const onChange = (event) => choose(event.target);

  swatches.addEventListener('pointerenter', preload, { once: true });
  swatches.addEventListener('focusin', preload, { once: true });
  swatches.addEventListener('pointerover', onEnter);
  swatches.addEventListener('pointerleave', onLeave);
  swatches.addEventListener('change', onChange);

  return () => {
    swatches.removeEventListener('pointerover', onEnter);
    swatches.removeEventListener('pointerleave', onLeave);
    swatches.removeEventListener('change', onChange);
  };
}
