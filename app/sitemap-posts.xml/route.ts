import generatePostsSitemap from '@/app/sitemap-posts';
import { generateSitemapXml } from '@/lib/sitemap-generator';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sitemap = await generatePostsSitemap();
        const xml = generateSitemapXml(sitemap);

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            }
        });
    } catch (error) {
        console.error('Error generating posts sitemap:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
