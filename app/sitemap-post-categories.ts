import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getAllCategories } from '@/lib/wordpress';

/**
 * Blog Categories Sitemap
 * Route: /sitemap-post-categories.xml
 * Lists all blog categories with hreflang annotations
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    const categories = await getAllCategories();

    if (!categories || categories.length === 0) {
        return [];
    }

    return categories.map((category) => {
        // Default URL
        const url = `${baseUrl}/en/posts/categories?category=${category.slug}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            alternates.languages[altLocale] = `${baseUrl}/${altLocale}/posts/categories?category=${category.slug}`;
        });

        return {
            url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates,
        };
    });
}

export const revalidate = 86400; // Revalidate daily
