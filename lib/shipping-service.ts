/**
 * Shipping Service for Restaurant Pack
 * Handles all shipping calculations and validations via WooCommerce REST API
 */

export interface ShippingMethod {
  id: string;
  method_id: string;
  label: string;
  cost: number;
  total_cost: number;
  tax: number;
  meta_data: Record<string, any>;
}

export interface RestrictedProduct {
  product_id: number;
  product_name: string;
  reason: string;
}

export interface ShippingCalculationResult {
  success: boolean;
  cart_subtotal?: number;
  cart_weight?: number;
  available_methods?: ShippingMethod[];
  restricted_products?: RestrictedProduct[];
  free_shipping_threshold?: number;
  free_shipping_available?: boolean;
  amount_to_free_shipping?: number;
  minimum_order?: number;
  minimum_order_met?: boolean;
  error?: string;
  message?: string;
  amount_needed?: number;
}

export interface CartItem {
  productId: number;
  variationId?: number;
  quantity: number;
}

export interface ShippingZone {
  id: number;
  zone_name: string;
  zone_locations: any[];
  shipping_methods: any[];
}

export interface ShippingZonesResult {
  success: boolean;
  zones?: ShippingZone[];
}

export interface ShippingValidationResult {
  success: boolean;
  valid: boolean;
  restricted_products?: RestrictedProduct[];
  minimum_order_met?: boolean;
  minimum_order_required?: number;
  cart_subtotal?: number;
}

/**
 * Calculate shipping for cart items and address via WooCommerce
 */
export async function calculateShipping(
  items: CartItem[],
  postcode: string,
  city: string = '',
  country: string = 'SE'
): Promise<ShippingCalculationResult> {
  try {
    const requestBody = {
      items: items.map(item => ({
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
      })),
      postcode,
      city,
      country,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 Calling Next.js shipping API:', requestBody);
    }

    // Call Next.js API route (server-side proxy to WordPress)
    const response = await fetch('/api/shipping/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 API Response Status:', response.status);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Shipping calculation error:', errorData);
      return {
        success: false,
        available_methods: [],
        restricted_products: [],
        error: errorData.error || 'Failed to calculate shipping',
      };
    }

    const data = await response.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Shipping API Response:', data);
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to calculate shipping:', error);
    return {
      success: false,
      available_methods: [],
      restricted_products: [],
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get all available shipping zones via WooCommerce REST API
 * Note: This function is primarily used server-side. For client-side, use the API routes.
 */
export async function getShippingZones(): Promise<ShippingZonesResult> {
  try {
    // Use internal API route for shipping zones
    const response = await fetch('/api/shipping/zones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch shipping zones');
      return {
        success: false,
        zones: [],
      };
    }

    const data = await response.json();
    return {
      success: true,
      zones: data.zones || [],
    };
  } catch (error) {
    console.error('Failed to fetch shipping zones:', error);
    return {
      success: false,
      zones: [],
    };
  }
}

/**
 * Validate shipping for cart items and address via WooCommerce postcode validation
 */
export async function validateShipping(
  items: CartItem[],
  postcode: string,
  city: string = '',
  country: string = 'SE'
): Promise<ShippingValidationResult> {
  try {
    // Use the internal API route for postcode validation
    const response = await fetch('/api/shipping/validate-postcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postcode,
        country,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Shipping validation error:', errorData);
      return {
        success: false,
        valid: false,
        restricted_products: [],
      };
    }

    const data = await response.json();
    return {
      success: true,
      valid: data.valid || false,
      restricted_products: [],
      minimum_order_met: true,
      minimum_order_required: 0,
    };
  } catch (error) {
    console.error('Failed to validate shipping:', error);
    return {
      success: false,
      valid: false,
      restricted_products: [],
    };
  }
}

/**
 * Format shipping cost for display
 */
export function formatShippingCost(cost: number): string {
  if (cost === 0) {
    return 'Free';
  }
  return `${cost.toFixed(2)} kr`;
}

/**
 * Check if postcode is in Stockholm area
 */
export function isStockholmPostcode(postcode: string): boolean {
  const normalized = postcode.replace(/\s+/g, '');
  const prefix = normalized.substring(0, 3);

  if (prefix.length < 3 || !/^\d+$/.test(prefix)) {
    return false;
  }

  const prefixNum = parseInt(prefix, 10);
  return prefixNum >= 100 && prefixNum <= 199;
}

/**
 * Validate Swedish postcode format
 */
export function validateSwedishPostcode(postcode: string): boolean {
  // Swedish postcodes: 5 digits, optionally with space after 3rd digit
  // Examples: 12345, 123 45
  const normalized = postcode.replace(/\s+/g, '');
  return /^\d{5}$/.test(normalized);
}

/**
 * Format Swedish postcode (add space after 3rd digit)
 */
export function formatSwedishPostcode(postcode: string): string {
  const normalized = postcode.replace(/\s+/g, '');
  if (normalized.length === 5) {
    return `${normalized.substring(0, 3)} ${normalized.substring(3)}`;
  }
  return postcode;
}
