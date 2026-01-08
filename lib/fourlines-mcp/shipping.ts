/**
 * Fourlines MCP Shipping API
 *
 * Functions for fetching shipping zones, methods, and calculating shipping costs.
 */

import { FOURLINES_MCP_CONFIG } from './config';
import { fetchFourlinesMCP, fetchFourlinesCached } from './api';

/**
 * Shipping Zone interface
 */
export interface ShippingZone {
  id: number;
  name: string;
  order: number;
  locations: Array<{
    code: string;
    type: string;
  }>;
}

/**
 * Shipping Method interface
 */
export interface ShippingMethod {
  id: string;
  instance_id: number;
  method_id: string;
  method_title: string;
  title: string;
  enabled: boolean;
  settings: Record<string, any>;
  cost?: number;
  total_cost?: number;
  label?: string;
}

/**
 * Shipping Calculation Request
 */
export interface ShippingCalculationRequest {
  postcode: string;
  city?: string;
  state?: string;
  country?: string;
  cart_total?: number;
  items?: Array<{
    product_id: number;
    quantity: number;
    variation_id?: number;
  }>;
}

/**
 * Shipping Calculation Response
 */
export interface ShippingCalculationResponse {
  available_methods: ShippingMethod[];
  zone: ShippingZone | null;
  restricted_products?: Array<{
    product_id: number;
    product_name: string;
    reason: string;
  }>;
}

/**
 * Get all shipping zones
 */
export async function getShippingZones(): Promise<ShippingZone[]> {
  try {
    const response = await fetchFourlinesCached<{ zones: ShippingZone[] }>(
      FOURLINES_MCP_CONFIG.endpoints.shippingZones,
      FOURLINES_MCP_CONFIG.cache.products, // Cache for 30 minutes
      ['shipping', 'zones']
    );

    return response.zones || [];
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return [];
  }
}

/**
 * Get a specific shipping zone by ID
 */
export async function getShippingZoneById(zoneId: number): Promise<ShippingZone | null> {
  try {
    const response = await fetchFourlinesCached<ShippingZone>(
      FOURLINES_MCP_CONFIG.endpoints.shippingZoneById(zoneId),
      FOURLINES_MCP_CONFIG.cache.products,
      ['shipping', `zone-${zoneId}`]
    );

    return response;
  } catch (error) {
    console.error(`Error fetching shipping zone ${zoneId}:`, error);
    return null;
  }
}

/**
 * Get all shipping methods
 */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const response = await fetchFourlinesCached<{ methods: ShippingMethod[] }>(
      FOURLINES_MCP_CONFIG.endpoints.shippingMethods,
      FOURLINES_MCP_CONFIG.cache.products,
      ['shipping', 'methods']
    );

    return response.methods || [];
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return [];
  }
}

/**
 * Get shipping methods for a specific zone
 */
export async function getShippingMethodsForZone(zoneId: number): Promise<ShippingMethod[]> {
  try {
    const response = await fetchFourlinesCached<{ methods: ShippingMethod[] }>(
      FOURLINES_MCP_CONFIG.endpoints.shippingZoneMethods(zoneId),
      FOURLINES_MCP_CONFIG.cache.products,
      ['shipping', `zone-${zoneId}-methods`]
    );

    return response.methods || [];
  } catch (error) {
    console.error(`Error fetching shipping methods for zone ${zoneId}:`, error);
    return [];
  }
}

/**
 * Calculate shipping costs for a given address and cart
 * This is the main function to use in checkout
 */
export async function calculateShipping(
  request: ShippingCalculationRequest
): Promise<ShippingCalculationResponse> {
  try {
    const response = await fetchFourlinesMCP<ShippingCalculationResponse>(
      FOURLINES_MCP_CONFIG.endpoints.calculateShipping,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    return response;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return {
      available_methods: [],
      zone: null,
      restricted_products: [],
    };
  }
}

/**
 * Helper function to format shipping method for display
 */
export function formatShippingMethod(method: ShippingMethod): {
  id: string;
  method_id: string;
  title: string;
  label: string;
  cost: number;
  total_cost: number;
} {
  return {
    id: method.id || `${method.instance_id}`,
    method_id: method.method_id,
    title: method.method_title,
    label: method.title || method.method_title,
    cost: method.cost || 0,
    total_cost: method.total_cost || method.cost || 0,
  };
}
