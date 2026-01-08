/**
 * Base Schema Utilities
 * Framework-agnostic helper functions for schema generation
 */

import type { ImageObject } from './types';

/**
 * Generate a unique ID for a schema entity
 */
export function generateSchemaId(baseUrl: string, type: string): string {
  return `${baseUrl}/#${type.toLowerCase()}`;
}

/**
 * Format a price value for schema (remove currency symbols, ensure valid number)
 */
export function formatSchemaPrice(price: number | string | undefined): string | undefined {
  if (price === undefined || price === null) return undefined;

  // Convert to string and remove non-numeric characters except decimal point
  const cleaned = String(price).replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) return undefined;

  // Return as string with 2 decimal places
  return parsed.toFixed(2);
}

/**
 * Convert availability status to Schema.org URL
 */
export function formatAvailability(
  status?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder' | boolean
): string {
  if (typeof status === 'boolean') {
    return status ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  }

  switch (status) {
    case 'InStock':
      return 'https://schema.org/InStock';
    case 'OutOfStock':
      return 'https://schema.org/OutOfStock';
    case 'PreOrder':
      return 'https://schema.org/PreOrder';
    case 'BackOrder':
      return 'https://schema.org/BackOrder';
    default:
      return 'https://schema.org/InStock';
  }
}

/**
 * Convert item condition to Schema.org URL
 */
export function formatItemCondition(
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
): string {
  switch (condition) {
    case 'UsedCondition':
      return 'https://schema.org/UsedCondition';
    case 'RefurbishedCondition':
      return 'https://schema.org/RefurbishedCondition';
    case 'NewCondition':
    default:
      return 'https://schema.org/NewCondition';
  }
}

/**
 * Create an ImageObject from a URL string
 */
export function createImageObject(
  url: string,
  options?: { width?: number; height?: number; caption?: string }
): ImageObject {
  return {
    '@type': 'ImageObject',
    url,
    ...(options?.width && { width: options.width }),
    ...(options?.height && { height: options.height }),
    ...(options?.caption && { caption: options.caption }),
  };
}

/**
 * Sanitize text for schema (remove HTML tags, decode entities)
 */
export function sanitizeSchemaText(text: string | undefined): string | undefined {
  if (!text) return undefined;

  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned || undefined;
}

/**
 * Validate required fields in schema object
 */
export function validateSchema<T extends Record<string, unknown>>(
  schema: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = schema[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Remove undefined/null fields from schema object
 */
export function cleanSchema<T>(schema: T): T {
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    return schema;
  }

  const cleaned: any = {};

  for (const [key, value] of Object.entries(schema)) {
    if (value !== undefined && value !== null) {
      // Recursively clean nested objects
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        cleaned[key] = cleanSchema(value);
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned as T;
}

/**
 * Get price valid until date (6 months from now by default)
 */
export function getPriceValidUntil(months: number = 6): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

/**
 * Format opening hours for Schema.org
 */
export function formatOpeningHours(hours: Array<{
  day: string | string[];
  opens: string;
  closes: string;
  description?: string;
}>) {
  return hours.map((hour) => ({
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: hour.day,
    opens: hour.opens,
    closes: hour.closes,
    ...(hour.description && { description: hour.description }),
  }));
}

/**
 * Extract the first image URL from various image formats
 */
export function getFirstImageUrl(
  images?: string | string[] | Array<{ src: string }>
): string | undefined {
  if (!images) return undefined;

  if (typeof images === 'string') return images;

  if (Array.isArray(images)) {
    if (images.length === 0) return undefined;
    const first = images[0];
    return typeof first === 'string' ? first : first.src;
  }

  return undefined;
}

/**
 * Extract all image URLs from various image formats
 */
export function getAllImageUrls(
  images?: string | string[] | Array<{ src: string; alt?: string }>
): string[] {
  if (!images) return [];

  if (typeof images === 'string') return [images];

  if (Array.isArray(images)) {
    return images.map((img) => (typeof img === 'string' ? img : img.src));
  }

  return [];
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string | undefined, maxLength: number): string | undefined {
  if (!text) return undefined;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
