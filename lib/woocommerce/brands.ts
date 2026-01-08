/**
 * WooCommerce Brands API Functions
 * Fetch product brands from WooCommerce
 */

import { fetchWooCommerceAPI } from './api';
import { WC_API_CONFIG } from './config';

export interface ProductBrand {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    image?: {
        id: number;
        src: string;
        alt: string;
    };
}

/**
 * Get all product brands using WooCommerce REST API
 */
export async function getProductBrands(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    hide_empty?: boolean;
}): Promise<ProductBrand[]> {
    const queryParams = {
        per_page: params?.per_page || 100,
        page: params?.page || 1,
        hide_empty: params?.hide_empty !== undefined ? params.hide_empty : true,
        ...(params?.search && { search: params.search }),
    };

    try {
        // Try WooCommerce Brands API first (v3, v2, v1)
        const endpoints = [
            '/products/brands',
            '/wc/v3/products/brands',
            '/wc/v2/products/brands',
            '/wc/v1/products/brands'
        ];

        for (const endpoint of endpoints) {
            try {
                // Build query string
                const queryString = new URLSearchParams();
                Object.entries(queryParams).forEach(([key, value]) => {
                    queryString.append(key, String(value));
                });

                const fullEndpoint = `${endpoint}?${queryString.toString()}`;
                const brands = await fetchWooCommerceAPI<ProductBrand[]>(fullEndpoint);

                if (brands && brands.length >= 0) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ Fetched ${brands.length} brands from ${endpoint}`);
                    }
                    return brands;
                }
            } catch (error) {
                // Try next endpoint
                continue;
            }
        }

        // Fallback to WordPress REST API if WC endpoints don't work
        const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
        if (!baseUrl) {
            throw new Error('WordPress URL not configured');
        }

        const url = new URL(`${baseUrl}/wp-json/wp/v2/product_brand`);
        Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600, // Cache for 1 hour
                tags: ['brands'],
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch brands: ${response.status} ${response.statusText}`);
            return [];
        }

        const brands = await response.json();

        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Fetched ${brands.length} brands from WordPress REST API`);
        }

        return brands;
    } catch (error) {
        console.error('Error fetching product brands:', error);
        return [];
    }
}

/**
 * Get a single brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<ProductBrand | null> {
    try {
        // Try WooCommerce Brands API first
        const endpoints = [
            '/products/brands',
            '/wc/v3/products/brands',
            '/wc/v2/products/brands',
            '/wc/v1/products/brands'
        ];

        for (const endpoint of endpoints) {
            try {
                const brands = await fetchWooCommerceAPI<ProductBrand[]>(`${endpoint}?slug=${slug}`);
                if (brands && brands.length > 0) {
                    return brands[0];
                }
            } catch (error) {
                continue;
            }
        }

        // Fallback to WordPress REST API
        const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
        if (!baseUrl) {
            throw new Error('WordPress URL not configured');
        }

        const url = new URL(`${baseUrl}/wp-json/wp/v2/product_brand`);
        url.searchParams.append('slug', slug);

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
                tags: ['brands', `brand-${slug}`],
            },
        });

        if (!response.ok) {
            return null;
        }

        const brands = await response.json();
        return brands[0] || null;
    } catch (error) {
        console.error(`Error fetching brand ${slug}:`, error);
        return null;
    }
}
