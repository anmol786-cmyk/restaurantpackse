import { siteConfig } from '@/site.config';
import { NextResponse } from 'next/server';
import { generateSitemapIndexXml } from '@/lib/sitemap-generator';

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

    const xml = generateSitemapIndexXml(sitemaps);

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    });
}
