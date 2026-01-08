'use client';

import { useWishlistStore } from '@/store/wishlist-store';
import { Button } from '@/components/ui/button';
import type { Product, ProductVariation } from '@/types/woocommerce';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface WishlistButtonProps {
  product: Product;
  variation?: ProductVariation;
  listId?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'ghost' | 'outline';
}

export function WishlistButton({
  product,
  variation,
  listId,
  className,
  showLabel = false,
  size = 'icon',
  variant = 'ghost',
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [isInList, setIsInList] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if item is in wishlist after hydration
  useEffect(() => {
    setMounted(true);
    setIsInList(isInWishlist(product.id, variation?.id, listId));
  }, [isInWishlist, product.id, variation?.id, listId]);

  // Subscribe to wishlist changes
  useEffect(() => {
    const unsubscribe = useWishlistStore.subscribe((state) => {
      setIsInList(state.isInWishlist(product.id, variation?.id, listId));
    });
    return unsubscribe;
  }, [product.id, variation?.id, listId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product, variation, listId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'group relative transition-all duration-300',
        isInList && 'text-red-500 hover:text-red-600',
        !isInList && 'text-gray-400 hover:text-red-500',
        className
      )}
      aria-label={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-300',
          mounted && isInList && 'fill-current scale-110',
          !mounted && 'opacity-0'
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isInList ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}

/**
 * Compact wishlist toggle for product cards
 */
export function WishlistToggle({
  product,
  variation,
  className,
}: {
  product: Product;
  variation?: ProductVariation;
  className?: string;
}) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [isInList, setIsInList] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsInList(isInWishlist(product.id, variation?.id));
  }, [isInWishlist, product.id, variation?.id]);

  useEffect(() => {
    const unsubscribe = useWishlistStore.subscribe((state) => {
      setIsInList(state.isInWishlist(product.id, variation?.id));
    });
    return unsubscribe;
  }, [product.id, variation?.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product, variation);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full p-2 transition-all duration-300 hover:scale-110',
        isInList
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500',
        className
      )}
      aria-label={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          mounted && isInList && 'fill-current'
        )}
      />
    </button>
  );
}
