import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    if (!stripe) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured on the server. Please contact support.' },
        { status: 503 }
      );
    }

    const {
      amount,
      currency = 'sek',
      customerEmail,
      customerName,
      billingAddress,
      shippingAddress,
      metadata
    } = await request.json();

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    // Build PaymentIntent params with full wallet support
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount), // Ensure it's an integer (öre/cents)
      currency: currency.toLowerCase(),

      // Enable ALL payment methods including Apple Pay, Google Pay, Klarna, Link
      // Using automatic_payment_methods ensures all enabled methods in Dashboard appear
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always', // Required for Klarna and redirect-based methods
      },

      receipt_email: customerEmail || undefined,
      description: `Order from ${customerName || customerEmail || 'Customer'}`,

      metadata: {
        integration: 'headless-woocommerce',
        source: 'nextjs-frontend',
        customer_name: customerName || '',
        customer_email: customerEmail || '',
        ...metadata,
      },
    };

    // Note: Billing address will be collected by PaymentElement during payment confirmation
    // Shipping address is added to PaymentIntent for address verification

    // Add shipping address if provided (required for some payment methods)
    if (shippingAddress) {
      paymentIntentParams.shipping = {
        name: shippingAddress.name || customerName || '',
        address: {
          line1: shippingAddress.address_1 || shippingAddress.line1 || '',
          line2: shippingAddress.address_2 || shippingAddress.line2 || undefined,
          city: shippingAddress.city || '',
          state: shippingAddress.state || undefined,
          postal_code: shippingAddress.postcode || shippingAddress.postal_code || '',
          country: shippingAddress.country || 'SE',
        },
      };
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log(`PaymentIntent created: ${paymentIntent.id}, status: ${paymentIntent.status}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      // Return available payment method types for frontend debugging
      paymentMethodTypes: paymentIntent.payment_method_types,
    });
  } catch (error) {
    console.error('PaymentIntent creation error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent. Please try again.' },
      { status: 500 }
    );
  }
}
