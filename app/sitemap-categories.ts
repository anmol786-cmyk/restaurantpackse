import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getProductCategories } from '@/lib/woocommerce';

/**
 * Product Categories Sitemap
 * Route: /sitemap-categories.xml
 * Lists all product categories with hreflang annotations
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    const categories = await getProductCategories();

    return categories.map((category: any) => {
        // Default URL (English)
        const url = `${baseUrl}/shop/category/${category.slug}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            const localePath = altLocale === 'en' ? '' : `/${altLocale}`;
            alternates.languages[altLocale] = `${baseUrl}${localePath}/shop/category/${category.slug}`;
        });

        return {
            url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates,
        };
    });
}

export const revalidate = 86400; // Revalidate daily
