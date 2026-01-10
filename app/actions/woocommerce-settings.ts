'use server';

import { getShippingZones, getShippingZoneLocations, validateShippingPostcode, getPaymentGateways, getCoupon } from '@/lib/woocommerce/orders';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

/**
 * Safely parse JSON response, detecting HTML error pages and PHP warnings
 */
async function parseJsonResponse(response: Response): Promise<any> {
    let text = await response.text();

    // Strip PHP warnings/errors that appear before JSON (e.g., <br /><b>Warning</b>...)
    // This happens when WordPress has WP_DEBUG enabled
    const jsonStart = text.search(/^[\[\{]/m);
    if (jsonStart > 0 && text.substring(0, jsonStart).includes('<b>')) {
        console.warn('PHP warnings detected in response, stripping them:', text.substring(0, Math.min(jsonStart, 200)));
        text = text.substring(jsonStart);
    }

    // Check if response is HTML (error page)
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON:', text.substring(0, 200));
        throw new Error(
            `WooCommerce API returned HTML instead of JSON. Status: ${response.status}. ` +
            'This usually means: 1) Invalid API credentials, 2) WordPress REST API is disabled, ' +
            'or 3) Wrong API URL. Check your .env file and WordPress settings.'
        );
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error('Failed to parse response:', text.substring(0, 200));
        throw new Error(`Invalid JSON response from WooCommerce API: ${text.substring(0, 100)}`);
    }
}

/**
 * Get WooCommerce general settings including minimum order amount
 */
export async function getWooCommerceSettings() {
    try {
        const response = await fetch(getWooCommerceUrl('/settings/general'), {
            headers: {
                'Authorization': getWooCommerceAuthHeader(),
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch WooCommerce settings');
        }

        const settings = await parseJsonResponse(response);

        // Extract relevant settings
        const currencySetting = settings.find((s: any) => s.id === 'woocommerce_currency');
        const currency = currencySetting?.value || 'SEK';

        return {
            success: true,
            data: {
                currency,
                settings,
            },
        };
    } catch (error: any) {
        console.error('Error fetching WooCommerce settings:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch settings',
        };
    }
}

/**
 * Get minimum order amount from WooCommerce
 * This checks the general settings for a minimum order amount
 */
export async function getMinimumOrderAmount() {
    try {
        // Try to get from checkout settings first
        const response = await fetch(getWooCommerceUrl('/settings/general'), {
            headers: {
                'Authorization': getWooCommerceAuthHeader(),
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        const settings = await parseJsonResponse(response);

        // Look for minimum order amount setting
        // Note: This might be a custom setting or plugin-specific
        // Common setting IDs: 'woocommerce_minimum_order_amount', 'minimum_order_amount'
        const minAmountSetting = settings.find(
            (s: any) => s.id === 'woocommerce_minimum_order_amount' || s.id === 'minimum_order_amount'
        );

        const minimumAmount = minAmountSetting?.value ? parseFloat(minAmountSetting.value) : 0;

        return {
            success: true,
            data: {
                minimumAmount,
                currency: 'SEK',
            },
        };
    } catch (error: any) {
        console.error('Error fetching minimum order amount:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch minimum order amount',
            data: {
                minimumAmount: 0, // Default to no minimum if error
                currency: 'SEK',
            },
        };
    }
}

/**
 * Validate shipping postcode against WooCommerce shipping zones
 */
export async function validateShippingPostcodeAction(postcode: string, country: string = 'SE') {
    try {
        const result = await validateShippingPostcode(postcode, country);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error validating postcode:', error);
        return {
            success: false,
            error: error.message || 'Failed to validate postcode',
        };
    }
}

/**
 * Get available shipping methods for a specific zone
 */
export async function getShippingMethodsForZone(zoneId: number) {
    try {
        const response = await fetch(
            getWooCommerceUrl(`/shipping/zones/${zoneId}/methods`),
            {
                headers: {
                    'Authorization': getWooCommerceAuthHeader(),
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch shipping methods');
        }

        const methods = await parseJsonResponse(response);
        return { success: true, data: methods };
    } catch (error: any) {
        console.error('Error fetching shipping methods:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch shipping methods',
        };
    }
}

/**
 * Get all available payment gateways
 */
export async function getPaymentGatewaysAction() {
    try {
        const gateways = await getPaymentGateways();
        // Filter only enabled gateways
        const enabledGateways = gateways.filter((g: any) => g.enabled);

        // Add custom Swish QR code image to the description
        const enhancedGateways = enabledGateways.map((gateway: any) => {
            if (gateway.id === 'swish') {
                const swishQRImage = 'https://crm.restaurantpack.se/wp-content/uploads/2025/05/swish.jpg';
                const customDescription = `
                    ${gateway.description || 'Pay with Swish'}
                    <div style="margin-top: 16px; text-align: center;">
                        <p style="margin-bottom: 12px; font-weight: 600; color: #1a472a;">Scan the QR code with your Swish app:</p>
                        <img src="${swishQRImage}" alt="Swish QR Code" style="max-width: 300px; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                        <p style="margin-top: 12px; font-size: 14px; color: #666;">After payment, please confirm via WhatsApp or email.</p>
                    </div>
                `;
                return {
                    ...gateway,
                    description: customDescription,
                };
            }
            return gateway;
        });

        return { success: true, data: enhancedGateways };
    } catch (error: any) {
        console.error('Error fetching payment gateways:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch payment gateways',
        };
    }
}

/**
 * Calculate shipping cost for cart
 */
export async function calculateShippingCost(params: {
    zoneId: number;
    methodId: string;
    cartTotal: number;
    items: Array<{ productId: number; quantity: number }>;
}) {
    try {
        const { zoneId, methodId, cartTotal } = params;

        // Fetch the specific shipping method
        const methodsResult = await getShippingMethodsForZone(zoneId);

        if (!methodsResult.success || !methodsResult.data) {
            throw new Error('Failed to fetch shipping methods');
        }

        const method = methodsResult.data.find((m: any) => m.id === methodId);

        if (!method) {
            throw new Error('Shipping method not found');
        }

        // Calculate cost based on method settings
        let cost = 0;

        if (method.method_id === 'flat_rate') {
            // Flat rate shipping
            const costSetting = method.settings.cost;
            cost = parseFloat(costSetting?.value || '0');
        } else if (method.method_id === 'free_shipping') {
            // Free shipping - check minimum amount
            const minAmountSetting = method.settings.min_amount;
            const minAmount = parseFloat(minAmountSetting?.value || '0');

            cost = cartTotal >= minAmount ? 0 : parseFloat(method.settings.cost?.value || '0');
        } else if (method.method_id === 'local_pickup') {
            cost = 0;
        }

        return {
            success: true,
            data: {
                cost,
                method: {
                    id: method.id,
                    title: method.title,
                    method_id: method.method_id,
                },
            },
        };
    } catch (error: any) {
        console.error('Error calculating shipping cost:', error);
        return {
            success: false,
            error: error.message || 'Failed to calculate shipping cost',
        };
    }
}

/**
 * Validate coupon code
 */
export async function validateCouponAction(code: string) {
    try {
        const coupon = await getCoupon(code);

        if (!coupon) {
            return {
                success: false,
                error: 'Invalid coupon code',
            };
        }

        return {
            success: true,
            data: coupon,
        };
    } catch (error: any) {
        console.error('Error validating coupon:', error);
        return {
            success: false,
            error: error.message || 'Failed to validate coupon',
        };
    }
}
