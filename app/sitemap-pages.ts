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
    { slug: '', priority: 1.0, changefreq: 'daily' },
    { slug: 'about', priority: 0.8, changefreq: 'monthly' },
    { slug: 'contact', priority: 0.8, changefreq: 'monthly' },
    { slug: 'faq', priority: 0.7, changefreq: 'monthly' },
    { slug: 'shop', priority: 0.9, changefreq: 'daily' },
    { slug: 'blog', priority: 0.7, changefreq: 'weekly' },
    { slug: 'posts', priority: 0.7, changefreq: 'weekly' },
    { slug: 'privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { slug: 'refund-return', priority: 0.3, changefreq: 'yearly' },
    { slug: 'terms-conditions', priority: 0.3, changefreq: 'yearly' },
    { slug: 'delivery-information', priority: 0.7, changefreq: 'monthly' },
    { slug: 'europe-delivery', priority: 0.7, changefreq: 'monthly' },
    { slug: 'wholesale', priority: 0.8, changefreq: 'monthly' },
    { slug: 'wholesale/register', priority: 0.7, changefreq: 'monthly' },
    { slug: 'wholesale/quote', priority: 0.7, changefreq: 'monthly' },
    { slug: 'wholesale/quick-order', priority: 0.7, changefreq: 'monthly' },
    { slug: 'cart', priority: 0.6, changefreq: 'daily' },
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
            // Alternate locales HAVE prefix (e.g., /sv/about)
            const altUrl = page.slug ? `${baseUrl}/${altLocale}/${page.slug}` : `${baseUrl}/${altLocale}`;

            // But if altLocale is 'en', we point to root (x-default behavior usually)
            // Actually, for hreflang 'en', we want to point to the English URL.
            // Since English is root, we map 'en' to root URL.
            if (altLocale === 'en') {
                alternates.languages[altLocale] = url;
            } else {
                alternates.languages[altLocale] = altUrl;
            }
        });

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
