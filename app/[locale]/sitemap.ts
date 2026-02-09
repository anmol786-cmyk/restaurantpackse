import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Locale-Specific Sitemap
 * Route: /[locale]/sitemap.xml
 * Automatically generates sitemap for each locale
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

export async function generateSitemaps() {
    return LOCALES.map((locale) => ({ locale }));
}

export default async function sitemap({
    id,
}: {
    id: { locale: string };
}): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;
    const locale = id.locale; // From generateSitemaps

    return PAGES.map((page) => {
        const url = page.slug ? `${baseUrl}/${locale}/${page.slug}` : `${baseUrl}/${locale}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            const altUrl = page.slug ? `${baseUrl}/${altLocale}/${page.slug}` : `${baseUrl}/${altLocale}`;
            alternates.languages[altLocale] = altUrl;
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
