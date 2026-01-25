import { NextResponse } from 'next/server';
import { getShippingZones } from '@/lib/woocommerce/orders';

export async function GET() {
    try {
        const zones = await getShippingZones();

        return NextResponse.json({
            success: true,
            zones: zones || [],
        });
    } catch (error) {
        console.error('Shipping zones fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch shipping zones',
                zones: [],
            },
            { status: 500 }
        );
    }
}
