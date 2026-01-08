/**
 * WooCommerce REST API Base Functions
 *
 * Core API functions for making authenticated requests to the WooCommerce REST API v3.
 * Handles authentication, caching, error handling, and response parsing.
 */

import { WC_API_CONFIG, getWooCommerceAuthHeader, buildQueryString } from './config';
import type { WooCommerceError } from '@/types/woocommerce';

/**
 * Custom error class for WooCommerce API errors
 */
export class WooCommerceAPIError extends Error {
  status: number;
  code: string;
  details?: Record<string, any>;

  constructor(status: number, message: string, code: string = 'woocommerce_api_error', details?: Record<string, any>) {
    super(message);
    this.name = 'WooCommerceAPIError';
    this.status = status;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WooCommerceAPIError);
    }
  }
}

/**
 * Parse WooCommerce error response
 */
function parseWooCommerceError(status: number, errorData: any): WooCommerceAPIError {
  if (errorData && typeof errorData === 'object') {
    const wcError = errorData as WooCommerceError;
    return new WooCommerceAPIError(
      status,
      wcError.message || 'WooCommerce API request failed',
      wcError.code || 'woocommerce_api_error',
      wcError.data?.details
    );
  }

  return new WooCommerceAPIError(status, 'WooCommerce API request failed');
}

/**
 * Generic WooCommerce API fetch function with authentication
 *
 * This is a server-side only function due to API credentials.
 * For client-side requests, use Next.js API routes.
 *
 * @param endpoint - API endpoint (e.g., '/products' or '/products/123')
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function fetchWooCommerceAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Validate that we're running server-side
  if (typeof window !== 'undefined') {
    throw new Error(
      'fetchWooCommerceAPI should only be called server-side. Use Next.js API routes for client-side requests.'
    );
  }

  const url = `${WC_API_CONFIG.baseUrl}${endpoint}`;

  try {
    // Get authentication header
    const authHeader = getWooCommerceAuthHeader();

    // Merge headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      ...options.headers,
    };

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw parseWooCommerceError(response.status, errorData);
    }

    // Parse and return JSON
    const data = await response.json();
    return data as T;

  } catch (error) {
    // Re-throw WooCommerceAPIError
    if (error instanceof WooCommerceAPIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new WooCommerceAPIError(
        0,
        `Network error: ${error.message}`,
        'network_error'
      );
    }

    // Handle unknown errors
    throw new WooCommerceAPIError(
      500,
      error instanceof Error ? error.message : 'Unknown error occurred',
      'unknown_error'
    );
  }
}

/**
 * Fetch with caching support using Next.js cache
 *
 * @param endpoint - API endpoint
 * @param cacheTime - Cache duration in seconds (0 = no cache)
 * @param tags - Cache tags for granular revalidation
 * @param options - Additional fetch options
 * @returns Parsed JSON response
 */
export async function fetchWooCommerceCached<T>(
  endpoint: string,
  cacheTime: number = WC_API_CONFIG.cache.products,
  tags: string[] = ['woocommerce'],
  options: RequestInit = {}
): Promise<T> {
  const mergedOptions: RequestInit = {
    ...options,
    next: {
      revalidate: cacheTime,
      tags: [...tags, 'woocommerce'],
      ...options.next,
    },
  };

  return fetchWooCommerceAPI<T>(endpoint, mergedOptions);
}

/**
 * Fetch paginated data with headers
 *
 * Returns both data and pagination info from response headers
 */
export async function fetchWooCommercePaginated<T>(
  endpoint: string,
  params: Record<string, any> = {},
  cacheTime?: number,
  tags?: string[]
): Promise<{
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}> {
  // Build query string
  const queryString = buildQueryString({
    per_page: params.per_page || WC_API_CONFIG.defaults.perPage,
    page: params.page || 1,
    ...params,
  });

  const url = `${WC_API_CONFIG.baseUrl}${endpoint}${queryString}`;

  try {
    const authHeader = getWooCommerceAuthHeader();

    const fetchOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    };

    // Add caching if specified
    if (cacheTime !== undefined) {
      fetchOptions.next = {
        revalidate: cacheTime,
        tags: [...(tags || []), 'woocommerce'],
      };
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw parseWooCommerceError(response.status, errorData);
    }

    // Get pagination info from headers
    const total = parseInt(response.headers.get('x-wp-total') || '0', 10);
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1', 10);

    const data = await response.json();

    return {
      data: data as T[],
      total,
      totalPages,
      currentPage: params.page || 1,
      perPage: params.per_page || WC_API_CONFIG.defaults.perPage,
    };

  } catch (error) {
    if (error instanceof WooCommerceAPIError) {
      throw error;
    }

    throw new WooCommerceAPIError(
      500,
      error instanceof Error ? error.message : 'Failed to fetch paginated data',
      'pagination_error'
    );
  }
}

/**
 * Create a new resource (POST request)
 */
export async function createWooCommerceResource<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return fetchWooCommerceAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a resource (PUT request)
 */
export async function updateWooCommerceResource<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return fetchWooCommerceAPI<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a resource (PATCH request)
 */
export async function patchWooCommerceResource<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return fetchWooCommerceAPI<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a resource (DELETE request)
 */
export async function deleteWooCommerceResource<T>(
  endpoint: string,
  force: boolean = false
): Promise<T> {
  const queryString = force ? '?force=true' : '';
  return fetchWooCommerceAPI<T>(`${endpoint}${queryString}`, {
    method: 'DELETE',
  });
}

/**
 * Batch operations
 * Allows creating, updating, and deleting multiple resources in a single request
 */
export async function batchWooCommerceResources<T>(
  endpoint: string,
  operations: {
    create?: Record<string, any>[];
    update?: Record<string, any>[];
    delete?: number[];
  }
): Promise<{
  create?: T[];
  update?: T[];
  delete?: T[];
}> {
  return fetchWooCommerceAPI<{
    create?: T[];
    update?: T[];
    delete?: T[];
  }>(`${endpoint}/batch`, {
    method: 'POST',
    body: JSON.stringify(operations),
  });
}

/**
 * Helper function to handle API errors gracefully
 * Returns null on error and logs the error
 */
export async function fetchWooCommerceSafe<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    return await fetchWooCommerceAPI<T>(endpoint, options);
  } catch (error) {
    if (error instanceof WooCommerceAPIError) {
      console.error(`WooCommerce API Error: ${error.message}`, {
        status: error.status,
        code: error.code,
        endpoint,
      });
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

/**
 * Check if WooCommerce API is accessible
 * Useful for health checks
 */
export async function checkWooCommerceConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  try {
    // Try to fetch system status or a simple endpoint
    await fetchWooCommerceAPI('/system_status');
    return {
      connected: true,
      message: 'Successfully connected to WooCommerce API',
    };
  } catch (error) {
    if (error instanceof WooCommerceAPIError) {
      return {
        connected: false,
        message: `WooCommerce API Error: ${error.message} (Status: ${error.status})`,
      };
    }
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
