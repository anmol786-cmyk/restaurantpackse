import { routing } from '@/i18n/routing';

const BASE_URL = 'https://restaurantpack.se';

/** Absolute URL for a path in a locale (English is unprefixed). */
export function localeUrl(locale: string, path: string): string {
  const cleanPath = path === '/' ? '' : path;
  return `${BASE_URL}${locale === 'en' ? '' : `/${locale}`}${cleanPath}` || BASE_URL;
}

/**
 * Self-referencing canonical + hreflang alternates for a localized page.
 * Every indexable page should use this: a missing canonical used to fall back to the
 * root layout's "/" and tell Google the page was a duplicate of the homepage.
 */
export function localeAlternates(locale: string, path: string) {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])),
      'x-default': localeUrl('en', path),
    },
  };
}
