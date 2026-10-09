import generateProductsSitemap from '@/app/sitemap-products';
import { generateSitemapXml } from '@/lib/sitemap-generator';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sitemap = await generateProductsSitemap();
        // The WooCommerce helpers return [] when WordPress is down; never serve (and CDN-cache)
        // an empty products sitemap - a 503 tells crawlers to come back later.
        if (sitemap.length === 0) {
            return new NextResponse('Sitemap temporarily unavailable', {
                status: 503,
                headers: { 'Retry-After': '300', 'Cache-Control': 'no-store' },
            });
        }

        const xml = generateSitemapXml(sitemap);

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Products update more frequently
            }
        });
    } catch (error) {
        console.error('Error generating products sitemap:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
