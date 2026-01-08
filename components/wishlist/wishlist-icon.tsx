'use client';

import { useWishlistStore } from '@/store/wishlist-store';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WishlistIcon() {
  const { getTotalItems, openWishlist, priceDropAlerts } = useWishlistStore();
  const [itemCount, setItemCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only show count after client-side hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setItemCount(getTotalItems());
    setAlertCount(priceDropAlerts.filter((alert) => !alert.notified).length);
  }, [getTotalItems, priceDropAlerts]);

  // Update count when wishlist changes
  useEffect(() => {
    const unsubscribe = useWishlistStore.subscribe((state) => {
      setItemCount(state.getTotalItems());
      setAlertCount(
        state.priceDropAlerts.filter((alert) => !alert.notified).length
      );
    });
    return unsubscribe;
  }, []);

  const hasItems = itemCount > 0;
  const hasAlerts = alertCount > 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-transparent"
      onClick={() => openWishlist()}
      aria-label="Open wishlist"
    >
      <Heart
        className={`h-6 w-6 transition-all duration-300 ${
          hasItems ? 'fill-current text-red-500' : 'text-gray-400'
        }`}
      />
      {mounted && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-in zoom-in duration-300">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
      {mounted && hasAlerts && (
        <span className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
      )}
    </Button>
  );
}
