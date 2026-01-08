'use client';

import { useAuthStore } from '@/store/auth-store';
import { WHOLESALE_TIERS } from '@/config/commerce-rules';
import { formatPrice } from '@/lib/woocommerce';
import { Tag, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface WholesalePriceDisplayProps {
    basePrice: number;
}

export function WholesalePriceDisplay({ basePrice }: WholesalePriceDisplayProps) {
    const { isAuthenticated, user } = useAuthStore();
    const isWholesale = user?.meta_data?.some(m => m.key === 'customer_type' && m.value === 'business') ||
        user?.meta_data?.some(m => m.key === 'is_wholesale_customer' && (m.value === '1' || m.value === 'yes'));

    if (!isAuthenticated) {
        return (
            <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Business Pricing</span>
                        <span className="text-[11px] text-muted-foreground">Login for wholesale rates</span>
                    </div>
                </div>
                <ChevronRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
        );
    }

    if (isWholesale) {
        return (
            <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-bold text-green-600 uppercase">Tiered Pricing</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                    {WHOLESALE_TIERS.map((tier) => {
                        const discountedPrice = basePrice * (1 - tier.discount);
                        return (
                            <div key={tier.minQuantity} className="flex flex-col items-center p-1 rounded bg-green-50 border border-green-100 italic">
                                <span className="text-[9px] text-green-700 font-bold">{tier.minQuantity}+ qty</span>
                                <span className="text-[10px] font-bold text-green-800">{formatPrice(discountedPrice, 'SEK')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}
