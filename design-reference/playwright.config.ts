import { defineConfig, devices } from '@playwright/test';

// The one testing seam (architecture.md → Testing Seam): the built site in a real browser,
// asserting only what a visitor can see. Later the same specs run against each port via BASE_URL.
const PORT = 4173;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // One browser at a time: parallel Chromium instances crash on low-memory machines
  // (ERR_INSUFFICIENT_RESOURCES). Raise with --workers=N where there is RAM to spare.
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  // Tests tagged @reduced-motion only run in the reduced-motion project, and only there.
  projects: [
    {
      name: 'desktop-chromium',
      grepInvert: /@reduced-motion/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      grepInvert: /@reduced-motion/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'reduced-motion',
      grep: /@reduced-motion/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx serve _site -l ${PORT} --no-clipboard`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
