'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > min) {
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

    if (isNaN(value) || value < min) {
      setQuantity(min);
      onChange?.(min);
    } else if (value > max) {
      setQuantity(max);
      onChange?.(max);
    } else {
      setQuantity(value);
      onChange?.(value);
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
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={handleDecrease}
        disabled={quantity <= min}
        type="button"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <input
        type="number"
        min={min}
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
