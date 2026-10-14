# Architecture

> المدخلات: `project.md` · `design.md` · `GLOSSARY.md` · `docs/adr/0001` · `PLAN.md` (Q1–Q24) · `prd.md` (سلوك الكرت) · `prototypes/salon-hero.html`.
> **مفيش UI Design منفصل (Figma / Claude Design):** الخطوة 3 اتخطّت بقرار المستخدم (2026-10-14). `design.md` هو مواصفات الشكل، والـ **Design Reference** نفسه هيبقى التصميم.
> النطاق: الملف ده بيغطي **المرحلة 1 (Design Reference)** بالتفصيل، و**عقد النقل (Porting contract)** للمنصات الـ3. كل Port هيتضافله قسم معماري خاص بيه لما نوصله.
> المصطلحات بنفس `GLOSSARY.md`: Salon، Look، Shop the Look، Bag (واجهة) / **Cart** (كود)، Quick Add، Quick View، Department، Category، The Edit، Lookbook، Campaign.

## Stack Choice & Rationale

| الطبقة | الاختيار | الدافع |
|--------|----------|--------|
| مولّد الصفحات | **Eleventy 3** (static site generator) بقوالب **Liquid** | (1) الصفحات بتطلع HTML كامل من السيرفر ← المحتوى مقروء لو الـ JS فشل (`PLAN.md` قواعد الحركة). (2) **Liquid هو لغة قوالب Shopify** وقريب جداً من Twig (Salla) ← المكوّنات تتنقل شبه نسخ. (3) بيانات المنتجات في JSON واحد بيولّد كل الصفحات باللغتين. |
| الـ JS | **Vanilla JS (ES modules)** + **esbuild** يجمّعهم في ملف واحد `aurelle.js` | مفيش framework لأن كل منصة بترندر HTML بنفسها، والـ JS دوره "يحيي" الماركب الموجود. ملف واحد مسطّح لأن **Shopify `assets/` مفيهوش فولدرات فرعية**. |
| الـ CSS | CSS عادي بـ custom properties + `@import` يتجمّع بـ esbuild في `aurelle.css` | التوكنز من `design.md` كـ CSS variables تتنقل زي ما هي لكل منصة. |
| الحركة | **GSAP 3.13+** (ScrollTrigger + **SplitText** — مجانيين) + **Lenis** | قرار `PLAN.md`؛ بيغطي M1–M14 كلها. |
| الصور | **@11ty/eleventy-img** | يولّد webp بأحجام متعددة + `srcset` + أبعاد ثابتة (CLS ≈ 0، `prd.md` §5). |
| الاختبار | **Playwright** | نقطة اختبار واحدة (انظر Testing Seam). |
| جودة الكود | Prettier + ESLint + Stylelint | انظر Coding Standards. |
| Node | 22 LTS | — |

**ليه مش ملفات HTML مكتوبة بإيد (زي `PLAN.md` القديم)؟** 13 صفحة × لغتين × 24 منتج = نسخ ماركب كتير بيتفرّق. ومفيش React/Vue لأن الـ Ports التلاتة server-rendered ومش هيستخدموا framework.

> ⚠️ **تعديل على `PLAN.md` (مش ADR):** `PLAN.md` كان مخطط `i18n.js` بيبدّل اللغة في نفس الصفحة. هنا اللغة بقت **URL** (`/` و `/ar/`) زي المنصات التلاتة (Shopify `/ar/`، WPML/Polylang `/ar/`، Salla `/ar`). ده بيلغي إعادة بناء SplitText عند التبديل. انظر التعارض مع `design.md` في Open Technical Questions #1.

## Project Structure

```
aurelle-store/
├─ design-reference/                 ← Design Reference (المرحلة 1) — مصدر الحقيقة
│  ├─ package.json  eleventy.config.js  esbuild.config.mjs  playwright.config.ts
│  ├─ src/
│  │  ├─ _data/
│  │  │  ├─ site.json               ← اسم الماركة (Q1: متغيّر واحد)، العملة، اللغات
│  │  │  ├─ i18n/en.json  ar.json   ← كل نصوص الواجهة بمفاتيح
│  │  │  ├─ catalog/products.json   ← ~24 منتج (انظر Database Schema)
│  │  │  ├─ catalog/categories.json
│  │  │  ├─ looks.json              ← Looks الـ Salon والـ Lookbook
│  │  │  ├─ edit.json               ← The Edit / New In / Most Loved (قوايم handles)
│  │  │  ├─ journal/*.md            ← مقالات بـ front-matter باللغتين
│  │  │  └─ community.json  stats.json  shipping.json
│  │  ├─ _includes/
│  │  │  ├─ layouts/  base.liquid  checkout.liquid  legal.liquid
│  │  │  ├─ sections/ salon.liquid  marquee.liquid  product-grid.liquid  campaign.liquid
│  │  │  │            shop-the-look.liquid  categories.liquid  made-by-hand.liquid
│  │  │  │            lookbook.liquid  material.liquid  statement.liquid  journal.liquid
│  │  │  │            community.liquid  newsletter.liquid
│  │  │  └─ components/ header  footer  mega-menu  mobile-menu  product-card  swatch
│  │  │                 size-selector  qty-stepper  quick-view  quick-add  shop-the-look-panel
│  │  │                 bag-drawer  toast  accordion  filter-bar  breadcrumb  form-field
│  │  │                 order-summary  button  eyebrow-title  dept-tabs  preloader  price
│  │  ├─ pages/                     ← صفحة لكل route (انظر Routing) — بتتولّد للغتين
│  │  ├─ css/  tokens.css  base.css  type.css  layout.css  components/*.css  sections/*.css
│  │  │        motion.css  rtl.css  index.css (imports)
│  │  ├─ js/
│  │  │  ├─ main.js                 ← نقطة الدخول: يسجّل المكوّنات بـ data-component
│  │  │  ├─ core/  events.js  store.js  dom.js  money.js  locale.js  focus-trap.js
│  │  │  ├─ cart/  cart.js (الواجهة)  adapters/local.js  (لاحقاً: woo.js shopify.js salla.js)
│  │  │  ├─ catalog/ product-source.js  adapters/static.js
│  │  │  ├─ components/ product-card.js  quick-view.js  quick-add.js  bag-drawer.js
│  │  │  │              shop-the-look.js  header.js  menus.js  filters.js  pdp.js
│  │  │  │              checkout.js  forms.js  lang-switch.js  toast.js  accordion.js
│  │  │  ├─ salon/  salon.js  layers.js  drag.js  focus-look.js
│  │  │  └─ motion/ index.js  preloader.js  split.js  reveal.js  parallax.js  cards.js
│  │  │             scrub.js  marquee.js  lookbook.js  counters.js  footer-word.js
│  │  │             smooth-scroll.js  reduced-motion.js
│  │  ├─ fonts/   (woff2 self-hosted)
│  │  └─ images/  src/ (الأصول بعد التفريغ والتوحيد)  ← eleventy-img يولّد منها
│  ├─ tests/  *.spec.ts
│  └─ _site/                        ← ناتج البناء (gitignored)
├─ wordpress/aurelle-theme/         ← Port 1 (لاحقاً)
├─ shopify/aurelle-shopify/         ← Port 2 (لاحقاً)
├─ salla/aurelle-twilight/          ← Port 3 (لاحقاً)
├─ prototypes/                      ← Prototypes (تترمي؛ مش جزء من المرجع)
└─ docs/  adr/  agents/  build-guide.md (لوج التعلّم + فروق المنصات)
```

**قاعدة:** كل مكوّن = ملف Liquid + ملف CSS + (لو تفاعلي) ملف JS **بنفس الاسم**. ده الوحدة اللي بتتنقل لكل Port.

## Routing

اللغة الافتراضية إنجليزي على الجذر (Q16)، والعربي تحت `/ar/` بنفس المسار. كل صفحة فيها `<html lang dir>` صح و `<link rel="alternate" hreflang>` للتانية.

| الصفحة | EN | AR | ملاحظات |
|--------|----|----|---------|
| Home | `/` | `/ar/` | |
| Shop — Department | `/shop/women/` · `/shop/men/` | `/ar/shop/women/` … | `/shop/` يحوّل لـ `/shop/women/` |
| Shop — فلترة | `?category=outerwear&size=M&price=0-15000&sort=price-asc` | نفسه | الفلترة على الـ client من الجريد المرندر (12 منتج لكل Department). الـ query string = مصدر حالة الفلاتر (قابلة للمشاركة والـ back). Category tile ← `/shop/women/?category=outerwear` |
| Product | `/products/{handle}/` | `/ar/products/{handle}/` | `?color={colorId}` يختار اللون |
| Bag (صفحة) | `/bag/` | `/ar/bag/` | |
| Checkout | `/checkout/` | `/ar/checkout/` | layout `checkout` (هيدر مبسّط، من غير فوتر) |
| Order confirmation | `/order/?id={orderId}` | `/ar/order/?id=` | يقرا الطلب من localStorage |
| About | `/about/` | `/ar/about/` | |
| Contact | `/contact/` | `/ar/contact/` | |
| Journal | `/journal/` · `/journal/{slug}/` | `/ar/journal/…` | فلتر Category بـ `?category=` |
| Client care & legal | `/pages/{shipping,returns,size-guide,faq,privacy,terms}/` | `/ar/pages/…` | layout `legal` |
| 404 | `/404.html` | `/ar/404.html` | |
| Account | — | — | **مش متبني** — [TODO] نطاقه (`project.md` سؤال 1) |
| Search | — | — | **مش متبني** — [TODO] (`project.md` سؤال 2) |

**طبقات فوق الصفحة (من غير route):** Quick View · Quick Add · Shop the Look · Bag drawer · Size guide. Quick View بتكتب `#qv={handle}` في الـ URL عشان تتفتح تاني بعد تبديل اللغة (انظر Open #1).

**تذكّر اللغة:** `lang-switch` بيحفظ `aurelle.lang` في localStorage. زيارة `/` مباشرة واللغة المحفوظة `ar` ← تحويل لـ `/ar/` (redirect على الـ client قبل الرسم). اللينكات الداخلية بتتولّد بالبادئة الصح، فمفيش تحويل أثناء التنقل.

**جدول تطابق الـ URLs مع المنصات (للـ Ports):**

| Reference | WooCommerce | Shopify | Salla |
|-----------|-------------|---------|-------|
| `/shop/women/` | `/product-category/women/` | `/collections/women` | `/women/c{id}` |
| `/products/{h}/` | `/product/{h}/` | `/products/{h}` | `/{slug}/p{id}` |
| `/bag/` | `/cart/` | `/cart` | `/cart` |
| `/journal/{s}/` | `/journal/{s}/` (posts) | `/blogs/journal/{s}` | `/blog/{s}` |

## API Design

المرجع **مفيهوش backend**. "الـ API" = (أ) ملفات JSON ثابتة بيولّدها Eleventy، و(ب) **واجهتين JS (adapters)** بيعزلوا الواجهة عن مصدر البيانات. كل Port بيكتب adapter بس، والمكوّنات ماتتغيّرش.

### (أ) JSON endpoints ثابتة (من البناء)
| Endpoint | Method | Response |
|----------|--------|----------|
| `/data/{lang}/products/{handle}.json` | GET | `ProductView` (انظر تحت) — للـ Quick View / Quick Add / Shop the Look |
| `/data/{lang}/looks/{lookId}.json` | GET | `{ id, number, name, image, pieces: ProductView[] }` |

`ProductView` = المنتج **بلغة واحدة** جاهز للعرض:
```json
{ "handle": "wool-wrap-coat", "title": "Wool Wrap Coat", "url": "/products/wool-wrap-coat/",
  "price": 12500, "compareAt": null, "currency": "EGP", "badge": "new",
  "colors": [{ "id": "camel", "label": "Camel", "swatch": "#B48A5E", "images": ["…"], "available": true }],
  "sizes": ["XS","S","M","L","XL"],
  "variants": [{ "id": "wool-wrap-coat-camel-m", "color": "camel", "size": "M", "available": true }],
  "details": { "material": "…", "care": "…" } }
```

### (ب) `CartAdapter` — `js/cart/adapters/*.js`
كل الدوال async وبترجع `Cart` كامل:
```
get()                         → Cart
add(variantId, qty = 1)       → Cart        // خطأ: OUT_OF_STOCK | INVALID_VARIANT
update(lineKey, qty)          → Cart        // qty = 0 ⇒ حذف
remove(lineKey)               → Cart
clear()                       → Cart
```
```
Cart = { lines: [{ key, variantId, handle, title, colorLabel, size, image, unitPrice, qty, lineTotal }],
         count, subtotal, currency }
```
`cart.js` (الواجهة الوحيدة اللي المكوّنات بتكلّمها) بيلفّ الـ adapter وبيطلق `cart:updated` بعد كل تغيير و `cart:error` عند الفشل. **Reference = `local.js`** (localStorage `aurelle.cart`، بيخزّن `variantId + qty` بس وبيكمّل البيانات من `products.json` المضمّن).

| الدالة | Woo (Store API) | Shopify (AJAX Cart) | Salla (Twilight SDK) |
|--------|-----------------|---------------------|----------------------|
| get | `GET /wp-json/wc/store/v1/cart` | `GET /cart.js` | `salla.cart.details()` |
| add | `POST …/cart/add-item` | `POST /cart/add.js` | `salla.cart.addItem()` |
| update | `POST …/cart/update-item` | `POST /cart/change.js` | `salla.cart.updateItem()` |
| remove | `POST …/cart/remove-item` | `POST /cart/change.js` (qty 0) | `salla.cart.deleteItem()` |

### (ج) `ProductSource` — `js/catalog/product-source.js`
`getProduct(handle, lang) → ProductView` · `getLook(lookId, lang) → Look`. Reference = fetch للـ JSON الثابت مع cache في الذاكرة. (Shopify: `/products/{h}.js`؛ Woo: `/wc/store/v1/products?slug=`؛ Salla: SDK.)

### (د) Checkout (Reference فقط)
`placeOrder(form) → { orderId }`: تحقق → يقرا الـ Cart → يكتب `Order` في localStorage `aurelle.orders` → `clear()` → تحويل لـ `/order/?id=`. وسائل الدفع: "Cash on delivery" و "Test card" (أي رقم بيعدّي، شارة "Test mode"). **مفيش أي بيانات دفع حقيقية بتتخزن** — حقل الكارت بيتحقق من الشكل بس ومابيتحفظش.

### (هـ) Newsletter / Contact (Reference)
النموذج بيتحقق على الـ client ويعرض حالة "تم" من غير إرسال. الخدمة الحقيقية [TODO] (`project.md` سؤال 3).

## Database Schema

مفيش قاعدة بيانات في المرجع — **ملفات JSON في `src/_data/` هي الـ schema**، وكل Port بيحوّلها لكيانات المنصة. النصوص اللي بتتعرض = `{ "en": "…", "ar": "…" }`.

**`Product`** (`catalog/products.json`)
| الحقل | النوع | ملاحظات |
|-------|-------|---------|
| `handle` | string (slug) | فريد؛ ثابت في اللغتين |
| `department` | `"women" \| "men"` | Department |
| `category` | categoryId | Category |
| `title`, `description` | Localized | |
| `price` | int (EGP، جنيه كامل) | |
| `compareAt` | int \| null | شارة الخصم والسعر المشطوب لو موجود — [TODO] سؤال 6 للعميل؛ الـ schema جاهزة |
| `badge` | `"new" \| null` | الخصم بيتحسب من `compareAt` |
| `colors[]` | `{ id, label: Localized, swatch: hex, images: [path] (≥2) }` | أول صورتين = main / hover |
| `sizes[]` | subset من `XS S M L XL` (أو `["ONE"]` للإكسسوارات) | |
| `variants[]` | `{ id, color, size, stock: int }` | `id` = `{handle}-{color}-{size}`؛ `available = stock > 0` |
| `material`, `care` | Localized | Accordion صفحة المنتج |
| `lookIds[]` | string[] | "Complete the Look" |
| `related[]` | handle[] | "You may also like" |

**`Category`**: `{ id, title: Localized, departments: ["women","men"], image, order }` — outerwear، knitwear، dresses (women فقط)، trousers، accessories.

**`Look`** (`looks.json`): `{ id, number, name: Localized, department, cutout (PNG شفاف), photo, pieces: [{ handle, color, hotspot: {x%, y%} }], inSalon: bool, inLookbook: bool, featured: bool }` — `featured` = Look قسم Shop the Look في الرئيسية.

**`Collection lists`** (`edit.json`): `{ newIn: {women:[handle], men:[…]}, theEdit: {…}, mostLoved: {…} }`.

**`Article`** (`journal/*.md` front-matter): `{ slug, lang-pair, category, date, cover, title, excerpt }` + المتن.

**`CommunityImage`**: `{ image, alt: Localized }` · **`Stat`**: `{ value: number, suffix, label: Localized }`.

**`Order`** (localStorage فقط): `{ id: "AU-{timestamp36}", createdAt, lang, contact: {email, phone}, shipping: {name, address, city, governorate}, shippingMethod, payment: "cod" | "test-card", lines: CartLine[], subtotal, shippingCost, total }`.

**التطابق مع المنصات:** Product ← Woo variable product / Shopify product / Salla product · color+size ← attributes / options · Look ← Woo CPT أو ACF / Shopify metaobject `look` / Salla: [TODO] · Article ← WP post / Shopify blog article / Salla blog · CommunityImage ← إعدادات الثيم (Q24).

## State Management

مفيش framework للحالة. **حالة قليلة، كل نوع في مكانه:**

| الحالة | المكان | مين بيقرا |
|--------|--------|-----------|
| Cart | `cart.js` (في الذاكرة) ← adapter (localStorage `aurelle.cart`) | Header count، Bag drawer، Bag page، Checkout |
| اللغة | الـ URL (`/ar/`) + `aurelle.lang` للتذكّر | كل حاجة |
| Preloader اتعرض | sessionStorage `aurelle.preloaded` (Q5) | `preloader.js` |
| الفلاتر | query string في `/shop/…` | `filters.js` |
| الطبقة المفتوحة | `core/store.js` (`openLayer`: واحدة بس في المرة) + `#qv=` | الطبقات + focus-trap |
| الطلبات | localStorage `aurelle.orders` | صفحة التأكيد |
| تقليل الحركة | `matchMedia('(prefers-reduced-motion: reduce)')` + class `is-reduced-motion` على `<html>` | motion + Lenis + Salon |

**التواصل بين المكوّنات:** CustomEvents على `document` من `core/events.js`:
`cart:updated {cart}` · `cart:error {code}` · `layer:open {id, trigger}` · `layer:close {id}` · `toast {message}`.
**قاعدة:** أي إضافة ناجحة للـ Cart ← `cart:updated` ← الدرج يفتح + العداد + toast (Q15، `design.md` UX Flow).

**تهيئة المكوّنات:** الماركب فيه `data-component="product-card"`، و `main.js` بيعمل `mount(root)` لكل عنصر ويرجّع `destroy()`. الحركة نفس الفكرة: `data-motion="chars|lines|scrub|reveal|parallax|cards|counter|marquee|lookbook|footer-word"` و `motion.init(root)` / `motion.destroy(root)`. ده اللي بيخلّي Shopify Theme Editor (`shopify:section:load/unload`) يشتغل من غير تعديل.

## Authentication & Authorization

- **Reference:** مفيش تسجيل دخول. كل الزوار Guest، والـ Checkout كزائر.
- **حسابات العملاء:** [TODO] — `project.md` سؤال 1. الـ Header فيه أيقونة الحساب حسب `design.md`، ودلوقتي بتودّي لـ… (انظر Open #3).
- **Admin:** لوحة كل منصة (Woo / Shopify / Salla) — خارج المرجع.
- **أمان المرجع:** مفيش أسرار في الكود (الـ repo Public). أي مفاتيح sandbox للـ Ports بتتحط في env/إعدادات المنصة، مش في git.

## Third-Party Integrations

| الأداة | الاستخدام | ملاحظات |
|--------|----------|---------|
| GSAP + ScrollTrigger + SplitText | M2–M13 | npm `gsap` ≥ 3.13 (SplitText مجاني) |
| Lenis | سكرول ناعم (Q6) | يتقفل مع reduced-motion؛ متوصّل بـ `ScrollTrigger.update` |
| Fonts | Bodoni Moda، El Messiri، IBM Plex Sans Arabic (Google Fonts، OFL) · Satoshi (Fontshare، ترخيص مجاني) | **self-hosted woff2** + `preload` للخطين الأساسيين؛ `ScrollTrigger.refresh()` بعد `document.fonts.ready` |
| Stock images | Unsplash / Pexels | تفريغ + توحيد الألوان **شغل بشري** (تذكرة `ready-for-human`)؛ الـ Salon يشتغل بـ placeholders SVG من الـ prototype لحد ما الصور تيجي |
| Playwright | الاختبار | |
| **Ports (لاحقاً):** WooCommerce Store API + COD/Stripe/PayPal sandbox · Shopify AJAX Cart + Bogus Gateway · Salla Twilight SDK | `CartAdapter` + `ProductSource` | متطلبات بشرية في `project.md` → Constraints |

## Features (end to end)

كل feature: **الواجهة ← البيانات ← السلوك ← "خلصت لما"**. دي المادة اللي `/to-tickets` هيقطّع منها vertical slices.

### F1 — الهيكل والتوكنز والصفحة الفاضية باللغتين (الأساس)
- **UI:** `base.liquid` + `tokens.css` (ألوان وخطوط ومسافات `design.md`) + Header + Footer (من غير حركة) + Language switch.
- **Data:** `site.json`، `i18n/*.json`.
- **Behaviour:** Eleventy يولّد `/` و `/ar/`؛ `dir="rtl"` + الخطوط العربي؛ logical properties؛ تذكّر اللغة.
- **Done:** الصفحتين بيفتحوا، التبديل بيودّي لنفس الصفحة باللغة التانية، العربي من اليمين، AURELLE لاتيني (Q2).

### F2 — نظام الحركة الأساسي
- **UI:** `data-motion` على عناصر تجريبية في الرئيسية.
- **Behaviour:** Lenis + ScrollTrigger + SplitText: M2، M3، M5، M6، M7، M8؛ العربي **كلمة كلمة**؛ reduced-motion = كل حاجة ظاهرة؛ الحالة المخفية بتتحط من JS.
- **Done:** كل تأثير شغّال EN/AR؛ مع reduced-motion أو JS مقفول المحتوى ظاهر.

### F3 — Preloader (M1)
أول زيارة في الجلسة بس؛ بعده M2 على كلمة الـ Salon. **Done:** reload في نفس الجلسة مايظهرش.

### F4 — كتالوج البيانات + Product card
- **Data:** `products.json` (أول 4–6 منتجات حقيقية الشكل بصور placeholder)، `categories.json`.
- **UI:** `product-card` بكل حالاته (`design.md` Components): صورتين، شارة، swatches (حد 4 + "+N")، سعر (+ مشطوب لو `compareAt`)، Sold out، لون واحد، صورة واحدة.
- **Behaviour:** `prd.md` FR-1 + FR-2 (swatch يبدّل الصورة من `data-*` من غير network؛ hover fade M9؛ لمس/كيبورد).
- **Done:** معاينة الكرت في صفحة اختبار وفي New In.

### F5 — Cart + Bag drawer + Quick Add
- **Code:** `cart.js` + `adapters/local.js` + events.
- **UI:** Bag drawer (يمين EN / شمال AR، M14)، عداد الهيدر، toast، Quick Add (مقاس واحد ← إضافة مباشرة؛ مقاسات ← لوحة اختيار مقاس — `design.md`).
- **Done:** Quick Add من كرت ← الدرج يفتح بالقطعة، العداد يتحدّث، reload والـ Bag لسه فيها القطعة، تعديل الكمية والحذف شغّالين، focus-trap + Esc.

### F6 — Quick View
`/data/{lang}/products/{h}.json` + نافذة (معرض، لون، مقاس، Add to Bag، "View full details") + تنبيه مقاس مش مختار؛ bottom sheet في الموبايل؛ `#qv=`. **Done:** Quick View ← إضافة ← الدرج.

### F7 — Shop (Department + فلاتر)
`/shop/women/` و `/shop/men/` + Filter bar/drawer (Category · Size · Price · Sort) + chips + عدد النتايج + "Load more" (8 ← 12) + حالة مفيش نتايج. **Done:** الفلاتر في الـ URL، الـ back بيرجّعها، موبايل "Filter & sort".

### F8 — Product page
صور مترصّة بـ M6 + عمود sticky (Q23) + لون + مقاس + Size guide + كمية + Add to Bag + Accordion + Complete the Look + You may also like؛ موبايل: سلايدر + زر ثابت تحت. **Done:** `?color=` بيختار اللون؛ إضافة بالمقاس الصح.

### F9 — Bag page + Checkout + Order confirmation
`/bag/` ← `/checkout/` (خطوة واحدة بأقسام، تحقق، "Test mode") ← `placeOrder` ← `/order/?id=`. **Done:** رحلة كاملة EN و AR؛ الـ Bag فاضية بعد الطلب؛ حالة Bag فاضية.

### F10 — Salon (هيرو الرئيسية)
- **Code:** نقل `prototypes/salon-hero.html` لـ `js/salon/*` + `salon.liquid` + توكنز AURELLE (بدل Playfair/Manrope وألوان VÉLUNE).
- **Data:** `looks.json` (`inSalon`).
- **Behaviour:** 4 طبقات ديسكتوب / 3 تابلت / 2 موبايل (Q8)؛ سحب (ماوس/إصبع، البعيد أبطأ)؛ كيبورد؛ كليك على Look ← يقرّب + الباقي يضبّب + **Shop the Look panel** (Q12) بـ Quick Add لكل قطعة و "Add all to Bag"؛ هيدر شفاف ← كريمي بعد الهيرو (Q20)؛ reduced-motion = من غير inertia.
- **Done:** من الـ Salon لحد الـ Bag drawer من غير مغادرة الرئيسية.

### F11 — أقسام الرئيسية التحريرية
Marquee (M10) · New In / The Edit / Most Loved (+ Department tabs) · Campaign · Shop the Look section (hotspots ← نفس الـ panel) · Shop by Category · Made by Hand · Lookbook (M11؛ موبايل سلايدر) · Material & Make (M12) · Brand statement (M4) · Journal · Community · Newsletter · Footer word (M13). Press quote **مش متبني** لحد قرار العميل. **Done:** الرئيسية بالترتيب في `design.md` §1.

### F12 — Journal
القايمة + المقال من `journal/*.md` (3 مقالات على الأقل) + فلتر Category + مقالات مرتبطة.

### F13 — الصفحات الثابتة
About (M4 التانية) · Contact (نموذج) · legal layout (Shipping، Returns، Size Guide بتابات Women/Men، FAQ بـ Accordion، Privacy، Terms — نصوص placeholder واضحة) · 404 · Mega menu + Mobile menu.

### F14 — الصور الحقيقية (ready-for-human)
اختيار stock + تفريغ الـ Looks (PNG) + توحيد الألوان ← `src/images/src/` ← eleventy-img. يحل محل الـ placeholders من غير تغيير كود.

**ترتيب الاعتماد المقترح:** F1 ← F2 ← (F3، F4) ← F5 ← (F6، F7، F8، F10) ← F9 (بعد F5) ← F11 ← (F12، F13). F14 بالتوازي من الأول.

## Testing Seam

**نقطة واحدة: الصفحة المبنية (`_site/`) في متصفح حقيقي عن طريق Playwright** — بنختبر السلوك اللي الزائر بيشوفه بس (نصوص، أدوار ARIA، URLs، عدد الـ Bag)، مش دوال داخلية. (ده المقترح في `docs/session-summary.md` — **محتاج تأكيد المستخدم**.)

- Projects: `desktop-chromium` (1440) · `mobile` (375، لمس) · `reduced-motion` (`reducedMotion: 'reduce'`).
- كل رحلة بتتشغّل على `/` و `/ar/`.
- الـ locators بالدور والاسم (`getByRole('button', { name: … })`)، والأسماء من `i18n/*.json` عشان الاختبار مايتكسرش لما النص يتغيّر.
- الحركة **مش بتتختبر بالتوقيت** — بنختبر الحالة النهائية (المحتوى ظاهر) والـ reduced-motion والـ JS-off (`javaScriptEnabled: false` ← النص مقروء).
- نفس الاختبارات هتشتغل لاحقاً على كل Port (بتغيير `baseURL`) — ده اللي بيأكّد إن التجربة واحدة على المنصات التلاتة (`project.md` Success Criteria).

## Coding Standards

- **المصطلحات:** أسماء الكود من `GLOSSARY.md` بالإنجليزي: `salon`، `look`, `shopTheLook`، **`cart`** (مش bag) في الكود، و "Bag" في نصوص الواجهة بس (Q11). `department`، `category`، `theEdit`، `lookbook`، `campaign`. ممنوع `outfit`، `gender`، `basket`.
- **CSS:** classes بنمط BEM مع بادئة: `c-` مكوّن (`c-card__media--hover`)، `s-` سيكشن، `u-` utility، `is-`/`has-` حالة. **logical properties بس** (Stylelint `liberty/use-logical-spec` أو قاعدة تمنع `left/right/margin-left…`). الألوان والمسافات من التوكنز بس — ممنوع hex جوّه الكومبوننت. مفيش `letter-spacing` تحت `[dir=rtl]`.
- **الحركة:** `transform` / `opacity` / `clip-path` / `filter` بس. كل تأثير بيتسجّل في `motion/index.js` وبيحترم `is-reduced-motion`. مفيش حالة مخفية في CSS.
- **JS:** ES modules، `const`/`let`، من غير classes إلا لو فيه حالة؛ كل مكوّن بيصدّر `mount(el) → destroy`؛ event delegation على الجريد (`prd.md` §5)؛ مفيش `innerHTML` بنص جاي من بيانات من غير escape.
- **Liquid:** كل نص من `i18n` بمفتاح (`{{ 'cart.add' | t }}`) — ممنوع نص ثابت في القالب؛ كل مكوّن بياخد بياناته كـ parameters (`{% render 'product-card', product: p %}`) عشان يتنقل لـ Shopify زي ما هو.
- **i18n:** المفاتيح بالإنجليزي، مقسّمة بالـ namespace (`header.*`، `cart.*`، `product.*`). السعر من `money.js`: `EGP 12,500` / `١٢٬٥٠٠ ج.م`.
- **a11y:** WCAG AA؛ `focus-visible`؛ كل طبقة `role="dialog" aria-modal` + focus-trap + رجوع التركيز؛ أهداف لمس ≥ 44px.
- **الأداء:** صور `aspect-ratio` ثابتة + lazy (إلا أول شاشة)؛ صور الـ Salon البعيدة lazy؛ `ScrollTrigger` يتقتل في `destroy`.
- **الأدوات:** Prettier (افتراضي) + ESLint (`eslint:recommended`) + Stylelint (`stylelint-config-standard`)؛ `npm run check` = lint + build + test.
- **Git:** فرع لكل تذكرة `ticket/{n}-{slug}`؛ Conventional Commits (`feat(cart): …`، `fix(salon): …`)؛ رسالة الـ commit بتذكر رقم الـ issue (`Closes #n`).
- **الملفات:** kebab-case؛ مكوّن = `name.liquid` + `name.css` + `name.js`.

## Open Technical Questions [TODO]

1. **⚠️ تعارض مع `design.md` (UX Flow):** "تبديل اللغة والنافذة مفتوحة ← المحتوى يتحدّث في مكانه". مع اللغة في الـ URL (زي المنصات التلاتة) التبديل = تنقّل لصفحة تانية. **المقترح:** Quick View بتتفتح تاني تلقائياً من `#qv=`، والـ Bag محفوظة أصلاً؛ باقي الطبقات بتتقفل. **محتاج موافقة** — البديل (تبديل في نفس الصفحة) مش هيتنقل لأي منصة.
2. **Testing seam (Playwright، سلوك ظاهر بس)** — مقترح ومستني تأكيد.
3. **أيقونة الحساب في الهيدر** والحسابات مش في النطاق (سؤال 1): نخفيها في المرجع، ولا نسيبها توصل لصفحة "Coming soon"؟ (المقترح: نخفيها لحد القرار.)
4. **أيقونة البحث** (سؤال 2): نفس الوضع — المقترح نخفيها.
5. **Edblad Store theme** مش موجود في `C:\Users\HP\projects\edblad-site\edblad-store-theme` (المسار في `PLAN.md`). مش بيأثّر على المرحلة 1، بس Port WordPress محتاج مكانه الصح.
6. **Salla:** EGP (سؤال 4) + مكان تخزين الـ Looks (مفيش metaobjects) — يتحسم في معمارية Port Salla.
7. **رسوم الشحن في الـ Checkout التجريبي:** `design.md` بيقول "Calculated at checkout" من غير أرقام. المقترح: `shipping.json` فيه طريقتين placeholder (Standard / Express) بأسعار وهمية — محتاج تأكيد أو أرقام.
8. **Press quote / As Featured In:** مش متبني لحد قرار العميل (`design.md` Open #1).
