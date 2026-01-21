'use client';

import { useState, useEffect } from 'react';
import { CommerceRules, GLOBAL_MOQ } from '@/config/commerce-rules';
import { useCurrency } from '@/hooks/use-currency';
import { Tag, TrendingDown, Plus, Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  const { format: formatCurrency } = useCurrency();
  const [discountResult, setDiscountResult] = useState(
    CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice)
  );

  const hasQuantityDiscount = CommerceRules.hasQuantityDiscount(productId);
  const moq = CommerceRules.getMOQ(productId);
  const tiers = CommerceRules.getQuantityDiscountTiers(productId);

  useEffect(() => {
    const result = CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice);
    setDiscountResult(result);
  }, [productId, quantity, basePrice]);

  if (!hasQuantityDiscount) {
    // Show MOQ info if global MOQ is set
    if (moq > 1) {
      return (
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              Minimum order: <strong>{moq} units</strong>
            </span>
          </div>
        </div>
      );
    }
    return null;
  }

  if (!discountResult) return null;

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Current Price Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            <Tag className="w-3 h-3 mr-1" />
            {discountResult.currentTierLabel}
          </Badge>
          {discountResult.savingsPercent > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-200">
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
            className="flex items-center gap-2 text-xs text-primary hover:underline cursor-pointer group"
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
      {/* MOQ Notice */}
      {moq > 1 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-100">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm text-blue-700">
            Minimum order quantity: <strong>{moq} units</strong>
          </span>
        </div>
      )}

      {/* Pricing Tiers Table */}
      {showTiersTable && tiers.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/50 px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold">Volume Pricing</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {tiers.map((tier, index) => {
              const isCurrentTier = discountResult.currentTierLabel.includes(tier.quantity.split('-')[0]) ||
                (quantity >= parseInt(tier.quantity) &&
                 (!tiers[index + 1] || quantity < parseInt(tiers[index + 1]?.quantity || '9999')));

              return (
                <div
                  key={tier.quantity}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 transition-colors',
                    isCurrentTier && 'bg-green-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-16">
                      {tier.quantity}
                    </span>
                    {isCurrentTier && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-sm font-bold',
                      isCurrentTier ? 'text-green-700' : 'text-foreground'
                    )}>
                      {formatCurrency(tier.price)}
                    </span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      tier.savings === 'Regular'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-green-100 text-green-700'
                    )}>
                      {tier.savings}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Pricing Summary */}
      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Your Price</span>
          </div>
          <Badge className="bg-green-600 hover:bg-green-600">
            {discountResult.currentTierLabel}
          </Badge>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-green-700">
            {formatCurrency(discountResult.unitPrice)}
          </span>
          <span className="text-sm text-muted-foreground">/unit</span>
          {discountResult.savingsPercent > 0 && (
            <span className="text-sm text-green-600 line-through ml-2">
              {formatCurrency(basePrice)}
            </span>
          )}
        </div>

        {discountResult.savings > 0 && (
          <div className="mt-2 text-sm text-green-700">
            Total: {formatCurrency(discountResult.totalPrice)}
            <span className="ml-2 font-semibold">
              (Save {formatCurrency(discountResult.savings)} - {discountResult.savingsPercent}% off)
            </span>
          </div>
        )}
      </div>

      {/* Next Tier Suggestion */}
      {discountResult.nextTierSuggestion && discountResult.priceAtNextTier && (
        <button
          onClick={() => {
            if (onQuantityChange && discountResult.quantityToNextTier) {
              onQuantityChange(quantity + discountResult.quantityToNextTier);
            }
          }}
          className="w-full p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {discountResult.nextTierSuggestion}
                </p>
                <p className="text-xs text-muted-foreground">
                  Next tier price: {formatCurrency(discountResult.priceAtNextTier)}/unit
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-primary">
                +{discountResult.quantityToNextTier} units
              </span>
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
interface CartItemDiscountProps {
  productId: number;
  quantity: number;
  basePrice: number;
}

export function CartItemDiscount({ productId, quantity, basePrice }: CartItemDiscountProps) {
  const { format: formatCurrency } = useCurrency();
  const discountResult = CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice);

  if (!discountResult || discountResult.savingsPercent === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Tag className="w-3 h-3 text-green-600" />
      <span className="text-xs text-green-600 font-medium">
        {discountResult.currentTierLabel} - Save {discountResult.savingsPercent}%
      </span>
    </div>
  );
}
