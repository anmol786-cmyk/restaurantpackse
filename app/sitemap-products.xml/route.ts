import generateProductsSitemap from '@/app/sitemap-products';
import { generateSitemapXml } from '@/lib/sitemap-generator';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sitemap = await generateProductsSitemap();
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
