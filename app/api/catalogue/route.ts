import { NextRequest, NextResponse } from 'next/server';
import { generateCataloguePDF, type CatalogueProduct, type CatalogueOptions } from '@/lib/catalogue-generator';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { format } from 'date-fns';

/**
 * Product Catalogue PDF Download API
 *
 * GET /api/catalogue
 * GET /api/catalogue?category=spices
 * GET /api/catalogue?includePrice=false
 * GET /api/catalogue?language=en
 *
 * Optional header: x-api-key — matched against env CATALOGUE_API_KEY.
 * If CATALOGUE_API_KEY is not set, all requests are allowed.
 */
export async function GET(request: NextRequest) {
    try {
        // ── Rate limiting / API key check ────────────────────────────────────────
        const requiredKey = process.env.CATALOGUE_API_KEY;
        if (requiredKey) {
            const providedKey = request.headers.get('x-api-key');
            if (providedKey !== requiredKey) {
                return NextResponse.json(
                    { error: 'Unauthorized: invalid or missing API key' },
                    { status: 401 }
                );
            }
        }

        // ── Query params ─────────────────────────────────────────────────────────
        const { searchParams } = new URL(request.url);
        const category     = searchParams.get('category') ?? undefined;
        const includePrice = searchParams.get('includePrice') !== 'false';
        const language     = (searchParams.get('language') === 'en' ? 'en' : 'sv') as 'en' | 'sv';

        // ── Fetch products ───────────────────────────────────────────────────────
        const products = await fetchProductsForCatalogue(category);

        if (products.length === 0) {
            return NextResponse.json(
                { error: 'No products found for catalogue' },
                { status: 404 }
            );
        }

        // ── Generate PDF ─────────────────────────────────────────────────────────
        const options: CatalogueOptions = {
            title:         language === 'sv' ? 'Produktkatalog' : 'Product Catalogue',
            subtitle:      `${format(new Date(), 'yyyy')} Edition`,
            includePrice,
            language,
            categoryFilter: category ? [category] : undefined,
        };

        const pdfBlob     = await generateCataloguePDF(products, options);
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const filename    = `anmol-wholesale-catalogue.pdf`;

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type':        'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control':       'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('[/api/catalogue] Error generating catalogue PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate catalogue PDF' },
            { status: 500 }
        );
    }
}

// ── WooCommerce helpers (same pattern as /api/catalog/pdf) ───────────────────

async function fetchProductsForCatalogue(categorySlug?: string): Promise<CatalogueProduct[]> {
    try {
        let url = getWooCommerceUrl('/products?per_page=100&status=publish&orderby=menu_order&order=asc');

        if (categorySlug) {
            const categoryId = await getCategoryIdBySlug(categorySlug);
            if (categoryId) {
                url += `&category=${categoryId}`;
            }
        }

        const response = await fetch(url, {
            headers: { Authorization: getWooCommerceAuthHeader() },
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API error: ${response.statusText}`);
        }

        const products = await response.json();

        return products.map((p: any): CatalogueProduct => ({
            id:           p.id,
            name:         cleanHtmlEntities(p.name),
            sku:          p.sku || '',
            price:        p.price || '',
            regularPrice: p.regular_price || '',
            salePrice:    p.sale_price || '',
            currency:     'SEK',
            image:        p.images?.[0]?.src || '',
            category:     cleanHtmlEntities(p.categories?.[0]?.name || 'Other'),
            description:  cleanHtmlEntities(p.short_description || ''),
        }));
    } catch (error) {
        console.error('[/api/catalogue] Error fetching products:', error);
        return [];
    }
}

async function getCategoryIdBySlug(slug: string): Promise<number | null> {
    try {
        const url = getWooCommerceUrl(`/products/categories?slug=${encodeURIComponent(slug)}`);
        const response = await fetch(url, {
            headers: { Authorization: getWooCommerceAuthHeader() },
        });
        if (!response.ok) return null;
        const categories = await response.json();
        return categories.length > 0 ? categories[0].id : null;
    } catch {
        return null;
    }
}

function cleanHtmlEntities(text: string): string {
    if (!text) return '';
    return text
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#0?39;/gi, "'")
        .replace(/&apos;/gi, "'")
        .replace(/&ndash;/gi, '\u2013')
        .replace(/&mdash;/gi, '\u2014')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&hellip;/gi, '...')
        .replace(/&lsquo;/gi, '\u2018')
        .replace(/&rsquo;/gi, '\u2019')
        .replace(/&ldquo;/gi, '\u201C')
        .replace(/&rdquo;/gi, '\u201D')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
        .replace(/<[^>]*>/g, '')
        .trim();
}
