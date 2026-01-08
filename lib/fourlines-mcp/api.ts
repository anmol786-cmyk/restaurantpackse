/**
 * Fourlines MCP API Client
 *
 * Core API functions for making authenticated requests to the Fourlines MCP plugin.
 * Handles authentication, caching, error handling, and response parsing.
 */

import { FOURLINES_MCP_CONFIG, getFourlinesAuthHeaders, buildQueryString } from './config';

/**
 * Custom error class for Fourlines MCP API errors
 */
export class FourlinesMCPError extends Error {
  status: number;
  code: string;
  details?: Record<string, any>;

  constructor(
    status: number,
    message: string,
    code: string = 'fourlines_mcp_error',
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'FourlinesMCPError';
    this.status = status;
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FourlinesMCPError);
    }
  }
}

/**
 * Parse Fourlines MCP error response
 */
function parseFourlinesError(status: number, errorData: any): FourlinesMCPError {
  if (errorData && typeof errorData === 'object') {
    return new FourlinesMCPError(
      status,
      errorData.message || 'Fourlines MCP API request failed',
      errorData.code || 'fourlines_mcp_error',
      errorData.data
    );
  }

  return new FourlinesMCPError(status, 'Fourlines MCP API request failed');
}

/**
 * Generic Fourlines MCP API fetch function with authentication
 *
 * Server-side only function due to API key.
 * For client-side requests, use Next.js API routes.
 */
export async function fetchFourlinesMCP<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Validate server-side execution
  if (typeof window !== 'undefined') {
    throw new Error(
      'fetchFourlinesMCP should only be called server-side. Use Next.js API routes for client-side requests.'
    );
  }

  const url = `${FOURLINES_MCP_CONFIG.baseUrl}${endpoint}`;

  try {
    // Get authentication headers
    const authHeaders = getFourlinesAuthHeaders();

    // Merge headers
    const headers: HeadersInit = {
      ...authHeaders,
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

      throw parseFourlinesError(response.status, errorData);
    }

    // Parse and return JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Re-throw FourlinesMCPError
    if (error instanceof FourlinesMCPError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new FourlinesMCPError(0, `Network error: ${error.message}`, 'network_error');
    }

    // Handle unknown errors
    throw new FourlinesMCPError(
      500,
      error instanceof Error ? error.message : 'Unknown error occurred',
      'unknown_error'
    );
  }
}

/**
 * Fetch with caching support using Next.js cache
 */
export async function fetchFourlinesCached<T>(
  endpoint: string,
  cacheTime: number = FOURLINES_MCP_CONFIG.cache.products,
  tags: string[] = ['fourlines-mcp'],
  options: RequestInit = {}
): Promise<T> {
  const mergedOptions: RequestInit = {
    ...options,
    next: {
      revalidate: cacheTime,
      tags: [...tags, 'fourlines-mcp'],
      ...options.next,
    },
  };

  return fetchFourlinesMCP<T>(endpoint, mergedOptions);
}

/**
 * Fetch paginated data
 * Returns both data and pagination info
 */
export async function fetchFourlinesPaginated<T>(
  endpoint: string,
  params: Record<string, any> = {},
  cacheTime?: number,
  tags?: string[]
): Promise<{
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages?: number;
}> {
  // Build query string
  const queryString = buildQueryString({
    per_page: params.per_page || params.perPage || FOURLINES_MCP_CONFIG.defaults.perPage,
    page: params.page || FOURLINES_MCP_CONFIG.defaults.page,
    ...params,
  });

  const url = `${endpoint}${queryString}`;

  const fetchOptions: RequestInit = {};

  // Add caching if specified
  if (cacheTime !== undefined) {
    fetchOptions.next = {
      revalidate: cacheTime,
      tags: [...(tags || []), 'fourlines-mcp'],
    };
  }

  const response = await fetchFourlinesMCP<{ items: T[]; total: number }>(url, fetchOptions);

  return {
    items: response.items || [],
    total: response.total || 0,
    page: params.page || 1,
    perPage: params.per_page || params.perPage || FOURLINES_MCP_CONFIG.defaults.perPage,
    totalPages: response.total
      ? Math.ceil(response.total / (params.per_page || params.perPage || FOURLINES_MCP_CONFIG.defaults.perPage))
      : undefined,
  };
}

/**
 * Create a new resource (POST request)
 */
export async function createFourlinesResource<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return fetchFourlinesMCP<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a resource (PUT request)
 */
export async function updateFourlinesResource<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return fetchFourlinesMCP<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a resource (DELETE request)
 */
export async function deleteFourlinesResource<T>(endpoint: string): Promise<T> {
  return fetchFourlinesMCP<T>(endpoint, {
    method: 'DELETE',
  });
}

/**
 * Helper function to handle API errors gracefully
 * Returns null on error and logs the error
 */
export async function fetchFourlinesSafe<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    return await fetchFourlinesMCP<T>(endpoint, options);
  } catch (error) {
    if (error instanceof FourlinesMCPError) {
      console.error(`Fourlines MCP API Error: ${error.message}`, {
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
 * Check if Fourlines MCP API is accessible
 */
export async function checkFourlinesConnection(): Promise<{
  connected: boolean;
  message: string;
  version?: string;
}> {
  try {
    const response = await fetchFourlinesMCP<{ status: string; version: string }>(
      FOURLINES_MCP_CONFIG.endpoints.health
    );

    return {
      connected: response.status === 'ok',
      message: 'Successfully connected to Fourlines MCP API',
      version: response.version,
    };
  } catch (error) {
    if (error instanceof FourlinesMCPError) {
      return {
        connected: false,
        message: `Fourlines MCP API Error: ${error.message} (Status: ${error.status})`,
      };
    }
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
