import { NextRequest, NextResponse } from 'next/server';
import { getProductVariations } from '@/lib/woocommerce';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const variations = await getProductVariations(productId);

    return NextResponse.json(variations);
  } catch (error) {
    console.error('Error fetching variations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variations' },
      { status: 500 }
    );
  }
}
