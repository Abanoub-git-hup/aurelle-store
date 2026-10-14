// Bundles the whole front end into two flat files — _site/assets/aurelle.js and aurelle.css —
// plus the fonts beside them. Flat on purpose: Shopify's assets/ folder has no subfolders,
// so every port can copy this folder as-is.
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: [
    { in: 'src/js/main.js', out: 'aurelle' },
    { in: 'src/css/index.css', out: 'aurelle' },
  ],
  outdir: '_site/assets',
  bundle: true,
  format: 'esm',
  target: ['es2022', 'chrome111', 'safari16.4', 'firefox115'],
  minify: !watch,
  sourcemap: watch,
  loader: { '.woff2': 'file' },
  // Stable names (no hashes) so <link rel="preload"> and the ports can point at them.
  assetNames: '[name]',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
