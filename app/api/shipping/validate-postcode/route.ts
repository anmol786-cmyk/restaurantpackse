import { NextRequest, NextResponse } from 'next/server';
import { validateShippingPostcodeAction } from '@/app/actions/woocommerce-settings';

export async function POST(request: NextRequest) {
    try {
        const { postcode, country } = await request.json();

        if (!postcode) {
            return NextResponse.json(
                { error: 'Postcode is required' },
                { status: 400 }
            );
        }

        const result = await validateShippingPostcodeAction(postcode, country || 'SE');

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Postcode validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate postcode' },
            { status: 500 }
        );
    }
}
