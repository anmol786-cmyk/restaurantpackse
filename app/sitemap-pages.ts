import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Legal / Support Pages Sitemap
 * Route: /sitemap-pages.xml
 *
 * Submits one URL entry per locale per page (4 × N pages).
 * Core pages (homepage, shop, wholesale, about, contact, faq, blog,
 * delivery, europe-delivery) are already in sitemap.xml — this file
 * covers legal and support pages only.
 */

const LOCALES = ['en', 'sv', 'no', 'da'] as const;

interface PageConfig {
    slug: string;
    priority: number;
    changefreq: MetadataRoute.Sitemap[number]['changeFrequency'];
}

const PAGES: PageConfig[] = [
    { slug: 'privacy-policy',   priority: 0.3, changefreq: 'yearly'  },
    { slug: 'refund-return',    priority: 0.4, changefreq: 'yearly'  },
    { slug: 'terms-conditions', priority: 0.3, changefreq: 'yearly'  },
    // Removed: 'cart' — blocked by robots.txt
    // Removed: 'posts' — noindexed, canonical → /blog
    // Core pages already in sitemap.ts
];

function localeUrl(baseUrl: string, locale: string, slug: string): string {
    return locale === 'en'
        ? `${baseUrl}/${slug}`
        : `${baseUrl}/${locale}/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;
    const entries: MetadataRoute.Sitemap = [];

    for (const page of PAGES) {
        // Build shared hreflang map for this page
        const languages: Record<string, string> = {};
        for (const locale of LOCALES) {
            languages[locale] = localeUrl(baseUrl, locale, page.slug);
        }
        languages['x-default'] = localeUrl(baseUrl, 'en', page.slug);

        // One entry per locale — each locale URL is a submitted URL
        for (const locale of LOCALES) {
            entries.push({
                url: localeUrl(baseUrl, locale, page.slug),
                lastModified: new Date(),
                changeFrequency: page.changefreq,
                priority: page.priority,
                alternates: { languages },
            });
        }
    }

    return entries;
}

export const revalidate = 86400; // Daily
