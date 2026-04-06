import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getProductCategories } from '@/lib/woocommerce';

/**
 * Product Categories Sitemap
 * Route: /sitemap-categories.xml
 *
 * Submits one URL entry per locale per category (4 × N categories).
 * Each entry carries the full hreflang alternates map so Google
 * treats every locale URL as a first-class submitted URL.
 */

const LOCALES = ['en', 'sv', 'no', 'da'] as const;

function localeUrl(baseUrl: string, locale: string, slug: string): string {
    return locale === 'en'
        ? `${baseUrl}/shop/category/${slug}`
        : `${baseUrl}/${locale}/shop/category/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    const categories = await getProductCategories();
    const entries: MetadataRoute.Sitemap = [];

    for (const category of categories) {
        // Build shared hreflang map for this category
        const languages: Record<string, string> = {};
        for (const locale of LOCALES) {
            languages[locale] = localeUrl(baseUrl, locale, category.slug);
        }
        languages['x-default'] = localeUrl(baseUrl, 'en', category.slug);

        // One entry per locale — each locale URL is a submitted URL
        for (const locale of LOCALES) {
            entries.push({
                url: localeUrl(baseUrl, locale, category.slug),
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: { languages },
            });
        }
    }

    return entries;
}

export const revalidate = 86400; // Revalidate daily
