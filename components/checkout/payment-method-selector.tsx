'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Smartphone, Loader2, FileText, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

export interface PaymentMethod {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    icon?: React.ReactNode;
}

interface PaymentMethodSelectorProps {
    selectedMethod: string;
    onMethodChange: (methodId: string) => void;
    className?: string;
}

const getPaymentIcon = (methodId: string) => {
    switch (methodId) {
        case 'cod':
            return <Banknote className="h-5 w-5" />;
        case 'bacs':
            return <CreditCard className="h-5 w-5" />;
        case 'stripe':
        case 'stripe_cc':
            return <CreditCard className="h-5 w-5" />;
        case 'swish':
            return <Smartphone className="h-5 w-5" />;
        case 'invoice_net30':
        case 'invoice_net60':
            return <FileText className="h-5 w-5" />;
        default:
            return <CreditCard className="h-5 w-5" />;
    }
};

export function PaymentMethodSelector({
    selectedMethod,
    onMethodChange,
    className,
}: PaymentMethodSelectorProps) {
    const { user } = useAuthStore();
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is a verified business customer
    const isBusinessVerified = user?.meta_data?.some(
        m => m.key === 'business_verified' && (m.value === '1' || m.value === 'yes' || m.value === true)
    );
    const isBusinessBasic = user?.meta_data?.some(
        m => m.key === 'customer_type' && m.value === 'business'
    ) || user?.meta_data?.some(
        m => m.key === 'is_wholesale_customer' && (m.value === '1' || m.value === 'yes')
    );

    const fetchPaymentGateways = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/payment-gateways', { cache: 'no-store' });

            if (!response.ok) {
                throw new Error('Failed to fetch payment gateways');
            }

            const data = await response.json();

            const formattedMethods = data.map((gateway: any) => ({
                id: gateway.id,
                title: gateway.title,
                description: gateway.description || `Pay using ${gateway.title}`,
                enabled: gateway.enabled,
                icon: getPaymentIcon(gateway.id),
            }));

            // Add invoice payment methods for verified business customers
            if (isBusinessVerified) {
                formattedMethods.push({
                    id: 'invoice_net30',
                    title: 'Invoice (Net 30)',
                    description: 'Pay within 30 days of invoice date. Available for verified business customers only.',
                    enabled: true,
                    icon: getPaymentIcon('invoice_net30'),
                });
                formattedMethods.push({
                    id: 'invoice_net60',
                    title: 'Invoice (Net 60)',
                    description: 'Pay within 60 days of invoice date. Available for verified business customers only.',
                    enabled: true,
                    icon: getPaymentIcon('invoice_net60'),
                });
            }

            setMethods(formattedMethods);

            // Auto-select first method if none selected
            if (formattedMethods.length > 0 && !selectedMethod) {
                onMethodChange(formattedMethods[0].id);
            }
        } catch (err) {
            console.error('Error fetching payment gateways:', err);
            setError('Failed to load payment methods. Using default options.');
            // Use fallback methods
            const fallbackMethods = [
                {
                    id: 'cod',
                    title: 'Cash on Delivery',
                    description: 'Pay with cash upon delivery',
                    enabled: true,
                    icon: getPaymentIcon('cod'),
                },
            ];
            setMethods(fallbackMethods);
            onMethodChange('cod');
        } finally {
            setLoading(false);
        }
    }, [selectedMethod, onMethodChange, isBusinessVerified]);

    useEffect(() => {
        fetchPaymentGateways();
    }, [fetchPaymentGateways]);

    if (loading) {
        return (
            <Card className={cn('p-6', className)}>
                <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                    <span className="text-neutral-600">Loading payment methods...</span>
                </div>
            </Card>
        );
    }

    const enabledMethods = methods.filter((m) => m.enabled);

    return (
        <div className={cn('space-y-4', className)}>
            <h2 className="font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                Payment Method
            </h2>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
                <div className="space-y-3">
                    {enabledMethods.map((method) => (
                        <Card
                            key={method.id}
                            className={cn(
                                'cursor-pointer transition-all hover:border-primary-500',
                                selectedMethod === method.id
                                    ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500 dark:bg-primary-950/20'
                                    : 'border-neutral-200 dark:border-neutral-800'
                            )}
                            onClick={() => onMethodChange(method.id)}
                        >
                            <div className="flex items-start gap-4 p-4">
                                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                                <div className="flex flex-1 items-start gap-3">
                                    {method.icon && (
                                        <div className="mt-0.5 text-primary-600 dark:text-primary-400">
                                            {method.icon}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Label
                                                htmlFor={method.id}
                                                className="cursor-pointer font-semibold text-primary-950 dark:text-primary-50"
                                            >
                                                {method.title}
                                            </Label>
                                            {(method.id === 'invoice_net30' || method.id === 'invoice_net60') && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    Business Only
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                            {method.description}
                                        </p>

                                        {/* Display additional payment details from WooCommerce */}
                                        {selectedMethod === method.id && method.description && (
                                            <div
                                                className="mt-3 rounded-lg bg-neutral-100 p-3 text-sm dark:bg-neutral-800 prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: method.description }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </RadioGroup>

            {enabledMethods.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No payment methods are currently available. Please contact support.
                    </p>
                </div>
            )}
        </div>
    );
}
