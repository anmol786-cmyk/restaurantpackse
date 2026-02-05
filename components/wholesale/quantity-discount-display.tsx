'use client';

import { useState, useEffect } from 'react';
import { CommerceRules, GLOBAL_MOQ } from '@/config/commerce-rules';
import { formatPrice } from '@/lib/utils';
import { Tag, TrendingDown, Plus, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { isApprovedWholesaleCustomer } from '@/lib/auth';

interface QuantityDiscountDisplayProps {
  productId: number;
  basePrice: number;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  showTiersTable?: boolean;
  compact?: boolean;
}

export function QuantityDiscountDisplay({
  productId,
  basePrice,
  quantity,
  onQuantityChange,
  showTiersTable = true,
  compact = false,
}: QuantityDiscountDisplayProps) {
  const { user } = useAuthStore();
  const isWholesale = isApprovedWholesaleCustomer(user);

  // Check if quantity discounts are enabled for this product
  const isDiscountEnabled = CommerceRules.isQuantityDiscountEnabled(productId);

  const [discountResult, setDiscountResult] = useState(
    CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice)
  );

  const moq = CommerceRules.getMOQ(productId);
  const tiers = CommerceRules.getEffectiveTiers(productId, basePrice);

  useEffect(() => {
    const result = CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice);
    setDiscountResult(result);
  }, [productId, quantity, basePrice]);

  // If quantity discounts are not enabled for this product, return null
  if (!isDiscountEnabled) return null;

  // If no tiers and moq is 1, return null
  if (tiers.length === 0 && moq <= 1) return null;

  if (compact) {
    if (!discountResult) return null;
    return (
      <div className="space-y-2">
        {/* Current Price Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground hover:bg-accent/20 border-accent/20">
            <Tag className="w-3 h-3 mr-1" />
            {discountResult.currentTierLabel}
          </Badge>
          {discountResult.savingsPercent > 0 && (
            <Badge variant="outline" className="text-primary border-primary/20">
              Save {discountResult.savingsPercent}%
            </Badge>
          )}
        </div>

        {/* Next Tier Suggestion */}
        {discountResult.nextTierSuggestion && (
          <button
            onClick={() => {
              if (onQuantityChange && discountResult.quantityToNextTier) {
                onQuantityChange(quantity + discountResult.quantityToNextTier);
              }
            }}
            className="flex items-center gap-2 text-xs text-primary hover:underline cursor-pointer group font-medium"
          >
            <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>{discountResult.nextTierSuggestion}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* MOQ Notice & Wholesale Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {moq > 1 && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <Info className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="text-xs">
              <span className="text-muted-foreground block">Minimum Order Quantity</span>
              <span className="font-bold text-primary">{moq} units</span>
            </div>
          </div>
        )}

        {isWholesale ? (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
            <div className="text-xs">
              <span className="text-muted-foreground block">Wholesale Account</span>
              <span className="font-bold text-accent-foreground">Priority Pricing Active</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
            <TrendingDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="text-xs">
              <span className="text-muted-foreground block">Wholesale Savings</span>
              <span className="font-bold">Login for business rates</span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Tiers Table */}
      {showTiersTable && tiers.length > 0 && (
        <div className="rounded-xl border border-primary/10 overflow-hidden bg-card shadow-sm">
          <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-primary-foreground tracking-wide uppercase">Wholesale Volume Tiers</span>
              </div>
              <Badge variant="gold" className="text-[10px] font-bold uppercase transition-transform hover:scale-105">
                Bulk Savings
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-primary/5">
            {tiers.map((tier, index) => {
              const tierMin = parseInt(tier.quantity);
              const isCurrentTier = quantity >= tierMin &&
                (!tiers[index + 1] || quantity < parseInt(tiers[index + 1].quantity));

              return (
                <div
                  key={tier.quantity}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 transition-colors',
                    isCurrentTier ? 'bg-accent/5' : 'hover:bg-muted/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2",
                      isCurrentTier
                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                        : "bg-muted text-muted-foreground border-transparent"
                    )}>
                      {tier.quantity}
                    </div>
                    <div>
                      <span className={cn(
                        "text-sm font-semibold block",
                        isCurrentTier ? "text-accent-foreground" : "text-foreground"
                      )}>
                        {tier.quantity} Units
                      </span>
                      {isCurrentTier && (
                        <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                          Current Tier
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      'text-base font-bold',
                      isCurrentTier ? 'text-primary' : 'text-foreground'
                    )}>
                      {formatPrice(tier.price, 'SEK')}
                    </span>
                    <Badge variant={isCurrentTier ? "gold" : "outline"} className="text-[10px] py-0 px-2">
                      {tier.savings}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Pricing Summary - Only show if there's actual savings */}
      {discountResult && discountResult.savingsPercent > 0 && (
        <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Tier Applied</span>
            </div>
            <Badge className="bg-primary text-primary-foreground hover:bg-primary font-bold">
              {discountResult.currentTierLabel}
            </Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">
              {formatPrice(discountResult.unitPrice, 'SEK')}
            </span>
            <span className="text-sm text-muted-foreground font-medium">/ unit</span>
            <span className="text-sm text-muted-foreground/60 line-through ml-2">
              {formatPrice(basePrice, 'SEK')}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between text-sm">
            <span className="text-primary/70 font-medium">Total for {quantity} units:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-primary block leading-none">
                {formatPrice(discountResult.totalPrice, 'SEK')}
              </span>
              <span className="text-xs text-success font-bold">
                You save {formatPrice(discountResult.savings, 'SEK')} ({discountResult.savingsPercent}% off)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Tier Suggestion */}
      {discountResult && discountResult.nextTierSuggestion && discountResult.priceAtNextTier && (
        <button
          onClick={() => {
            if (onQuantityChange && discountResult.quantityToNextTier) {
              onQuantityChange(quantity + discountResult.quantityToNextTier);
            }
          }}
          className="w-full p-4 bg-card hover:bg-primary/[0.02] rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {discountResult.nextTierSuggestion}
                </p>
                <p className="text-xs text-muted-foreground">
                  Save more with only <span className="font-bold text-accent">{discountResult.quantityToNextTier} more</span> units
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="border-primary/30 text-primary font-bold">
                {formatPrice(discountResult.priceAtNextTier, 'SEK')}/unit
              </Badge>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * Inline version for cart items
 */
export function CartItemDiscount({ productId, quantity, basePrice }: { productId: number; quantity: number; basePrice: number }) {
  // Check if quantity discounts are enabled for this product
  if (!CommerceRules.isQuantityDiscountEnabled(productId)) {
    return null;
  }

  const discountResult = CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice);

  if (!discountResult || discountResult.savingsPercent === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
        <Tag className="w-2.5 h-2.5 text-accent" />
      </div>
      <span className="text-[10px] text-primary font-bold uppercase tracking-tight">
        {discountResult.currentTierLabel} (-{discountResult.savingsPercent}%)
      </span>
    </div>
  );
}
