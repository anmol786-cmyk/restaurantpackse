'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StripePaymentFormProps {
    amount: number;
    currency: string;
    onSuccess: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
}

export function StripePaymentForm({
    amount,
    currency,
    onSuccess,
    onError,
}: StripePaymentFormProps) {
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
            // Submit the payment element first to validate
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message || 'Please check your payment details');
                setIsProcessing(false);
                return;
            }

            // Build the return URL with order info for redirect-based payments (Klarna, etc.)
            const returnUrl = new URL('/checkout/stripe-return', window.location.origin);

            // Confirm the payment - this will redirect for Klarna/wallet payments
            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl.toString(),
                },
                // Always redirect for redirect-based methods (Klarna, etc.)
                // For card payments, this will return immediately if 3DS is not needed
                redirect: 'if_required',
            });

            if (confirmError) {
                // This error can happen if:
                // 1. Card was declined
                // 2. 3DS failed
                // 3. User cancelled the redirect
                setError(confirmError.message || 'Payment failed');
                onError?.(confirmError.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            // If we get here with a paymentIntent, payment succeeded without redirect (cards usually)
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            } else if (paymentIntent && paymentIntent.status === 'processing') {
                // Some payment methods (bank transfers) may still be processing
                onSuccess(paymentIntent.id);
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // This shouldn't happen with redirect: 'if_required', but handle it
                setError('Additional authentication required. Please try again.');
                setIsProcessing(false);
            } else if (!paymentIntent) {
                // Redirect happened (Klarna, Google Pay, etc.)
                // The user will be redirected to the return_url after completing payment
                // Don't do anything here - the redirect is happening
                console.log('Redirect in progress...');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            onError?.(err instanceof Error ? err.message : 'An unexpected error occurred');
            setIsProcessing(false);
        }
    };

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Payment Amount Display */}
                    <div className="flex items-center justify-between rounded-lg bg-primary-50 p-4 dark:bg-primary-950/20">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            <span className="font-medium text-primary-950 dark:text-primary-50">
                                Total Amount
                            </span>
                        </div>
                        <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
                            {new Intl.NumberFormat('sv-SE', {
                                style: 'currency',
                                currency: currency,
                            }).format(amount)}
                        </span>
                    </div>

                    {/* Stripe Payment Element */}
                    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                        <PaymentElement
                            options={{
                                layout: {
                                    type: 'accordion',
                                    defaultCollapsed: false,
                                    radios: true,
                                    spacedAccordionItems: true,
                                },
                                // Prioritize wallets first for better UX
                                paymentMethodOrder: ['apple_pay', 'google_pay', 'link', 'klarna', 'card'],
                                // Wallet configuration
                                wallets: {
                                    applePay: 'auto', // Shows on Safari/iOS automatically
                                    googlePay: 'auto', // Shows on Chrome with Google account
                                },
                                // Business info for wallet payments
                                business: {
                                    name: 'Anmol Wholesale',
                                },
                                // Fields configuration - collect all required billing details
                                fields: {
                                    billingDetails: {
                                        name: 'auto',      // Collect name for wallet payments
                                        email: 'auto',     // Collect email
                                        phone: 'auto',     // Collect phone number
                                        address: 'auto',   // Collect billing address (required for some payment methods)
                                    },
                                },
                                // Terms display
                                terms: {
                                    card: 'never',         // Don't show terms for cards
                                    applePay: 'never',     // Apple Pay has its own
                                    googlePay: 'never',    // Google Pay has its own
                                },
                            }}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="w-full"
                        size="lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                Pay {new Intl.NumberFormat('sv-SE', {
                                    style: 'currency',
                                    currency: currency,
                                }).format(amount)}
                            </>
                        )}
                    </Button>

                    {/* Payment Security Notice */}
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Your payment information is encrypted and secure. Powered by{' '}
                        <span className="font-semibold">Stripe</span>.
                    </p>
                </div>
            </form>
        </Card>
    );
}
