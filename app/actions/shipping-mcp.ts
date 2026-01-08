'use server';

/**
 * Server actions for MCP Shipping API
 */

import {
  calculateShipping,
  getShippingZones,
  getShippingMethodsForZone,
  formatShippingMethod,
  type ShippingCalculationRequest,
  type ShippingMethod,
} from '@/lib/fourlines-mcp/shipping';

export interface CalculateShippingInput {
  postcode: string;
  city?: string;
  state?: string;
  country?: string;
  cart_total?: number;
  items?: Array<{
    productId: number;
    quantity: number;
    variationId?: number;
  }>;
}

export interface CalculateShippingResult {
  success: boolean;
  data?: {
    methods: Array<{
      id: string;
      method_id: string;
      title: string;
      label: string;
      cost: number;
      total_cost: number;
    }>;
    zone_name?: string;
    restricted_products?: Array<{
      product_id: number;
      product_name: string;
      reason: string;
    }>;
  };
  error?: string;
}

/**
 * Calculate shipping costs using MCP API
 */
export async function calculateShippingMCP(
  input: CalculateShippingInput
): Promise<CalculateShippingResult> {
  try {
    // Build the request
    const request: ShippingCalculationRequest = {
      postcode: input.postcode,
      city: input.city,
      state: input.state,
      country: input.country || 'SE', // Default to Sweden
      cart_total: input.cart_total,
      items: input.items?.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        variation_id: item.variationId,
      })),
    };

    // Call MCP shipping calculation
    const response = await calculateShipping(request);

    // Format methods for frontend
    const methods = response.available_methods.map(formatShippingMethod);

    return {
      success: true,
      data: {
        methods,
        zone_name: response.zone?.name,
        restricted_products: response.restricted_products,
      },
    };
  } catch (error) {
    console.error('Error calculating shipping via MCP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate shipping',
    };
  }
}

/**
 * Get all available shipping zones
 */
export async function getShippingZonesAction() {
  try {
    const zones = await getShippingZones();

    return {
      success: true,
      data: zones,
    };
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch shipping zones',
      data: [],
    };
  }
}

/**
 * Get shipping methods for a specific zone
 */
export async function getShippingMethodsForZoneAction(zoneId: number) {
  try {
    const methods = await getShippingMethodsForZone(zoneId);

    return {
      success: true,
      data: methods.map(formatShippingMethod),
    };
  } catch (error) {
    console.error(`Error fetching shipping methods for zone ${zoneId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch shipping methods',
      data: [],
    };
  }
}
