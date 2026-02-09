import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getProducts } from '@/lib/woocommerce/products-direct';

/**
 * Products Sitemap
 * Route: /sitemap-products.xml
 * Lists all products with hreflang annotations for each locale
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    // Fetch all products (pagination might be needed for very large stores, 
    // but for sitemap generation we try to get a large batch)
    // In a real large-scale scenario, you'd split this into sitemap-products-[id].xml
    const productsRes = await getProducts({ per_page: 100 });
    const products = productsRes.data;

    return products.map((product) => {
        // Default URL (usually English or the default locale)
        const url = `${baseUrl}/en/product/${product.slug}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            alternates.languages[altLocale] = `${baseUrl}/${altLocale}/product/${product.slug}`;
        });

        return {
            url,
            lastModified: new Date(product.date_modified || product.date_created),
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates,
        };
    });
}

export const revalidate = 3600; // Revalidate hourly
