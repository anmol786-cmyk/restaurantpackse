/**
 * Product Quantity Restriction Utilities
 * 
 * Handles product quantity limits fetched from the backend
 */

import { Product } from '@/types/woocommerce';
import { CartItem } from '@/store/cart-store';

export interface QuantityRestriction {
    is_restricted: boolean;
    max_quantity: number | null;
    message: string | null;
}

/**
 * Get quantity restriction for a product
 */
export function getProductQuantityRestriction(product: Product): QuantityRestriction | null {
    // Check if product has quantity_restriction in meta or direct property
    const restriction = (product as any).quantity_restriction;

    if (restriction && restriction.is_restricted) {
        return restriction;
    }

    // Fallback: Check meta_data for _max_quantity_restriction
    const metaRestriction = product.meta_data?.find(
        meta => meta.key === '_max_quantity_restriction'
    );

    if (metaRestriction && metaRestriction.value) {
        const maxQty = parseInt(metaRestriction.value as string, 10);
        return {
            is_restricted: true,
            max_quantity: maxQty,
            message: `🚫 Maximum ${maxQty} units allowed for this promotional product.`,
        };
    }

    return null;
}

/**
 * Check if adding quantity would exceed restriction
 */
export function checkQuantityLimit(
    product: Product,
    requestedQty: number,
    currentCartItems: CartItem[]
): { allowed: boolean; error?: string; maxAllowed?: number } {
    const restriction = getProductQuantityRestriction(product);

    if (!restriction || !restriction.is_restricted || !restriction.max_quantity) {
        return { allowed: true };
    }

    // Calculate current quantity in cart for this product
    const currentQty = currentCartItems
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

    const totalQty = currentQty + requestedQty;

    if (totalQty > restriction.max_quantity) {
        return {
            allowed: false,
            error: restriction.message || `Maximum ${restriction.max_quantity} units allowed`,
            maxAllowed: restriction.max_quantity - currentQty,
        };
    }

    return { allowed: true };
}

/**
 * Get maximum allowed quantity for a product considering cart
 */
export function getMaxAllowedQuantity(
    product: Product,
    currentCartItems: CartItem[]
): number | null {
    const restriction = getProductQuantityRestriction(product);

    if (!restriction || !restriction.is_restricted || !restriction.max_quantity) {
        return null; // No limit
    }

    // Calculate current quantity in cart
    const currentQty = currentCartItems
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

    return Math.max(0, restriction.max_quantity - currentQty);
}

/**
 * Validate cart items against quantity restrictions
 */
export function validateCartQuantities(
    cartItems: CartItem[],
    products: Map<number, Product>
): { valid: boolean; errors: Array<{ productId: number; message: string }> } {
    const errors: Array<{ productId: number; message: string }> = [];

    // Group cart items by product ID
    const productQuantities = new Map<number, number>();

    cartItems.forEach(item => {
        const current = productQuantities.get(item.productId) || 0;
        productQuantities.set(item.productId, current + item.quantity);
    });

    // Check each product
    productQuantities.forEach((totalQty, productId) => {
        const product = products.get(productId);
        if (!product) return;

        const restriction = getProductQuantityRestriction(product);
        if (!restriction || !restriction.is_restricted || !restriction.max_quantity) {
            return;
        }

        if (totalQty > restriction.max_quantity) {
            errors.push({
                productId,
                message: restriction.message || `Maximum ${restriction.max_quantity} units allowed for ${product.name}`,
            });
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Hardcoded restrictions for immediate use
 * (Use this if WordPress API doesn't expose restrictions yet)
 */
export const HARDCODED_RESTRICTIONS: Record<number, QuantityRestriction> = {
    215: {
        is_restricted: true,
        max_quantity: 3,
        message: '🚫 You can only purchase a maximum of 3 units of this promotional product.',
    },
    // Add more product IDs as needed
};

/**
 * Get restriction with fallback to hardcoded values
 */
export function getProductQuantityRestrictionWithFallback(product: Product): QuantityRestriction | null {
    // Try to get from API first
    const apiRestriction = getProductQuantityRestriction(product);
    if (apiRestriction) {
        return apiRestriction;
    }

    // Fallback to hardcoded
    return HARDCODED_RESTRICTIONS[product.id] || null;
}
