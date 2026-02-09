'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function OrderPayReturnContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'updating' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const handleReturn = async () => {
            const clientSecret = searchParams.get('payment_intent_client_secret');
            const orderIdParam = searchParams.get('order');
            const orderKey = searchParams.get('key');

            setOrderId(orderIdParam);

            if (!clientSecret) {
                setStatus('failed');
                setMessage('No payment information found. Please try again.');
                return;
            }

            if (!orderIdParam || !orderKey) {
                setStatus('failed');
                setMessage('Missing order information. Please contact support.');
                return;
            }

            try {
                const stripe = await stripePromise;
                if (!stripe) {
                    setStatus('failed');
                    setMessage('Failed to load payment processor.');
                    return;
                }

                // Retrieve the PaymentIntent status
                const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);

                if (error) {
                    setStatus('failed');
                    setMessage(error.message || 'Failed to verify payment status.');
                    return;
                }

                if (!paymentIntent) {
                    setStatus('failed');
                    setMessage('Payment information not found.');
                    return;
                }

                // Handle payment status
                switch (paymentIntent.status) {
                    case 'succeeded':
                    case 'processing':
                        // Payment successful - mark the WooCommerce order as paid
                        setStatus('updating');
                        setMessage('Payment verified! Updating your order...');

                        try {
                            const updateResponse = await fetch(`/api/orders/${orderIdParam}/mark-paid`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    orderKey: orderKey,
                                    paymentIntentId: paymentIntent.id,
                                }),
                            });

                            if (!updateResponse.ok) {
                                const errorData = await updateResponse.json();
                                throw new Error(errorData.error || 'Failed to update order');
                            }

                            setStatus('success');
                            setMessage('Payment successful! Your order has been updated.');

                            // Redirect to success page after a short delay
                            setTimeout(() => {
                                router.push(`/checkout/success?order=${orderIdParam}&payment_intent=${paymentIntent.id}`);
                            }, 2000);

                        } catch (updateError) {
                            console.error('Order update failed:', updateError);
                            setStatus('failed');
                            setMessage(
                                `Payment was successful but order update failed. Please contact support with payment ID: ${paymentIntent.id}`
                            );
                        }
                        break;

                    case 'requires_payment_method':
                        setStatus('failed');
                        setMessage('Payment failed. Please try again with a different payment method.');
                        break;

                    case 'requires_action':
                        setStatus('failed');
                        setMessage('Additional authentication required. Please complete the verification.');
                        break;

                    default:
                        setStatus('failed');
                        setMessage(`Unexpected payment status: ${paymentIntent.status}`);
                }
            } catch (err) {
                console.error('Error verifying payment:', err);
                setStatus('failed');
                setMessage('An error occurred while verifying your payment.');
            }
        };

        handleReturn();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2">Verifying Payment</h1>
                        <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
                    </>
                )}

                {status === 'updating' && (
                    <>
                        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2">Updating Your Order</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2 text-green-700">Payment Successful!</h1>
                        <p className="text-muted-foreground mb-4">{message}</p>
                        {orderId && (
                            <p className="text-sm font-medium mb-2">Order #{orderId}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Redirecting to order confirmation...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2 text-red-700">Something Went Wrong</h1>
                        <p className="text-muted-foreground mb-4 text-sm">{message}</p>
                        <div className="space-y-2">
                            <Link href="/contact" className="block">
                                <Button className="w-full">Contact Support</Button>
                            </Link>
                            <Link href="/" className="block">
                                <Button variant="outline" className="w-full">Return to Home</Button>
                            </Link>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function OrderPayReturnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                    <h1 className="text-xl font-semibold mb-2">Loading...</h1>
                </Card>
            </div>
        }>
            <OrderPayReturnContent />
        </Suspense>
    );
}
