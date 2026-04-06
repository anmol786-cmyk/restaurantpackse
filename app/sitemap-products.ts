import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getProducts } from '@/lib/woocommerce/products-direct';

/**
 * Products Sitemap
 * Route: /sitemap-products.xml
 *
 * Submits one URL entry per locale per product (4 × N products).
 * Each entry carries the full hreflang alternates map so Google
 * treats every locale URL as a first-class submitted URL — not
 * merely a discovered alternate.
 */

const LOCALES = ['en', 'sv', 'no', 'da'] as const;

function localeUrl(baseUrl: string, locale: string, slug: string): string {
    return locale === 'en'
        ? `${baseUrl}/product/${slug}`
        : `${baseUrl}/${locale}/product/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    const productsRes = await getProducts({ per_page: 100 });
    const products = productsRes.data;

    const entries: MetadataRoute.Sitemap = [];

    for (const product of products) {
        const lastModified = new Date(product.date_modified || product.date_created);

        // Build shared hreflang map for this product
        const languages: Record<string, string> = {};
        for (const locale of LOCALES) {
            languages[locale] = localeUrl(baseUrl, locale, product.slug);
        }
        languages['x-default'] = localeUrl(baseUrl, 'en', product.slug);

        // One entry per locale — each locale URL is a submitted URL
        for (const locale of LOCALES) {
            entries.push({
                url: localeUrl(baseUrl, locale, product.slug),
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: { languages },
            });
        }
    }

    return entries;
}

export const revalidate = 3600; // Revalidate hourly
