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

    // Each sub-sitemap already lists all 4 locales with hreflang.
    // Posts/post-categories are empty (the one blog post is a static page in sitemap-pages);
    // add them back when WordPress posts are published.
    const sitemaps = [
        `${baseUrl}/sitemap-pages.xml`,
        `${baseUrl}/sitemap-products.xml`,
        `${baseUrl}/sitemap-categories.xml`,
    ];

    const xml = generateSitemapIndexXml(sitemaps);

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    });
}
