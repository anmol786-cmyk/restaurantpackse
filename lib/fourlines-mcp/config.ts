/**
 * Fourlines MCP API Configuration
 *
 * Configuration for the Fourlines MCP plugin API integration.
 * This replaces the need for WooCommerce Consumer Key/Secret with a single API key.
 */

export const FOURLINES_MCP_CONFIG = {
  // API Base URL
  baseUrl: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/fourlines-mcp/v1`,

  // API Key (server-side only)
  apiKey: process.env.FOURLINES_MCP_KEY || '',

  // API Endpoints
  endpoints: {
    // Health check
    health: '/health',

    // Products
    products: '/products',
    productById: (id: number) => `/products/${id}`,
    productSearch: '/products/search',

    // Posts
    posts: '/posts',
    postById: (id: number) => `/posts/${id}`,

    // Pages
    pages: '/posts', // Uses posts endpoint with type=page

    // Media
    media: '/media',
    mediaById: (id: number) => `/media/${id}`,

    // Orders
    orders: '/orders',
    orderById: (id: number) => `/orders/${id}`,

    // Customers
    customers: '/customers',
    customerById: (id: number) => `/customers/${id}`,

    // Shipping
    shippingZones: '/shipping/zones',
    shippingZoneById: (id: number) => `/shipping/zones/${id}`,
    shippingMethods: '/shipping/methods',
    shippingZoneMethods: (zoneId: number) => `/shipping/zones/${zoneId}/methods`,
    calculateShipping: '/shipping/calculate',

    // Logs (admin only)
    logs: '/logs',

    // Manifest
    manifest: '/manifest',
  },

  // Cache configuration (in seconds)
  cache: {
    products: 1800, // 30 minutes
    productDetail: 3600, // 1 hour
    posts: 3600, // 1 hour
    pages: 86400, // 24 hours
    categories: 3600, // 1 hour
    orders: 0, // No cache
    customers: 0, // No cache
  },

  // Default query parameters
  defaults: {
    perPage: 20,
    page: 1,
  },
} as const;

/**
 * Get authentication headers for Fourlines MCP
 */
export function getFourlinesAuthHeaders(): HeadersInit {
  const apiKey = FOURLINES_MCP_CONFIG.apiKey;

  if (!apiKey) {
    throw new Error(
      'Fourlines MCP API key is not configured. Please set FOURLINES_MCP_KEY environment variable.'
    );
  }

  return {
    'X-Fourlines-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
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
 * Validate Fourlines MCP configuration
 */
export function validateFourlinesConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    errors.push('NEXT_PUBLIC_WORDPRESS_URL is not set');
  }

  if (!process.env.FOURLINES_MCP_KEY) {
    errors.push('FOURLINES_MCP_KEY is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
