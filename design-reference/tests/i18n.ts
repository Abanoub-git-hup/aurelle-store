// Visible strings come from the same dictionaries the site is built from,
// so a copy change never breaks a test.
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8'));
const dictionaries: Record<string, Record<string, unknown>> = Object.fromEntries(
  site.languages.map((l: { code: string }) => [
    l.code,
    JSON.parse(readFileSync(`src/_data/i18n/${l.code}.json`, 'utf8')),
  ]),
);

export const brand: string = site.brand;
export const languages: { code: string; dir: string; prefix: string; name: string }[] = site.languages;

export function t(lang: string, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], dictionaries[lang]);
  if (typeof value !== 'string') throw new Error(`missing i18n key ${lang}:${key}`);
  return value.replaceAll('{brand}', brand);
}
