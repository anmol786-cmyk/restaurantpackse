import { NextResponse } from 'next/server';
import { getPaymentGatewaysAction } from '@/app/actions/woocommerce-settings';

export async function GET() {
    try {
        const result = await getPaymentGatewaysAction();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Payment gateways fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment gateways' },
            { status: 500 }
        );
    }
}
