import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Sitemap Index
 * Route: /sitemap.xml
 *
 * Each locale version is its own <url> entry, each with reciprocal hreflang
 * annotations for all variants — per Google's hreflang in sitemaps spec.
 * Generates 12 routes × 4 locales = 48 entries total.
 */

const LOCALES = ['en', 'sv', 'no', 'da'] as const;

type CoreRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const CORE_ROUTES: CoreRoute[] = [
  { path: '',                       changeFrequency: 'daily',   priority: 1.0 },
  { path: '/shop',                  changeFrequency: 'daily',   priority: 0.9 },
  { path: '/wholesale',             changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/wholesale/register',    changeFrequency: 'monthly', priority: 0.8 },
  { path: '/wholesale/quick-order', changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/wholesale/quote',       changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about',                 changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact',               changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq',                   changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog',                  changeFrequency: 'daily',   priority: 0.6 },
  { path: '/posts/elektrisk-tandoor-vs-koleldad-tandoor', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/delivery-information',  changeFrequency: 'monthly', priority: 0.6 },
  { path: '/europe-delivery',       changeFrequency: 'monthly', priority: 0.6 },
];

function localeUrl(locale: string, path: string): string {
  const base = siteConfig.site_domain;
  return locale === 'en' ? `${base}${path}` : `${base}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, changeFrequency, priority } of CORE_ROUTES) {
    // Build the shared hreflang map for this path (same for every locale entry)
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) {
      languages[locale] = localeUrl(locale, path);
    }
    // x-default points to the English (no-prefix) version
    languages['x-default'] = localeUrl('en', path);

    // One sitemap entry per locale — each locale URL is its own <url> entry
    for (const locale of LOCALES) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
