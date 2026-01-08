'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Package, PackageOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { getTotalItems, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only show count after client-side hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setItemCount(getTotalItems());
  }, [getTotalItems]);

  // Update count when cart changes
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      setItemCount(state.getTotalItems());
    });
    return unsubscribe;
  }, []);

  const Icon = itemCount > 0 ? PackageOpen : Package;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-transparent"
      onClick={openCart}
      aria-label="Open shopping cart"
    >
      <Icon className="h-6 w-6 transition-all duration-300" />
      {mounted && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground animate-in zoom-in duration-300">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );
}
