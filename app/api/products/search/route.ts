import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Product Search API
 * Search products by keyword with minimum 3 characters
 * Used for autocomplete in quick order forms
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const perPage = parseInt(searchParams.get('per_page') || '10');

    // Validate query
    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: 'Search query must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Search products
    const products = await searchProducts(query, {
      per_page: Math.min(perPage, 50), // Max 50 results
      status: 'publish',
      stock_status: 'instock', // Only in-stock products for ordering
    });

    return NextResponse.json({
      success: true,
      query,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error('Product search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
