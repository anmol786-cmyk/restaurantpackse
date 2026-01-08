'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Section } from '@/components/craft';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CreditCard, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface OrderData {
    id: number;
    status: string;
    total: string;
    currency: string;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_1: string;
        city: string;
        postcode: string;
        country: string;
    };
    line_items: Array<{
        name: string;
        quantity: number;
        total: string;
    }>;
}

interface PaymentFormProps {
    clientSecret: string;
    orderData: OrderData;
    orderKey: string;
}

function PaymentForm({ clientSecret, orderData, orderKey }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error: submitError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Redirect to order-pay return page which will mark the order as paid
                    return_url: `${window.location.origin}/checkout/order-pay/return?order=${orderData.id}&key=${orderKey}`,
                },
            });

            if (submitError) {
                setError(submitError.message || 'Payment failed. Please try again.');
                setIsProcessing(false);
            }
            // If no error, the page will redirect automatically
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
                <h3 className="mb-3 font-semibold text-primary-950 dark:text-primary-50">
                    Order #{orderData.id}
                </h3>
                <div className="space-y-2 text-sm">
                    {orderData.line_items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">{item.total} {orderData.currency}</span>
                        </div>
                    ))}
                    <div className="mt-3 border-t pt-3">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-primary-600">{orderData.total} {orderData.currency}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Info */}
            <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Billing Details</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {orderData.billing.first_name} {orderData.billing.last_name}<br />
                    {orderData.billing.email}<br />
                    {orderData.billing.address_1}, {orderData.billing.city} {orderData.billing.postcode}
                </p>
            </div>

            {/* Stripe Payment Element */}
            <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">Payment Details</h3>
                <PaymentElement
                    options={{
                        layout: 'accordion',
                    }}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                size="lg"
                className="w-full rounded-full"
                disabled={!stripe || !elements || isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay {orderData.total} {orderData.currency}
                    </>
                )}
            </Button>

            <p className="text-center text-xs text-neutral-500">
                <Lock className="mr-1 inline h-3 w-3" />
                Secured by Stripe. Your payment information is encrypted.
            </p>
        </form>
    );
}

export default function OrderPayPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params);
    const searchParams = useSearchParams();
    const orderKey = searchParams.get('key') || '';
    const payForOrder = searchParams.get('pay_for_order') === 'true';

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderAndCreatePaymentIntent = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch order details from WooCommerce
                const orderResponse = await fetch(`/api/orders/${orderId}?key=${orderKey}`);

                if (!orderResponse.ok) {
                    const errorData = await orderResponse.json();
                    throw new Error(errorData.error || 'Failed to fetch order');
                }

                const order = await orderResponse.json();

                // Check if order is already paid
                if (order.status === 'completed' || order.status === 'processing') {
                    setError('This order has already been paid.');
                    setIsLoading(false);
                    return;
                }

                // Check if order is valid for payment
                if (order.status !== 'pending') {
                    setError(`This order cannot be paid. Current status: ${order.status}`);
                    setIsLoading(false);
                    return;
                }

                setOrderData(order);

                // Create PaymentIntent for this order
                const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: Math.round(parseFloat(order.total) * 100), // Convert to cents/öre
                        currency: order.currency.toLowerCase(),
                        customerEmail: order.billing.email,
                        customerName: `${order.billing.first_name} ${order.billing.last_name}`,
                        metadata: {
                            wc_order_id: order.id.toString(),
                            order_key: orderKey,
                            source: 'manual_order_pay',
                        },
                    }),
                });

                if (!paymentResponse.ok) {
                    const errorData = await paymentResponse.json();
                    throw new Error(errorData.error || 'Failed to initialize payment');
                }

                const { clientSecret: secret } = await paymentResponse.json();
                setClientSecret(secret);

            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err instanceof Error ? err.message : 'Failed to load order');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId && orderKey) {
            fetchOrderAndCreatePaymentIntent();
        } else {
            setError('Invalid payment link. Please check the URL.');
            setIsLoading(false);
        }
    }, [orderId, orderKey]);

    // Loading state
    if (isLoading) {
        return (
            <Section>
                <Container>
                    <div className="flex min-h-[60vh] flex-col items-center justify-center">
                        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary-600" />
                        <p className="text-neutral-600 dark:text-neutral-400">Loading order details...</p>
                    </div>
                </Container>
            </Section>
        );
    }

    // Error state
    if (error) {
        return (
            <Section>
                <Container>
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
                        <h1 className="mb-2 font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                            Payment Error
                        </h1>
                        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                            {error}
                        </p>
                        <Button asChild>
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </Container>
            </Section>
        );
    }

    // No client secret yet
    if (!clientSecret || !orderData) {
        return (
            <Section>
                <Container>
                    <div className="flex min-h-[60vh] flex-col items-center justify-center">
                        <AlertCircle className="mb-4 h-16 w-16 text-yellow-500" />
                        <h1 className="mb-2 font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                            Unable to Process Payment
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Please contact support if this issue persists.
                        </p>
                    </div>
                </Container>
            </Section>
        );
    }

    // Payment form
    return (
        <Section>
            <Container>
                <div className="mx-auto max-w-lg">
                    <div className="mb-8 text-center">
                        <CreditCard className="mx-auto mb-4 h-12 w-12 text-primary-600" />
                        <h1 className="mb-2 font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
                            Complete Your Payment
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Securely pay for your order using your preferred payment method.
                        </p>
                    </div>

                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: 'stripe',
                                variables: {
                                    colorPrimary: '#166534',
                                    borderRadius: '8px',
                                },
                            },
                        }}
                    >
                        <PaymentForm
                            clientSecret={clientSecret}
                            orderData={orderData}
                            orderKey={orderKey}
                        />
                    </Elements>
                </div>
            </Container>
        </Section>
    );
}
