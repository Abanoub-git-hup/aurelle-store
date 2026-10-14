import { test, expect, type Page } from '@playwright/test';
import { brand, t } from './i18n';

// Motion is checked by its end states, never by timing: everything ends up visible, text is
// split the right way per script, and nothing is hidden when motion is off.

const entrances =
  '[data-motion~="word"], [data-motion~="chars"], [data-motion~="lines"], [data-motion~="reveal"]';

async function scrollThrough(page: Page) {
  for (let i = 0; i < 30; i++) await page.mouse.wheel(0, 400);
  await page.waitForTimeout(400);
}

// An element has finished its entrance when it and its split pieces are unmoved and opaque.
async function allSettled(page: Page) {
  return page.evaluate((selector) => {
    const pieces = [
      ...document.querySelectorAll(selector),
      ...document.querySelectorAll('.u-split-char, .u-split-word, .u-split-line'),
      ...document.querySelectorAll('[data-motion~="cards"] > *'),
    ];
    return pieces.every((el) => {
      const s = getComputedStyle(el);
      const still = s.transform === 'none' || s.transform === 'matrix(1, 0, 0, 1, 0, 0)';
      return still && s.opacity === '1' && s.visibility === 'visible' && s.filter === 'none';
    });
  }, entrances);
}

test.describe('with motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('turns on smooth scrolling and releases the pending state', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\blenis\b/);
    await expect(page.locator('html')).not.toHaveClass(/is-motion-pending/);
  });

  test('every animated element ends visible and in place', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    await expect.poll(() => allSettled(page), { timeout: 8000 }).toBe(true);
  });

  test('the wordmark rises letter by letter and stays readable', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1, name: brand });
    await expect(h1.locator('.u-split-char')).toHaveCount(brand.length);
  });

  test('English titles split into letters inside whole words', async ({ page }) => {
    await page.goto('/');
    const title = page.getByRole('heading', { level: 2, name: t('en', 'motionDemo.title') });
    const words = t('en', 'motionDemo.title').split(/\s+/);
    await expect(title.locator('.u-split-word')).toHaveCount(words.length);
    await expect(title.locator('.u-split-char')).toHaveCount(words.join('').length);

    // A word never breaks across two lines.
    const broken = await title.evaluate(
      (el) =>
        [...el.querySelectorAll('.u-split-word')].filter((w) => {
          const tops = new Set(
            [...w.querySelectorAll('.u-split-char')].map((c) => c.getBoundingClientRect().top),
          );
          return tops.size > 1;
        }).length,
    );
    expect(broken).toBe(0);
  });

  test('Arabic is split into words, never letters — except the Latin wordmark', async ({ page }) => {
    await page.goto('/ar/');
    const title = page.getByRole('heading', { level: 2, name: t('ar', 'motionDemo.title') });
    await expect(title.locator('.u-split-char')).toHaveCount(0);
    await expect(title.locator('.u-split-word')).toHaveCount(t('ar', 'motionDemo.title').split(/\s+/).length);

    // AURELLE keeps its letters, in left-to-right order.
    const xs = await page
      .getByRole('heading', { level: 1 })
      .locator('.u-split-char')
      .evaluateAll((chars) => chars.map((c) => c.getBoundingClientRect().left));
    expect(xs).toHaveLength(brand.length);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
  });

  test('Arabic page ends fully visible too', async ({ page }) => {
    await page.goto('/ar/');
    await scrollThrough(page);
    await expect.poll(() => allSettled(page), { timeout: 8000 }).toBe(true);
  });
});

test.describe('reduced motion @reduced-motion', () => {
  for (const path of ['/', '/ar/']) {
    test(`${path}: everything is shown at once, with no smooth scroll or splitting`, async ({ page }) => {
      await page.goto(path);
      const html = page.locator('html');
      await expect(html).toHaveClass(/is-reduced-motion/);
      await expect(html).not.toHaveClass(/\blenis\b/);
      await expect(html).not.toHaveClass(/is-motion-pending/);
      await expect(page.locator('.u-split-char, .u-split-word, .u-split-line')).toHaveCount(0);
      expect(await allSettled(page)).toBe(true);
    });
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ['/', '/ar/']) {
    test(`${path}: all text is visible and readable`, async ({ page }) => {
      await page.goto(path);
      const lang = path === '/' ? 'en' : 'ar';
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(brand);
      await expect(page.getByRole('heading', { level: 2, name: t(lang, 'motionDemo.title') })).toBeVisible();
      await expect(page.getByText(t(lang, 'motionDemo.text'))).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: t(lang, 'newIn.title') })).toBeVisible();
      expect(await allSettled(page)).toBe(true);
    });
  }
});
