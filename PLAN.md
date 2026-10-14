# AURELLE Store — Bilingual E-commerce × 3 Platforms (WordPress / Shopify / Salla)

> آخر تحديث: 2026-10-14 — **تحويل المرجع من VÉLUNE إلى AURELLE** + هيرو Ombrine + نظام أنيميشن نصّي من VÉLUNE.

## Context (ليه بنعمل ده)
بناء متجر أزياء فخم **AURELLE** كـ **متجر إلكتروني وظيفي حقيقي** (منتجات + سلة + تشيكآوت شغّال)
على **3 منصات**: WordPress/WooCommerce، Shopify (OS 2.0)، Salla (Twilight).

**المراجع (3 مصادر، لكل واحد دور محدد):**
| المرجع | الرابط | بناخد منه |
|--------|--------|-----------|
| **AURELLE** (الأساس) | https://extended-nectarine-998439.framer.app/ | الهوية البصرية كلها: الألوان، الخطوط، التخطيط، الأقسام، كروت المنتجات، الفوتر |
| **Ombrine** | https://ombrine.framer.website/ | **سيكشن الهيرو فقط** ("صالون الإطلالات" — موديلات في عمق ثلاثي الأبعاد، سحب + كليك للاقتراب) |
| **VÉLUNE** | https://velune.framer.website/ | **سلوك الحركة فقط**: ظهور النص حرف حرف، كشف النص المرتبط بالسكرول، parallax الصور |

> ⚠️ القاعدة الذهبية: **ستايل واحد موحّد = ستايل AURELLE**. هيرو Ombrine وحركة VÉLUNE بيتنفّذوا
> **بخطوط وألوان AURELLE** — مش بخط Ombrine ولا بألوان VÉLUNE السودا.

**ليه AURELLE (بدل VÉLUNE):** إحساس دار أزياء حقيقية (quiet luxury: كريمي + Bodoni + تصوير طبيعي موحّد)،
ومتجر مكتمل تجارياً (New In / Shop the Look / أقسام / Lookbook / Journal / Newsletter) — بيتطابق مع
مكوّنات المنصات الـ3 أحسن من VÉLUNE اللي كان تحريري وفيه 4 خامات بس. ومنتجاته (بالطو، تريكو، بنطلونات)
بتتطابق مع إطلالات هيرو Ombrine، عكس فساتين السهرة في VÉLUNE.

**القرارات المحسومة:**
- **العمق:** متجر وظيفي — منتجات/فاريانت/سلة/تشيكآوت يشتغلوا فعلاً، لكن **بوابات الدفع في
  وضع تجريبي (test/sandbox)** مش دفع حقيقي بفلوس.
- **اللغة/السوق:** **ثنائي اللغة عربي + إنجليزي (RTL/LTR)** على الـ3 منصات.
- **الأسلوب:** نبني **مرجع تصميم موحّد (HTML/CSS/JS)** أولاً = مصدر الحقيقة، وبعدين نحوّله
  لكل منصة بأدواتها + طبقة التجارة بتاعتها.
- **الأولوية التصميمية:** **الأنيميشن وطريقة ظهور المحتوى** (حرف حرف، كشف الصور، دخول الكروت) — ناعمة وفخمة.

> **نعيد استخدام تجربة مجرّبة:** ثيم **Edblad Store** الموجود
> (`C:\Users\HP\projects\edblad-site\edblad-store-theme`) هو نفس النمط بالظبط
> (WordPress هجين FSE + WooCommerce) — هيبقى السكافولد لجزء الووردبريس.

> ⚠️ **حقيقة مهمة عن التشيكآوت:** صفحة الدفع نفسها **مقفولة التصميم** في Shopify (إلا Plus)
> و Salla — بتكون بتدفّق المنصة المستضاف. التصميم الكامل للتشيكآوت ممكن **فقط** في WooCommerce.
> في Shopify/Salla بنصمّم لحد السلة، والتشيكآوت بياخد ثيم المنصة الافتراضي.

---

## بنية المشروع
> الجذر: `C:\Users\HP\projects\aurelle-store`
```
aurelle-store/
├─ PLAN.md  prd.md
├─ prototypes/ (salon-hero.html ← نموذج هيرو Ombrine؛ يتعاد تلوينه بتوكنز AURELLE)
├─ design-reference/            ← المصدر الموحّد (source of truth)
│  ├─ index.html  shop.html  product.html  cart.html  checkout.html
│  ├─ about.html  contact.html  journal.html
│  ├─ css/ (tokens.css, base.css, sections.css, motion.css, rtl.css)
│  ├─ js/
│  │  ├─ motion/ (preloader.js, split-text.js, reveal.js, parallax.js, smooth-scroll.js, counters.js)
│  │  ├─ salon-hero.js          ← هيرو Ombrine
│  │  ├─ cart-demo.js  i18n.js
│  ├─ fonts/   assets/
├─ wordpress/aurelle-theme/     ← هجين FSE + WooCommerce (على نمط Edblad)
├─ shopify/aurelle-shopify/     ← OS 2.0 Liquid
├─ salla/aurelle-twilight/      ← Twilight / Twig
└─ docs/build-guide.md          ← لوج تعلّم + فروق المنصات
```

---

## Design Tokens (مستخرجة من AURELLE بالقياس من الموقع)
| Token | Value | الاستخدام |
|-------|-------|-----------|
| `--bg` | `#F6F3EE` | الخلفية الأساسية (كريمي) |
| `--bg-2` | `#EFEAE1` | أقسام بديلة / خلفية الكروت |
| `--ink` | `#1A1714` | النص + الأقسام الغامقة (campaign / lookbook / الهيرو) |
| `--muted` | `#6B6258` | نص ثانوي |
| `--accent` | `#A6855B` | برونزي — النجمة ✦ والتفاصيل الصغيرة فقط |
| `--line` | `rgba(26,23,20,.12)` | فواصل |
| `--on-dark` | `#F6F3EE` (+ `.6` للثانوي) | نص فوق الغامق |
| خط عناوين (EN) | **Bodoni Moda** 400 (tracking سالب خفيف في الأحجام الكبيرة) | |
| خط نص/واجهة (EN) | **Satoshi** 400/500؛ اللابلز UPPERCASE بـ tracking ‎~0.14em | |
| خط عناوين (AR) | **El Messiri** | |
| خط نص (AR) | **IBM Plex Sans Arabic** | |
| الرمز | النجمة **✦** (لودر + فواصل الماركي) | |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out ناعم) + `power4.out` في GSAP | |

---

## نظام الأنيميشن (Motion System) — قلب المشروع
مكتبة واحدة تتكتب مرة في `design-reference/js/motion/` وتتنقل كما هي للمنصات الـ3.
**المكتبات:** GSAP 3 + ScrollTrigger + **SplitText** (مجاني من 3.13) + **Lenis** للسكرول الناعم.

| # | التأثير | المصدر | الوصف |
|---|---------|--------|-------|
| M1 | **Preloader** | AURELLE | شاشة `--ink` + خط رأسي + ✦ برونزي ينبض → ينفتح على الهيرو |
| M2 | **كلمة AURELLE حرف حرف (الهيرو)** | AURELLE | كل حرف يطلع من تحت قناع (`overflow:hidden`, `yPercent:110→0`) + blur خفيف → 0، stagger ‎0.06s، بعد اللودر مباشرة |
| M3 | **عناوين الأقسام حرف حرف** | VÉLUNE | SplitText chars → ظهور عند الدخول (y + opacity، stagger قصير) |
| M4 | **نص مكشوف بالسكرول (scrub)** | VÉLUNE | الحروف تبدأ باهتة (opacity ‎0.15) وتنوّر حرف ورا حرف مع السكرول — للجمل الكبيرة ("Luxury is the quiet confidence…") |
| M5 | **فقرات سطر سطر** | — | SplitText lines + mask، يطلع كل سطر بتأخير بسيط |
| M6 | **كشف الصور** | VÉLUNE/AURELLE | `clip-path: inset()` يتفتح + الصورة `scale 1.15→1` |
| M7 | **Parallax الصور** | VÉLUNE | الصورة جوّه إطارها تتحرك `yPercent` مع السكرول (scrub) — campaign / atelier / categories |
| M8 | **دخول الكروت** | — | `ScrollTrigger.batch()` → y + opacity + stagger؛ الكروت تيجي ورا بعض بنعومة |
| M9 | **Hover الكرت** | prd.md | تبديل صورتين fade + swatches + Quick Add (حسب `prd.md`) |
| M10 | **Marquee الأقسام** | AURELLE | شريط Outerwear ✦ Knitwear ✦ … لا نهائي، يبطّأ عند الـ hover |
| M11 | **Lookbook أفقي** | AURELLE | سيكشن مثبّت (pin) والصور تتحرك أفقياً مع السكرول |
| M12 | **عدّادات** | AURELLE | count-up للأرقام (‎% natural fibres …) عند الظهور |
| M13 | **كلمة AURELLE الضخمة في الفوتر** | AURELLE | نفس M2 بس مرتبطة بالسكرول |

**قواعد ثابتة:**
- **العربي ما يتقسمش حروف أبداً** — تقسيم الحروف بيكسر وصل الحروف العربية. في `[dir=rtl]` M2/M3/M4
  بتشتغل على مستوى **الكلمة** (`type: "words"`) تلقائياً. اسم الماركة اللاتيني AURELLE يفضل حرف حرف في اللغتين.
- `prefers-reduced-motion` → كل حاجة تظهر فوراً بدون حركة (ولا parallax ولا scrub ولا Lenis).
- Lenis شغّال على كل الأجهزة (ديسكتوب + لمس) — Q6.
- Preloader (M1) مرة واحدة في الجلسة — Q5.
- `ScrollTrigger.refresh()` بعد تحميل الخطوط (`document.fonts.ready`) — SplitText لازم يتقاس بعد الخط.
- المحتوى لازم يكون مقروء لو الـ JS فشل (الحالة الابتدائية المخفية بتتحط من JS مش من CSS).
- الأنيميشن بيستخدم `transform`/`opacity`/`clip-path` بس — مفيش animate لـ width/top.

---

## المرحلة 1 — المرجع الموحّد (design-reference/)
صفحات ثابتة كاملة ثنائية اللغة (تبديل `dir`/`lang` من زر)، تغطي كل المتجر:

**الصفحات:** الرئيسية، المتجر/الكتالوج (مع فلاتر)، صفحة منتج (فاريانت + Add to cart +
تبويبات Material/Care + Size Guide)، السلة، التشيكآوت، من نحن، اتصل، الجورنال.

**أقسام الرئيسية (هيكل AURELLE بعد حذف المكرر):**
1. Preloader ✦ (M1)
2. Header: كلمة AURELLE + بحث + حساب + Bag (0) + **مبدّل لغة AR/EN**
3. **Hero = صالون Ombrine** (من `prototypes/salon-hero.html`) بخلفية `--ink` الدافية، وفوقه
   **كلمة AURELLE حرف حرف (M2)** + "A quieter luxury, made to last a lifetime." + Discover the Collection
4. Marquee الأقسام ✦ (M10)
5. As Featured In (شعارات صحافة نصّية)
6. New In — جريد 4 كروت (M8/M9)
7. The Winter Campaign — صورة full-bleed (M6/M7) + "Worn slowly, kept for years" (M3)
8. Shop the Look — صورة بنقاط hotspots تفتح المنتجات
9. Shop by Category — 4 كروت كبيرة (Outerwear/Knitwear/Dresses/Accessories)
10. Made by Hand — صورة + نص (Atelier)
11. The Edit — جريد منتجات مختارة
12. The Lookbook — سكرول أفقي مثبّت (M11)
13. Material & Make + عدّادات (M12)
14. جملة الماركة الكبيرة — كشف بالسكرول (M4)
15. Most Loved — جريد
16. The Press — اقتباس Vogue
17. The Journal — 3 مقالات
18. Community @aurelle — جريد صور
19. Newsletter — Join the Aurelle Atelier
20. Footer (Shop / Client Care / The House / Connect) + كلمة AURELLE ضخمة (M13)

> **محذوف من AURELLE لأنه مكرر:** الـ Campaign التاني، الـ Atelier التاني، الـ Material & Make التاني.

**هيرو Ombrine — قواعد التوحيد:**
- لوجو Ombrine والخط الـ script بتاعه **يتشالوا** → الهيدر الموحّد + Bodoni/Satoshi.
- خلفية الصالون بتتلوّن من `--ink` (#1A1714) بدفء برونزي خفيف بدل البني/الأسود بتاع Ombrine.
- الإطلالات = منتجات AURELLE الحقيقية (صور cut-out PNG)؛ الكليك على إطلالة يفتح المنتج / Quick View.
- انتقال الهيرو الغامق → جسم الصفحة الكريمي بتدرّج أرضية الصالون (`::after`) + شريط الماركي.

**ثنائي اللغة + RTL (نمط موحّد يتكرر في كل المنصات):**
- CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`) + `rtl.css`
  بـ `[dir="rtl"]` للتعديلات، وخط عربي للعناوين/النص.
- `i18n.js` بسيط في المرجع (قاموس EN/AR + تبديل `dir`) — ويعيد بناء SplitText بعد تبديل اللغة.
- الـ Marquee واللوكبوك الأفقي يعكسوا اتجاههم في RTL.

**السلة التجريبية في المرجع:** `cart-demo.js` (localStorage) عشان نجرّب تدفّق
Add→Cart→Checkout بصرياً قبل الربط الحقيقي في كل منصة.

**التحقق:** فتح كل صفحة في البراوزر الداخلي — فحص الأنيميشن (M1–M13)، تبديل اللغة/RTL
(العربي كلمة كلمة)، reduced-motion، وتدفّق السلة التجريبي.

---

## المرحلة 2 — WordPress + WooCommerce (هجين، على نمط Edblad)
```
aurelle-theme/
├─ style.css  functions.php  theme.json
├─ inc/ (theme-setup, enqueue, woo-hooks, customizer)
├─ parts/ (header.html, footer.html)            ← FSE
├─ templates/ (home.html, page.html, index.html, 404.html)  ← FSE
├─ patterns/ (salon-hero, marquee, new-in, campaign, shop-the-look, categories,
│             atelier, lookbook, material, statement, journal, newsletter)
├─ assets/js/motion/                            ← نفس مكتبة المرجع
├─ page-cart.php  page-checkout.php
└─ woocommerce/ (archive-product, content-product, single-product, cart/, checkout/)
```
- **تجارة حقيقية:** WooCommerce للمنتجات/الفاريانت/السلة/**التشيكآوت كامل التصميم**.
- **الدفع تجريبي:** Cash on Delivery + Stripe/PayPal **sandbox**.
- **ثنائي اللغة:** WPML أو Polylang + دعم RTL (WordPress RTL-ready).
- نفس ماركب المرجع يتلفّ في patterns/قوالب Woo. نعيد استخدام سكافولد Edblad.
- **التحقق:** WooCommerce + منتج تجريبي → تدفّق سلة→تشيكآوت ببوابة تجريبية؛ تبديل اللغة.

---

## المرحلة 3 — Shopify (Online Store 2.0 / Liquid)
```
aurelle-shopify/
├─ layout/theme.liquid
├─ templates/*.json (index, collection, product, cart, page)
├─ sections/ (salon-hero, marquee, new-in, campaign, shop-the-look, categories,
│             atelier, lookbook, material, statement, journal, newsletter, footer)
├─ snippets/   config/settings_schema.json
├─ locales/en.default.json + ar.json
└─ assets/ (css/js/fonts + motion/*.js)
```
- كل قسم = `section` فيه `{% schema %}`؛ `index.json` يرتّب الهوم.
- **تجارة حقيقية:** منتجات/كولكشن/سلة Shopify. **التشيكآوت = مستضاف من Shopify**
  (تصميم محدود؛ Bogus Gateway للطلبات التجريبية).
- **ثنائي اللغة:** Shopify Markets/Translate + ملفات `locales` + RTL عبر `{{ request.locale }}`.
- الأنيميشن لازم يعيد التهيئة في Theme Editor (`shopify:section:load`).
- **متطلب بشري:** Shopify Partner + development store + `shopify theme dev`.

---

## المرحلة 4 — Salla (Twilight / Twig)
```
aurelle-twilight/
├─ twilight.json
├─ src/views/pages/ (index, product, cart ...)
├─ src/views/components/ (salon-hero, marquee, new-in, campaign, categories, lookbook ...)
├─ src/views/{header,footer}/
├─ src/assets/{scss,js,images}/ (+ motion/*.js)
└─ src/locales/{ar,en}.json
```
- مبني على **Theme Raed**؛ **عربي/RTL native + SAR**، ونضيف EN.
- **تجارة حقيقية:** منتجات/سلة/تشيكآوت Salla (التشيكآوت من المنصة).
- **متطلب بشري:** Salla Partner + `npm i -g @salla.sa/cli` + `salla theme serve` + متجر تجريبي.

---

## ملاحظات شاملة (cross-cutting)
- **ترتيب الشغل:** المرحلة 1 كاملة الأول، وبعدها 2/3/4 بالتوازي (نفس الماركب + نفس CSS/JS
  يتلفّوا بقالب كل منصة؛ الأنيميشن يُكتب مرة ويُعاد استخدامه).
- **RTL موحّد:** logical properties في الأساس + طبقة `[dir=rtl]` خفيفة لكل منصة.
- **الخطوط:** self-hosted (Bodoni Moda/El Messiri/IBM Plex Sans Arabic من Google Fonts، Satoshi من Fontshare).
- **الصور:** بدائل royalty-free fashion بنفس روح AURELLE (إضاءة طبيعية، خلفيات جبس/حجر، درجات بيج)؛
  مش صور AURELLE/Ombrine الأصلية (حقوق). إطلالات الهيرو محتاجة صور **cut-out (PNG شفاف)**.
- **أداء الأنيميشن:** SplitText + Lenis + صالون Ombrine تقيلين — الهيرو lazy للصور البعيدة، و
  ScrollTriggers تتقتل لما الصفحة تتقفل (مهم في Shopify editor).
- **فرق جوهري بين المنصات يتوثّق في docs:** التشيكآوت كامل التصميم في Woo فقط؛ Shopify/Salla
  تشيكآوت مستضاف.

## Verification (ملخّص)
1. **Reference:** كل الصفحات + تبديل AR/EN/RTL + الأنيميشن M1–M13 + reduced-motion + سلة تجريبية (البراوزر الداخلي).
2. **WordPress:** WooCommerce + منتج تجريبي → سلة→تشيكآوت ببوابة sandbox؛ RTL.
3. **Shopify:** dev store → `shopify theme dev` → طلب تجريبي بـ Bogus Gateway.
4. **Salla:** متجر Partner تجريبي → `salla theme serve` → طلب تجريبي.

## المتطلبات البشرية (مش قادر أعملها لوحدي)
- Shopify: Partner account + development store.
- Salla: Partner account + تثبيت Salla CLI + متجر تجريبي.
- WordPress: استضافة/موقع (Hostinger + WP MCP متاحين) + WooCommerce.
- بيانات بوابات دفع تجريبية (اختياري — Stripe/PayPal sandbox).

## القرارات المحسومة في جلسة الأسئلة (2026-10-14)
| # | القرار |
|---|--------|
| Q1 | **AURELLE = اسم عمل مؤقت.** الاسم متغيّر واحد في `i18n` + إعدادات كل منصة — تغييره في مكان واحد. |
| Q2 | **AURELLE يفضل لاتيني في العربي كمان** (حرف حرف في اللغتين). |
| Q3 | **خط العناوين العربي = El Messiri** (+ IBM Plex Sans Arabic للنص). |
| Q4 | **صور الـ Looks = Stock مجاني** (Unsplash/Pexels) + إزالة خلفية → PNG شفاف. التحدي: توحيد الإضاءة والدرجات (color grading موحّد على كل الصور). |
| Q5 | **Preloader أول زيارة بس في الجلسة** (sessionStorage)؛ باقي التنقلات fade سريع. |
| Q6 | **Lenis في كل حتة** (ديسكتوب + لمس)؛ بيتقفل فقط مع `prefers-reduced-motion`. |
| Q7 | **الحركة على 3 مستويات:** حرف حرف لـ AURELLE والعناوين الكبيرة · سطر سطر للفقرات · scrub-reveal لجملة أو اتنين بس في الموقع كله. |
| Q8 | **الموبايل = صالون مخفّف** (طبقتين بدل 4) والسحب بالإصبع. |
| Q9 | **ترتيب المنصات: WordPress ← Shopify ← Salla** (واحدة واحدة بعد المرجع). |
| Q10 | الفولدر القديم `velune-store` اتمسح. |
| Q11 | **الواجهة تقول Bag / الحقيبة؛ الكود والتوثيق يقولوا Cart** (عشان يطابقوا المنصات). |
| Q12 | **كليك على Look في الـ Salon يفتح لوحة Shop the Look** بكل قطع الـ Look + Quick Add لكل قطعة. |

| Q13 | **رجالي + حريمي** (زي Ombrine) — الكتالوج والـ Salon فيهم الاتنين. |
| Q14 | **السوق مصر — العملة الافتراضية EGP** (Salla: يتراجع حسب العملات المدعومة فيها). |
| Q15 | **الـ Bag = درج جانبي** بيتزحلق فوق الصفحة بعد Quick Add أو كليك على أيقونة الـ Bag. |
| Q16 | **اللغة الافتراضية إنجليزي دايماً**؛ اختيار الزائر للعربي يتحفظ. |

| Q17 | **القايمة: Women / Men أولاً**، وتحت كل واحد الأقسام (Outerwear، Knitwear …). |
| Q18 | **رئيسية واحدة مشتركة** — الـ Salon فيه رجالة وستات، والجريدات (New In …) فيها تابات Women / Men. |
| Q19 | **كتالوج تجريبي ~24 منتج** (12 حريمي + 12 رجالي) بصور stock + مقاسات + ألوان. |
| Q20 | **الهيدر شفاف فوق الـ Salon بنص فاتح** → يتحوّل بنعومة لخلفية كريمي بنص غامق بعد الهيرو. |

| Q21 | **المقاسات حروف XS–XL**، والـ Size Guide يوضّح المقاسات بالسنتي. |
| Q22 | **فلاتر الـ Shop: Category + المقاس + السعر/الترتيب** (اللون مش فلتر؛ الـ swatches على الكروت بس). |
| Q23 | **صفحة المنتج: صور مترصّة بالطول + معلومات sticky جنبها**، وكل صورة بتتكشف مع السكرول (M6). |
| Q24 | **Journal = مقالات المنصة الحقيقية** (WP posts / Shopify blog)، و**Community = صور يدوية من الإعدادات**. |

## أسئلة مفتوحة
لا يوجد — جلسة الأسئلة خلصت (4 جولات، 24 قرار). التفاصيل الأصغر بتتحسم أثناء بناء المرجع.
