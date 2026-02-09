import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Main Sitemap Index
 * 
 * This creates a sitemap index at /sitemap.xml
 * Lists all sub-sitemaps for different locales and content types
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;
    const locales = ['en', 'sv', 'no', 'da'];

    // Create sitemap entries for the index
    const sitemaps: MetadataRoute.Sitemap = [];

    // Add locale-specific page sitemaps
    // English (Default)
    sitemaps.push({
        url: `${baseUrl}/sitemap-pages.xml`,
        lastModified: new Date(),
    });

    // Other Languages
    ['sv', 'no', 'da'].forEach(locale => {
        sitemaps.push({
            url: `${baseUrl}/${locale}/sitemap.xml`,
            lastModified: new Date(),
        });
    });

    // Add other sitemaps
    sitemaps.push(
        {
            url: `${baseUrl}/sitemap-products.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap-categories.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap-posts.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap-post-categories.xml`,
            lastModified: new Date(),
        }
    );

    return sitemaps;
}
