// Re-export from new i18n structure for backwards compatibility
export { type Locale, localeNames, localeFlags, routing } from './i18n/routing';

// Re-export locales directly
import { routing } from './i18n/routing';
export const locales = routing.locales;
