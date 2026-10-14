import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { loadCatalog } from './lib/catalog.js';
import { imageData, imageShortcode } from './lib/images.js';
import { placeholderList, placeholderSvg } from './lib/placeholders.js';
import { formatMoney } from './src/js/core/money.js';

const site = JSON.parse(readFileSync('./src/_data/site.json', 'utf8'));
const dictionaries = Object.fromEntries(
  site.languages.map((l) => [l.code, JSON.parse(readFileSync(`./src/_data/i18n/${l.code}.json`, 'utf8'))]),
);
const byCode = Object.fromEntries(site.languages.map((l) => [l.code, l]));

// The language of a page comes from its URL: `/ar/...` is Arabic, everything else English.
function langOf(url = '/') {
  const match = site.languages.find(
    (l) => l.prefix && (url === `${l.prefix}/` || url.startsWith(`${l.prefix}/`)),
  );
  return match ? match.code : site.defaultLang;
}

// Strip the language prefix so the same path can be rebuilt for another language.
function basePath(url = '/') {
  const lang = byCode[langOf(url)];
  return lang.prefix ? url.slice(lang.prefix.length) || '/' : url;
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

export default function (eleventyConfig) {
  // {{ 'header.bag' | t }} — translated UI string for the current page's language.
  // {{ 'card.moreColours' | t: 2 }} — a number argument fills {n}.
  // A missing key fails the build, so no page ships with an untranslated string.
  eleventyConfig.addFilter('t', function (key, n) {
    const lang = langOf(this.page?.url);
    const value = lookup(dictionaries[lang], key);
    if (typeof value !== 'string') {
      throw new Error(`i18n: missing key "${key}" for "${lang}" (${this.page?.inputPath})`);
    }
    let text = value.replaceAll('{brand}', site.brand);
    if (n !== undefined) {
      text = text.replaceAll('{n}', new Intl.NumberFormat(byCode[lang].numberLocale).format(n));
    }
    return text;
  });

  // {{ product.title | loc }} — a { en, ar } content field in the current page's language.
  eleventyConfig.addFilter('loc', function (field) {
    if (field == null || typeof field === 'string') return field;
    return field[langOf(this.page?.url)] ?? field[site.defaultLang];
  });

  // {{ product.price | money }} — "EGP 12,500" / "١٢٬٥٠٠ ج.م".
  eleventyConfig.addFilter('money', function (amount) {
    return formatMoney(amount, langOf(this.page?.url));
  });

  // Catalog — products with derived fields, categories, curated lists (lib/catalog.js).
  const catalog = loadCatalog();
  eleventyConfig.addGlobalData('shop', catalog);
  eleventyConfig.addWatchTarget('./lib/');

  // Images — real photo when present, generated placeholder otherwise (lib/images.js).
  eleventyConfig.addAsyncShortcode('image', imageShortcode);
  eleventyConfig.addAsyncFilter('image_data', imageData);
  eleventyConfig.on('eleventy.after', ({ dir }) => {
    for (const item of placeholderList(catalog)) {
      const file = `${dir.output}/images/placeholder/${item.key}.svg`;
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, placeholderSvg(item));
    }
  });

  // {{ '/shop/women/' | lurl }} — internal link in the current page's language.
  eleventyConfig.addFilter('lurl', function (path) {
    return `${byCode[langOf(this.page?.url)].prefix}${path}`;
  });

  // {% assign lang = page.url | lang_of %} — the language object (code, dir, prefix …) of a URL.
  eleventyConfig.addFilter('lang_of', (url) => byCode[langOf(url)]);

  // {{ page.url | lang_url: 'ar' }} — the same page in another language.
  eleventyConfig.addFilter('lang_url', (url, code) => `${byCode[code].prefix}${basePath(url)}`);

  // {{ 0 | num }} — digits in the page's script (Arabic-Indic in Arabic).
  eleventyConfig.addFilter('num', function (value) {
    const lang = langOf(this.page?.url);
    return new Intl.NumberFormat(byCode[lang].numberLocale).format(value);
  });

  eleventyConfig.setTemplateFormats(['liquid', 'md']);
  // esbuild writes the bundles straight into _site/assets; reload the browser when they change.
  eleventyConfig.setServerOptions({ watch: ['_site/assets/**'] });

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
  };
}
