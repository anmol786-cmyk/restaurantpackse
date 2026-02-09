'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cart-store';
import { Container, Section } from '@/components/craft';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/woocommerce';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { StripeExpressCheckout } from '@/components/checkout/stripe-express-checkout';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const t = useTranslations('cart');
  const tf = useTranslations('freeShipping');

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-2 text-3xl font-bold">{t('emptyTitle')}</h1>
            <p className="mb-6 text-muted-foreground">
              {t('emptyDesc')}
            </p>
            <Button asChild size="lg">
              <Link href="/shop">{t('continueShopping')}</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 rounded-lg border p-4"
                >
                  {/* Product Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border sm:h-32 sm:w-32">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 128px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground">{t('noImage')}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/${item.product.slug}`}
                            className="font-semibold hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.categories && item.product.categories.length > 0 && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.product.categories[0].name}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {t('price')} {formatPrice(item.price, 'SEK')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity, 'SEK')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <Button variant="outline" onClick={clearCart}>
                {t('clearCart')}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border p-6 sticky top-4">
              <h2 className="mb-4 text-xl font-bold">{t('orderSummary')}</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span>{formatPrice(getTotalPrice(), 'SEK')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span>{t('calculatedAtCheckout')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('tax')}</span>
                  <span>{t('calculatedAtCheckout')}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('total')}</span>
                    <span>{formatPrice(getTotalPrice(), 'SEK')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* Express Checkout - Apple Pay / Google Pay */}
                <StripeExpressCheckout
                  amount={getTotalPrice()}
                  currency="SEK"
                  showDebug={false}
                  onSuccess={(result) => {
                    console.log('Express checkout from cart success:', result);
                  }}
                  onError={(error) => {
                    console.error('Express checkout from cart error:', error);
                  }}
                />

                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">{t('proceedToCheckout')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/shop">{t('continueShopping')}</Link>
                </Button>
              </div>

              {/* Free Shipping Banner */}
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
                <p className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <span>🚚</span>
                  {getTotalPrice() >= 5000 ? (
                    <span>{tf('qualify')}</span>
                  ) : (
                    <span>{tf('threshold')}</span>
                  )}
                </p>
                {getTotalPrice() < 5000 && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-500">
                    {tf('addMore', { amount: formatPrice(5000 - getTotalPrice(), 'SEK') })}
                  </p>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {t('taxesNote')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
