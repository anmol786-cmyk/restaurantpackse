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
import { WhatsAppOrderButton } from '@/components/whatsapp/whatsapp-order-button';
import { CommerceRules } from '@/config/commerce-rules';
import { useEffect } from 'react';

export function CartDrawer() {
  const { user } = useAuthStore();
  const { format: formatCurrency } = useCurrency();
  const isWholesale = user?.meta_data?.some(m => m.key === 'customer_type' && m.value === 'business') ||
    user?.meta_data?.some(m => m.key === 'is_wholesale_customer' && (m.value === '1' || m.value === 'yes'));

  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems, notification, clearNotification } = useCartStore();

  // Auto-clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
        </SheetHeader>

        {/* Notification Banner */}
        {notification && (
          <div className="mx-4 mt-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{notification.message}</p>
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

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild className="mt-4" onClick={closeCart}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* WhatsApp Order Button - Top of Cart */}
            <div className="px-4 pt-4">
              <WhatsAppOrderButton
                context="cart"
                cartItems={items}
                cartTotal={getTotalPrice(isWholesale).toString()}
                cartSubtotal={getTotalPrice(isWholesale).toString()}
                requireCustomerInfo={true}
                variant="outline"
                size="sm"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                label="Order via WhatsApp"
                onSuccess={() => {
                  closeCart();
                }}
              />
            </div>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-4 border-b pb-4">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0].src}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold line-clamp-2">
                            {item.product.name}
                          </h4>
                          {(() => {
                            // Check for quantity discount first
                            const quantityDiscount = CommerceRules.calculateQuantityDiscount(item.productId, item.quantity, item.price);
                            const tieredPrice = CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale);

                            // Use quantity discount if available, otherwise use tiered pricing
                            const unitPrice = quantityDiscount ? quantityDiscount.unitPrice : tieredPrice.unitPrice;
                            const hasDiscount = quantityDiscount ? quantityDiscount.savingsPercent > 0 : (isWholesale && tieredPrice.discount > 0);
                            const discountLabel = quantityDiscount ? quantityDiscount.currentTierLabel : tieredPrice.label;

                            return (
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {formatCurrency(unitPrice)}
                                </p>
                                {hasDiscount && discountLabel && (
                                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1 rounded border border-green-200">
                                    {discountLabel}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.key)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="ml-auto text-sm font-semibold text-primary">
                          {(() => {
                            const quantityDiscount = CommerceRules.calculateQuantityDiscount(item.productId, item.quantity, item.price);
                            if (quantityDiscount) {
                              return formatCurrency(quantityDiscount.totalPrice);
                            }
                            const tieredPrice = CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale);
                            return formatCurrency(tieredPrice.unitPrice * item.quantity);
                          })()}
                        </span>
                      </div>

                      {/* Discount Hint for next tier */}
                      {(() => {
                        const quantityDiscount = CommerceRules.calculateQuantityDiscount(item.productId, item.quantity, item.price);
                        if (quantityDiscount?.nextTierSuggestion && quantityDiscount.quantityToNextTier) {
                          return (
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + (quantityDiscount.quantityToNextTier || 0))}
                              className="mt-1 text-[10px] text-green-600 hover:underline cursor-pointer text-left"
                            >
                              + {quantityDiscount.nextTierSuggestion}
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
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
      </SheetContent>
    </Sheet>
  );
}
