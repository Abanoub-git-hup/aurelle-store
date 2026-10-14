# Claude Design Prompt

## Task
Design a responsive, bilingual (English LTR + Arabic RTL) luxury fashion e-commerce website called **AURELLE** — homepage first, then the inner pages — on desktop (1440) and mobile (390) artboards.

## Project Context
AURELLE is a "quiet luxury" fashion house for women and men, selling outerwear, knitwear, dresses, trousers and accessories in natural fibres made to last for years. The market is Egypt (prices in EGP) and English is the default language, with a full Arabic right-to-left version. The tone is calm, considered and editorial, close to a print fashion magazine and never a discount store. There's lots of empty space, natural-light photography and very little decoration. The signature experience is the **Salon** on the homepage: a dark room full of models wearing complete outfits (**Looks**) standing at different depths. Visitors drag to wander through it and click a Look to shop all of its pieces (**Shop the Look**). Visitors can buy without leaving the page through Quick Add, Quick View and a side **Bag** drawer. In the interface the cart is always called "Bag", or «الحقيبة» in Arabic.

## Reference Design
- **Primary reference:** https://extended-nectarine-998439.framer.app/
  - Take from it: the overall mood, the cream body with warm-ink dark sections as dramatic breaks, the high-contrast serif + small sans pairing, uppercase micro-labels with wide tracking, frameless 3:4 product cards, the header (links left · wordmark centre · icons right), the dark footer with a giant cropped wordmark, the ✦ star motif, and the homepage section rhythm.
  - Do NOT copy: its copy, its photos, or its press logos.
- **Hero reference:** https://ombrine.framer.website/
  - Take from it: **only** the concept of the hero, a dark room of full-length cut-out models on 4 depth layers (far, blurred and faint · back · main and clear · front, huge and blurred), draggable, with a click to step closer.
  - Do NOT copy: its script logo, its typeface, its brown-black palette or its UI chrome. The hero must wear AURELLE's own type and colours.
- **Motion reference:** https://velune.framer.website/
  - Take from it: **only** the motion feel, meaning headings that reveal letter by letter from under a mask, large sentences whose letters light up one by one as you scroll, and images drifting slower than the scroll inside their frames.
  - Do NOT copy: its black palette, its evening-gown content or its layout.
- Never use any reference's photos, logos or text as content.

## Design System
**Colours**
- Background `#F6F3EE` (cream), used as the body of every page
- Background alt `#EFEAE1`, used for alternating sections, image placeholders and fields
- Ink `#1A1714` (warm near-black), used for all main text, the dark sections, the Salon and the footer
- Muted `#6B6258`, used for paragraphs and labels
- Bronze accent `#A6855B`, used **only** for the ✦ star, hotspot dots and the Bag counter. Never use it for buttons or headings.
- Line: Ink at 12% opacity
- On-ink text `#F6F3EE` (60% for secondary)
- Error `#9B3B2E` · Success `#4F6B4A`
- No saturated colours, no decorative gradients, and never use pure black.

**Typography**
- English display and product names: **Bodoni Moda** 400. English body and UI: **Satoshi** 400/500.
- Arabic display: **El Messiri** 500. Arabic body: **IBM Plex Sans Arabic** 400/500. Never apply letter-spacing to Arabic.
- Giant wordmark: Bodoni 12vw (~174px desktop) / 18vw mobile.
- Display 72/40px, line-height 1.05, tracking −0.02em.
- H2 48/32px · H3 26/22px · Product name 17/15px.
- Body 16px, line-height 1.7, Muted colour.
- Price 14px Satoshi 500 in Ink.
- Eyebrow 11px UPPERCASE, tracking 0.18em, Muted.
- Button / text link 12px UPPERCASE, tracking 0.08em.

**Spacing & layout**
- Spacing scale: 4/8/12/16/24/32/48/64/96/128/160.
- Page side margin: 6vw on desktop (~86px), 32px on tablet and **24px on mobile**.
- 12-column grid with 24px gutter (16px on mobile).
- Section spacing: 160px desktop / 72px mobile.
- Max content width 1440px.

**Shape**
- Images and cards have **square corners (0 radius)**.
- Primary buttons are **pills** (full radius).
- Inputs have square corners and an underline only.
- No shadows, except a very soft one on drawers and modals.

**Image ratios**
- Product 3:4 · Category 4:5 · Campaign full-bleed 16:9 (4:5 on mobile) · Lookbook 3:4 · Journal 4:3.

**Imagery**
- Natural side-light, plaster, stone and wood backdrops.
- Palette of camel, oat, cream, charcoal and sand.
- Calm, still poses, with one consistent warm colour grade across all photos.
- Use placeholder fashion photography in this mood.

**Icons**
- 1.25px thin line icons at 20px, monochrome.
- Use a thin long arrow ⟶ beside text links. It mirrors in RTL.

**Motion (annotate on the artboards)**
- Preloader on the first visit only: Ink screen, thin vertical line and a pulsing bronze ✦.
- The AURELLE wordmark reveals letter by letter.
- Section headings reveal letter by letter. In Arabic they reveal word by word.
- Paragraphs reveal line by line.
- Images reveal by unmasking upward while scaling from 115% to 100%, plus a subtle parallax.
- Cards stagger in.
- On card hover, the second image fades in and the Quick buttons rise.
- An endless category marquee.
- A horizontal-scrolling Lookbook.
- Stats count up.
- One or two scroll-lit brand sentences.
- The giant footer wordmark reveals on scroll.
- Easing is a long, soft expo-out.
- With reduced motion, everything is simply visible.

## Pages to Design

### 1. Home (design first, desktop + mobile)
1. **Header**: Women · Men · Collections · Journal · About on the left; the **AURELLE** wordmark in the centre; Search · Account · Bag (0) · `EN · ع` on the right. It is transparent with cream text over the Salon, then turns into a cream bar with ink text below the hero.
2. **Salon hero** (100vh, Ink with a soft warm bronze glow on the floor)
   - About 25 full-length cut-out models, women and men, on 4 depth layers. The main row is crisp and clickable.
   - Overlaid: the eyebrow "AUTUMN — WINTER 2026", the giant wordmark **AURELLE** in cream, the line "A quieter luxury, made to last a lifetime." and a pill button "DISCOVER THE COLLECTION ⟶".
   - Bottom hint: "Drag to wander · Click a look to step closer".
   - The floor fades into the cream page below.
   - Also design the **clicked state**: the chosen Look steps forward and enlarges, the rest blurs, and the Shop the Look panel opens.
3. **Marquee**: OUTERWEAR ✦ KNITWEAR ✦ DRESSES ✦ TROUSERS ✦ ACCESSORIES.
4. **New In**: eyebrow "JUST ARRIVED", title "New In", Women / Men tabs, 4 product cards and a "VIEW ALL ⟶" link.
5. **Campaign**: full-bleed photo, eyebrow "THE WINTER CAMPAIGN", display line "Worn slowly, kept for years" and "VIEW THE CAMPAIGN ⟶".
6. **Shop the Look**: one large Look photo with bronze hotspot dots on each piece, beside a list of those pieces with Quick Add.
7. **Shop by Category**: 4 tall tiles (Outerwear, Knitwear, Dresses, Accessories), each with a "SHOP NOW" link.
8. **Made by Hand**: photo and text split. Eyebrow "MADE BY HAND", display "Every seam, considered.", a short paragraph and "INSIDE THE ATELIER ⟶".
9. **The Edit**: 4 cards with Women / Men tabs.
10. **Lookbook** on an Ink section: "AUTUMN — WINTER 2026 / The Lookbook / SCROLL ⟶" with LOOK 01–06 cards scrolling horizontally.
11. **Material & Make**: text, two fabric close-up photos and 3 stats (e.g. "100% natural fibres", "12 family ateliers", "0 seasons wasted").
12. **Brand statement**: one large display sentence, "Luxury is the quiet confidence of a thing kept for a lifetime." Show it half-lit to indicate the scroll-lit effect.
13. **Most Loved**: 4 cards.
14. **Journal**: 3 article cards, each with category · date and a title.
15. **Community**: square photo grid with "@aurelle".
16. **Newsletter**: "Join the Aurelle Atelier", an underlined email field and a "SUBSCRIBE" button.
17. **Footer** on Ink: wordmark and a short line, columns Shop / Client Care / The House / Connect, the giant cropped AURELLE wordmark, then © and legal links.

Prices use the format **EGP 12,500**, or **١٢٬٥٠٠ ج.م** in Arabic.

### 2. Shop
- Small page header: Department · Category · item count.
- Sticky filter bar: Category · Size (XS–XL) · Price · Sort, with removable active-filter chips.
- 4-column card grid and a "LOAD MORE" button.
- Empty state.
- On mobile: 2 columns and a "FILTER & SORT" bottom drawer.

### 3. Product
- **Left side:** images stacked vertically at large size.
- **Right side**, a sticky column:
  - breadcrumb, name (H2) and price
  - colour swatches with the colour name
  - size boxes XS–XL with a "Size guide" link
  - quantity
  - a full-width pill "ADD TO BAG"
  - accordions for Material · Care · Shipping & Returns
- **Below the columns:** "Complete the Look" and "You may also like".
- **On mobile:** a swipe image carousel and a sticky bottom "ADD TO BAG".

### 4. Bag page
- List of items: image, name, colour, size, quantity, price and remove.
- Sticky summary: subtotal, shipping "Calculated at checkout", total and "CHECKOUT".
- Empty state.

### 5. Checkout
- Minimal header with the wordmark and "Back to Bag".
- One long step: Contact → Shipping address → Delivery method → Payment, with a small "Test mode" badge.
- Sticky order summary.
- No main navigation and no footer.

### 6. Order confirmation
✦, "Thank you", the order number, a summary and "CONTINUE SHOPPING".

### 7. About
Campaign hero, brand story, Made by Hand, Material & Make and a second scroll-lit sentence.

### 8. Contact
Form fields (Name, Email, Subject, Message), contact details and "Ateliers — by appointment".

### 9. Journal + Article
- **List:** a featured story and a 3-column grid with category filter.
- **Article:** hero image, display title, category · date, comfortable reading column, inline images and related stories.

### 10. Client care & legal
Shipping, Returns, Size Guide (table with Women / Men tabs), FAQ (accordion), Privacy and Terms. All use one template: title, sticky side index and body text.

### 11. 404
Giant faded AURELLE in the background, "This page has been kept elsewhere." and links to Home and Shop.

### Overlays (design each)
- **Shop the Look panel**
  - Contents: the Look image, its pieces (thumbnail, name, price, size picker, Quick Add) and "ADD ALL TO BAG".
  - Desktop: a side panel. Mobile: a bottom sheet.
- **Quick View**
  - Contents: an image gallery, name, price, colour, size and "ADD TO BAG", plus "View full details".
  - Desktop: a centred modal. Mobile: a bottom sheet.
- **Quick Add size picker**: a small panel.
- **Bag drawer**
  - Contents: the items, the total, "CHECKOUT" and "VIEW BAG".
  - Desktop: slides in from the right (from the left in Arabic). Mobile: full width.
  - Also design the empty state.
- **Toast**: "Added to Bag".
- **Mega menu** under Women / Men: categories and one editorial image.
- **Mobile menu**: full-screen Ink with large serif links.
- **Size guide** modal.

## Reusable Components
- **Header**: transparent and solid states.
- **Buttons**
  - Pill: default · hover (colours invert) · focus · loading · disabled.
  - Text link with ⟶.
- **Eyebrow + title + "View all"** block.
- **Department tabs.**
- **Product card**
  - Contents: a 3:4 image with a second image on hover, a New / −20% badge, Quick View and Quick Add buttons, the name, the price (with a struck old price), and up to 4 swatches then "+N".
  - States: default · hover · focus · selected colour · sold out · single colour · loading.
- **Swatch**: default · selected ring · sold-out slash.
- **Size box**: available · selected (Ink) · sold out.
- **Quantity stepper.**
- **Look label with hotspot.**
- **Marquee.**
- **Campaign block.**
- **Category tile.**
- **Editorial split.**
- **Lookbook card.**
- **Stat.**
- **Quote.**
- **Journal card.**
- **Newsletter field**: default · focus · error · success.
- **Filter bar and chips.**
- **Breadcrumb.**
- **Accordion.**
- **Form field**: default · focus · error · valid · disabled.
- **Order summary.**
- **Footer.**

## Responsive Requirements
- Artboards: **Desktop 1440** and **Mobile 390** for every page. Add **Tablet 834** for Home, Shop and Product.
- **Mobile**
  - 24px side margin; touch targets of at least 44px.
  - The Salon reduces to 2 layers (main + front) and is dragged with a finger.
  - Product grids use 2 columns.
  - The Lookbook becomes a swipe carousel.
  - Overlays become bottom sheets.
  - Quick Add stays visible on cards.
- **Tablet**: 3-column grids, the Salon on 3 layers, and card buttons always visible.
- **Arabic RTL**
  - Provide an **RTL version of Home (desktop + mobile)** and one of the Product page.
  - Mirror the whole layout, the arrows and the drawer side.
  - Use El Messiri and IBM Plex Sans Arabic.
  - The **AURELLE** wordmark stays in Latin letters and is not mirrored.

## Iteration Notes
1. **Round 1: Home desktop only.** Lock the design system (colours, type scale, spacing, buttons, product card) and the Salon composition before anything else.
2. **Round 2: Home mobile + Home RTL.**
3. **Round 3: Product + Shop + all overlays** (Quick View, Shop the Look, Bag drawer).
4. **Round 4: Bag, Checkout, Confirmation, About, Contact, Journal, legal and 404.**

**Locked once approved:** colours, typography, the card anatomy and the Salon concept. After that, refine only the content and spacing.

**Open, to confirm with the client:**
- the press block, since there is no real press yet (use a neutral placeholder)
- the Account and Search pages
- whether the discount badge is shown
