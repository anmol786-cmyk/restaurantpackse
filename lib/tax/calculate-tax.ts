/**
 * Tax Calculation Utilities
 *
 * Calculates tax based on WooCommerce product tax_class and tax_status.
 *
 * Swedish VAT Rates:
 * - Standard: 25% (default, tax_class = "")
 * - Reduced: 12% (food products, tax_class = "reduced-rate")
 * - Zero: 0% (exports, tax_class = "zero-rate")
 */

import type { Product, ProductVariation, TaxStatus } from '@/types/woocommerce';

export interface TaxRate {
  rate: number; // Percentage (e.g., 25 for 25%)
  name: string; // Display name (e.g., "Standard VAT", "Reduced VAT")
}

export interface TaxCalculation {
  subtotalWithoutTax: number;
  taxAmount: number;
  totalWithTax: number;
  taxRate: number;
}

export interface ItemTaxBreakdown {
  taxRate: number;
  subtotal: number;
  taxAmount: number;
}

/**
 * Swedish VAT rates by tax class
 * https://www.skatteverket.se/foretag/moms/
 */
const SWEDISH_TAX_RATES: Record<string, TaxRate> = {
  '': { rate: 25, name: 'Standard VAT' }, // Standard rate (empty string)
  'standard': { rate: 25, name: 'Standard VAT' },
  'reduced-rate': { rate: 12, name: 'Reduced VAT (Food)' },
  'zero-rate': { rate: 0, name: 'Zero VAT (Export)' },
};

/**
 * Get tax rate for a product based on its tax_class
 */
export function getTaxRateForProduct(
  product: Product | ProductVariation
): TaxRate {
  const taxClass = product.tax_class || '';
  const taxStatus = product.tax_status;

  // If product is not taxable, return 0%
  if (taxStatus === 'none') {
    return { rate: 0, name: 'No VAT' };
  }

  // Return tax rate based on tax class
  return SWEDISH_TAX_RATES[taxClass] || SWEDISH_TAX_RATES[''];
}

/**
 * Get tax rate percentage for a product
 */
export function getTaxRate(product: Product | ProductVariation): number {
  return getTaxRateForProduct(product).rate;
}

/**
 * Calculate tax for a single line item
 *
 * IMPORTANT: WooCommerce prices can be configured as:
 * - Tax-inclusive (price already includes tax) - DEFAULT in Sweden
 * - Tax-exclusive (tax added on top)
 *
 * This function assumes tax-inclusive pricing (Swedish standard).
 */
export function calculateItemTax(
  product: Product | ProductVariation,
  quantity: number,
  pricePerUnit: number,
  pricesIncludeTax: boolean = true
): ItemTaxBreakdown {
  const taxRate = getTaxRate(product);
  const lineTotal = pricePerUnit * quantity;

  if (pricesIncludeTax) {
    // Tax is INCLUDED in the price
    // If price is 112 SEK with 12% tax:
    // - Subtotal without tax = 112 / 1.12 = 100 SEK
    // - Tax amount = 112 - 100 = 12 SEK
    const taxMultiplier = 1 + taxRate / 100;
    const subtotal = lineTotal / taxMultiplier;
    const taxAmount = lineTotal - subtotal;

    return {
      taxRate,
      subtotal,
      taxAmount,
    };
  } else {
    // Tax is ADDED to the price
    // If price is 100 SEK + 12% tax:
    // - Subtotal = 100 SEK
    // - Tax amount = 100 * 0.12 = 12 SEK
    const taxAmount = lineTotal * (taxRate / 100);

    return {
      taxRate,
      subtotal: lineTotal,
      taxAmount,
    };
  }
}

/**
 * Calculate total tax for cart items
 * Handles mixed tax rates (some items at 12%, others at 25%)
 */
export function calculateCartTax(
  items: Array<{
    product: Product;
    variation?: ProductVariation;
    quantity: number;
    price: number;
  }>,
  pricesIncludeTax: boolean = true
): TaxCalculation {
  let totalSubtotal = 0;
  let totalTax = 0;

  // Calculate tax for each item (they may have different tax rates)
  items.forEach((item) => {
    const productToTax = item.variation || item.product;
    const itemTax = calculateItemTax(
      productToTax,
      item.quantity,
      item.price,
      pricesIncludeTax
    );

    totalSubtotal += itemTax.subtotal;
    totalTax += itemTax.taxAmount;
  });

  const totalWithTax = totalSubtotal + totalTax;

  // Calculate weighted average tax rate
  const averageTaxRate = totalSubtotal > 0 ? (totalTax / totalSubtotal) * 100 : 0;

  return {
    subtotalWithoutTax: totalSubtotal,
    taxAmount: totalTax,
    totalWithTax,
    taxRate: averageTaxRate,
  };
}

/**
 * Get tax breakdown by rate
 * Useful for displaying "12% VAT: 50 SEK, 25% VAT: 125 SEK"
 */
export function getTaxBreakdownByRate(
  items: Array<{
    product: Product;
    variation?: ProductVariation;
    quantity: number;
    price: number;
  }>,
  pricesIncludeTax: boolean = true
): Array<{ rate: number; name: string; taxAmount: number; subtotal: number }> {
  const breakdown = new Map<number, { name: string; taxAmount: number; subtotal: number }>();

  items.forEach((item) => {
    const productToTax = item.variation || item.product;
    const taxRateInfo = getTaxRateForProduct(productToTax);
    const itemTax = calculateItemTax(productToTax, item.quantity, item.price, pricesIncludeTax);

    const existing = breakdown.get(taxRateInfo.rate);
    if (existing) {
      existing.taxAmount += itemTax.taxAmount;
      existing.subtotal += itemTax.subtotal;
    } else {
      breakdown.set(taxRateInfo.rate, {
        name: taxRateInfo.name,
        taxAmount: itemTax.taxAmount,
        subtotal: itemTax.subtotal,
      });
    }
  });

  return Array.from(breakdown.entries()).map(([rate, data]) => ({
    rate,
    ...data,
  }));
}

/**
 * Format tax rate for display
 */
export function formatTaxRate(rate: number): string {
  return `${rate}%`;
}

/**
 * Check if product has reduced VAT rate (food products)
 */
export function hasReducedVAT(product: Product | ProductVariation): boolean {
  return product.tax_class === 'reduced-rate';
}

/**
 * Check if product has standard VAT rate
 */
export function hasStandardVAT(product: Product | ProductVariation): boolean {
  const taxClass = product.tax_class || '';
  return taxClass === '' || taxClass === 'standard';
}
