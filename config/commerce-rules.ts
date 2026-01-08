/**
 * Commerce Rules Configuration
 * Mirrors the backend WordPress plugin rules for frontend validation
 * Source: ideal-indiska-commerce-rules/ideal-indiska-commerce-rules.php
 */

export interface QuantityLimit {
  productId: number;
  maxQuantity: number;
}

export interface BulkPricingRule {
  productId: number;
  requiredQuantity: number;
  totalPrice: number;
}

export interface ShippingRestriction {
  restrictedZones: string[];
  restrictedCategories: string[];
  restrictedProductIds: number[];
}

/**
 * Product quantity limits
 * These products have maximum purchase limits per order
 * UPDATED: 2025-05-24 to match WordPress plugin
 */
export const QUANTITY_LIMITS: QuantityLimit[] = [
  { productId: 215, maxQuantity: 3 },   // India Gate Sona Masoori Rice (changed from 4 to 3)
  { productId: 193, maxQuantity: 2 },   // Product ID 193 (NEW)
  { productId: 4943, maxQuantity: 3 },  // Product ID 4943 (NEW)
];

/**
 * Bulk pricing rules
 * Products with special pricing when buying multiple units
 */
export const BULK_PRICING_RULES: BulkPricingRule[] = [
  // Specific product rules can go here
];

/**
 * Global Wholesale Tiered Pricing
 * Applied to all products unless overridden or restricted
 */
export const WHOLESALE_TIERS = [
  { minQuantity: 10, discount: 0.10, label: 'Bulk (10+)' },
  { minQuantity: 50, discount: 0.16, label: 'Wholesale (50+)' },
  { minQuantity: 100, discount: 0.20, label: 'Commercial (100+)' },
];

/**
 * Minimum Order Quantity (MOQ) Rules
 */
export const MOQ_RULES = [
  // { categoryId: 'bulk-rice', minQuantity: 5 },
];

/**
 * Shipping restrictions
 * Perishable items cannot be shipped to certain zones
 */
export const SHIPPING_RESTRICTIONS: ShippingRestriction = {
  restrictedZones: [
    'Rest of Sweden',
    'Rest of the World',
  ],
  restrictedCategories: [
    'fresh-produce',
    'frozen-foods',
    'tradional-sweets', // Note: Matches backend typo
  ],
  restrictedProductIds: [],
};

/**
 * Helper functions for rule validation
 */
export const CommerceRules = {
  /**
   * Get quantity limit for a product
   */
  getQuantityLimit(productId: number): number | null {
    const limit = QUANTITY_LIMITS.find(l => l.productId === productId);
    return limit ? limit.maxQuantity : null;
  },

  /**
   * Check if adding quantity would exceed limit
   */
  canAddQuantity(productId: number, currentQuantity: number, addQuantity: number): { allowed: boolean; maxQuantity: number | null; message?: string } {
    const maxQuantity = this.getQuantityLimit(productId);

    if (maxQuantity === null) {
      return { allowed: true, maxQuantity: null };
    }

    const totalQuantity = currentQuantity + addQuantity;

    if (totalQuantity > maxQuantity) {
      return {
        allowed: false,
        maxQuantity,
        message: `Cannot add to cart. Maximum ${maxQuantity} units allowed for this product.`
      };
    }

    return { allowed: true, maxQuantity };
  },

  /**
   * Get bulk pricing rule for a product
   */
  getBulkPricing(productId: number, quantity: number): { unitPrice: number; isBulkPrice: boolean } | null {
    const rule = BULK_PRICING_RULES.find(r => r.productId === productId);

    if (!rule) {
      return null;
    }

    if (quantity >= rule.requiredQuantity) {
      return {
        unitPrice: Math.round((rule.totalPrice / rule.requiredQuantity) * 100) / 100,
        isBulkPrice: true
      };
    }

    return null;
  },

  /**
   * Get tiered price based on quantity
   * For wholesale customers
   */
  getTieredPrice(basePrice: number, quantity: number, isWholesaleUser: boolean = false): { unitPrice: number; discount: number; label: string | null } {
    if (!isWholesaleUser) {
      return { unitPrice: basePrice, discount: 0, label: null };
    }

    // Find the highest tier that applies
    const applicableTier = [...WHOLESALE_TIERS]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find(tier => quantity >= tier.minQuantity);

    if (applicableTier) {
      const discountAmount = basePrice * applicableTier.discount;
      return {
        unitPrice: basePrice - discountAmount,
        discount: applicableTier.discount,
        label: applicableTier.label
      };
    }

    return { unitPrice: basePrice, discount: 0, label: null };
  },

  /**
   * Calculate total with tiered pricing
   */
  calculateTotalWithTiers(items: { price: number; quantity: number }[], isWholesaleUser: boolean = false): number {
    return items.reduce((total, item) => {
      const { unitPrice } = this.getTieredPrice(item.price, item.quantity, isWholesaleUser);
      return total + (unitPrice * item.quantity);
    }, 0);
  },

  /**
   * Get Minimum Order Quantity for a product
   */
  getMOQ(productId: number, categories?: string[]): number {
    // Check specific product ID first
    // For now returning 1 as default, but logic can be extended
    return 1;
  },

  /**
   * Check if quantity meets MOQ
   */
  checkMOQ(productId: number, quantity: number, categories?: string[]): { met: boolean; minRequired: number } {
    const minRequired = this.getMOQ(productId, categories);
    return {
      met: quantity >= minRequired,
      minRequired
    };
  },

  /**
   * Check if product is restricted in shipping zone
   */
  isRestrictedForShipping(productCategories: string[], productId: number, shippingZone?: string): boolean {
    if (!shippingZone) {
      return false;
    }

    // Check if zone is restricted
    const isRestrictedZone = SHIPPING_RESTRICTIONS.restrictedZones.some(
      zone => zone.toLowerCase() === shippingZone.toLowerCase()
    );

    if (!isRestrictedZone) {
      return false;
    }

    // Check if product has restricted category
    const hasRestrictedCategory = productCategories.some(cat =>
      SHIPPING_RESTRICTIONS.restrictedCategories.includes(cat)
    );

    // Check if product ID is restricted
    const isRestrictedProduct = SHIPPING_RESTRICTIONS.restrictedProductIds.includes(productId);

    return hasRestrictedCategory || isRestrictedProduct;
  },

  /**
   * Get perishable category names for display
   */
  getPerishableCategoryNames(): string[] {
    return ['Fresh Produce', 'Frozen Foods', 'Traditional Sweets'];
  }
};
