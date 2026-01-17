import { NextResponse } from 'next/server';

/**
 * Quick API Key Test
 * Tests if WooCommerce credentials are working
 * Shows exactly which environment variables are being checked
 */
export async function GET() {
    // Check for server-side WORDPRESS_URL first, then fall back to NEXT_PUBLIC_
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const key = process.env.WORDPRESS_CONSUMER_KEY;
    const secret = process.env.WORDPRESS_CONSUMER_SECRET;

    // Detailed debugging info
    const debugInfo = {
        WORDPRESS_URL: process.env.WORDPRESS_URL ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL ? 'SET' : 'NOT SET',
        WORDPRESS_CONSUMER_KEY: process.env.WORDPRESS_CONSUMER_KEY ? 'SET' : 'NOT SET',
        WORDPRESS_CONSUMER_SECRET: process.env.WORDPRESS_CONSUMER_SECRET ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
    };

    if (!wpUrl || !key || !secret) {
        return NextResponse.json({
            error: 'Missing environment variables',
            has_url: !!wpUrl,
            has_key: !!key,
            has_secret: !!secret,
            debug: debugInfo,
            expected_vars: [
                'WORDPRESS_URL (or NEXT_PUBLIC_WORDPRESS_URL)',
                'WORDPRESS_CONSUMER_KEY',
                'WORDPRESS_CONSUMER_SECRET'
            ]
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
