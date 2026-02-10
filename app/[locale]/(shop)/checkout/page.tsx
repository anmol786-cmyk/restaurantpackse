'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
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
import { PaymentTermsSelector } from '@/components/checkout/payment-terms-selector';
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



export default function CheckoutPage() {
  const t = useTranslations('checkoutPage');
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
  const [paymentTerm, setPaymentTerm] = useState<'immediate' | 'credit'>('immediate');
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

  const cartTotal = getTotalPrice();

  // Track initiate checkout
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(items, getTotalPrice());
    }
  }, [items, getTotalPrice]);

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

        // Select first method by default
        setSelectedShippingMethod(result.available_methods[0]);

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
        setShippingMethods([]);
        setSelectedShippingMethod(null);
        setShippingError(t('noShippingMethods'));
      }
    } catch (err) {
      console.error('Shipping calculation failed:', err);
      setShippingError(t('couldNotFetchShipping'));
      setShippingMethods([]);
      setSelectedShippingMethod(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  }, [items, t]);

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
      setError(t('fillNameEmail'));
      return false;
    }

    if (!addressData.address_1 || !addressData.city || !addressData.postcode) {
      setError(t('fillCompleteAddress'));
      return false;
    }

    if (!selectedShippingMethod) {
      setError(t('selectShippingMethod'));
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
      setError(t('someItemsCannotShip'));
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
      setError(t('paymentSucceededOrderFailed', { id: paymentIntentId }));
      setIsProcessing(false);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    const billing = sameAsShipping ? addressData : billingData;
    if (!billing || !selectedShippingMethod) {
      setError(t('completeAllInfo'));
      return;
    }

    // Handle credit payment term - skip Stripe entirely
    const isCreditPayment = paymentTerm === 'credit';
    const effectivePaymentMethod = isCreditPayment ? 'invoice_credit' : paymentMethod;

    // Check for Stripe payment (only when not using credit terms)
    const stripePaymentMethods = ['stripe', 'stripe_cc', 'stripe_klarna', 'klarna', 'link'];
    const isStripe = !isCreditPayment && (stripePaymentMethods.includes(paymentMethod) || paymentMethod.startsWith('stripe'));
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
        setError(t('someItemsUnavailable'));
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

      // Build metadata for credit payment
      const creditMetaData = isCreditPayment ? [
        { key: 'payment_terms', value: 'net_28' },
        { key: 'payment_due_date', value: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { key: 'is_credit_payment', value: 'yes' },
      ] : [];

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
        payment_method: effectivePaymentMethod,
        payment_method_title: getPaymentMethodTitle(effectivePaymentMethod),
        customer_note: orderNotes || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: false,
        meta_data: creditMetaData.length > 0 ? creditMetaData : undefined,
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
      invoice_credit: 'Invoice - 28 Day Credit',
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
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">{t('emptyCartTitle')}</h1>
            <p className="mb-6 text-muted-foreground">{t('emptyCartDesc')}</p>
            <Button asChild size="lg" variant="gold">
              <Link href="/shop">{t('shopNow')}</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const steps = [
    { id: 'information', label: t('stepInformation'), icon: MapPin },
    { id: 'payment', label: t('stepPayment'), icon: CreditCard },
  ];

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground">{t('title')}</h1>

          {/* 2-Step Progress */}
          <div className="flex items-center justify-center max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary-100'
                        : index === 0 && currentStep === 'payment'
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground'
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
                      currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-1 flex-1 rounded',
                      currentStep === 'payment' ? 'bg-success' : 'bg-muted'
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
              <p className="font-semibold">{t('stockIssues')}</p>
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
              <p className="font-semibold">{t('shippingRestrictions')}</p>
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
                      setError(t('expressCheckoutFailed', { error }));
                    }}
                  />

                  {/* Contact Information */}
                  <Card className="p-6">
                    <h2 className="font-heading text-xl font-bold mb-4">{t('contactInfo')}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">{t('emailLabel')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={addressData.email}
                          onChange={(e) => updateAddress('email', e.target.value)}
                          placeholder={t('emailPlaceholder')}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('phoneLabel')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={addressData.phone}
                          onChange={(e) => updateAddress('phone', e.target.value)}
                          placeholder={t('phonePlaceholder')}
                          required
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Shipping Address */}
                  <Card className="p-6">
                    <h2 className="font-heading text-xl font-bold mb-4">{t('shippingAddressTitle')}</h2>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="first_name">{t('firstName')}</Label>
                          <Input
                            id="first_name"
                            value={addressData.first_name}
                            onChange={(e) => updateAddress('first_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">{t('lastName')}</Label>
                          <Input
                            id="last_name"
                            value={addressData.last_name}
                            onChange={(e) => updateAddress('last_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address_1">{t('streetAddress')}</Label>
                        <Input
                          id="address_1"
                          value={addressData.address_1}
                          onChange={(e) => updateAddress('address_1', e.target.value)}
                          placeholder={t('streetPlaceholder')}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address_2">{t('apartment')}</Label>
                        <Input
                          id="address_2"
                          value={addressData.address_2 || ''}
                          onChange={(e) => updateAddress('address_2', e.target.value)}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <Label htmlFor="postcode">{t('postcode')}</Label>
                          <Input
                            id="postcode"
                            value={addressData.postcode}
                            onChange={(e) => updateAddress('postcode', e.target.value)}
                            onBlur={handlePostcodeBlur}
                            placeholder={t('postcodePlaceholder')}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">{t('city')}</Label>
                          <Input
                            id="city"
                            value={addressData.city}
                            onChange={(e) => updateAddress('city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">{t('country')}</Label>
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
                    <h2 className="font-heading text-xl font-bold mb-4">{t('shippingMethodTitle')}</h2>

                    {/* Free Shipping Banner */}
                    <div className="mb-4 rounded-lg border border-success/30 bg-success/10 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-success">
                        <Truck className="h-4 w-4" />
                        {cartTotal >= 5000 ? (
                          <span>{t('freeShippingQualify')}</span>
                        ) : (
                          <span>{t('freeShippingThreshold')}</span>
                        )}
                      </p>
                      {cartTotal < 5000 && (
                        <p className="mt-1 text-xs text-success/80">
                          {t('addMoreForFreeShipping', { amount: formatPrice(5000 - cartTotal, 'SEK') })}
                        </p>
                      )}
                    </div>

                    {/* Shipping methods list below */}

                    {isCalculatingShipping ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                        <span className="text-muted-foreground">{t('calculatingShipping')}</span>
                      </div>
                    ) : shippingMethods.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Truck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>{t('enterPostcode')}</p>
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
                                  ? 'border-primary bg-primary-50 ring-2 ring-primary'
                                  : 'border-border hover:border-primary/30'
                              )}
                              onClick={() => setSelectedShippingMethod(method)}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <div className="text-primary">
                                  {getShippingIcon(method.method_id)}
                                </div>
                                <Label htmlFor={method.id} className="cursor-pointer font-medium text-foreground">
                                  {method.label}
                                </Label>
                              </div>
                              <span className="font-bold text-foreground">
                                {method.cost === 0 ? (
                                  <span className="text-success">{t('free')}</span>
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
                        {t('sameBilling')}
                      </Label>
                    </div>
                  </Card>

                  <Button
                    size="lg"
                    variant="gold"
                    className="w-full"
                    onClick={handleContinueToPayment}
                    disabled={!selectedShippingMethod}
                  >
                    {t('continueToPayment')}
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
                      <h3 className="font-semibold text-foreground">{t('shippingTo')}</h3>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setCurrentStep('information')}
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addressData.first_name} {addressData.last_name}
                      <br />
                      {addressData.address_1}
                      {addressData.address_2 && <>, {addressData.address_2}</>}
                      <br />
                      {addressData.postcode} {addressData.city}, {addressData.country}
                    </p>
                    {selectedShippingMethod && (
                      <p className="mt-2 text-sm">
                        <span className="text-muted-foreground">{t('shippingLabel')}</span>{' '}
                        <span className="font-medium text-foreground">{selectedShippingMethod.label}</span>
                        {' - '}
                        {shippingCost === 0 ? (
                          <span className="text-success font-semibold">{t('free')}</span>
                        ) : (
                          formatPrice(shippingCost, 'SEK')
                        )}
                      </p>
                    )}
                  </Card>

                  {/* Payment Terms for Business Customers with Credit */}
                  <PaymentTermsSelector
                    orderTotal={cartTotal + shippingCost}
                    onPaymentTermChange={setPaymentTerm}
                    selectedTerm={paymentTerm}
                  />

                  {/* Payment Method - only show if paying immediately */}
                  {paymentTerm === 'immediate' && (
                    <PaymentMethodSelector
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                      orderTotal={cartTotal + shippingCost}
                    />
                  )}

                  {/* Order Notes */}
                  <Card className="p-6">
                    <Label htmlFor="order-notes">{t('orderNotesLabel')}</Label>
                    <Textarea
                      id="order-notes"
                      placeholder={t('orderNotesPlaceholder')}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </Card>

                  {/* Stripe Payment Form */}
                  {stripeClientSecret && isStripePayment && (
                    <Card className="p-6">
                      <h3 className="font-heading text-lg font-bold mb-4">{t('completePayment')}</h3>
                      <StripeProvider clientSecret={stripeClientSecret}>
                        <PaymentRequestButton
                          amount={cartTotal + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => setError(t('paymentFailed', { error }))}
                        />
                        <StripePaymentForm
                          amount={cartTotal + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => setError(t('paymentFailed', { error }))}
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
                      {t('back')}
                    </Button>
                    <Button
                      size="lg"
                      variant="gold"
                      className="flex-1"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || (isStripePayment && !!stripeClientSecret)}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('processing')}
                        </>
                      ) : (
                        t('placeOrderAmount', { amount: formatPrice(cartTotal + shippingCost - calculateDiscount(), 'SEK') })
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
                label={t('orderViaWhatsApp')}
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
