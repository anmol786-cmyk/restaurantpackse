'use client';

import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest, Stripe } from '@stripe/stripe-js';
import { useState, useEffect, useRef } from 'react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface ExpressCheckoutProps {
    amount: number;
    currency?: string;
    onSuccess: (paymentIntent: any) => void;
    onError?: (error: string) => void;
    showDebug?: boolean;
}

/**
 * Payment Request Button - Uses the older, more reliable API
 * This is what WordPress Stripe Gateway used before ExpressCheckoutElement
 */
function PaymentRequestButtonInner({
    amount,
    currency = 'SEK',
    onSuccess,
    onError,
    showDebug = false,
}: ExpressCheckoutProps) {
    const stripe = useStripe();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
    const [canMakePayment, setCanMakePayment] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!stripe) {
            console.log('⏳ Waiting for Stripe to load...');
            return;
        }

        console.log('🔧 Creating Payment Request...');
        console.log('🔧 Amount:', amount, 'Currency:', currency);

        // Create PaymentRequest - this is what WordPress uses
        const pr = stripe.paymentRequest({
            country: 'SE',
            currency: currency.toLowerCase(),
            total: {
                label: 'Total',
                amount: Math.round(amount * 100), // Convert to öre
            },
            requestPayerName: true,
            requestPayerEmail: true,
            requestPayerPhone: true,
        });

        // Check if payment request is supported
        pr.canMakePayment().then((result) => {
            console.log('📱 canMakePayment result:', result);
            setCanMakePayment(result);

            if (result) {
                setPaymentRequest(pr);
                setStatus('ready');
                console.log('✅ Payment Request is available!');
            } else {
                setStatus('unavailable');
                console.log('❌ Payment Request not available');
                console.log('   This could mean:');
                console.log('   - No wallet configured in browser');
                console.log('   - Domain not registered for Apple Pay');
                console.log('   - Browser doesn\'t support payment request API');
            }
        }).catch((error) => {
            console.error('❌ canMakePayment error:', error);
            setStatus('error');
            setErrorMsg(error.message || 'Failed to check payment methods');
        });

        // Handle payment method
        pr.on('paymentmethod', async (event) => {
            console.log('💳 Payment method received:', event.paymentMethod);

            try {
                // In WordPress, this would confirm the payment on the server
                // For now, we'll complete the event and let parent handle it
                event.complete('success');
                onSuccess({
                    paymentMethod: event.paymentMethod,
                    payerEmail: event.payerEmail,
                    payerName: event.payerName,
                    payerPhone: event.payerPhone,
                });
            } catch (error) {
                console.error('Payment failed:', error);
                event.complete('fail');
                onError?.(error instanceof Error ? error.message : 'Payment failed');
            }
        });

        pr.on('cancel', () => {
            console.log('🚫 Payment cancelled by user');
        });

        return () => {
            // Clean up
        };
    }, [stripe, amount, currency, onSuccess, onError]);

    // Mount the button when ready
    useEffect(() => {
        if (!stripe || !paymentRequest || !buttonRef.current) return;

        console.log('🔧 Mounting Payment Request Button...');

        const elements = stripe.elements();
        const prButton = elements.create('paymentRequestButton', {
            paymentRequest,
            style: {
                paymentRequestButton: {
                    type: 'default',
                    theme: 'dark',
                    height: '48px',
                },
            },
        });

        prButton.mount(buttonRef.current);
        console.log('✅ Payment Request Button mounted');

        return () => {
            prButton.unmount();
        };
    }, [stripe, paymentRequest]);

    // Hide if not available and not in debug mode
    if (status === 'unavailable' && !showDebug) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Express Checkout
                </span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Fast & Secure
                </span>
            </div>

            {/* Payment Request Button Container */}
            <div ref={buttonRef} className="min-h-[48px]" />

            {/* Debug info */}
            {showDebug && (
                <div className="mt-4 rounded bg-yellow-50 p-3 text-xs dark:bg-yellow-900/20">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Debug Info (PaymentRequest API):</p>
                    <p>Status: <strong>{status}</strong></p>
                    <p>Stripe loaded: {stripe ? 'Yes' : 'No'}</p>
                    <p>Payment Request: {paymentRequest ? 'Created' : 'Not created'}</p>
                    <p>Amount: {amount} SEK ({Math.round(amount * 100)} öre)</p>
                    <p>canMakePayment: {JSON.stringify(canMakePayment)}</p>
                    {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}

                    {status === 'unavailable' && (
                        <div className="mt-2 text-yellow-700 dark:text-yellow-400">
                            <p className="font-bold">Why wallets aren't showing:</p>
                            <ul className="list-disc pl-4 mt-1">
                                <li>Apple Pay: Requires Safari + Apple Pay set up on device</li>
                                <li>Google Pay: Requires Chrome + payment method saved in Google</li>
                                <li>Neither: Check if domain is registered in Stripe → Apple Pay settings</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Status messages */}
            {status === 'loading' && (
                <p className="mt-2 text-center text-xs text-neutral-500">
                    Checking payment options...
                </p>
            )}

            {status === 'ready' && (
                <>
                    <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Pay instantly with Link, Apple Pay, or Google Pay
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className="text-sm font-medium text-neutral-500">Or continue below</span>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Wrapper - Provides Stripe context without needing clientSecret
 */
export function StripeExpressCheckout(props: ExpressCheckoutProps) {
    const { amount } = props;

    useEffect(() => {
        console.log('🚀 StripeExpressCheckout mounting with amount:', amount);
        console.log('🚀 Stripe Key prefix:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 15));
    }, [amount]);

    if (amount <= 0) {
        console.log('⚠️ Amount is 0 or negative');
        return null;
    }

    // Simply wrap with Elements - no clientSecret needed for PaymentRequest
    return (
        <Elements stripe={stripePromise}>
            <PaymentRequestButtonInner {...props} />
        </Elements>
    );
}

export default StripeExpressCheckout;
