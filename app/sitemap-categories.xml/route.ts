import generateCategoriesSitemap from '@/app/sitemap-categories';
import { generateSitemapXml } from '@/lib/sitemap-generator';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sitemap = await generateCategoriesSitemap();
        // The WooCommerce helpers return [] when WordPress is down; never serve (and CDN-cache)
        // an empty categories sitemap - a 503 tells crawlers to come back later.
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
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            }
        });
    } catch (error) {
        console.error('Error generating categories sitemap:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
