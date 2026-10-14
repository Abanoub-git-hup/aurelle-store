// Components hang off `data-component="name"` in the markup. Each module exports
// `mount(el)` and may return a `destroy()` — the same contract every port reuses
// (Shopify re-mounts a section after the theme editor reloads it).

const registry = new Map();
const mounted = new WeakMap();

export function register(name, mount) {
  registry.set(name, mount);
}

export function mountAll(root = document) {
  for (const el of root.querySelectorAll('[data-component]')) {
    if (mounted.has(el)) continue;
    const mount = registry.get(el.dataset.component);
    if (!mount) continue;
    mounted.set(el, mount(el) || (() => {}));
  }
}

export function destroyAll(root = document) {
  for (const el of root.querySelectorAll('[data-component]')) {
    const destroy = mounted.get(el);
    if (!destroy) continue;
    destroy();
    mounted.delete(el);
  }
}
