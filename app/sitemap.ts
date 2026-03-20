import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * Sitemap Index
 * Route: /sitemap.xml
 * Lists all core pages with hreflang annotations for each locale
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

type CoreRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const CORE_ROUTES: CoreRoute[] = [
  { path: '',                      changeFrequency: 'daily',   priority: 1.0 },
  { path: '/shop',                 changeFrequency: 'daily',   priority: 0.9 },
  { path: '/wholesale',            changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/wholesale/register',   changeFrequency: 'monthly', priority: 0.8 },
  { path: '/wholesale/quick-order',changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/wholesale/quote',      changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about',                changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact',              changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq',                  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog',                 changeFrequency: 'daily',   priority: 0.6 },
  { path: '/delivery-information', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/europe-delivery',      changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.site_domain;
  const now = new Date();

  return CORE_ROUTES.map(({ path, changeFrequency, priority }) => {
    // Default (English) URL has no locale prefix
    const url = `${baseUrl}${path}`;

    // Build alternate language links
    const languages: Record<string, string> = {};
    LOCALES.forEach((locale) => {
      if (locale === 'en') {
        languages[locale] = url;
      } else {
        languages[locale] = `${baseUrl}/${locale}${path}`;
      }
    });
    languages['x-default'] = url;

    return {
      url,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    };
  });
}
