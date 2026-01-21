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
 * Quantity Discount Rule Interface
 * For products with progressive quantity-based discounts
 */
export interface QuantityDiscountRule {
  productId: number;
  productName: string;
  basePrice: number;           // Regular price (e.g., 450)
  tiers: QuantityDiscountTier[];
  floorPrice: number;          // Minimum price (never go below this)
  progressiveDiscount?: {
    startAfterQuantity: number;  // Start progressive discounts after this qty
    quantityStep: number;        // Every X units added
    discountPercent: number;     // Gives Y% additional discount
  };
}

export interface QuantityDiscountTier {
  minQuantity: number;
  maxQuantity: number | null;  // null = unlimited
  unitPrice: number;
  label: string;
}

export interface QuantityDiscountResult {
  unitPrice: number;
  totalPrice: number;
  savings: number;
  savingsPercent: number;
  currentTierLabel: string;
  nextTierSuggestion: string | null;
  quantityToNextTier: number | null;
  priceAtNextTier: number | null;
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
 * Global Minimum Order Quantity (MOQ)
 * Default MOQ applied to all products unless overridden
 */
export const GLOBAL_MOQ = 6;

/**
 * Product-specific MOQ overrides
 * Products listed here use their specific MOQ instead of global
 */
export const MOQ_RULES: { productId: number; minQuantity: number; reason?: string }[] = [
  // Add product-specific MOQ overrides here
  // { productId: 123, minQuantity: 10, reason: 'Bulk item' },
];

/**
 * Quantity Discount Rules
 * Products with progressive quantity-based pricing
 */
export const QUANTITY_DISCOUNT_RULES: QuantityDiscountRule[] = [
  {
    productId: 161,
    productName: 'Mini Electric Tandoor',
    basePrice: 450,
    floorPrice: 370,
    tiers: [
      { minQuantity: 1, maxQuantity: 5, unitPrice: 450, label: 'Regular Price' },
      { minQuantity: 6, maxQuantity: 19, unitPrice: 420, label: 'MOQ Price (6+)' },
      { minQuantity: 20, maxQuantity: 49, unitPrice: 400, label: 'Bulk Price (20+)' },
      { minQuantity: 50, maxQuantity: null, unitPrice: 380, label: 'Volume Price (50+)' },
    ],
    progressiveDiscount: {
      startAfterQuantity: 50,  // Progressive discounts start after 50 units
      quantityStep: 10,        // Every 10 additional units
      discountPercent: 2,      // Gives 2% additional discount
    },
  },
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
   * Returns product-specific MOQ or global MOQ
   */
  getMOQ(productId: number, _categories?: string[]): number {
    // Check for product-specific MOQ override
    const productMOQ = MOQ_RULES.find(r => r.productId === productId);
    if (productMOQ) {
      return productMOQ.minQuantity;
    }
    // Return global MOQ
    return GLOBAL_MOQ;
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
   * Check if a product has quantity discount rules
   */
  hasQuantityDiscount(productId: number): boolean {
    return QUANTITY_DISCOUNT_RULES.some(r => r.productId === productId);
  },

  /**
   * Get quantity discount rule for a product
   */
  getQuantityDiscountRule(productId: number): QuantityDiscountRule | null {
    return QUANTITY_DISCOUNT_RULES.find(r => r.productId === productId) || null;
  },

  /**
   * Calculate quantity discount price for a product
   * This is the main function for calculating price based on quantity
   */
  calculateQuantityDiscount(productId: number, quantity: number, basePrice?: number): QuantityDiscountResult | null {
    const rule = this.getQuantityDiscountRule(productId);

    if (!rule) {
      return null;
    }

    const effectiveBasePrice = basePrice || rule.basePrice;

    // Find the applicable tier
    const applicableTier = rule.tiers
      .filter(tier => quantity >= tier.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    if (!applicableTier) {
      // Below minimum tier, use base price
      return {
        unitPrice: effectiveBasePrice,
        totalPrice: effectiveBasePrice * quantity,
        savings: 0,
        savingsPercent: 0,
        currentTierLabel: 'Regular Price',
        nextTierSuggestion: `Add ${rule.tiers[0].minQuantity - quantity} more to get bulk pricing`,
        quantityToNextTier: rule.tiers[0].minQuantity - quantity,
        priceAtNextTier: rule.tiers[0].unitPrice,
      };
    }

    let unitPrice = applicableTier.unitPrice;
    let currentTierLabel = applicableTier.label;

    // Apply progressive discount if applicable
    if (rule.progressiveDiscount && quantity > rule.progressiveDiscount.startAfterQuantity) {
      const extraUnits = quantity - rule.progressiveDiscount.startAfterQuantity;
      const discountSteps = Math.floor(extraUnits / rule.progressiveDiscount.quantityStep);

      if (discountSteps > 0) {
        // Apply cumulative percentage discount
        const totalDiscountPercent = discountSteps * rule.progressiveDiscount.discountPercent;
        const discountMultiplier = 1 - (totalDiscountPercent / 100);
        unitPrice = applicableTier.unitPrice * discountMultiplier;

        // Ensure price doesn't go below floor
        if (unitPrice < rule.floorPrice) {
          unitPrice = rule.floorPrice;
          currentTierLabel = `Best Price (Floor)`;
        } else {
          currentTierLabel = `Volume Discount (-${totalDiscountPercent}%)`;
        }
      }
    }

    // Round to 2 decimal places
    unitPrice = Math.round(unitPrice * 100) / 100;

    const totalPrice = unitPrice * quantity;
    const regularTotal = effectiveBasePrice * quantity;
    const savings = regularTotal - totalPrice;
    const savingsPercent = Math.round((savings / regularTotal) * 100);

    // Calculate next tier suggestion
    let nextTierSuggestion: string | null = null;
    let quantityToNextTier: number | null = null;
    let priceAtNextTier: number | null = null;

    // Check if there's a next tier
    const nextTier = rule.tiers.find(t => t.minQuantity > quantity);

    if (nextTier) {
      quantityToNextTier = nextTier.minQuantity - quantity;
      priceAtNextTier = nextTier.unitPrice;
      const savingsAtNextTier = effectiveBasePrice - nextTier.unitPrice;
      nextTierSuggestion = `Add ${quantityToNextTier} more to save ${Math.round((savingsAtNextTier / effectiveBasePrice) * 100)}% per unit!`;
    } else if (rule.progressiveDiscount && unitPrice > rule.floorPrice) {
      // Calculate next progressive discount step
      const currentExtraUnits = Math.max(0, quantity - rule.progressiveDiscount.startAfterQuantity);
      const currentSteps = Math.floor(currentExtraUnits / rule.progressiveDiscount.quantityStep);
      const unitsToNextStep = rule.progressiveDiscount.quantityStep - (currentExtraUnits % rule.progressiveDiscount.quantityStep);

      if (unitsToNextStep > 0 && unitsToNextStep < rule.progressiveDiscount.quantityStep) {
        quantityToNextTier = unitsToNextStep;
        const nextSteps = currentSteps + 1;
        const nextDiscountPercent = nextSteps * rule.progressiveDiscount.discountPercent;
        priceAtNextTier = Math.max(
          rule.floorPrice,
          Math.round(applicableTier.unitPrice * (1 - nextDiscountPercent / 100) * 100) / 100
        );

        if (priceAtNextTier < unitPrice) {
          nextTierSuggestion = `Add ${quantityToNextTier} more to get ${rule.progressiveDiscount.discountPercent}% extra discount!`;
        }
      } else if (quantity <= rule.progressiveDiscount.startAfterQuantity) {
        // Not yet in progressive discount territory
        quantityToNextTier = rule.progressiveDiscount.startAfterQuantity + rule.progressiveDiscount.quantityStep - quantity;
        const nextDiscountPercent = rule.progressiveDiscount.discountPercent;
        priceAtNextTier = Math.round(applicableTier.unitPrice * (1 - nextDiscountPercent / 100) * 100) / 100;
        nextTierSuggestion = `Add ${quantityToNextTier} more to unlock progressive discounts!`;
      }
    }

    return {
      unitPrice,
      totalPrice,
      savings,
      savingsPercent,
      currentTierLabel,
      nextTierSuggestion,
      quantityToNextTier,
      priceAtNextTier,
    };
  },

  /**
   * Get all discount tiers for display (for a product)
   * Useful for showing pricing table on product page
   */
  getQuantityDiscountTiers(productId: number): { quantity: string; price: number; savings: string }[] {
    const rule = this.getQuantityDiscountRule(productId);
    if (!rule) return [];

    const tiers: { quantity: string; price: number; savings: string }[] = [];

    // Add base tiers
    for (const tier of rule.tiers) {
      const maxLabel = tier.maxQuantity ? tier.maxQuantity.toString() : '+';
      const savingsPercent = Math.round(((rule.basePrice - tier.unitPrice) / rule.basePrice) * 100);
      tiers.push({
        quantity: tier.maxQuantity
          ? `${tier.minQuantity}-${tier.maxQuantity}`
          : `${tier.minQuantity}+`,
        price: tier.unitPrice,
        savings: savingsPercent > 0 ? `${savingsPercent}% off` : 'Regular',
      });
    }

    // Add progressive discount examples if applicable
    if (rule.progressiveDiscount) {
      const baseProgressivePrice = rule.tiers[rule.tiers.length - 1].unitPrice;
      let currentPrice = baseProgressivePrice;
      let step = 1;

      while (currentPrice > rule.floorPrice && step <= 3) {
        const qty = rule.progressiveDiscount.startAfterQuantity + (step * rule.progressiveDiscount.quantityStep);
        const discountPercent = step * rule.progressiveDiscount.discountPercent;
        currentPrice = Math.max(
          rule.floorPrice,
          Math.round(baseProgressivePrice * (1 - discountPercent / 100) * 100) / 100
        );

        const savingsPercent = Math.round(((rule.basePrice - currentPrice) / rule.basePrice) * 100);
        tiers.push({
          quantity: `${qty}+`,
          price: currentPrice,
          savings: `${savingsPercent}% off`,
        });

        step++;
      }
    }

    return tiers;
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
