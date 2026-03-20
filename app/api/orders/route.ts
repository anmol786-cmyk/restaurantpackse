import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Require auth
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');
    if (!authCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const perPage = searchParams.get('per_page') || '20';
    const page = searchParams.get('page') || '1';
    const status = searchParams.get('status') || 'any';

    if (!customerId) {
      return NextResponse.json({ error: 'customer_id required' }, { status: 400 });
    }

    const params = new URLSearchParams({
      customer: customerId,
      per_page: perPage,
      page,
      status,
      orderby: 'date',
      order: 'desc',
    });

    const response = await fetch(getWooCommerceUrl(`/orders?${params}`), {
      headers: { Authorization: getWooCommerceAuthHeader() },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('WooCommerce orders fetch failed:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: response.status });
    }

    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
