import { NextRequest, NextResponse } from 'next/server';
import { getShippingMethodsForZone } from '@/app/actions/woocommerce-settings';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const zoneId = searchParams.get('zoneId');

        if (!zoneId) {
            return NextResponse.json(
                { error: 'Zone ID is required' },
                { status: 400 }
            );
        }

        const result = await getShippingMethodsForZone(parseInt(zoneId));

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Shipping methods fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shipping methods' },
            { status: 500 }
        );
    }
}
