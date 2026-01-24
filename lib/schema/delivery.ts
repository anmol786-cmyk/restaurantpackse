/**
 * Delivery Service Schema Generator
 * Creates DeliveryService and Service schemas for delivery information pages
 */

import type { Organization, Service } from './types';
import { cleanSchema } from './base';

/**
 * Generate Stockholm Delivery Service Schema
 * For /delivery-information page
 */
export function stockholmDeliveryServiceSchema(baseUrl: string = 'https://restaurantpack.se') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#stockholm-delivery-service`,
    name: 'Stockholm B2B Delivery Service',
    description: 'Free delivery on bulk orders over 500 SEK to all of Stockholm. Same-day delivery available to nearby areas.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Anmol Wholesale',
    },
    serviceType: 'Wholesale Delivery',
    areaServed: [
      {
        '@type': 'City',
        name: 'Stockholm',
      },
      {
        '@type': 'Place',
        name: 'Spånga',
      },
      {
        '@type': 'Place',
        name: 'Kista',
      },
      {
        '@type': 'Place',
        name: 'Solna',
      },
      {
        '@type': 'Place',
        name: 'Sundbyberg',
      },
      {
        '@type': 'Place',
        name: 'Bromma',
      },
      {
        '@type': 'Place',
        name: 'Järfälla',
      },
      {
        '@type': 'Place',
        name: 'Vällingby',
      },
      {
        '@type': 'Place',
        name: 'Hässelby',
      },
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'FREE Stockholm B2B Delivery',
        description: 'Free delivery for wholesale orders 5,000 SEK and above in our primary coverage zone',
        price: '0',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          minPrice: 5000,
          priceCurrency: 'SEK',
        },
      },
      {
        '@type': 'Offer',
        name: 'Standard B2B Pallet Freight',
        description: 'Fixed rate pallet shipping for businesses within greater Stockholm',
        price: '495',
        priceCurrency: 'SEK',
      },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46769178456',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Europe Delivery Service Schema
 * For /europe-delivery page
 */
export function europeDeliveryServiceSchema(baseUrl: string = 'https://restaurantpack.se') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#europe-delivery-service`,
    name: 'Europe-Wide B2B Delivery Service',
    description: 'Authentic Indo-Pak products and restaurant supplies delivered across Europe via DHL. No minimum order, no customs hassle within EU.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Anmol Wholesale',
    },
    serviceType: 'International Wholesale Delivery',
    areaServed: {
      '@type': 'Continent',
      name: 'Europe',
    },
    offers: {
      '@type': 'Offer',
      name: 'DHL Europe Delivery',
      description: 'DHL shipping to all European countries. Rates calculated at checkout based on weight and destination.',
      priceCurrency: 'SEK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'SEK',
        description: 'DHL rates calculated at checkout based on weight and destination',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46769178456',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
    additionalType: 'https://schema.org/DeliveryEvent',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  };

  return cleanSchema(schema);
}



/**
 * Generate FAQ Page Schema for Delivery
 */
export function deliveryFAQSchema(baseUrl: string = 'https://restaurantpack.se') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the minimum order for wholesale delivery in Stockholm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For our own Anmol fleet delivery in Stockholm, we offer free shipping on wholesale orders over 5,000 SEK. For smaller orders, pallet freight rates apply or you can choose Ex-Warehouse pickup from Spånga.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I pick up my wholesale order directly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. We offer Ex-Warehouse pickup from our facility at Fagerstagatan 13, Spånga. This is often the most cost-effective option for local restaurants and grocery stores.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver bulk supplies to all of Europe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we ship wholesale quantities across Europe via DHL Freight. Minimum order for international shipping is 5,000 SEK. Since we are based in Sweden, there are no customs duties for EU destinations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you handle pallet shipments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are experts in pallet logistics. Bulk orders are securely packed on standard Euro-pallets and shipped via DHL or our own fleet with tail-lift trucks for easy unloading at your restaurant or warehouse.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I track my wholesale freight?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all shipments including pallet freight are fully trackable. You will receive a tracking link via our B2B portal or email as soon as the carrier scans the shipment.',
        },
      },
    ],
  };
}
