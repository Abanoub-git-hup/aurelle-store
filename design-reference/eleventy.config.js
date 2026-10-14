import { readFileSync } from 'node:fs';

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
  // A missing key fails the build, so no page ships with an untranslated string.
  eleventyConfig.addFilter('t', function (key) {
    const lang = langOf(this.page?.url);
    const value = lookup(dictionaries[lang], key);
    if (typeof value !== 'string') {
      throw new Error(`i18n: missing key "${key}" for "${lang}" (${this.page?.inputPath})`);
    }
    return value.replaceAll('{brand}', site.brand);
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
