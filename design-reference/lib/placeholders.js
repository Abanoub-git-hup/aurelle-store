// Placeholder art until the real stock photos arrive (ticket "real images"): one SVG per image key,
// a flat garment silhouette in the colour's swatch on the cream ground. View 1 is the whole piece,
// view 2 a close crop, so the hover swap is visible.

const GROUND = '#EFEAE1';
const LINE = 'rgba(26,23,20,0.12)';

const SHAPES = {
  outerwear:
    'M210 150 L260 120 L300 170 L340 120 L390 150 L450 230 L470 560 L420 570 L410 330 L405 680 L195 680 L190 330 L180 570 L130 560 L150 230 Z',
  knitwear:
    'M200 200 L260 170 Q300 200 340 170 L400 200 L470 300 L440 470 L405 460 L400 590 L200 590 L195 460 L160 470 L130 300 Z',
  dresses: 'M250 140 L265 140 L280 230 L320 230 L335 140 L350 140 L360 260 L440 680 L160 680 L240 260 Z',
  trousers: 'M215 150 L385 150 L410 680 L320 680 L300 300 L280 680 L190 680 Z',
  accessories: 'M170 330 L430 330 L450 640 L150 640 Z',
};

function garment(category, colour) {
  const d = SHAPES[category] ?? SHAPES.accessories;
  const handle =
    category === 'accessories'
      ? `<path d="M230 330 Q230 200 300 200 Q370 200 370 330" fill="none" stroke="${colour}" stroke-width="18"/>`
      : '';
  return `${handle}<path d="${d}" fill="${colour}" stroke="${LINE}" stroke-width="2"/>
    <path d="${d}" fill="url(#shade)"/>`;
}

export function placeholderSvg({ category, colour, view }) {
  const crop = view > 1 ? ' transform="translate(-360 -280) scale(2.2)"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="${GROUND}"/>
  <g${crop}>${garment(category, colour)}</g>
</svg>
`;
}

// Every image key the catalog refers to, with what its placeholder should draw.
export function placeholderList(catalog) {
  const list = [];
  for (const p of catalog.products) {
    for (const c of p.colors) {
      c.images.forEach((key, i) => list.push({ key, category: p.category, colour: c.swatch, view: i + 1 }));
    }
  }
  for (const c of catalog.categories) {
    list.push({ key: c.image, category: c.id, colour: '#A9A091', view: 1 });
  }
  return list;
}
