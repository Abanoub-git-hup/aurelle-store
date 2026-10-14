// Prices are whole Egyptian pounds. One formatter for the build (Eleventy) and the browser:
//   en → "EGP 12,500"   ar → "١٢٬٥٠٠ ج.م"
const NUMBER_LOCALE = { en: 'en-US', ar: 'ar-EG' };
const CURRENCY_LABEL = { en: (n) => `EGP ${n}`, ar: (n) => `${n} ج.م` };

export function formatMoney(amount, lang = 'en') {
  const digits = new Intl.NumberFormat(NUMBER_LOCALE[lang] ?? NUMBER_LOCALE.en, {
    maximumFractionDigits: 0,
  }).format(amount);
  return (CURRENCY_LABEL[lang] ?? CURRENCY_LABEL.en)(digits);
}
