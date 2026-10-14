// Images by key, e.g. 'products/wool-wrap-coat/camel-1'.
// A real photo in src/images/src/<key>.(jpg|jpeg|png|webp) is resized to responsive webp by
// eleventy-img; until it exists the generated placeholder SVG is used. Dropping the photos in is
// enough — no template changes (ticket "real images").
//
//   {% image key, alt, class, sizes, loading %}   → <img …>
//   {% assign d = key | image_data %}              → { src, srcset, width, height } (for data-* swaps)
import { existsSync } from 'node:fs';
import Image from '@11ty/eleventy-img';

const SOURCE_DIR = 'src/images/src';
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const WIDTHS = [480, 960, 1600];

const escapeAttr = (s = '') => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;');

function sourceFor(key) {
  return EXTENSIONS.map((ext) => `${SOURCE_DIR}/${key}.${ext}`).find((file) => existsSync(file));
}

export async function imageData(key) {
  const source = sourceFor(key);
  if (!source) {
    return { src: `/images/placeholder/${key}.svg`, srcset: '', width: 600, height: 800 };
  }

  const metadata = await Image(source, {
    widths: WIDTHS,
    formats: ['webp'],
    outputDir: '_site/images/',
    urlPath: '/images/',
    filenameFormat: (id, src, width, format) => `${key.replaceAll('/', '-')}-${width}.${format}`,
  });
  const set = metadata.webp;
  const largest = set[set.length - 1];
  return {
    src: largest.url,
    srcset: set.map((i) => `${i.url} ${i.width}w`).join(', '),
    width: largest.width,
    height: largest.height,
  };
}

export async function imageShortcode(key, alt = '', className = '', sizes = '100vw', loading = 'lazy') {
  const d = await imageData(key);
  const srcset = d.srcset ? ` srcset="${d.srcset}" sizes="${escapeAttr(sizes)}"` : '';
  return `<img src="${d.src}"${srcset} width="${d.width}" height="${d.height}" alt="${escapeAttr(alt)}" class="${escapeAttr(className)}" loading="${loading}" decoding="async">`;
}
