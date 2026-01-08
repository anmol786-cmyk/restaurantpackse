/**
 * WooCommerce Integration - Main Export File
 *
 * Central export point for all WooCommerce functionality.
 * Import from this file for cleaner imports throughout the application.
 *
 * @example
 * ```ts
 * import { getProducts, getProductBySlug } from '@/lib/woocommerce';
 * ```
 */

// Configuration
export {
  WC_API_CONFIG,
  getWooCommerceUrl,
  getWooCommerceAuthHeader,
  buildQueryString,
  validateWooCommerceConfig,
} from './config';

// Core API Functions
export {
  fetchWooCommerceAPI,
  fetchWooCommerceCached,
  fetchWooCommercePaginated,
  createWooCommerceResource,
  updateWooCommerceResource,
  patchWooCommerceResource,
  deleteWooCommerceResource,
  batchWooCommerceResources,
  fetchWooCommerceSafe,
  checkWooCommerceConnection,
  WooCommerceAPIError,
} from './api';

// Product Functions
export {
  // Fetching
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByIds,
  getFeaturedProducts,
  getOnSaleProducts,
  getRelatedProducts,
  getUpsellProducts,
  getCrossSellProducts,
  searchProducts,
  getProductsByCategory,
  getProductsByTag,

  // Variations
  getProductVariations,
  getProductVariation,

  // Categories
  getProductCategories,
  getProductCategoryById,
  getProductCategoryBySlug,
  getParentCategories,
  getChildCategories,

  // Tags
  getProductTags,
  getProductTagById,
  getProductTagBySlug,

  // Reviews
  getProductReviews,
  getReviewsByProductId,

  // Utilities
  isProductInStock,
  isProductOnSale,
  getProductPrice,
  getDiscountPercentage,
  formatPrice,
  getVariableProductPrice,
  getStockQuantity,
  hasVariations,
} from './products';

// Type exports for convenience
export type {
  Product,
  ProductVariation,
  ProductCategoryFull,
  ProductTagFull,
  ProductReview,
  ProductQueryParams,
  CategoryQueryParams,
  Order,
  Customer,
  Coupon,
  CartItem,
  Cart,
} from '@/types/woocommerce';
