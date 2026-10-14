import { saveLang } from '../core/locale.js';

// The links already point at the same page in the other language. On click we remember the
// choice and carry the hash along, so an open layer (e.g. `#qv=handle`) reopens after the switch.
export function mount(el) {
  function onClick(event) {
    const link = event.target.closest('a[data-lang]');
    if (!link) return;
    saveLang(link.dataset.lang);
    if (location.hash) link.hash = location.hash;
  }

  el.addEventListener('click', onClick);
  return () => el.removeEventListener('click', onClick);
}
