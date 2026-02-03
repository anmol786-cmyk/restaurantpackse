'use client';

import { useAuthStore } from '@/store/auth-store';
import { WHOLESALE_TIERS } from '@/config/commerce-rules';
import { useCurrency } from '@/hooks/use-currency';
import { Tag, Building2, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getWholesaleStatus, getCreditStatus } from '@/lib/auth';

interface WholesalePriceDisplayProps {
    basePrice: number;
    showCompact?: boolean;
}

export function WholesalePriceDisplay({ basePrice, showCompact = false }: WholesalePriceDisplayProps) {
    const { isAuthenticated, user } = useAuthStore();
    const { format: formatCurrency } = useCurrency();

    const wholesaleStatus = getWholesaleStatus(user);
    const creditStatus = getCreditStatus(user);
    const isApprovedWholesale = wholesaleStatus === 'approved';
    const isPendingWholesale = wholesaleStatus === 'pending';
    const isBusinessCustomer = wholesaleStatus !== 'none';

    // Not authenticated - show register CTA
    if (!isAuthenticated) {
        return (
            <Link
                href="/wholesale/register"
                className="mt-2 p-3 bg-accent/10 rounded-lg border border-accent/30 flex items-center justify-between group cursor-pointer hover:bg-accent/15 hover:border-accent/50 transition-all duration-200"
            >
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Business Pricing Available</span>
                        <span className="text-[11px] text-muted-foreground">Register for wholesale rates & credit terms</span>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
        );
    }

    // Authenticated but not a business customer - show upgrade CTA
    if (!isBusinessCustomer) {
        return (
            <Link
                href="/wholesale/register"
                className="mt-2 p-3 bg-gradient-to-r from-accent/5 to-accent/15 rounded-lg border border-accent/30 flex items-center justify-between group cursor-pointer hover:from-accent/10 hover:to-accent/20 transition-all duration-200"
            >
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Upgrade to Business Account</span>
                        <span className="text-[11px] text-muted-foreground">Get up to 20% off with volume pricing</span>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
        );
    }

    // Pending wholesale approval
    if (isPendingWholesale) {
        return (
            <div className="mt-2 p-3 bg-warning/10 rounded-lg border border-warning/30">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-warning uppercase tracking-wider">Verification Pending</span>
                        <span className="text-[11px] text-warning/80">Your business account is being verified. Wholesale pricing will be enabled shortly.</span>
                    </div>
                </div>
                {/* Show preview of pricing tiers */}
                <div className="mt-3 pt-3 border-t border-warning/30">
                    <span className="text-[10px] text-warning/80 uppercase font-medium">Preview: Pricing after approval</span>
                    <div className="grid grid-cols-3 gap-1 mt-2 opacity-60">
                        {WHOLESALE_TIERS.map((tier) => {
                            const discountedPrice = basePrice * (1 - tier.discount);
                            return (
                                <div key={tier.minQuantity} className="flex flex-col items-center p-1 rounded bg-warning/10 border border-warning/20">
                                    <span className="text-[9px] text-warning font-bold">{tier.minQuantity}+ qty</span>
                                    <span className="text-[10px] font-bold text-warning">{formatCurrency(discountedPrice)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Approved wholesale customer - show full pricing tiers
    if (isApprovedWholesale) {
        if (showCompact) {
            // Compact version for smaller spaces
            return (
                <div className="mt-2 flex items-center gap-2">
                    <Tag className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-bold text-green-600 uppercase">Wholesale: Up to {Math.round(WHOLESALE_TIERS[WHOLESALE_TIERS.length - 1].discount * 100)}% off</span>
                </div>
            );
        }

        return (
            <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Wholesale Pricing Active</span>
                    </div>
                    {creditStatus === 'approved' && (
                        <span className="text-[9px] font-medium text-primary bg-primary/10 dark:bg-primary/20 px-1.5 py-0.5 rounded">
                            28-Day Credit
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {WHOLESALE_TIERS.map((tier) => {
                        const discountedPrice = basePrice * (1 - tier.discount);
                        const savingsPercent = Math.round(tier.discount * 100);
                        return (
                            <div key={tier.minQuantity} className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                <span className="text-[9px] text-green-700 dark:text-green-400 font-bold">{tier.minQuantity}+ units</span>
                                <span className="text-sm font-bold text-green-800 dark:text-green-300">{formatCurrency(discountedPrice)}</span>
                                <span className="text-[9px] text-green-600 dark:text-green-500">Save {savingsPercent}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}
