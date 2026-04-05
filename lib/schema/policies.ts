/**
 * MerchantReturnPolicy & OfferShippingDetails Schema Generators
 * Required by Google Merchant Center / Search Console for shopping eligibility
 */

/**
 * Anmol Wholesale Return Policy Schema
 * 14-day return window, in-store and by post, customer-paid return shipping
 */
export function merchantReturnPolicySchema(baseUrl: string = 'https://restaurantpack.se') {
  return {
    '@context': 'https://schema.org',
    '@type': 'MerchantReturnPolicy',
    '@id': `${baseUrl}/#return-policy`,
    name: 'Anmol Wholesale Return Policy',
    url: `${baseUrl}/refund-return`,
    description: '14-day return window for eligible non-perishable items. In-person returns at Spånga warehouse or by post.',
    applicableCountry: ['SE', 'NO', 'DK', 'FI', 'DE'],
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: [
      'https://schema.org/ReturnInStore',
      'https://schema.org/ReturnByMail',
    ],
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    merchantReturnLink: `${baseUrl}/refund-return`,
    refundType: 'https://schema.org/FullRefund',
    itemCondition: 'https://schema.org/NewCondition',
  };
}

/**
 * Anmol Wholesale Shipping Details Schema
 * Free shipping in Stockholm on orders 5000+ SEK, DHL/PostNord for rest of Sweden
 */
export function offerShippingDetailsSchema(baseUrl: string = 'https://restaurantpack.se') {
  return [
    // Free Stockholm delivery (orders ≥ 5000 SEK)
    {
      '@type': 'OfferShippingDetails',
      '@id': `${baseUrl}/#shipping-stockholm-free`,
      shippingLabel: 'Free B2B Delivery – Stockholm Region',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'SEK',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'SE',
        addressRegion: 'Stockholm',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 1,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 2,
          unitCode: 'DAY',
        },
      },
      doesNotShip: false,
    },
    // Standard Sweden delivery (DHL / PostNord / DB Schenker)
    {
      '@type': 'OfferShippingDetails',
      '@id': `${baseUrl}/#shipping-sweden-standard`,
      shippingLabel: 'B2B Freight – Sweden (DHL / PostNord / DB Schenker)',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '199',
        currency: 'SEK',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'SE',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 1,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 2,
          maxValue: 5,
          unitCode: 'DAY',
        },
      },
      doesNotShip: false,
    },
    // Europe (Scandinavia + Germany)
    {
      '@type': 'OfferShippingDetails',
      '@id': `${baseUrl}/#shipping-europe`,
      shippingLabel: 'B2B Freight – Europe (Scandinavia & Germany)',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '499',
        currency: 'SEK',
      },
      shippingDestination: [
        { '@type': 'DefinedRegion', addressCountry: 'NO' },
        { '@type': 'DefinedRegion', addressCountry: 'DK' },
        { '@type': 'DefinedRegion', addressCountry: 'FI' },
        { '@type': 'DefinedRegion', addressCountry: 'DE' },
      ],
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 2,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 3,
          maxValue: 7,
          unitCode: 'DAY',
        },
      },
      doesNotShip: false,
    },
  ];
}
