'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/woocommerce';
import { useCartStore } from '@/store/cart-store';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Tag } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { CommerceRules } from '@/config/commerce-rules';
import { CouponInput } from './coupon-input';
import { calculateCartTax, getTaxBreakdownByRate } from '@/lib/tax/calculate-tax';

interface OrderSummaryProps {
    shippingCost?: number;
    className?: string;
    discountAmount?: number;
    onApplyCoupon?: (coupon: any) => void;
    appliedCoupon?: string;
}

export function OrderSummary({
    shippingCost: propShippingCost,
    className,
    discountAmount = 0,
    onApplyCoupon,
    appliedCoupon
}: OrderSummaryProps) {
    const { user } = useAuthStore();
    const isWholesale = user?.meta_data?.some(m => m.key === 'customer_type' && m.value === 'business') ||
        user?.meta_data?.some(m => m.key === 'is_wholesale_customer' && (m.value === '1' || m.value === 'yes'));

    const { items, getTotalPrice, getShippingCost } = useCartStore();

    // Get shipping cost from cart store or fallback to prop
    const shippingCost = propShippingCost !== undefined ? propShippingCost : getShippingCost();

    // Calculate tax dynamically based on each product's tax_class
    // This handles mixed carts (some items at 12% VAT, others at 25%)
    const cartItemsWithPricing = items.map(item => ({
        product: item.product,
        variation: item.variation,
        quantity: item.quantity,
        price: CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale).unitPrice,
    }));

    const taxCalculation = calculateCartTax(cartItemsWithPricing, true);
    const taxBreakdown = getTaxBreakdownByRate(cartItemsWithPricing, true);

    const subtotalWithoutTax = taxCalculation.subtotalWithoutTax;
    const includedTax = taxCalculation.taxAmount;
    const totalWithTax = getTotalPrice(isWholesale);

    // Total = items total (already includes tax) + shipping - discount
    const total = Math.max(0, totalWithTax + shippingCost - discountAmount);

    if (items.length === 0) {
        return (
            <Card className={className}>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <ShoppingBag className="mb-4 h-12 w-12 text-neutral-400" />
                    <p className="text-neutral-600 dark:text-neutral-400">Your cart is empty</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <div className="p-6">
                <h2 className="mb-6 font-heading text-xl font-bold text-primary-950 dark:text-primary-50">
                    Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.key} className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-neutral-100 dark:bg-neutral-800">
                                {item.product.images && item.product.images.length > 0 ? (
                                    <Image
                                        src={item.product.images[0].src}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ShoppingBag className="h-6 w-6 text-neutral-400" />
                                    </div>
                                )}
                                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                                    {item.quantity}
                                </Badge>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <p className="font-medium text-primary-950 dark:text-primary-50">
                                        {item.product.name}
                                    </p>
                                    {item.variation && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Variation: {item.variation.id}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                                        {formatPrice(CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale).unitPrice * item.quantity, 'SEK')}
                                    </p>
                                    {isWholesale && CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale).discount > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100 italic">
                                            <Tag className="w-2.5 h-2.5" />
                                            {CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale).label}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="my-6" />

                {/* Totals */}
                <div className="space-y-3">
                    {/* Subtotal without tax */}
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                            Subtotal (excl. tax)
                        </span>
                        <span className="font-medium">{formatPrice(subtotalWithoutTax, 'SEK')}</span>
                    </div>

                    {/* Tax included in prices - with breakdown for mixed rates */}
                    {taxBreakdown.length === 1 ? (
                        // Single tax rate - simple display
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Tax ({taxBreakdown[0].rate}% included)
                            </span>
                            <span className="font-medium">{formatPrice(includedTax, 'SEK')}</span>
                        </div>
                    ) : (
                        // Multiple tax rates - show breakdown
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                    Tax (mixed rates included)
                                </span>
                                <span className="font-medium">{formatPrice(includedTax, 'SEK')}</span>
                            </div>
                            {/* Show individual rates */}
                            <div className="pl-4 space-y-1 border-l-2 border-neutral-200 dark:border-neutral-700">
                                {taxBreakdown.map((item) => (
                                    <div key={item.rate} className="flex justify-between text-xs text-neutral-500 dark:text-neutral-500">
                                        <span>{item.rate}% VAT</span>
                                        <span>{formatPrice(item.taxAmount, 'SEK')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Discount {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                            <span>-{formatPrice(discountAmount, 'SEK')}</span>
                        </div>
                    )}

                    {shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
                            <span className="font-medium">{formatPrice(shippingCost, 'SEK')}</span>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-primary-950 dark:text-primary-50">Total</span>
                        <span className="text-primary-700 dark:text-primary-400">
                            {formatPrice(total, 'SEK')}
                        </span>
                    </div>
                </div>

                {onApplyCoupon && !appliedCoupon && (
                    <>
                        <Separator className="my-6" />
                        <CouponInput onApply={onApplyCoupon} />
                    </>
                )}

                {/* Free Shipping Banner */}
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                    <p className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                        <span>🚚</span>
                        {totalWithTax >= 5000 ? (
                            <span>You qualify for free shipping within Stockholm!</span>
                        ) : (
                            <span>Free shipping within Stockholm on orders over 5,000 kr</span>
                        )}
                    </p>
                    {totalWithTax < 5000 && (
                        <p className="mt-1 text-xs text-green-600 dark:text-green-500">
                            Add {formatPrice(5000 - totalWithTax, 'SEK')} more to qualify
                        </p>
                    )}
                </div>

                {/* Additional Info */}
                <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm dark:bg-neutral-900">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        <strong>Note:</strong> Prices include VAT where applicable. Final shipping costs will be calculated based on your location.
                    </p>
                </div>
            </div>
        </Card>
    );
}
