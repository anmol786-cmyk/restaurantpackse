/**
 * Brand Schema Generator
 * Framework-agnostic function for generating Brand schema
 */

import type { Brand } from './types';
import { createImageObject, cleanSchema } from './base';

/**
 * Generate Brand Schema
 *
 * @param name - Brand name
 * @param options - Additional brand options
 * @returns Brand schema object
 */
export function brandSchema(
  name: string,
  options?: {
    url?: string;
    logo?: string;
    description?: string;
    logoWidth?: number;
    logoHeight?: number;
  }
): Brand {
  const schema: Brand = {
    '@type': 'Brand',
    name,
  };

  if (options?.url) {
    schema.url = options.url;
  }

  if (options?.logo) {
    if (options.logoWidth && options.logoHeight) {
      schema.logo = createImageObject(options.logo, {
        width: options.logoWidth,
        height: options.logoHeight,
      });
    } else {
      schema.logo = options.logo;
    }
  }

  if (options?.description) {
    schema.description = options.description;
  }

  return cleanSchema(schema);
}

/**
 * Pre-configured Anmol Wholesale Brand Schema
 */
export function anmolWholesaleBrandSchema(): Brand {
  return brandSchema('Anmol Wholesale', {
    url: 'https://restaurantpack.se',
    logo: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
    description: 'Sweden\'s trusted B2B wholesale supplier for restaurants, grocery stores, and caterers. Manufacturer of Anmol Electric Tandoor.',
  });
}
