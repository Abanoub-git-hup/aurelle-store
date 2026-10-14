# AURELLE Store

متجر أزياء فخم ثنائي اللغة (عربي/إنجليزي) بيتبني مرة كمرجع تصميم موحّد، وبعدين يتنقل لـ WooCommerce و Shopify و Salla.

## Language

### المصادر والمرجع

**Design Reference** (المرجع الموحّد):
نسخة HTML/CSS/JS الثابتة للمتجر كله — مصدر الحقيقة الوحيد للشكل والحركة اللي كل منصة بتنسخ منه.
_Avoid_: prototype، mockup، template

**Prototype** (نموذج أولي):
تجربة مؤقتة لسؤال تصميمي واحد (زي `salon-hero.html`)، مش جزء من المرجع وممكن تترمي.
_Avoid_: design reference، draft

**Port** (نقل لمنصة):
نسخة المرجع الموحّد بعد ما اتلفّت بقوالب منصة معينة وطبقة التجارة بتاعتها.
_Avoid_: theme (لوحدها)، version، clone

### الهيرو

**Salon** (الصالون):
سيكشن الهيرو — قاعة غامقة فيها Looks واقفة على أعماق مختلفة، الزائر بيسحب يتجوّل فيها ويكليك عشان يقرّب.
_Avoid_: hero gallery، carousel، 3D hero

**Look** (إطلالة):
موديل واحد لابس طقم كامل جوّه الـ Salon أو الـ Lookbook.
_Avoid_: outfit، figure، model

**Shop the Look**:
لوحة بتعرض كل القطع اللي لابسها Look واحد، وكل قطعة ليها Quick Add — بتتفتح من الـ Salon أو من قسم Shop the Look.
_Avoid_: outfit builder، bundle

### الشراء

**Bag** (الحقيبة):
اسم سلة المشتريات زي ما الزائر بيشوفه في الواجهة. في الكود والتوثيق وعلى المنصات اسمه **Cart** — نفس الحاجة، كلمتين حسب مين بيقرا.
_Avoid_: basket، السلة (في الواجهة)

**Quick Add**:
إضافة منتج للـ Bag من غير ما الزائر يدخل صفحة المنتج.
_Avoid_: add to cart (في الواجهة)

**Quick View**:
نافذة معاينة كاملة للمنتج (صور + مقاس + لون + Quick Add) فوق الصفحة الحالية.
_Avoid_: preview، popup

### الكتالوج

**Department** (القسم الرئيسي):
أول مستوى في التصفح: **Women** أو **Men**.
_Avoid_: gender، section

**Category** (الفئة):
نوع القطعة جوّه الـ Department (Outerwear، Knitwear، Dresses، Trousers، Accessories).
_Avoid_: collection، type

**The Edit**:
مجموعة منتجات مختارة يدوياً بيعرضها المتجر كقسم مستقل في الرئيسية.
_Avoid_: featured، picks، curated list

**Lookbook**:
سلسلة Looks مرقّمة لموسم معيّن بتتعرض بسكرول أفقي.
_Avoid_: gallery، slider

**Campaign**:
صورة/قصة الموسم الكبيرة بعرض الشاشة كلها، تحريرية مش منتج.
_Avoid_: banner، hero (برّه الهيرو)
