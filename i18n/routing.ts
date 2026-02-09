import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sv', 'no', 'da'],
  defaultLocale: 'en',
  // English has no prefix (preserves existing URLs / Google indexing)
  // Other locales get prefixed: /sv/shop, /no/shop, /da/shop
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
};
