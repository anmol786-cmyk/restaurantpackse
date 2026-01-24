'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/woocommerce';
import { useCurrency } from '@/hooks/use-currency';
import { Minus, Plus, X, AlertCircle } from 'lucide-react';
{/* Cart Footer */ }
<SheetFooter className="flex-col gap-3">
  <div className="flex justify-between border-t pt-4 text-base font-bold">
    <span>Total:</span>
    <span>{formatCurrency(getTotalPrice(isWholesale))}</span>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <Button asChild variant="outline" size="default" onClick={closeCart} className="text-sm">
      <Link href="/shop">Continue Shopping</Link>
    </Button>
    <Button asChild size="default" onClick={closeCart} className="text-sm">
      <Link href="/checkout">Checkout</Link>
    </Button>
  </div>
</SheetFooter>
          </>
        )}
      </SheetContent >
    </Sheet >
  );
}
