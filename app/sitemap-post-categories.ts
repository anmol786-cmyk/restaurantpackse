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

    // Blog post category filter URLs (/posts/categories?category=X) are thin query-parameter
    // pages that are noindexed. Exclude from sitemap to avoid wasting crawl budget.
    return [];
}

export const revalidate = 86400; // Revalidate daily
