'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/woocommerce';
import {
  X,
  AlertCircle,
  ShoppingCart,
  Share2,
  Heart,
  TrendingDown,
  Edit,
  Save,
  Trash2,
  Plus,
  List,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { WishlistItem, WishlistPriority } from '@/store/wishlist-store';

export function WishlistDrawer() {
  const {
    items,
    lists,
    isOpen,
    currentListId,
    closeWishlist,
    removeItem,
    getTotalItems,
    notification,
    clearNotification,
    moveToCart,
    updateItem,
    getItemsByList,
    setCurrentList,
    clearList,
    createList,
    priceDropAlerts,
    dismissPriceAlert,
  } = useWishlistStore();

  const { addItem: addToCart } = useCartStore();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const currentList = lists.find((list) => list.id === currentListId);
  const currentItems = getItemsByList(currentListId);

  // Auto-clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const handleMoveToCart = (item: WishlistItem) => {
    moveToCart(item.id, (product, variation) => {
      addToCart(product, 1, variation);
    });
  };

  const handleEditNotes = (item: WishlistItem) => {
    setEditingNotes(item.id);
    setNotesText(item.notes || '');
  };

  const handleSaveNotes = (itemId: string) => {
    updateItem(itemId, { notes: notesText });
    setEditingNotes(null);
  };

  const handlePriorityChange = (itemId: string, priority: WishlistPriority) => {
    updateItem(itemId, { priority });
  };

  const handleShare = async () => {
    if (currentList) {
      const shareUrl = useWishlistStore.getState().getShareUrl(currentListId);
      if (navigator.share) {
        try {
          await navigator.share({
            title: currentList.name,
            text: `Check out my wishlist: ${currentList.name}`,
            url: shareUrl,
          });
        } catch (err) {
          // User cancelled or share failed
          console.log('Share cancelled');
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        useWishlistStore.getState().setNotification({
          message: 'Share link copied to clipboard!',
          type: 'success',
          timestamp: Date.now(),
        });
      }
    }
  };

  const getPriorityColor = (priority: WishlistPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPriceChange = (item: WishlistItem) => {
    if (item.currentPrice < item.originalPrice) {
      const percentageChange =
        ((item.originalPrice - item.currentPrice) / item.originalPrice) * 100;
      return percentageChange.toFixed(0);
    }
    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-current text-red-500" />
                {currentList?.name || 'Wishlist'}
              </SheetTitle>
              <SheetDescription>
                {getTotalItems(currentListId)} {getTotalItems(currentListId) === 1 ? 'item' : 'items'}
              </SheetDescription>
            </div>

            {/* List Selector */}
            {lists.length > 1 && (
              <Select value={currentListId} onValueChange={setCurrentList}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({getTotalItems(list.id)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </SheetHeader>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`mx-4 mt-4 rounded-lg border p-3 ${
              notification.type === 'success'
                ? 'border-green-500/50 bg-green-500/10'
                : notification.type === 'error'
                ? 'border-red-500/50 bg-red-500/10'
                : notification.type === 'warning'
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-blue-500/50 bg-blue-500/10'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                className={`h-5 w-5 flex-shrink-0 ${
                  notification.type === 'success'
                    ? 'text-green-600'
                    : notification.type === 'error'
                    ? 'text-red-600'
                    : notification.type === 'warning'
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`}
              />
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    notification.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : notification.type === 'error'
                      ? 'text-red-800 dark:text-red-200'
                      : notification.type === 'warning'
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearNotification}
                className="h-6 w-6 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Price Drop Alerts */}
        {priceDropAlerts.length > 0 && (
          <div className="mx-4 mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-3">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-5 w-5 flex-shrink-0 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {priceDropAlerts.length} Price Drop{priceDropAlerts.length > 1 ? 's' : ''} Detected!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Some items in your wishlist are now cheaper
                </p>
              </div>
            </div>
          </div>
        )}

        {currentItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Heart className="h-16 w-16 text-muted-foreground opacity-20" />
            <p className="mt-4 text-muted-foreground">Your wishlist is empty</p>
            <Button asChild className="mt-4" onClick={closeWishlist}>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {currentItems.map((item) => {
                  const priceChange = getPriceChange(item);

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 border-b pb-4"
                    >
                      {/* Priority Badge */}
                      <div className="absolute -left-2 -top-2 z-10">
                        <Badge
                          className={`h-6 px-2 text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority}
                        </Badge>
                      </div>

                      {/* Product Image */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border hover:opacity-80 transition-opacity"
                        onClick={closeWishlist}
                      >
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0].src}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">
                              No image
                            </span>
                          </div>
                        )}
                        {priceChange && (
                          <div className="absolute top-1 right-1 flex items-center gap-1 rounded-md bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">
                            <TrendingDown className="h-3 w-3" />
                            {priceChange}%
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div className="flex-1">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={closeWishlist}
                            >
                              <h4 className="text-sm font-semibold line-clamp-2 hover:underline">
                                {item.product.name}
                              </h4>
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(item.currentPrice, 'SEK')}
                              </p>
                              {priceChange && (
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatPrice(item.originalPrice, 'SEK')}
                                </p>
                              )}
                            </div>
                            {item.variation && (
                              <p className="text-xs text-muted-foreground">
                                {item.variation.attributes
                                  .map((attr) => attr.option)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Notes Section */}
                        {editingNotes === item.id ? (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              placeholder="Add a note..."
                              className="h-16 text-xs"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveNotes(item.id)}
                                className="h-7 text-xs"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingNotes(null)}
                                className="h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {item.notes && (
                              <p className="mt-1 text-xs text-muted-foreground italic">
                                {item.notes}
                              </p>
                            )}
                          </>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveToCart(item)}
                            className="h-8 text-xs"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotes(item)}
                            className="h-8 text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {item.notes ? 'Edit Note' : 'Add Note'}
                          </Button>
                          <Select
                            value={item.priority}
                            onValueChange={(value: WishlistPriority) =>
                              handlePriorityChange(item.id, value)
                            }
                          >
                            <SelectTrigger className="h-8 w-24 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wishlist Footer */}
            <SheetFooter className="flex-col gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to clear all items from ${currentList?.name}?`
                      )
                    ) {
                      clearList(currentListId);
                    }
                  }}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear List
                </Button>
              </div>

              <Button asChild size="lg" className="w-full" onClick={closeWishlist}>
                <Link href="/my-account?tab=wishlist">View All Lists</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
