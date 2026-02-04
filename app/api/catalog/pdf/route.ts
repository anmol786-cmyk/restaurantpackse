import { NextRequest, NextResponse } from 'next/server';
import { generateCataloguePDF, type CatalogueProduct } from '@/lib/catalogue-generator';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { format } from 'date-fns';

/**
 * Generate Product Catalogue PDF
 *
 * GET /api/catalog/pdf
 * GET /api/catalog/pdf?category=spices
 * GET /api/catalog/pdf?lang=sv
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const language = (searchParams.get('lang') || 'sv') as 'en' | 'sv';
        const includePrice = searchParams.get('price') !== 'false';

        // Fetch products from WooCommerce
        const products = await fetchProductsForCatalogue(category || undefined);

        if (products.length === 0) {
            return NextResponse.json(
                { error: 'No products found for catalogue' },
                { status: 404 }
            );
        }

        // Generate PDF
        const pdfBlob = await generateCataloguePDF(products, {
            title: language === 'sv' ? 'Produktkatalog' : 'Product Catalogue',
            subtitle: `${format(new Date(), 'yyyy')} Edition`,
            includePrice,
            language,
        });

        const arrayBuffer = await pdfBlob.arrayBuffer();
        const filename = `Anmol-Wholesale-Catalogue-${format(new Date(), 'yyyy-MM')}.pdf`;

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating catalogue PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate catalogue PDF' },
            { status: 500 }
        );
    }
}

/**
 * Fetch products from WooCommerce for catalogue
 */
async function fetchProductsForCatalogue(categorySlug?: string): Promise<CatalogueProduct[]> {
    try {
        let url = getWooCommerceUrl('/products?per_page=100&status=publish&orderby=menu_order&order=asc');

        // If category filter is provided, get category ID first
        if (categorySlug) {
            const categoryId = await getCategoryIdBySlug(categorySlug);
            if (categoryId) {
                url += `&category=${categoryId}`;
            }
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': getWooCommerceAuthHeader(),
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API error: ${response.statusText}`);
        }

        const products = await response.json();

        // Map to catalogue product structure
        return products.map((p: any) => ({
            id: p.id,
            name: cleanHtmlEntities(p.name),
            sku: p.sku || '',
            price: p.price || '',
            regularPrice: p.regular_price || '',
            salePrice: p.sale_price || '',
            currency: 'SEK',
            image: p.images?.[0]?.src || '',
            category: p.categories?.[0]?.name || 'Other',
            description: cleanHtmlEntities(p.short_description || ''),
        }));

    } catch (error) {
        console.error('Error fetching products for catalogue:', error);
        return [];
    }
}

/**
 * Get category ID by slug
 */
async function getCategoryIdBySlug(slug: string): Promise<number | null> {
    try {
        const url = getWooCommerceUrl(`/products/categories?slug=${slug}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': getWooCommerceAuthHeader(),
            },
        });

        if (!response.ok) return null;

        const categories = await response.json();
        return categories.length > 0 ? categories[0].id : null;

    } catch {
        return null;
    }
}

/**
 * Clean HTML entities from text
 */
function cleanHtmlEntities(text: string): string {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .trim();
}
