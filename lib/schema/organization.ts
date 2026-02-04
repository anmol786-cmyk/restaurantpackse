/**
 * Organization Schema Generator
 * Framework-agnostic function for generating Organization/GroceryStore schema
 */

import type { Organization, OrganizationInput } from './types';
import { generateSchemaId, formatOpeningHours, cleanSchema } from './base';

/**
 * Generate Organization Schema (GroceryStore, LocalBusiness, etc.)
 *
 * @param config - Organization configuration
 * @returns Complete Organization schema object
 */
export function organizationSchema(config: OrganizationInput): Organization {
  const schema: Organization = {
    '@context': 'https://schema.org',
    '@type': config.types || ['WholesaleStore', 'Wholesaler', 'Organization'],
    '@id': generateSchemaId(config.url, 'organization'),
    name: config.name,
    url: config.url,
  };

  // Optional fields
  if (config.alternateName) {
    schema.alternateName = config.alternateName;
  }

  if (config.description) {
    schema.description = config.description;
  }

  if (config.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo,
    };
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.telephone) {
    schema.telephone = config.telephone;
  }

  if (config.email) {
    schema.email = config.email;
  }

  if (config.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: config.address.street,
      addressLocality: config.address.city,
      postalCode: config.address.postalCode,
      addressCountry: config.address.country,
      ...(config.address.region && { addressRegion: config.address.region }),
    };
  }

  if (config.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    };
  }

  if (config.openingHours && config.openingHours.length > 0) {
    schema.openingHoursSpecification = formatOpeningHours(config.openingHours);
  }

  if (config.cuisine && config.cuisine.length > 0) {
    schema.servesCuisine = config.cuisine;
  }

  if (config.priceRange) {
    schema.priceRange = config.priceRange;
  }

  if (config.socialMedia && config.socialMedia.length > 0) {
    schema.sameAs = config.socialMedia.filter(Boolean);
  }

  if (config.foundingDate) {
    schema.foundingDate = config.foundingDate;
  }

  return cleanSchema(schema);
}



/**
 * Anmol Wholesale Organization Schema
 * B2B Wholesale distributor for restaurants, grocery stores, and caterers
 */
export function anmolWholesaleOrganizationSchema(baseUrl: string = 'https://restaurantpack.se'): Organization {
  return organizationSchema({
    name: 'Anmol Wholesale',
    alternateName: 'Anmol AB | Restaurang Grossist Stockholm',
    description: 'Sveriges ledande B2B restaurang grossist. Anmol Wholesale erbjuder 15% lägre priser på indiska kryddor, basmati ris, storköksvaror och elektrisk tandoor. Snabb leverans i Stockholm och hela Sverige.',
    url: baseUrl,
    logo: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
    image: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
    telephone: '+46769178456',
    email: 'info@restaurantpack.se',
    address: {
      street: 'Fagerstagatan 13',
      city: 'Spånga',
      region: 'Stockholm',
      postalCode: '163 53',
      country: 'SE',
    },
    // Geo coordinates for Spånga, Stockholm
    geo: {
      latitude: 59.3833,
      longitude: 17.8981,
    },
    openingHours: [
      { day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '20:00' },
      { day: ['Saturday', 'Sunday'], opens: '11:00', closes: '19:00' },
    ],
    priceRange: '$$',
    socialMedia: [
      'https://www.facebook.com/AnmolWholesale',
    ],
    foundingDate: '2010',
    types: ['WholesaleStore', 'Wholesaler', 'LocalBusiness', 'Organization'],
  });
}

/**
 * Full-featured Anmol Wholesale Organization Schema
 * Includes B2B delivery services, payment methods, and service areas
 */
export function anmolWholesaleOrganizationSchemaFull(baseUrl: string = 'https://restaurantpack.se'): Organization {
  const baseSchema = anmolWholesaleOrganizationSchema(baseUrl);

  return {
    ...baseSchema,

    slogan: 'Kitchen to Kitchen',

    // B2B Payment methods
    paymentAccepted: [
      'Credit Card',
      'Debit Card',
      'Visa',
      'MasterCard',
      'Apple Pay',
      'Google Pay',
      'Stripe',
      'Bank Transfer',
      'Invoice (Net 30/60 for verified businesses)',
    ],
    currenciesAccepted: 'SEK, EUR, NOK, DKK',

    // Products/Categories offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'B2B Restaurant Supply & Wholesale',
      description: 'Complete range of Indo-Pak products, bulk ingredients, and professional kitchen equipment including Anmol Electric Tandoor',
    },

    // Knowledge areas - Swedish & English for local SEO
    knowsAbout: [
      'Restaurang Grossist Stockholm',
      'Storköksvaror Grossist',
      'Indiska Kryddor Grossist',
      'Basmati Ris Storpack',
      'Elektrisk Tandoor',
      'Wholesale Food Distribution',
      'Restaurant Supplies Sweden',
      'Indo-Pak Products',
      'Bulk Ingredients',
      'Anmol Electric Tandoor',
      'Basmati Rice Wholesale',
      'Professional Kitchen Equipment',
      'B2B Foodservice',
      'Catering Supplies',
      'Halal Kött Stockholm',
    ],

    // Additional B2B properties - Primary focus on Stockholm, then Sweden, then Scandinavia
    areaServed: [
      {
        '@type': 'City',
        name: 'Stockholm',
        containedInPlace: {
          '@type': 'Country',
          name: 'Sweden',
        },
      },
      {
        '@type': 'State',
        name: 'Stockholm County',
        containedInPlace: {
          '@type': 'Country',
          name: 'Sweden',
        },
      },
      {
        '@type': 'Country',
        name: 'Sweden',
      },
      {
        '@type': 'Country',
        name: 'Norway',
      },
      {
        '@type': 'Country',
        name: 'Denmark',
      },
      {
        '@type': 'Country',
        name: 'Finland',
      },
      {
        '@type': 'Country',
        name: 'Germany',
      },
    ],

    // Affiliated organization
    parentOrganization: {
      '@type': 'Organization',
      name: 'Anmol Sweets & Restaurant',
      legalName: 'Anmol AB',
      url: 'https://anmolsweets.se',
    },

    // Manufacturer credentials - Defined as a Product that the organization makes
    // Fixed: Added 'offers' to satisfy Google rich snippet requirements
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Anmol Electric Tandoor',
        description: 'Professional electric tandoor for restaurants and commercial kitchens',
        image: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/anmol-tandoor-Photoroom.jpg',
        sku: 'ANM-TND-001',
        mpn: 'ANM-TND-001',
        brand: {
          '@type': 'Brand',
          name: 'Anmol'
        },
        offers: {
          '@type': 'Offer',
          price: '450',
          priceCurrency: 'SEK',
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/product/anmol-electric-tandoor`
        }
      }
    },
  };
}


