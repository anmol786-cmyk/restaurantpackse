import { NextResponse } from 'next/server';

/**
 * Quick API Key Test
 * Tests if WooCommerce credentials are working
 */
export async function GET() {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const key = process.env.WORDPRESS_CONSUMER_KEY;
    const secret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!wpUrl || !key || !secret) {
        return NextResponse.json({
            error: 'Missing environment variables',
            has_url: !!wpUrl,
            has_key: !!key,
            has_secret: !!secret,
        }, { status: 500 });
    }

    try {
        const auth = Buffer.from(`${key}:${secret}`).toString('base64');
        const testUrl = `${wpUrl}/wp-json/wc/v3/products?per_page=1`;

        const response = await fetch(testUrl, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });

        const data = response.ok ? await response.json() : await response.text();

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            url: testUrl,
            keyPrefix: key.substring(0, 10) + '...',
            secretPrefix: secret.substring(0, 10) + '...',
            response: response.ok ? {
                productsFound: Array.isArray(data) ? data.length : 0,
                firstProduct: data[0]?.name || null,
            } : {
                error: data.substring(0, 200),
            },
        });
    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
