'use server';

import { WC_API_CONFIG } from '@/lib/woocommerce/config';

export async function getAllProductsForCatalog() {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    // Authorization header
    const auth = 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        // We might need to handle pagination if there are many products
        // For now, let's fetch 100 which is a reasonable catalog size for testing
        // In a real scenario, we'd loop through pages
        const response = await fetch(`${baseUrl}/products?per_page=100&status=publish`, {
            headers: {
                'Authorization': auth
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const products = await response.json();

        // Map to simplified structure
        return {
            success: true,
            data: products.map((p: any) => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                price: p.price,
                currency: 'SEK', // Default since WC might not return it per product easily
                image: p.images && p.images.length > 0 ? p.images[0].src : '',
                category: p.categories && p.categories.length > 0 ? p.categories[0].name : '',
                description: p.short_description || p.description
            }))
        };
    } catch (error: any) {
        console.error('Catalog fetch error:', error);
        return { success: false, error: error.message };
    }
}
