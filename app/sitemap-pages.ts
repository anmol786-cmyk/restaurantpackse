import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Static Pages Sitemap
 * Route: /sitemap-pages.xml (listed in the /sitemap.xml index)
 *
 * Submits one URL entry per locale per page (4 × N pages), with reciprocal hreflang.
 * Core pages used to live in app/sitemap.ts, which shadowed the sitemap index
 * route and kept products/categories out of the submitted sitemap.
 */

const LOCALES = ['en', 'sv', 'no', 'da'] as const;

interface PageConfig {
    slug: string;
    priority: number;
    changefreq: MetadataRoute.Sitemap[number]['changeFrequency'];
}

const PAGES: PageConfig[] = [
    { slug: '',                       priority: 1.0, changefreq: 'daily'   },
    { slug: 'shop',                   priority: 0.9, changefreq: 'daily'   },
    { slug: 'wholesale',              priority: 0.9, changefreq: 'weekly'  },
    { slug: 'wholesale/register',     priority: 0.8, changefreq: 'monthly' },
    { slug: 'wholesale/quick-order',  priority: 0.8, changefreq: 'weekly'  },
    { slug: 'wholesale/quote',        priority: 0.7, changefreq: 'monthly' },
    { slug: 'about',                  priority: 0.7, changefreq: 'monthly' },
    { slug: 'contact',                priority: 0.7, changefreq: 'monthly' },
    { slug: 'faq',                    priority: 0.7, changefreq: 'monthly' },
    { slug: 'blog',                   priority: 0.6, changefreq: 'weekly'  },
    { slug: 'posts/elektrisk-tandoor-vs-koleldad-tandoor', priority: 0.8, changefreq: 'monthly' },
    { slug: 'delivery-information',   priority: 0.6, changefreq: 'monthly' },
    { slug: 'europe-delivery',        priority: 0.6, changefreq: 'monthly' },
    { slug: 'privacy-policy',   priority: 0.3, changefreq: 'yearly'  },
    { slug: 'refund-return',    priority: 0.4, changefreq: 'yearly'  },
    { slug: 'terms-conditions', priority: 0.3, changefreq: 'yearly'  },
    // Removed: 'cart' — blocked by robots.txt
    // Removed: 'posts' — noindexed, canonical → /blog
];

function localeUrl(baseUrl: string, locale: string, slug: string): string {
    const path = slug ? `/${slug}` : '';
    return locale === 'en'
        ? `${baseUrl}${path}`
        : `${baseUrl}/${locale}${path}`;
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
