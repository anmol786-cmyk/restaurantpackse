import { siteConfig } from '@/site.config';
import { NextResponse } from 'next/server';

/**
 * Main Sitemap Index Handler
 * Route: /sitemap.xml
 * Returns a sitemap index listing all sub-sitemaps
 */
export async function GET() {
    const baseUrl = siteConfig.site_domain;
    const locales = ['sv', 'no', 'da'];

    const sitemaps = [
        `${baseUrl}/sitemap-pages.xml`,
        `${baseUrl}/sitemap-products.xml`,
        `${baseUrl}/sitemap-categories.xml`,
        `${baseUrl}/sitemap-posts.xml`,
        `${baseUrl}/sitemap-post-categories.xml`,
        ...locales.map(locale => `${baseUrl}/${locale}/sitemap.xml`)
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    });
}
