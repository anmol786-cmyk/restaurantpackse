import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Default (English) Pages Sitemap
 * Route: /sitemap-pages.xml
 * Contains all default language pages (no /en/ prefix)
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

interface PageConfig {
    slug: string;
    priority: number;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const PAGES: PageConfig[] = [
    // Note: homepage, shop, wholesale, about, contact, faq, blog, delivery pages
    // are already in sitemap.ts (sitemap.xml). This file covers legal/support pages only.
    { slug: 'privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { slug: 'refund-return', priority: 0.3, changefreq: 'yearly' },
    { slug: 'terms-conditions', priority: 0.3, changefreq: 'yearly' },
    // Removed: 'cart' — blocked by robots.txt, must not be in sitemap
    // Removed: 'posts' — duplicate of /blog, will be redirected
    // Removed: core pages already covered by sitemap.ts
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    return PAGES.map((page) => {
        // English is default, so NO locale prefix
        const url = page.slug ? `${baseUrl}/${page.slug}` : `${baseUrl}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            if (altLocale === 'en') {
                alternates.languages[altLocale] = url;
            } else {
                const altUrl = page.slug ? `${baseUrl}/${altLocale}/${page.slug}` : `${baseUrl}/${altLocale}`;
                alternates.languages[altLocale] = altUrl;
            }
        });
        alternates.languages['x-default'] = url; // English is default

        return {
            url,
            lastModified: new Date(),
            changeFrequency: page.changefreq,
            priority: page.priority,
            alternates,
        };
    });
}

export const revalidate = 86400; // Daily
