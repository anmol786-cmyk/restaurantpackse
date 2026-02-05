import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string = 'en-US'
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Decode HTML entities in a string
 * Handles both lowercase and UPPERCASE entities (e.g., &amp; and &AMP;)
 * @param text - Text containing HTML entities
 * @returns Decoded text
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  // Handle named entities (case-insensitive with 'gi' flag)
  let decoded = text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&ndash;/gi, '\u2013')
    .replace(/&mdash;/gi, '\u2014')
    .replace(/&lsquo;/gi, '\u2018')
    .replace(/&rsquo;/gi, '\u2019')
    .replace(/&ldquo;/gi, '\u201C')
    .replace(/&rdquo;/gi, '\u201D')
    .replace(/&bull;/gi, '\u2022')
    .replace(/&hellip;/gi, '\u2026')
    .replace(/&copy;/gi, '\u00A9')
    .replace(/&reg;/gi, '\u00AE')
    .replace(/&trade;/gi, '\u2122')
    .replace(/&euro;/gi, '\u20AC')
    .replace(/&pound;/gi, '\u00A3')
    .replace(/&yen;/gi, '\u00A5')
    .replace(/&cent;/gi, '\u00A2')
    .replace(/&deg;/gi, '\u00B0')
    .replace(/&plusmn;/gi, '\u00B1')
    .replace(/&times;/gi, '\u00D7')
    .replace(/&divide;/gi, '\u00F7')
    .replace(/&frac12;/gi, '\u00BD')
    .replace(/&frac14;/gi, '\u00BC')
    .replace(/&frac34;/gi, '\u00BE')
    .replace(/&laquo;/gi, '\u00AB')
    .replace(/&raquo;/gi, '\u00BB');

  // Handle numeric character references (&#8211; etc.)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));

  // Handle hex character references (&#x2013; etc.)
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return decoded;
}

/**
 * Format a price to a readable format
 * @param price - Price value (number or string)
 * @param currency - Currency code (default: 'SEK')
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string,
  currency: string = 'SEK',
  locale: string = 'sv-SE'
): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}
