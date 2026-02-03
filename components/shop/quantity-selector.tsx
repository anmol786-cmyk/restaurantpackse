'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommerceRules } from '@/config/commerce-rules';
import { useCurrency } from '@/hooks/use-currency';

interface QuantitySelectorProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  productId?: number;
  basePrice?: number;
  showDiscountHint?: boolean;
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className,
  productId,
  basePrice,
  showDiscountHint = true,
}: QuantitySelectorProps) {
  // Calculate MOQ for this product
  const moq = productId ? CommerceRules.getMOQ(productId) : min;
  const effectiveMin = Math.max(min, moq);

  // Ensure initial quantity respects MOQ
  const [quantity, setQuantity] = useState(Math.max(initialQuantity, effectiveMin));

  const { format: formatCurrency } = useCurrency();

  // Get discount info if available
  const discountResult = productId && basePrice
    ? CommerceRules.calculateQuantityDiscount(productId, quantity, basePrice)
    : null;

  // Update quantity when initialQuantity changes (for cart sync)
  useEffect(() => {
    setQuantity(prev => {
      if (initialQuantity !== prev) {
        return Math.max(initialQuantity, effectiveMin);
      }
      return prev;
    });
  }, [initialQuantity, effectiveMin]);

  const handleDecrease = () => {
    if (quantity > effectiveMin) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < effectiveMin) {
      setQuantity(effectiveMin);
      onChange?.(effectiveMin);
    } else if (value > max) {
      setQuantity(max);
      onChange?.(max);
    } else {
      setQuantity(value);
      onChange?.(value);
    }
  };

  const handleAddToNextTier = () => {
    if (discountResult?.quantityToNextTier) {
      const newQuantity = Math.min(quantity + discountResult.quantityToNextTier, max);
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  };

  const inputSizeClasses = {
    sm: 'h-8 w-12 text-sm',
    md: 'h-10 w-14',
    lg: 'h-12 w-16 text-lg',
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={sizeClasses[size]}
          onClick={handleDecrease}
          disabled={quantity <= effectiveMin}
          type="button"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <input
          type="number"
          min={effectiveMin}
          max={max}
          value={quantity}
          onChange={handleInputChange}
          className={cn(
            'rounded-md border border-input bg-background px-3 py-2 text-center font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            inputSizeClasses[size]
          )}
          aria-label="Quantity"
        />

        <Button
          variant="outline"
          size="icon"
          className={sizeClasses[size]}
          onClick={handleIncrease}
          disabled={quantity >= max}
          type="button"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          {quantity === 1 ? '1 item' : `${quantity} items`}
        </span>
      </div>

      {/* MOQ Notice */}
      {moq > 1 && quantity === effectiveMin && (
        <p className="text-xs text-accent-foreground">
          Minimum order: {moq} units
        </p>
      )}

      {/* Discount Hint */}
      {showDiscountHint && discountResult?.nextTierSuggestion && discountResult.priceAtNextTier && (
        <button
          type="button"
          onClick={handleAddToNextTier}
          className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 hover:underline cursor-pointer group"
        >
          <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
          <span>{discountResult.nextTierSuggestion}</span>
          <span className="text-muted-foreground">
            ({formatCurrency(discountResult.priceAtNextTier)}/unit)
          </span>
        </button>
      )}

      {/* Current Discount Badge */}
      {discountResult && discountResult.savingsPercent > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
            {discountResult.currentTierLabel} - Save {discountResult.savingsPercent}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Usage Example:
 *
 * import { QuantitySelector } from '@/components/shop/quantity-selector';
 *
 * function ProductPage() {
 *   const [quantity, setQuantity] = useState(1);
 *
 *   return (
 *     <QuantitySelector
 *       initialQuantity={quantity}
 *       onChange={setQuantity}
 *       min={1}
 *       max={10}
 *     />
 *   );
 * }
 */
