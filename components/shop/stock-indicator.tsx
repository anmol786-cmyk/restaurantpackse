import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, ProductVariation } from '@/types/woocommerce';

interface StockIndicatorProps {
  product: Product | ProductVariation;
  showQuantity?: boolean;
  variant?: 'default' | 'detailed';
  className?: string;
}

export function StockIndicator({
  product,
  showQuantity = true,
  variant = 'default',
  className,
}: StockIndicatorProps) {
  const { stock_status, stock_quantity, manage_stock, low_stock_amount } = product;

  const isLowStock =
    manage_stock &&
    stock_quantity !== null &&
    low_stock_amount !== null &&
    stock_quantity <= low_stock_amount;

  if (variant === 'detailed') {
    return (
      <div className={cn('space-y-2', className)}>
        {/* Stock Status Badge */}
        {stock_status === 'instock' && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-semibold text-success">In Stock</p>
              {showQuantity && manage_stock && stock_quantity !== null && (
                <p className="text-sm text-muted-foreground">
                  {stock_quantity} {stock_quantity === 1 ? 'unit' : 'units'} available
                </p>
              )}
            </div>
          </div>
        )}

        {stock_status === 'onbackorder' && (
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-semibold text-warning">Available on Backorder</p>
              <p className="text-sm text-muted-foreground">
                Ships when stock arrives
              </p>
            </div>
          </div>
        )}

        {stock_status === 'outofstock' && (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Out of Stock</p>
              <p className="text-sm text-muted-foreground">
                Currently unavailable
              </p>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {isLowStock && stock_status === 'instock' && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
            <p className="text-sm font-medium text-warning-foreground">
              ⚠️ Only {stock_quantity} left in stock - order soon!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default variant - simple badges
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {stock_status === 'instock' && (
        <>
          <Badge variant="outline" className="border-success text-success">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            In Stock
          </Badge>
          {isLowStock && (
            <Badge variant="outline" className="border-warning text-warning">
              Only {stock_quantity} left
            </Badge>
          )}
        </>
      )}

      {stock_status === 'onbackorder' && (
        <Badge variant="outline" className="border-warning text-warning">
          <Clock className="mr-1 h-3 w-3" />
          Backorder
        </Badge>
      )}

      {stock_status === 'outofstock' && (
        <Badge variant="outline" className="border-destructive text-destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Out of Stock
        </Badge>
      )}
    </div>
  );
}
