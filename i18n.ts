import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'sv', 'no', 'da'] as const;
export type Locale = (typeof locales)[number];

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

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validatedLocale = locale as Locale;
  if (!locales.includes(validatedLocale)) notFound();

  return {
    locale: validatedLocale,
    messages: (await import(`./messages/${validatedLocale}.json`)).default,
  };
});
