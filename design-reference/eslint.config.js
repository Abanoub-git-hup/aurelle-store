import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['_site/', 'node_modules/', 'test-results/', 'playwright-report/', 'tests/**/*.ts'] },
  js.configs.recommended,
  {
    files: ['src/js/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.js', '*.mjs', 'lib/**/*.js'],
    languageOptions: { globals: globals.node },
  },
];
