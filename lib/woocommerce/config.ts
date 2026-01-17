/**
 * WooCommerce REST API Configuration
 *
 * This file contains all configuration settings for the WooCommerce REST API v3 integration.
 * It handles API URLs, authentication, endpoints, and caching strategies.
 */

// WooCommerce API Base Configuration
// Note: Hostinger only passes NEXT_PUBLIC_* variables to runtime, so we check both
export const WC_API_CONFIG = {
  // API Base URL - Check server-side first, then NEXT_PUBLIC fallback
  baseUrl: `${process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3`,

  // Authentication credentials - Check server-side first, then NEXT_PUBLIC fallback
  // (Hostinger doesn't pass non-NEXT_PUBLIC vars to Node.js runtime)
  auth: {
    consumerKey: process.env.WORDPRESS_CONSUMER_KEY
      || process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY
      || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY
      || '',
    consumerSecret: process.env.WORDPRESS_CONSUMER_SECRET
      || process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET
      || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET
      || '',
  },

  // WooCommerce REST API v3 Endpoints
  endpoints: {
    // Products
    products: '/products',
    productById: (id: number) => `/products/${id}`,
    productBySlug: (slug: string) => `/products?slug=${slug}`,
    productVariations: (productId: number) => `/products/${productId}/variations`,
    productVariationById: (productId: number, variationId: number) =>
      `/products/${productId}/variations/${variationId}`,
    productReviews: '/products/reviews',
    productReviewsByProduct: (productId: number) => `/products/reviews?product=${productId}`,

    // Product Categories
    productCategories: '/products/categories',
    productCategoryById: (id: number) => `/products/categories/${id}`,
    productCategoryBySlug: (slug: string) => `/products/categories?slug=${slug}`,

    // Product Tags
    productTags: '/products/tags',
    productTagById: (id: number) => `/products/tags/${id}`,
    productTagBySlug: (slug: string) => `/products/tags?slug=${slug}`,

    // Product Attributes
    productAttributes: '/products/attributes',
    productAttributeById: (id: number) => `/products/attributes/${id}`,
    productAttributeTerms: (attributeId: number) => `/products/attributes/${attributeId}/terms`,

    // Orders
    orders: '/orders',
    orderById: (id: number) => `/orders/${id}`,

    // Customers
    customers: '/customers',
    customerById: (id: number) => `/customers/${id}`,
    customerByEmail: (email: string) => `/customers?email=${email}`,

    // Coupons
    coupons: '/coupons',
    couponById: (id: number) => `/coupons/${id}`,
    couponByCode: (code: string) => `/coupons?code=${code}`,

    // Payment Gateways
    paymentGateways: '/payment_gateways',
    paymentGatewayById: (id: string) => `/payment_gateways/${id}`,

    // Shipping
    shippingZones: '/shipping/zones',
    shippingZoneById: (id: number) => `/shipping/zones/${id}`,
    shippingMethods: '/shipping_methods',

    // Tax
    taxRates: '/taxes',
    taxClasses: '/taxes/classes',

    // Settings
    settings: '/settings',
    settingsByGroup: (group: string) => `/settings/${group}`,
  },

  // Cache configuration (in seconds)
  cache: {
    // Product caching
    products: 1800, // 30 minutes
    productDetail: 3600, // 1 hour
    productVariations: 1800, // 30 minutes

    // Category/Tag caching
    categories: 3600, // 1 hour
    tags: 3600, // 1 hour

    // No cache for user-specific data
    cart: 0,
    orders: 0,
    customers: 0,

    // Settings cache
    settings: 86400, // 24 hours
    paymentGateways: 86400, // 24 hours
    shippingMethods: 86400, // 24 hours
  },

  // Default query parameters
  defaults: {
    perPage: 20,
    orderBy: 'date',
    order: 'desc',
  },

  // Pagination limits
  limits: {
    maxPerPage: 100,
    defaultPerPage: 20,
  },
} as const;

/**
 * Get the full API URL for a given endpoint
 */
export function getWooCommerceUrl(endpoint: string): string {
  return `${WC_API_CONFIG.baseUrl}${endpoint}`;
}

/**
 * Generate Basic Auth header for WooCommerce API
 * Uses Base64 encoding of consumer_key:consumer_secret
 * Note: Hostinger only passes NEXT_PUBLIC_* variables to runtime, so we check both
 */
export function getWooCommerceAuthHeader(): string {
  // Read environment variables - check NEXT_PUBLIC_ versions as fallback (Hostinger compatible)
  const consumerKey = process.env.WORDPRESS_CONSUMER_KEY
    || process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY
    || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;

  const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET
    || process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET
    || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    console.error('Missing WC credentials:', {
      hasKey: !!consumerKey,
      hasSecret: !!consumerSecret,
      nodeEnv: process.env.NODE_ENV,
      // Debug which vars are available
      WORDPRESS_CONSUMER_KEY: !!process.env.WORDPRESS_CONSUMER_KEY,
      NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY: !!process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY,
    });
    throw new Error(
      'WooCommerce API credentials are not configured. Please set WORDPRESS_CONSUMER_KEY (or NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY) environment variables.'
    );
  }

  // Create base64 encoded string of key:secret
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Validate WooCommerce configuration
 */
export function validateWooCommerceConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for server-side WORDPRESS_URL (preferred) or fallback to NEXT_PUBLIC_WORDPRESS_URL
  if (!process.env.WORDPRESS_URL && !process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    errors.push('WORDPRESS_URL (or NEXT_PUBLIC_WORDPRESS_URL) is not set');
  }

  if (!process.env.WORDPRESS_CONSUMER_KEY) {
    errors.push('WORDPRESS_CONSUMER_KEY is not set');
  }

  if (!process.env.WORDPRESS_CONSUMER_SECRET) {
    errors.push('WORDPRESS_CONSUMER_SECRET is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
