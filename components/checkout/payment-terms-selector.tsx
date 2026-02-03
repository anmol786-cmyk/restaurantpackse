'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { getCreditStatus, getCreditLimit, getCreditTermsDays, hasAvailableCredit } from '@/lib/auth';
import { CREDIT_TERMS } from '@/config/commerce-rules';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';

interface PaymentTermsSelectorProps {
    orderTotal: number;
    onPaymentTermChange: (term: 'immediate' | 'credit') => void;
    selectedTerm: 'immediate' | 'credit';
}

export function PaymentTermsSelector({ orderTotal, onPaymentTermChange, selectedTerm }: PaymentTermsSelectorProps) {
    const { user, isAuthenticated } = useAuthStore();
    const { format: formatCurrency } = useCurrency();

    const creditStatus = getCreditStatus(user);
    const creditLimit = getCreditLimit(user);
    const creditTermsDays = getCreditTermsDays(user);
    const canUseCredit = hasAvailableCredit(user, orderTotal);
    const isApprovedForCredit = creditStatus === 'approved';
    const isPendingCredit = creditStatus === 'pending';

    // Calculate credit used and available
    const creditUsed = Number(user?.meta_data?.find((m: any) => m.key === 'credit_used')?.value || 0);
    const availableCredit = creditLimit - creditUsed;

    // Check minimum order for credit
    const meetsMinimumForCredit = orderTotal >= CREDIT_TERMS.minOrderForCredit;

    // If user is not authenticated or doesn't have approved credit, don't show this component
    if (!isAuthenticated || !isApprovedForCredit) {
        // Show pending credit status message if applicable
        if (isPendingCredit) {
            return (
                <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Credit Application Pending</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                Your credit application is being reviewed. Once approved, you&apos;ll be able to use {creditTermsDays}-day payment terms.
                            </p>
                        </div>
                    </div>
                </Card>
            );
        }
        return null;
    }

    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Payment Terms
            </h3>

            {/* Credit Status Info */}
            <div className="mb-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-primary/80 dark:text-primary/70 font-medium">Credit Limit:</span>
                    <span className="text-primary dark:text-primary font-bold">{formatCurrency(creditLimit)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-primary/80 dark:text-primary/70">Available Credit:</span>
                    <span className="text-primary dark:text-primary font-semibold">{formatCurrency(availableCredit)}</span>
                </div>
            </div>

            <RadioGroup
                value={selectedTerm}
                onValueChange={(value) => onPaymentTermChange(value as 'immediate' | 'credit')}
                className="space-y-3"
            >
                {/* Immediate Payment Option */}
                <div className="flex items-start space-x-3">
                    <RadioGroupItem value="immediate" id="payment-immediate" className="mt-1" />
                    <Label htmlFor="payment-immediate" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span className="font-medium">Pay Now</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Pay immediately using card, Apple Pay, or Google Pay
                        </p>
                    </Label>
                </div>

                {/* Credit Payment Option */}
                <div className={`flex items-start space-x-3 ${!canUseCredit || !meetsMinimumForCredit ? 'opacity-60' : ''}`}>
                    <RadioGroupItem
                        value="credit"
                        id="payment-credit"
                        className="mt-1"
                        disabled={!canUseCredit || !meetsMinimumForCredit}
                    />
                    <Label htmlFor="payment-credit" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium">{creditTermsDays}-Day Credit</span>
                            <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                                Invoice
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Pay within {creditTermsDays} days via invoice
                        </p>

                        {/* Show reason if credit can't be used */}
                        {!meetsMinimumForCredit && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Minimum order of {formatCurrency(CREDIT_TERMS.minOrderForCredit)} required for credit terms
                            </p>
                        )}
                        {meetsMinimumForCredit && !canUseCredit && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Insufficient credit available. Available: {formatCurrency(availableCredit)}
                            </p>
                        )}
                    </Label>
                </div>
            </RadioGroup>

            {/* Selected term confirmation */}
            {selectedTerm === 'credit' && canUseCredit && meetsMinimumForCredit && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-green-700 dark:text-green-300">Invoice Payment Selected</p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                An invoice will be sent to your email. Payment due within {creditTermsDays} days.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
