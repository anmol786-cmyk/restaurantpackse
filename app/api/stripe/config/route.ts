import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET() {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({
                error: 'Stripe not configured'
            }, { status: 500 });
        }

        // Get payment method configuration
        const paymentMethodConfig = await stripe.paymentMethodConfigurations.list({
            limit: 10,
        });

        // Get account details
        const account = await stripe.accounts.retrieve();

        return NextResponse.json({
            account: {
                id: account.id,
                country: account.country,
                business_type: account.business_type,
            },
            paymentMethodConfigs: paymentMethodConfig.data.map(config => ({
                id: config.id,
                name: config.name,
                apple_pay: config.apple_pay,
                google_pay: config.google_pay,
            })),
            raw: paymentMethodConfig.data[0], // Show full first config for debugging
        });
    } catch (error) {
        console.error('Error fetching Stripe config:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
