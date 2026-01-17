import { NextResponse } from 'next/server';

/**
 * WooCommerce Diagnostic Endpoint
 * 
 * This endpoint provides detailed diagnostics for WooCommerce API connectivity
 * Use this to debug authentication and connection issues
 * 
 * @returns Detailed diagnostic information
 */
export async function GET() {
    const diagnostics: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: {},
        errors: [],
    };

    // Check environment variables
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    diagnostics.checks.env_vars = {
        NEXT_PUBLIC_WORDPRESS_URL: wpUrl ? '✅ SET' : '❌ NOT SET',
        WORDPRESS_CONSUMER_KEY: consumerKey ? `✅ SET (${consumerKey.substring(0, 10)}...)` : '❌ NOT SET',
        WORDPRESS_CONSUMER_SECRET: consumerSecret ? `✅ SET (${consumerSecret.substring(0, 10)}...)` : '❌ NOT SET',
    };

    if (!wpUrl || !consumerKey || !consumerSecret) {
        diagnostics.errors.push('Missing required environment variables');
        return NextResponse.json(diagnostics, { status: 500 });
    }

    // Test WooCommerce API
    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const testUrl = `${wpUrl}/wp-json/wc/v3/products?per_page=1`;

        diagnostics.checks.api_url = testUrl;
        diagnostics.checks.auth_header = `Basic ${auth.substring(0, 20)}...`;

        const startTime = Date.now();
        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });
        const endTime = Date.now();

        diagnostics.checks.response = {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            responseTime: `${endTime - startTime}ms`,
            headers: Object.fromEntries(response.headers.entries()),
        };

        if (response.ok) {
            const data = await response.json();
            diagnostics.checks.data = {
                productsReturned: data.length,
                sampleProduct: data[0] ? {
                    id: data[0].id,
                    name: data[0].name,
                    slug: data[0].slug,
                } : null,
            };
            diagnostics.status = '✅ SUCCESS';
        } else {
            const errorText = await response.text();
            diagnostics.checks.errorResponse = errorText.substring(0, 500);
            diagnostics.errors.push(`WooCommerce API returned ${response.status}: ${response.statusText}`);
            diagnostics.status = '❌ FAILED';
        }

    } catch (error) {
        diagnostics.status = '❌ ERROR';
        diagnostics.errors.push(error instanceof Error ? error.message : 'Unknown error');
        diagnostics.checks.exception = {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
        };
    }

    // Test WordPress REST API (for comparison)
    try {
        const wpTestUrl = `${wpUrl}/wp-json/wp/v2/posts?per_page=1`;
        const wpResponse = await fetch(wpTestUrl);

        diagnostics.checks.wordpress_api = {
            url: wpTestUrl,
            status: wpResponse.status,
            ok: wpResponse.ok,
        };
    } catch (error) {
        diagnostics.checks.wordpress_api = {
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }

    return NextResponse.json(diagnostics, {
        status: diagnostics.status === '✅ SUCCESS' ? 200 : 500,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
