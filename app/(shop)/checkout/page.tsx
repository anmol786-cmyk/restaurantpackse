'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Section } from '@/components/craft';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { PaymentMethodSelector } from '@/components/checkout/payment-method-selector';
import { OrderSummary } from '@/components/checkout/order-summary';
import { createOrderAction } from '@/app/actions/order';
import { validateCartStockAction } from '@/app/actions/cart';
import { validateShippingRestrictions } from '@/app/actions/shipping-restrictions';
import { formatPrice } from '@/lib/woocommerce';
import { calculateShipping, type ShippingMethod } from '@/lib/shipping-service';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  Gift,
  Package,
  MapPin,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { StripePaymentForm } from '@/components/checkout/stripe-payment-form';
import { PaymentRequestButton } from '@/components/checkout/payment-request-button';
import { StripeExpressCheckout } from '@/components/checkout/stripe-express-checkout';
import { trackInitiateCheckout } from '@/lib/analytics';
import { WhatsAppOrderButton } from '@/components/whatsapp/whatsapp-order-button';
import { cn } from '@/lib/utils';

type CheckoutStep = 'information' | 'payment';

interface AddressData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

// Fallback shipping methods if API fails
const FALLBACK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'flat_rate:1',
    method_id: 'flat_rate',
    label: 'Standard Shipping',
    cost: 99,
    total_cost: 99,
    tax: 0,
    meta_data: {},
  },
  {
    id: 'local_pickup:2',
    method_id: 'local_pickup',
    label: 'Store Pickup (Stockholm)',
    cost: 0,
    total_cost: 0,
    tax: 0,
    meta_data: {},
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, setShippingAddress } = useCartStore();
  const { user } = useAuthStore();

  // Step state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');

  // Form data
  const [addressData, setAddressData] = useState<AddressData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.billing?.phone || '',
    address_1: user?.shipping?.address_1 || '',
    address_2: user?.shipping?.address_2 || '',
    city: user?.shipping?.city || '',
    state: user?.shipping?.state || '',
    postcode: user?.shipping?.postcode || '',
    country: user?.shipping?.country || 'SE',
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState<AddressData | null>(null);

  // Shipping state
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<{ productId: number; message: string }[]>([]);
  const [shippingRestrictions, setShippingRestrictions] = useState<
    Array<{ productId: number; productName: string; reason: string }>
  >([]);
  const [coupon, setCoupon] = useState<any | null>(null);

  // Stripe state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [isStripePayment, setIsStripePayment] = useState(false);

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 500;
  const cartTotal = getTotalPrice();
  const qualifiesForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Track initiate checkout
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(items, getTotalPrice());
    }
  }, []);

  // Calculate shipping when postcode changes
  const handleCalculateShipping = useCallback(async (postcode: string, city: string, country: string) => {
    if (!postcode || postcode.length < 5) return;

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const result = await calculateShipping(
        items.map((item) => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
        })),
        postcode,
        city,
        country
      );

      if (result.success && result.available_methods && result.available_methods.length > 0) {
        setShippingMethods(result.available_methods);

        // Auto-select best shipping method
        const freeShipping = result.available_methods.find((m) => m.method_id === 'free_shipping');
        if (freeShipping && qualifiesForFreeShipping) {
          setSelectedShippingMethod(freeShipping);
        } else {
          // Select first non-free method or first method
          const firstPaidMethod = result.available_methods.find((m) => m.method_id !== 'free_shipping');
          setSelectedShippingMethod(firstPaidMethod || result.available_methods[0]);
        }

        // Check for restricted products
        if (result.restricted_products && result.restricted_products.length > 0) {
          setShippingRestrictions(
            result.restricted_products.map((p) => ({
              productId: p.product_id,
              productName: p.product_name,
              reason: p.reason,
            }))
          );
        }
      } else {
        // Use fallback methods
        console.warn('No shipping methods from API, using fallback');
        setShippingMethods(FALLBACK_SHIPPING_METHODS);
        setSelectedShippingMethod(FALLBACK_SHIPPING_METHODS[0]);
      }
    } catch (err) {
      console.error('Shipping calculation failed:', err);
      setShippingError('Could not calculate shipping. Using standard rates.');
      setShippingMethods(FALLBACK_SHIPPING_METHODS);
      setSelectedShippingMethod(FALLBACK_SHIPPING_METHODS[0]);
    } finally {
      setIsCalculatingShipping(false);
    }
  }, [items, qualifiesForFreeShipping]);

  // Handle postcode blur to trigger shipping calculation
  const handlePostcodeBlur = () => {
    if (addressData.postcode && addressData.postcode.replace(/\s/g, '').length >= 5) {
      handleCalculateShipping(addressData.postcode, addressData.city, addressData.country);
      setShippingAddress({
        postcode: addressData.postcode,
        city: addressData.city,
        country: addressData.country,
      });
    }
  };

  // Update address field
  const updateAddress = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate information step
  const validateInformationStep = async (): Promise<boolean> => {
    setError(null);
    setShippingRestrictions([]);

    // Basic validation
    if (!addressData.first_name || !addressData.last_name || !addressData.email) {
      setError('Please fill in your name and email');
      return false;
    }

    if (!addressData.address_1 || !addressData.city || !addressData.postcode) {
      setError('Please fill in your complete address');
      return false;
    }

    if (!selectedShippingMethod) {
      setError('Please select a shipping method');
      return false;
    }

    // Validate shipping restrictions
    const restrictionResult = await validateShippingRestrictions({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      postcode: addressData.postcode,
      city: addressData.city,
      country: addressData.country,
    });

    if (!restrictionResult.success) {
      setError(restrictionResult.error || 'Failed to validate shipping');
      return false;
    }

    if (restrictionResult.data && !restrictionResult.data.valid) {
      setShippingRestrictions(restrictionResult.data.restrictedProducts);
      setError('Some items cannot be shipped to this location');
      return false;
    }

    return true;
  };

  // Continue to payment step
  const handleContinueToPayment = async () => {
    const isValid = await validateInformationStep();
    if (isValid) {
      if (sameAsShipping) {
        setBillingData({ ...addressData, state: addressData.state || '' });
      }
      setCurrentStep('payment');
    }
  };

  // Get shipping cost
  const shippingCost = selectedShippingMethod?.total_cost || selectedShippingMethod?.cost || 0;

  // Handler for successful Stripe payment
  const handleStripeSuccess = async (paymentIntentId: string) => {
    const billing = sameAsShipping ? addressData : billingData;
    if (!billing || !selectedShippingMethod) {
      setError('Missing order information');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;

      const result = await createOrderAction({
        customer_id: isRealCustomer ? user.id : undefined,
        billing: { ...billing, state: billing.state || '' },
        shipping: { ...addressData, state: addressData.state || '' },
        line_items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: selectedShippingMethod.method_id,
            method_title: selectedShippingMethod.label,
            total: shippingCost.toString(),
          },
        ],
        payment_method: paymentMethod,
        payment_method_title: getPaymentMethodTitle(paymentMethod),
        customer_note: orderNotes || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: true,
        transaction_id: paymentIntentId,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create order');
      }

      clearCart();
      router.push(`/checkout/success?order=${result.data.id}&payment_intent=${paymentIntentId}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Payment succeeded but order creation failed. Contact support with ID: ' + paymentIntentId);
      setIsProcessing(false);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    const billing = sameAsShipping ? addressData : billingData;
    if (!billing || !selectedShippingMethod) {
      setError('Please complete all required information');
      return;
    }

    // Check for Stripe payment
    const stripePaymentMethods = ['stripe', 'stripe_cc', 'stripe_klarna', 'klarna', 'link'];
    const isStripe = stripePaymentMethods.includes(paymentMethod) || paymentMethod.startsWith('stripe');
    setIsStripePayment(isStripe);

    setIsProcessing(true);
    setError(null);
    setStockErrors([]);

    try {
      // Validate stock
      const stockResult = await validateCartStockAction(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );

      if (!stockResult.success || !stockResult.data?.valid) {
        setStockErrors(stockResult.data?.errors || []);
        setError('Some items are no longer available');
        setIsProcessing(false);
        return;
      }

      // For Stripe payments, create PaymentIntent
      if (isStripe) {
        const totalAmount = cartTotal + shippingCost - calculateDiscount();

        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
            currency: 'sek',
            customerEmail: billing.email,
            customerName: `${billing.first_name} ${billing.last_name}`,
            billingAddress: {
              line1: billing.address_1,
              line2: billing.address_2,
              city: billing.city,
              state: billing.state,
              postal_code: billing.postcode,
              country: billing.country,
            },
            shippingAddress: {
              name: `${addressData.first_name} ${addressData.last_name}`,
              address_1: addressData.address_1,
              address_2: addressData.address_2,
              city: addressData.city,
              state: addressData.state,
              postcode: addressData.postcode,
              country: addressData.country,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to initialize payment');
        }

        const { clientSecret, paymentIntentId } = await response.json();

        // Store checkout data for redirect recovery
        const checkoutData = {
          billing,
          shipping: addressData,
          shippingMethod: {
            method_id: selectedShippingMethod.method_id,
            label: selectedShippingMethod.label,
            cost: shippingCost,
          },
          paymentMethod,
          items: items.map((item) => ({
            product_id: item.productId,
            variation_id: item.variationId,
            quantity: item.quantity,
          })),
          orderNotes,
          coupon: coupon ? { code: coupon.code } : null,
          paymentIntentId,
        };
        sessionStorage.setItem('pendingCheckoutData', JSON.stringify(checkoutData));

        setStripeClientSecret(clientSecret);
        setIsProcessing(false);
        return;
      }

      // For non-Stripe payments
      const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;

      const result = await createOrderAction({
        customer_id: isRealCustomer ? user.id : undefined,
        billing: { ...billing, state: billing.state || '' },
        shipping: { ...addressData, state: addressData.state || '' },
        line_items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: selectedShippingMethod.method_id,
            method_title: selectedShippingMethod.label,
            total: shippingCost.toString(),
          },
        ],
        payment_method: paymentMethod,
        payment_method_title: getPaymentMethodTitle(paymentMethod),
        customer_note: orderNotes || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: false,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error);
      }

      clearCart();
      router.push(`/checkout/success?order=${result.data.id}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
      setIsProcessing(false);
    }
  };

  const calculateDiscount = () => {
    if (!coupon) return 0;
    if (coupon.discount_type === 'percent') {
      return (cartTotal * parseFloat(coupon.amount)) / 100;
    }
    if (coupon.discount_type === 'fixed_cart') {
      return parseFloat(coupon.amount);
    }
    return 0;
  };

  const getPaymentMethodTitle = (methodId: string): string => {
    const titles: Record<string, string> = {
      cod: 'Cash on Delivery',
      bacs: 'Direct Bank Transfer',
      stripe: 'Credit Card',
      swish: 'Swish',
      credit_net28: 'Credit (Net 28)',
    };
    return titles[methodId] || methodId;
  };

  const getShippingIcon = (methodId: string) => {
    switch (methodId) {
      case 'local_pickup':
        return <Package className="h-5 w-5" />;
      case 'free_shipping':
        return <Gift className="h-5 w-5 text-green-600" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-neutral-400" />
            <h1 className="mb-2 font-heading text-3xl font-bold">Your cart is empty</h1>
            <p className="mb-6 text-neutral-600">Add items to your cart before checkout</p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const steps = [
    { id: 'information', label: 'Information', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="mb-4 font-heading text-4xl font-bold">Checkout</h1>

          {/* 2-Step Progress */}
          <div className="flex items-center justify-center max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                      currentStep === step.id
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : index === 0 && currentStep === 'payment'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    )}
                  >
                    {index === 0 && currentStep === 'payment' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-medium',
                      currentStep === step.id ? 'text-primary-700' : 'text-neutral-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-1 flex-1 rounded',
                      currentStep === 'payment' ? 'bg-green-600' : 'bg-neutral-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {stockErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Stock issues:</p>
              <ul className="mt-2 list-disc pl-4">
                {stockErrors.map((err) => (
                  <li key={err.productId}>{err.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {shippingRestrictions.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Shipping Restrictions:</p>
              <ul className="mt-2 list-disc pl-4">
                {shippingRestrictions.map((r) => (
                  <li key={r.productId}>
                    <strong>{r.productName}:</strong> {r.reason}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Information */}
              {currentStep === 'information' && (
                <motion.div
                  key="information"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Express Checkout */}
                  <StripeExpressCheckout
                    amount={cartTotal}
                    currency="SEK"
                    showDebug={false}
                    onSuccess={async (result) => {
                      console.log('Express checkout success:', result);
                    }}
                    onError={(error) => {
                      setError(`Express checkout failed: ${error}`);
                    }}
                  />

                  {/* Contact Information */}
                  <Card className="p-6">
                    <h2 className="font-heading text-xl font-bold mb-4">Contact Information</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={addressData.email}
                          onChange={(e) => updateAddress('email', e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={addressData.phone}
                          onChange={(e) => updateAddress('phone', e.target.value)}
                          placeholder="+46 70 123 45 67"
                          required
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Shipping Address */}
                  <Card className="p-6">
                    <h2 className="font-heading text-xl font-bold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="first_name">First Name *</Label>
                          <Input
                            id="first_name"
                            value={addressData.first_name}
                            onChange={(e) => updateAddress('first_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Last Name *</Label>
                          <Input
                            id="last_name"
                            value={addressData.last_name}
                            onChange={(e) => updateAddress('last_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address_1">Street Address *</Label>
                        <Input
                          id="address_1"
                          value={addressData.address_1}
                          onChange={(e) => updateAddress('address_1', e.target.value)}
                          placeholder="Street name and number"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address_2">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="address_2"
                          value={addressData.address_2 || ''}
                          onChange={(e) => updateAddress('address_2', e.target.value)}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <Label htmlFor="postcode">Postcode *</Label>
                          <Input
                            id="postcode"
                            value={addressData.postcode}
                            onChange={(e) => updateAddress('postcode', e.target.value)}
                            onBlur={handlePostcodeBlur}
                            placeholder="123 45"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={addressData.city}
                            onChange={(e) => updateAddress('city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Select
                            value={addressData.country}
                            onValueChange={(v) => updateAddress('country', v)}
                          >
                            <SelectTrigger id="country">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SE">Sweden</SelectItem>
                              <SelectItem value="NO">Norway</SelectItem>
                              <SelectItem value="DK">Denmark</SelectItem>
                              <SelectItem value="FI">Finland</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Shipping Method */}
                  <Card className="p-6">
                    <h2 className="font-heading text-xl font-bold mb-4">Shipping Method</h2>

                    {/* Free Shipping Progress */}
                    {!qualifiesForFreeShipping && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="flex items-center gap-2 font-medium text-green-800">
                            <Gift className="h-4 w-4" />
                            Free shipping at {formatPrice(FREE_SHIPPING_THRESHOLD, 'SEK')}
                          </span>
                          <span className="font-semibold text-green-700">
                            {formatPrice(amountToFreeShipping, 'SEK')} to go!
                          </span>
                        </div>
                        <Progress value={freeShippingProgress} className="h-2" />
                      </div>
                    )}

                    {qualifiesForFreeShipping && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <Gift className="h-5 w-5" />
                          <span className="font-semibold">You qualify for free shipping!</span>
                        </div>
                      </div>
                    )}

                    {isCalculatingShipping ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600 mr-2" />
                        <span>Calculating shipping rates...</span>
                      </div>
                    ) : shippingMethods.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500">
                        <Truck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Enter your postcode to see shipping options</p>
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedShippingMethod?.id}
                        onValueChange={(id) => {
                          const method = shippingMethods.find((m) => m.id === id);
                          if (method) setSelectedShippingMethod(method);
                        }}
                      >
                        <div className="space-y-2">
                          {shippingMethods.map((method) => (
                            <div
                              key={method.id}
                              className={cn(
                                'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all',
                                selectedShippingMethod?.id === method.id
                                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              )}
                              onClick={() => setSelectedShippingMethod(method)}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <div className="text-primary-600">
                                  {getShippingIcon(method.method_id)}
                                </div>
                                <Label htmlFor={method.id} className="cursor-pointer font-medium">
                                  {method.label}
                                </Label>
                              </div>
                              <span className="font-bold">
                                {method.cost === 0 ? (
                                  <span className="text-green-600">Free</span>
                                ) : (
                                  formatPrice(method.total_cost || method.cost, 'SEK')
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}

                    {shippingError && (
                      <p className="mt-2 text-sm text-amber-600">{shippingError}</p>
                    )}
                  </Card>

                  {/* Billing Address Toggle */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="same-billing"
                        checked={sameAsShipping}
                        onCheckedChange={(c) => setSameAsShipping(c as boolean)}
                      />
                      <Label htmlFor="same-billing" className="cursor-pointer">
                        Billing address same as shipping
                      </Label>
                    </div>
                  </Card>

                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    onClick={handleContinueToPayment}
                    disabled={!selectedShippingMethod}
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Order Summary Card */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Shipping to</h3>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setCurrentStep('information')}
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {addressData.first_name} {addressData.last_name}
                      <br />
                      {addressData.address_1}
                      {addressData.address_2 && <>, {addressData.address_2}</>}
                      <br />
                      {addressData.postcode} {addressData.city}, {addressData.country}
                    </p>
                    {selectedShippingMethod && (
                      <p className="mt-2 text-sm">
                        <span className="text-neutral-500">Shipping:</span>{' '}
                        <span className="font-medium">{selectedShippingMethod.label}</span>
                        {' - '}
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          formatPrice(shippingCost, 'SEK')
                        )}
                      </p>
                    )}
                  </Card>

                  {/* Payment Method */}
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    orderTotal={cartTotal + shippingCost}
                  />

                  {/* Order Notes */}
                  <Card className="p-6">
                    <Label htmlFor="order-notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="order-notes"
                      placeholder="Special instructions for your order..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </Card>

                  {/* Stripe Payment Form */}
                  {stripeClientSecret && isStripePayment && (
                    <Card className="p-6">
                      <h3 className="font-heading text-lg font-bold mb-4">Complete Payment</h3>
                      <StripeProvider clientSecret={stripeClientSecret}>
                        <PaymentRequestButton
                          amount={cartTotal + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => setError(`Payment failed: ${error}`)}
                        />
                        <StripePaymentForm
                          amount={cartTotal + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => setError(`Payment failed: ${error}`)}
                        />
                      </StripeProvider>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep('information')}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 rounded-full"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || (isStripePayment && !!stripeClientSecret)}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Place Order - ${formatPrice(cartTotal + shippingCost - calculateDiscount(), 'SEK')}`
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <WhatsAppOrderButton
                context="cart"
                cartItems={items}
                cartTotal={cartTotal.toString()}
                cartSubtotal={cartTotal.toString()}
                requireCustomerInfo={true}
                variant="outline"
                size="lg"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                label="Order via WhatsApp"
                onSuccess={() => {
                  clearCart();
                  router.push('/');
                }}
              />

              <OrderSummary
                shippingCost={shippingCost}
                discountAmount={calculateDiscount()}
                onApplyCoupon={setCoupon}
                appliedCoupon={coupon?.code}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
