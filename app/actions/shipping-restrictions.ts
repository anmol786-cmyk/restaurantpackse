'use server';

import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

/**
 * Validate if cart items can be shipped to the provided postcode
 * Checks for Stockholm-specific shipping restrictions
 */
export async function validateShippingRestrictions(params: {
    items: Array<{ productId: number; quantity: number }>;
    postcode: string;
    city?: string;
    country?: string;
}) {
    const { items, postcode, city, country } = params;

    try {
        const restrictedProducts: Array<{
            productId: number;
            productName: string;
            reason: string;
        }> = [];

        // Check each product for shipping restrictions
        for (const item of items) {
            const response = await fetch(
                getWooCommerceUrl(`/products/${item.productId}`),
                {
                    headers: {
                        'Authorization': getWooCommerceAuthHeader(),
                    },
                    cache: 'no-store',
                }
            );

            if (!response.ok) {
                console.error(`Failed to fetch product ${item.productId}`);
                continue;
            }

            const product = await response.json();

            // Check if product has shipping restrictions
            // This checks for:
            // 1. Shipping class restrictions
            // 2. Custom meta fields for regional restrictions
            // 3. Product categories with restrictions

            const shippingClass = product.shipping_class;
            const metaData = product.meta_data || [];

            // Check for Stockholm-only shipping class
            if (shippingClass === 'stockholm-only') {
                const isStockholm = isStockholmPostcode(postcode);
                if (!isStockholm) {
                    restrictedProducts.push({
                        productId: product.id,
                        productName: product.name,
                        reason: 'This product can only be shipped within Stockholm area',
                    });
                }
            }

            // Check for custom meta field restrictions
            const shippingRestriction = metaData.find(
                (meta: any) => meta.key === '_shipping_restriction'
            );

            if (shippingRestriction) {
                const restriction = shippingRestriction.value;

                if (restriction === 'stockholm_only') {
                    const isStockholm = isStockholmPostcode(postcode);
                    if (!isStockholm) {
                        restrictedProducts.push({
                            productId: product.id,
                            productName: product.name,
                            reason: 'This product can only be shipped within Stockholm area',
                        });
                    }
                } else if (restriction === 'sweden_only' && country !== 'SE') {
                    restrictedProducts.push({
                        productId: product.id,
                        productName: product.name,
                        reason: 'This product can only be shipped within Sweden',
                    });
                }
            }

            // Check for perishable items (common in restaurant/food businesses)
            const categories = product.categories || [];
            const hasPerishableCategory = categories.some(
                (cat: any) =>
                    cat.slug === 'perishable' ||
                    cat.slug === 'fresh-food' ||
                    cat.slug === 'catering'
            );

            if (hasPerishableCategory) {
                const isStockholm = isStockholmPostcode(postcode);
                if (!isStockholm) {
                    restrictedProducts.push({
                        productId: product.id,
                        productName: product.name,
                        reason:
                            'Perishable items can only be delivered within Stockholm area for freshness',
                    });
                }
            }
        }

        return {
            success: true,
            data: {
                valid: restrictedProducts.length === 0,
                restrictedProducts,
            },
        };
    } catch (error: any) {
        console.error('Error validating shipping restrictions:', error);
        return {
            success: false,
            error: error.message || 'Failed to validate shipping restrictions',
            data: {
                valid: true, // Default to allowing shipping on error to not block checkout
                restrictedProducts: [],
            },
        };
    }
}

/**
 * Check if a postcode is within Stockholm area
 * Stockholm postcodes typically start with 1 (100 00 - 199 99)
 */
function isStockholmPostcode(postcode: string): boolean {
    // Normalize postcode (remove spaces and convert to uppercase)
    const normalized = postcode.replace(/\s/g, '').toUpperCase();

    // Stockholm postcodes are in the range 100 00 - 199 99
    // Extract first 3 digits
    const prefix = normalized.substring(0, 3);

    if (prefix.length < 3 || !/^\d{3}$/.test(prefix)) {
        return false;
    }

    const prefixNum = parseInt(prefix, 10);

    // Stockholm area: 100-199
    return prefixNum >= 100 && prefixNum <= 199;
}

/**
 * Get shipping restriction info for display
 */
export async function getProductShippingInfo(productId: number) {
    try {
        const response = await fetch(
            getWooCommerceUrl(`/products/${productId}`),
            {
                headers: {
                    'Authorization': getWooCommerceAuthHeader(),
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        const product = await response.json();
        const metaData = product.meta_data || [];
        const shippingClass = product.shipping_class;

        let restriction = null;

        if (shippingClass === 'stockholm-only') {
            restriction = 'Stockholm area only';
        }

        const shippingRestriction = metaData.find(
            (meta: any) => meta.key === '_shipping_restriction'
        );

        if (shippingRestriction) {
            const value = shippingRestriction.value;
            if (value === 'stockholm_only') {
                restriction = 'Stockholm area only';
            } else if (value === 'sweden_only') {
                restriction = 'Sweden only';
            }
        }

        return {
            success: true,
            data: {
                hasRestriction: restriction !== null,
                restriction,
            },
        };
    } catch (error: any) {
        console.error('Error fetching product shipping info:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch shipping info',
        };
    }
}
