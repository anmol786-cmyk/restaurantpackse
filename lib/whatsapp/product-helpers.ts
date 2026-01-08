/**
 * WhatsApp Product Helpers
 * Functions to retrieve WhatsApp-specific data from WooCommerce products
 */

import type { Product } from '@/types/woocommerce';

/**
 * Gets custom WhatsApp message template from product meta_data
 * Returns null if no custom message is set
 * @param product - WooCommerce product
 * @returns Custom message template or null
 */
export function getProductWhatsAppMessage(product: Product): string | null {
  if (!product.meta_data || product.meta_data.length === 0) {
    return null;
  }

  const metaField = product.meta_data.find(
    (meta) => meta.key === '_whatsapp_custom_message'
  );

  if (!metaField || !metaField.value) {
    return null;
  }

  return String(metaField.value);
}

/**
 * Checks if WhatsApp ordering is enabled for a specific product
 * Products can be disabled via meta field: _whatsapp_enabled = false
 * Default is enabled (true) if meta field is not set
 * @param product - WooCommerce product
 * @returns true if WhatsApp ordering is enabled for this product
 */
export function isWhatsAppEnabledForProduct(product: Product): boolean {
  if (!product.meta_data || product.meta_data.length === 0) {
    return true; // Default: enabled
  }

  const metaField = product.meta_data.find(
    (meta) => meta.key === '_whatsapp_enabled'
  );

  if (!metaField) {
    return true; // Default: enabled if field not present
  }

  // Check for various false values
  const value = metaField.value;
  return value !== 'false' && value !== false && value !== 'no' && value !== 0;
}

/**
 * Gets custom WhatsApp phone number for a specific product
 * Some products may have different contact numbers
 * @param product - WooCommerce product
 * @returns Custom phone number or null
 */
export function getProductWhatsAppPhone(product: Product): string | null {
  if (!product.meta_data || product.meta_data.length === 0) {
    return null;
  }

  const metaField = product.meta_data.find(
    (meta) => meta.key === '_whatsapp_phone'
  );

  if (!metaField || !metaField.value) {
    return null;
  }

  return String(metaField.value);
}

/**
 * Checks if product can be ordered (in stock and purchasable)
 * @param product - WooCommerce product
 * @returns true if product can be ordered
 */
export function canOrderProduct(product: Product): boolean {
  // Check if product is purchasable
  if (!product.purchasable) {
    return false;
  }

  // Check stock status
  if (product.stock_status !== 'instock' && product.stock_status !== 'onbackorder') {
    return false;
  }

  // If stock management is enabled, check stock quantity
  if (product.manage_stock && product.stock_quantity !== null) {
    if (product.stock_quantity <= 0 && product.backorders === 'no') {
      return false;
    }
  }

  return true;
}

/**
 * Gets product availability message for WhatsApp
 * @param product - WooCommerce product
 * @returns Availability message
 */
export function getProductAvailabilityMessage(product: Product): string {
  if (!canOrderProduct(product)) {
    if (product.stock_status === 'outofstock') {
      return 'This product is currently out of stock.';
    }
    if (!product.purchasable) {
      return 'This product is not available for purchase at this time.';
    }
    return 'This product is currently unavailable.';
  }

  if (product.stock_status === 'onbackorder') {
    return 'This product is available on backorder.';
  }

  if (product.manage_stock && product.stock_quantity !== null) {
    if (product.stock_quantity <= 5) {
      return `Only ${product.stock_quantity} left in stock!`;
    }
  }

  return 'In stock';
}
