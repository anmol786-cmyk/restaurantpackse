/**
 * Fourlines MCP Products API
 *
 * Functions for fetching and managing WooCommerce products via Fourlines MCP.
 */

import {
  fetchFourlinesMCP,
  fetchFourlinesCached,
  fetchFourlinesPaginated,
  createFourlinesResource,
  updateFourlinesResource,
  deleteFourlinesResource,
} from './api';
import { FOURLINES_MCP_CONFIG, buildQueryString } from './config';
import type { Product } from '@/types/woocommerce';

/**
 * Product query parameters
 */
export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  per_page?: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  orderby?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
}

/**
 * MCP Product Response (simplified from WooCommerce)
 */
interface MCPProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  permalink: string;
  description?: string;
  short_description?: string;
  images?: string[];
  stock?: number;
  date_created?: string;
  date_modified?: string;
}

/**
 * Convert MCP product to WooCommerce Product type
 */
function convertMCPProduct(mcpProduct: any): Product {
  const now = new Date().toISOString();

  return {
    id: mcpProduct.id,
    name: mcpProduct.name,
    slug: mcpProduct.permalink?.split('/').filter(Boolean).pop() || `product-${mcpProduct.id}`,
    permalink: mcpProduct.permalink,
    date_created: mcpProduct.date_created || now,
    date_created_gmt: mcpProduct.date_created || now,
    date_modified: mcpProduct.date_modified || now,
    date_modified_gmt: mcpProduct.date_modified || now,
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: mcpProduct.description || '',
    short_description: mcpProduct.short_description || '',
    sku: mcpProduct.sku || '',
    price: mcpProduct.price || '0',
    regular_price: mcpProduct.regular_price || '0',
    sale_price: mcpProduct.sale_price || '',
    date_on_sale_from: null,
    date_on_sale_from_gmt: null,
    date_on_sale_to: null,
    date_on_sale_to_gmt: null,
    on_sale: Boolean(mcpProduct.sale_price && parseFloat(mcpProduct.sale_price) > 0),
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: Boolean(mcpProduct.stock !== undefined),
    stock_quantity: mcpProduct.stock || null,
    stock_status: (mcpProduct.stock_status as any) || 'instock',
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    low_stock_amount: null,
    sold_individually: false,
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '0',
    rating_count: 0,
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [],
    tags: [],
    images: (mcpProduct.images || []).map((src: string, index: number) => ({
      id: index,
      src,
      name: `${mcpProduct.name} - Image ${index + 1}`,
      alt: mcpProduct.name,
    })),
    attributes: [],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    price_html: '',
    related_ids: [],
    meta_data: [],
  };
}

/**
 * Get all products with optional filters
 */
export async function getProducts(params: ProductQueryParams = {}): Promise<{
  data: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}> {
  try {
    const response = await fetchFourlinesPaginated<MCPProduct>(
      FOURLINES_MCP_CONFIG.endpoints.products,
      params,
      FOURLINES_MCP_CONFIG.cache.products,
      ['products']
    );

    const products = response.items.map(convertMCPProduct);

    return {
      data: products,
      total: response.total,
      totalPages: response.totalPages || Math.ceil(response.total / response.perPage),
      currentPage: response.page,
      perPage: response.perPage,
    };
  } catch (error) {
    console.error('Error fetching products via MCP:', error);
    return {
      data: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: params.perPage || params.per_page || 20,
    };
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetchFourlinesCached<any>(
      FOURLINES_MCP_CONFIG.endpoints.productById(id),
      FOURLINES_MCP_CONFIG.cache.productDetail,
      ['products', `product-${id}`]
    );

    return convertMCPProduct(response);
  } catch (error) {
    console.error(`Error fetching product ${id} via MCP:`, error);
    return null;
  }
}

/**
 * Get product by slug
 * Note: MCP doesn't support slug lookup directly, so we search by name
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Convert slug to searchable term
    const searchTerm = slug.replace(/-/g, ' ');

    const response = await searchProducts(searchTerm);

    if (response.length === 0) {
      return null;
    }

    // Find exact match by slug
    const exactMatch = response.find((product) => product.slug === slug);

    return exactMatch || response[0];
  } catch (error) {
    console.error(`Error fetching product by slug ${slug} via MCP:`, error);
    return null;
  }
}

/**
 * Search products
 */
export async function searchProducts(
  query: string,
  params: Omit<ProductQueryParams, 'search'> = {}
): Promise<Product[]> {
  try {
    const queryString = buildQueryString({ q: query, ...params });

    const response = await fetchFourlinesMCP<{ items: MCPProduct[]; total: number }>(
      `${FOURLINES_MCP_CONFIG.endpoints.productSearch}${queryString}`
    );

    return response.items.map(convertMCPProduct);
  } catch (error) {
    console.error('Error searching products via MCP:', error);
    return [];
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await getProducts({
      perPage: limit,
      featured: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching featured products via MCP:', error);
    return [];
  }
}

/**
 * Get products on sale
 */
export async function getOnSaleProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await getProducts({
      perPage: limit,
      on_sale: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching sale products via MCP:', error);
    return [];
  }
}

/**
 * Get latest products
 */
export async function getLatestProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await getProducts({
      perPage: limit,
      orderby: 'date',
      order: 'desc',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching latest products via MCP:', error);
    return [];
  }
}

/**
 * Create a new product (admin only)
 */
export async function createProduct(data: {
  name: string;
  description?: string;
  sku?: string;
  regular_price: number;
  sale_price?: number;
  stock?: number;
}): Promise<Product | null> {
  try {
    const response = await createFourlinesResource<MCPProduct>(
      FOURLINES_MCP_CONFIG.endpoints.products,
      data
    );

    return convertMCPProduct(response);
  } catch (error) {
    console.error('Error creating product via MCP:', error);
    return null;
  }
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    sku: string;
    regular_price: number;
    sale_price: number;
    stock: number;
  }>
): Promise<Product | null> {
  try {
    const response = await updateFourlinesResource<MCPProduct>(
      FOURLINES_MCP_CONFIG.endpoints.productById(id),
      data
    );

    return convertMCPProduct(response);
  } catch (error) {
    console.error(`Error updating product ${id} via MCP:`, error);
    return null;
  }
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await deleteFourlinesResource(FOURLINES_MCP_CONFIG.endpoints.productById(id));
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id} via MCP:`, error);
    return false;
  }
}
