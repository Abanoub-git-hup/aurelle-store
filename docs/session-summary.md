# ملخص الجلسة — AURELLE Store (2026-10-14)

> اقرا الملف ده الأول في أي نافذة جديدة. بعده: `project.md` ← `design.md` ← `GLOSSARY.md` ← `docs/adr/`.

## المشروع في سطرين
متجر أزياء فخم (رجالي + حريمي) ثنائي اللغة EN/AR، يتبني كـ **مرجع موحّد HTML/CSS/JS** الأول، وبعدين يتنقل لـ **WordPress/WooCommerce ← Shopify ← Salla**. دفع تجريبي فقط. السوق مصر (EGP). الاسم AURELLE مؤقت.

- **المسار:** `C:\Users\HP\projects\aurelle-store` (كان `velune-store` واتنقل — الفولدر القديم اتمسح)
- **GitHub (Public):** https://github.com/Abanoub-git-hup/aurelle-store — فرع `main`، فيه commit واحد بس (الملفات الأحدث لسه مش متعمل لها commit)

## المراجع (ADR-0001)
| المرجع | الرابط | بناخد منه |
|--------|--------|-----------|
| AURELLE | https://extended-nectarine-998439.framer.app/ | **كل الهوية**: ألوان، خطوط، أقسام، كروت، هيدر، فوتر |
| Ombrine | https://ombrine.framer.website/ | **الهيرو فقط** (الـ Salon) — بستايل AURELLE |
| VÉLUNE | https://velune.framer.website/ | **الحركة فقط** (نص حرف حرف، scroll-lit text، parallax) |

## ملفات المشروع
| الملف | الدور | الحالة |
|-------|-------|--------|
| `project.md` | إيه وليه ولمين (Agency PM) | ✅ — فيه 9 أسئلة للعميل مفتوحة |
| `design.md` | مواصفات التصميم + الحركة M1–M14 + 30+ مكوّن (Agency Designer) | ✅ |
| `design_prompt.md` | برومبت Claude Design (إنجليزي) | ✅ |
| `GLOSSARY.md` | المصطلحات (Salon، Look، Shop the Look، Bag، Department، Category …) | ✅ |
| `docs/adr/0001-…` | قرار AURELLE + Ombrine + VÉLUNE | ✅ |
| `PLAN.md` | الخطة القديمة + **جدول الـ 24 قرار (Q1–Q24)** | مؤقت — يتأرشف في `docs/archive/` بعد `architecture.md` |
| `prd.md` | سلوك كرت المنتج (swatches، hover، Quick View/Add) | مؤقت — ألوانه في §6 قديمة (VÉLUNE)؛ السلوك صالح |
| `prototypes/salon-hero.html` | نموذج أولي للـ Salon | يتنقل للمرجع بتوكنز AURELLE |
| `CLAUDE.md` + `docs/agents/` | إعداد skills: GitHub Issues + 5 labels + single-context | ✅ |

## أهم القرارات (التفاصيل في PLAN.md)
- **التوكنز:** خلفية `#F6F3EE` · بديلة `#EFEAE1` · حبر `#1A1714` · ثانوي `#6B6258` · برونزي `#A6855B` (✦ فقط).
- **الخطوط:** Bodoni Moda + Satoshi (EN) · El Messiri + IBM Plex Sans Arabic (AR). AURELLE لاتيني في اللغتين.
- **الحركة:** 3 مستويات (حرف حرف للكلمة والعناوين الكبيرة، سطر سطر للفقرات، scroll-lit لجملة أو اتنين). العربي **كلمة كلمة** مش حرف حرف. Lenis في كل الأجهزة. Preloader أول زيارة بس. reduced-motion = كل حاجة ظاهرة.
- **الـ Salon:** 4 طبقات ديسكتوب / طبقتين موبايل. كليك على Look → لوحة **Shop the Look**.
- **التجارة:** واجهة "Bag" / كود "Cart". Bag = درج جانبي. مقاسات XS–XL. فلاتر: Category + مقاس + سعر/ترتيب. ~24 منتج (12+12). القايمة Women / Men أولاً. صفحة المنتج: صور مترصّة + معلومات sticky.
- **اللغة الافتراضية:** إنجليزي دايماً.
- **الصور:** stock مجاني + تفريغ + توحيد ألوان (أصعب جزء).
- **الاختبار (مقترح، مستني تأكيد):** نقطة واحدة = الصفحة في متصفح حقيقي (Playwright)، سلوك ظاهر فقط.

## الـ Workflow (Agency بأدوار)
1. ✅ **PM** → `project.md`
2. ✅ **UI/UX Designer** → `design.md` + `design_prompt.md`
3. ⏸ **Claude Design** — مستني قرار: نعملها ولا نتخطاها؟ (التوصية: نتخطاها، لأن الحركة أولوية والمرجع HTML هو التصميم)
4. ⏭ **Architect** (النسخة المعدّلة `agency-software-architect` من غير `anthropic-skills:`) → `architecture.md` بس، وبعدين المستخدم يبعت **`/to-tickets architecture.md`**
5. **Fullstack** (النسخة المعدّلة) → تذكرة تذكرة من GitHub، ويقف بعد كل تذكرة
6. **QA** → 7. **DevOps**

- `/to-spec` **مش مستخدم** في الـ workflow ده (project.md + architecture.md بيغطّوه).
- تقسيم تذاكر مبدئي اتعتمد (17 تذكرة: 16 vertical slice + تذكرة صور الـ stock) — `/to-tickets` هيعيد بناءه من `architecture.md`.

## مفتوح
- **قرار الخطوة 3** (Claude Design ولا نتخطى للـ Architect).
- **أسئلة العميل في project.md:** حسابات العملاء، البحث، خدمة النشرة، عملة Salla، نصوص الصفحات القانونية، شارة الخصم، Quick Add بمقاسات، أرقام النجاح، الاسم النهائي.
- **"As Featured In" / اقتباس Vogue:** مفيش صحافة حقيقية → placeholder أو يتشال.
- **ملفات مش متعمل لها commit:** project.md، design.md، design_prompt.md، docs/session-summary.md.
- **صور `assets/prd/`** (لقطات Ctrl Cairo) في repo عام — ممكن تتشال.
- أرشفة `PLAN.md` و `prd.md` بعد `architecture.md`.

## ملاحظات للأداة
- `/grill-with-docs` و `/to-tickets` و `/to-spec` و `/setup-matt-pocock-skills` = أوامر **المستخدم** يكتبها في الشات (Claude مايقدرش يشغّلها).
- الرد للمستخدم بالعربي دايماً.
