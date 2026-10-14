// Build-time view of the catalog. The JSON in src/_data/catalog/ stays the raw schema
// (architecture.md → Database Schema); everything derived — availability, discount, the
// curated lists resolved to products — is computed here once, so templates stay simple.
import { readFileSync } from 'node:fs';

const read = (file) =>
  JSON.parse(readFileSync(new URL(`../src/_data/catalog/${file}`, import.meta.url), 'utf8'));

export const MAX_SWATCHES = 4; // FR-1.3: four swatches on a card, then "+N"

function enrich(product) {
  const colors = product.colors.map((color) => ({
    ...color,
    available: product.variants.some((v) => v.color === color.id && v.stock > 0),
  }));
  const available = colors.some((c) => c.available);
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return {
    ...product,
    colors,
    available,
    discount,
    // First colour that can be bought (or the first one when nothing can) is the card's default.
    defaultColor: (colors.find((c) => c.available) ?? colors[0]).id,
    singleImage: colors.every((c) => c.images.length < 2),
    singleSize: product.sizes.length === 1,
  };
}

export function loadCatalog() {
  const products = read('products.json').map(enrich);
  const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));
  const categories = read('categories.json').sort((a, b) => a.order - b.order);

  const resolve = (lists) =>
    Object.fromEntries(
      Object.entries(lists).map(([name, byDept]) => [
        name,
        Object.fromEntries(
          Object.entries(byDept).map(([dept, handles]) => [
            dept,
            handles.map((h) => {
              if (!byHandle[h])
                throw new Error(`catalog: edit list "${name}.${dept}" names unknown product "${h}"`);
              return byHandle[h];
            }),
          ]),
        ),
      ]),
    );

  const departments = [...new Set(products.map((p) => p.department))]; // Women first, as in the menu (Q17)

  return {
    products,
    byHandle,
    categories,
    departments,
    lists: resolve(read('edit.json')),
    maxSwatches: MAX_SWATCHES,
  };
}
