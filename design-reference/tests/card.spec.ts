import { test, expect, type Page, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { t } from './i18n';

type Colour = { id: string; label: { en: string; ar: string } };
type Product = {
  handle: string;
  title: { en: string; ar: string };
  price: number;
  compareAt: number | null;
  colors: (Colour & { images: string[] })[];
  variants: { color: string; stock: number }[];
};

const products: Product[] = JSON.parse(readFileSync('src/_data/catalog/products.json', 'utf8'));
const lists = JSON.parse(readFileSync('src/_data/catalog/edit.json', 'utf8'));
const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));

const soldOut = products.find((p) => p.variants.every((v) => v.stock === 0))!;
const oneColour = products.find((p) => p.colors.length === 1 && p.variants.some((v) => v.stock > 0))!;
const onePicture = products.find((p) => p.colors.every((c) => c.images.length === 1))!;
const discounted = products.find((p) => p.compareAt)!;
const manyColours = products.find((p) => p.colors.length > 4)!;
const threeColours = products.find(
  (p) => p.colors.length === 3 && p.colors.every((c) => c.images.length === 2),
)!;

const card = (page: Page, p: Product, lang: 'en' | 'ar' = 'en') =>
  page.getByRole('article').filter({ has: page.getByRole('heading', { name: p.title[lang], exact: true }) });
const mainSrc = (c: Locator) => c.locator('.c-card__img--main').getAttribute('src');

test.describe('New In on the home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
  });

  test('shows four Women cards, and Men behind the second tab', async ({ page }) => {
    const section = page.getByRole('region', { name: t('en', 'newIn.title') });
    const women = section.getByRole('tabpanel', { name: t('en', 'nav.women'), exact: true });
    await expect(women.getByRole('article')).toHaveCount(4);
    for (const h of lists.newIn.women) {
      await expect(women.getByRole('heading', { name: byHandle[h].title.en, exact: true })).toBeVisible();
    }
    const viewAll = section.getByRole('link', { name: t('en', 'common.viewAll') });
    await expect(viewAll).toHaveAttribute('href', '/shop/women/');

    await section.getByRole('tab', { name: t('en', 'nav.men'), exact: true }).click();
    const men = section.getByRole('tabpanel', { name: t('en', 'nav.men'), exact: true });
    await expect(men.getByRole('article')).toHaveCount(4);
    await expect(women).toBeHidden();
    await expect(men.getByRole('heading', { name: byHandle[lists.newIn.men[0]].title.en })).toBeVisible();
    await expect(viewAll).toHaveAttribute('href', '/shop/men/');
  });

  test('tabs follow the keyboard, mirrored in Arabic', async ({ page }) => {
    const tabs = page.getByRole('region', { name: t('en', 'newIn.title') }).getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toBeFocused();

    await page.goto('/ar/');
    const arTabs = page.getByRole('region', { name: t('ar', 'newIn.title') }).getByRole('tab');
    await arTabs.first().focus();
    await page.keyboard.press('ArrowLeft'); // "next" is to the left in RTL
    await expect(arTabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('card states (preview page)', () => {
  test.beforeEach(async ({ page }) => page.goto('/dev/cards/'));

  test('a sold-out product says so and fades its picture', async ({ page }) => {
    const c = card(page, soldOut);
    await expect(c.getByText(t('en', 'card.soldOut'), { exact: true })).toBeVisible();
    await expect(c.locator('.c-card__img--main')).toHaveCSS('opacity', '0.5');
  });

  test('one colour: no swatches, the colour is still named', async ({ page }) => {
    const c = card(page, oneColour);
    await expect(c.getByRole('radio')).toHaveCount(0);
    await expect(c.getByText(oneColour.colors[0].label.en, { exact: true })).toBeVisible();
  });

  test('one picture: no second image to fade in', async ({ page }) => {
    const c = card(page, onePicture);
    await expect(c.locator('.c-card__img--hover')).toHaveCount(0);
    await expect(c).toHaveClass(/c-card--single-image/);
  });

  test('a discount shows the badge and the struck-through old price', async ({ page }) => {
    const c = card(page, discounted);
    const pct = Math.round((1 - discounted.price / discounted.compareAt!) * 100);
    await expect(c.getByText(t('en', 'card.discount').replace('{n}', String(pct)))).toBeVisible();
    await expect(c.locator('s')).toHaveText(`EGP ${discounted.compareAt!.toLocaleString('en-US')}`);
    await expect(c.getByText(`EGP ${discounted.price.toLocaleString('en-US')}`)).toBeVisible();
  });

  test('more than four colours: four swatches and +N', async ({ page }) => {
    const c = card(page, manyColours);
    await expect(c.getByRole('radio')).toHaveCount(4);
    const more = manyColours.colors.length - 4;
    await expect(
      c.getByRole('link', { name: t('en', 'card.moreColoursLabel').replace('{n}', String(more)) }),
    ).toHaveText(`+${more}`);
  });

  test('a sold-out colour is marked for screen readers too', async ({ page }) => {
    const p = products.find(
      (x) =>
        x.colors.some((c) => x.variants.filter((v) => v.color === c.id).every((v) => v.stock === 0)) &&
        x.variants.some((v) => v.stock > 0),
    )!;
    const gone = p.colors.find((c) =>
      p.variants.filter((v) => v.color === c.id).every((v) => v.stock === 0),
    )!;
    const index = p.colors.indexOf(gone);
    test.skip(index >= 4, 'the sold-out colour is behind +N');
    await expect(
      card(page, p).getByRole('radio', { name: `${gone.label.en} — ${t('en', 'card.soldOut')}` }),
    ).toBeVisible();
  });

  test('pictures keep a fixed 3:4 frame', async ({ page }) => {
    const box = await card(page, threeColours).locator('.c-card__media').boundingBox();
    expect(box!.height / box!.width).toBeCloseTo(4 / 3, 2);
  });
});

test.describe('colour swatches', () => {
  test.beforeEach(async ({ page }) => page.goto('/dev/cards/'));

  test('hovering a swatch previews that colour, leaving restores it — with no network call', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'no hover on touch');
    const c = card(page, threeColours);
    const [first, second] = threeColours.colors;
    const calls: string[] = [];
    page.on('request', (r) => {
      if (['fetch', 'xhr'].includes(r.resourceType())) calls.push(r.url());
    });

    expect(await mainSrc(c)).toContain(`${first.id}-1`);
    await c.locator('.c-swatch').nth(1).hover();
    expect(await mainSrc(c)).toContain(`${second.id}-1`);
    await expect(c.locator('.c-card__img--hover')).toHaveAttribute('src', new RegExp(`${second.id}-2`));

    await page.mouse.move(0, 0);
    expect(await mainSrc(c)).toContain(`${first.id}-1`);
    expect(calls).toEqual([]);
  });

  test('choosing a swatch changes the picture, the colour name and the links, without layout shift', async ({
    page,
  }) => {
    const c = card(page, threeColours);
    const second = threeColours.colors[1];
    await c.scrollIntoViewIfNeeded();
    const shifted = page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries() as PerformanceEntry[] & { value: number }[]) total += e.value;
          }).observe({ type: 'layout-shift' });
          setTimeout(() => resolve(total), 800);
        }),
    );
    await c.getByRole('radio', { name: second.label.en }).click({ force: true });
    expect(await shifted).toBe(0);

    await page.mouse.move(0, 0);
    expect(await mainSrc(c)).toContain(`${second.id}-1`);
    await expect(c.getByText(second.label.en, { exact: true }).last()).toBeVisible();
    await expect(c.getByRole('link', { name: threeColours.title.en })).toHaveAttribute(
      'href',
      `/products/${threeColours.handle}/?color=${second.id}`,
    );
  });

  test('swatches work from the keyboard', async ({ page }) => {
    const c = card(page, threeColours);
    await c.getByRole('radio').first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(c.getByRole('radio').nth(1)).toBeChecked();
    expect(await mainSrc(c)).toContain(`${threeColours.colors[1].id}-1`);
  });

  test('tapping a swatch selects it on touch screens', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'touch only');
    const c = card(page, threeColours);
    await c.locator('.c-swatch').nth(2).tap();
    await expect(c.getByRole('radio').nth(2)).toBeChecked();
    expect(await mainSrc(c)).toContain(`${threeColours.colors[2].id}-1`);
  });
});

test('Arabic cards: Arabic names, colours and digits', async ({ page }) => {
  await page.goto('/ar/dev/cards/');
  const c = card(page, threeColours, 'ar');
  await expect(c).toBeVisible();
  const digits = new Intl.NumberFormat('ar-EG').format(threeColours.price);
  await expect(c.getByText(`${digits} ج.م`)).toBeVisible();
  await expect(c.getByRole('radio', { name: threeColours.colors[1].label.ar })).toBeAttached();
});
