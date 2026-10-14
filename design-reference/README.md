# AURELLE — Design Reference

The single source of truth for the store's look, motion and behaviour. Each platform port
(WooCommerce, Shopify, Salla) copies its markup, `assets/aurelle.css` and `assets/aurelle.js`.
See `../architecture.md`.

## Run

```bash
npm install
npx playwright install chromium   # once, for the tests
npm run dev                       # http://localhost:8080 (English) · /ar/ (Arabic)
```

| Script          | What it does                                       |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | esbuild + Eleventy in watch mode with live reload  |
| `npm run build` | writes the static site to `_site/`                 |
| `npm run lint`  | ESLint + Stylelint (logical properties) + Prettier |
| `npm test`      | Playwright against the built `_site/`              |
| `npm run check` | lint → build → test                                |

## Where things live

- Pages: `src/pages/` — each one is generated once per language (`/` and `/ar/`).
- Text: `src/_data/i18n/en.json` and `ar.json`. Templates never hold copy; a missing key fails the build.
- Components: `src/_includes/components/*.liquid` + `src/css/components/*.css` (+ `src/js/components/*.js`).
- Tokens: `src/css/tokens.css` — the only file with raw colour values.
