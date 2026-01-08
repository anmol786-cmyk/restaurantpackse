'use client';

import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/woocommerce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Gift, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 500; // SEK

export function CartThresholdMessages({
  className,
  showFreeShipping = true,
}: {
  className?: string;
  showFreeShipping?: boolean;
}) {
  const { getSubtotal, freeShippingThreshold } =
    useCartStore();

  const subtotal = getSubtotal();
  const actualFreeShippingThreshold = freeShippingThreshold || FREE_SHIPPING_THRESHOLD;
  const freeShippingMet = subtotal >= actualFreeShippingThreshold;
  const amountToFree = Math.max(
    0,
    actualFreeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    (subtotal / actualFreeShippingThreshold) * 100,
    100
  );

  return (
    <div className={cn('space-y-3', className)}>
      {/* 1. FREE SHIPPING PROMO (below 500 SEK) */}
      {showFreeShipping && !freeShippingMet && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Free shipping in selected areas of Stockholm when you spend 500kr.
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Add {formatPrice(amountToFree, 'SEK')} more to qualify!
              </p>
              <Progress value={freeShippingProgress} className="h-2" />
              <div className="flex justify-between text-xs text-blue-700 dark:text-blue-400">
                <span>{formatPrice(subtotal, 'SEK')}</span>
                <span>{formatPrice(actualFreeShippingThreshold, 'SEK')}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 2. FREE SHIPPING ACHIEVED (500+ SEK) */}
      {showFreeShipping && freeShippingMet && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>
            <p className="font-semibold text-green-800 dark:text-green-300">
              Congratulations! You qualify for free shipping to selected areas of Stockholm!
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

