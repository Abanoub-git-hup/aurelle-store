import { test, expect, type Page } from '@playwright/test';
import { brand, languages, t } from './i18n';

const home = (prefix: string) => `${prefix}/`;

async function clearSavedLang(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

for (const lang of languages) {
  test.describe(`home — ${lang.code}`, () => {
    test.beforeEach(async ({ page }) => {
      await clearSavedLang(page);
      await page.goto(home(lang.prefix));
    });

    test('has the right language, direction and alternates', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', lang.code);
      await expect(page.locator('html')).toHaveAttribute('dir', lang.dir);
      await expect(page).toHaveTitle(t(lang.code, 'meta.homeTitle'));
      for (const alt of languages) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${alt.code}"]`)).toHaveAttribute(
          'href',
          home(alt.prefix),
        );
      }
    });

    test('shows the header and the footer in this language', async ({ page }) => {
      const header = page.getByRole('banner');
      await expect(header.getByRole('link', { name: t(lang.code, 'a11y.home') })).toHaveText(brand);
      await expect(header.getByRole('link', { name: new RegExp(t(lang.code, 'header.bag')) })).toBeVisible();

      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('heading', { name: t(lang.code, 'footer.clientCare') })).toBeVisible();
      await expect(footer.getByText(t(lang.code, 'footer.rights'))).toBeVisible();
    });

    test('keeps the brand Latin and uses this language’s faces', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(brand);
      await page.evaluate(() => document.fonts.ready);
      const faces = lang.code === 'ar' ? ['El Messiri', 'IBM Plex Sans Arabic'] : ['Bodoni Moda', 'Satoshi'];
      for (const face of faces) {
        const loaded = await page.evaluate(
          (family) =>
            [...document.fonts].some((f) => f.family.replaceAll('"', '') === family && f.status === 'loaded'),
          face,
        );
        expect(loaded, `${face} loaded`).toBe(true);
      }
    });
  });
}

test('fonts are self-hosted — nothing is fetched from another origin', async ({ page, baseURL }) => {
  const foreign: string[] = [];
  page.on('request', (req) => {
    if (!req.url().startsWith(baseURL!)) foreign.push(req.url());
  });
  await page.goto('/');
  await page.goto('/ar/');
  await page.evaluate(() => document.fonts.ready);
  expect(foreign).toEqual([]);
});

test('Arabic text never gets letter-spacing', async ({ page }) => {
  await clearSavedLang(page);
  await page.goto('/ar/');
  const spaced = await page.evaluate(() =>
    [...document.querySelectorAll('body *:not(.c-wordmark)')]
      .filter((el) => /[؀-ۿ]/.test(el.textContent ?? ''))
      .filter((el) => !['normal', '0px'].includes(getComputedStyle(el).letterSpacing))
      .map((el) => `${el.className}: ${getComputedStyle(el).letterSpacing}`),
  );
  expect(spaced).toEqual([]);
});

test('every visible Arabic string comes from the dictionary — no stray English', async ({ page }) => {
  await clearSavedLang(page);
  await page.goto('/ar/');
  // Latin words allowed on an Arabic page: the brand and the language switch label.
  const allowed = new Set([brand, 'EN']);
  const stray = await page.evaluate(
    (allowList) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const found: string[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement!;
        if (el.closest('script, [aria-hidden="true"]') || !el.checkVisibility()) continue;
        for (const word of node.textContent!.match(/[A-Za-z]+/g) ?? []) {
          if (!allowList.includes(word)) found.push(word);
        }
      }
      return found;
    },
    [...allowed],
  );
  expect(stray).toEqual([]);
});

test.describe('language switch', () => {
  test.beforeEach(async ({ page }) => clearSavedLang(page));

  test('goes to the same page in the other language and back', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'العربية' }).click();
    await expect(page).toHaveURL(/\/ar\/$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('remembers Arabic: a later visit to / opens /ar/', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'العربية' }).click();
    await expect(page).toHaveURL(/\/ar\/$/);

    await page.goto('/');
    await expect(page).toHaveURL(/\/ar\/$/);
  });

  test('remembers English after switching back', async ({ page }) => {
    await page.goto('/ar/');
    await page.getByRole('link', { name: 'English' }).click();
    await page.goto('/');
    await expect(page).toHaveURL(/:\d+\/$/);
  });

  test('marks the current language', async ({ page }) => {
    await page.goto('/ar/');
    await expect(page.getByRole('link', { name: 'العربية' })).toHaveAttribute('aria-current', 'true');
    await expect(page.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });
});

test('the Arabic layout mirrors the English one', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the full header row only exists on desktop');
  await clearSavedLang(page);
  const positions = async (prefix: string) => {
    await page.goto(home(prefix));
    const nav = await page
      .getByRole('navigation', { name: t(prefix ? 'ar' : 'en', 'a11y.mainNav') })
      .boundingBox();
    const bag = await page.locator('[data-cart-toggle]').boundingBox();
    return { nav: nav!.x, bag: bag!.x };
  };
  const en = await positions('');
  const ar = await positions('/ar');
  expect(en.nav).toBeLessThan(en.bag);
  expect(ar.nav).toBeGreaterThan(ar.bag);
});
