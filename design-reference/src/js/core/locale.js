// The page's language lives in the URL (`/` English, `/ar/` Arabic). The visitor's choice is
// remembered so a later visit to `/` goes straight to their language (see lang-redirect.liquid).

import site from '../../_data/site.json';

export const LANG_KEY = site.storageKeys.lang;

export function currentLang() {
  return document.documentElement.lang || 'en';
}

export function saveLang(code) {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    // Storage blocked (private mode, disabled cookies): the switch still works, it just isn't remembered.
  }
}
