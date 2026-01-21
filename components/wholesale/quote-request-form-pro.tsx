'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Plus, Trash2, Send, Package, Building2, ClipboardList,
  Search, Minus, CheckCircle2, MessageSquare, FileText, ArrowRight,
  Clock, ShieldCheck, Sparkles, Phone, Mail, Calculator
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import type { Product } from '@/types/woocommerce';
import Image from 'next/image';
import { CommerceRules, GLOBAL_MOQ } from '@/config/commerce-rules';

// Schema for quote form
const quoteItemSchema = z.object({
  productId: z.number().optional(),
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  quantity: z.number().min(1, 'Minimum quantity is 1'),
  unitPrice: z.number().optional(),
  image: z.string().optional(),
});

const quoteSchema = z.object({
  // Business Info
  companyName: z.string().min(1, 'Company name is required'),
  vatNumber: z.string().optional(),
  businessType: z.string().min(1, 'Business type is required'),
  // Contact Info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  // Items
  items: z.array(quoteItemSchema).min(1, 'At least one item is required'),
  // Additional
  message: z.string().optional(),
  preferredDeliveryDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteItem {
  productId?: number;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice?: number;
  image?: string;
}

// Step indicator
const STEPS = [
  { id: 1, label: 'Products', icon: Package },
  { id: 2, label: 'Business Info', icon: Building2 },
  { id: 3, label: 'Review & Submit', icon: FileText },
];

export function QuoteRequestFormPro() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionType, setSubmissionType] = useState<'website' | 'whatsapp' | null>(null);
  const [quoteResult, setQuoteResult] = useState<{
    success: boolean;
    quoteId?: string;
    orderId?: number;
    message?: string;
  } | null>(null);

  const { format: formatCurrency } = useCurrency();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      companyName: '',
      vatNumber: '',
      businessType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      items: [{ name: '', quantity: GLOBAL_MOQ, sku: '' }],
      message: '',
      preferredDeliveryDate: '',
      deliveryAddress: '',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Calculate totals
  const items = form.watch('items');
  const estimatedTotal = items.reduce((sum, item) => {
    if (item.unitPrice && item.quantity) {
      return sum + (item.unitPrice * item.quantity);
    }
    return sum;
  }, 0);

  const hasAllPrices = items.every(item => item.unitPrice && item.unitPrice > 0);

  // Submit handler
  async function onSubmit(data: QuoteFormValues, type: 'website' | 'whatsapp') {
    setIsLoading(true);
    setSubmissionType(type);

    try {
      if (type === 'website') {
        // Submit to API - creates WooCommerce order
        const response = await fetch('/api/quotes/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            totalEstimate: estimatedTotal,
            source: 'quote-request-pro',
            createOrder: true, // Flag to create WooCommerce order
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setQuoteResult({
            success: true,
            quoteId: result.quoteId,
            orderId: result.orderId,
            message: result.message,
          });
          toast.success('Quote request submitted successfully!');
        } else {
          toast.error(result.error || 'Failed to submit quote request');
        }
      } else {
        // Generate WhatsApp message
        const whatsappMessage = generateWhatsAppMessage(data, estimatedTotal);
        const whatsappNumber = '46735000000'; // Replace with actual business number
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Also submit to API for tracking (without order creation)
        await fetch('/api/quotes/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            totalEstimate: estimatedTotal,
            source: 'quote-request-whatsapp',
            createOrder: false,
          }),
        });

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        setQuoteResult({
          success: true,
          message: 'WhatsApp opened with your quote request.',
        });
        toast.success('Opening WhatsApp...');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Generate WhatsApp message
  function generateWhatsAppMessage(data: QuoteFormValues, total: number): string {
    const itemsList = data.items
      .map((item, i) => `${i + 1}. ${item.name} - Qty: ${item.quantity}${item.sku ? ` (SKU: ${item.sku})` : ''}`)
      .join('\n');

    return `*QUOTE REQUEST - Anmol Wholesale*

*Business Information*
Company: ${data.companyName}
VAT/Org: ${data.vatNumber || 'N/A'}
Type: ${data.businessType}

*Contact Person*
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

*Requested Products*
${itemsList}

${total > 0 ? `*Estimated Total: ${formatCurrency(total)}*` : '*Please provide pricing*'}

${data.preferredDeliveryDate ? `Preferred Delivery: ${data.preferredDeliveryDate}` : ''}
${data.deliveryAddress ? `Delivery Address: ${data.deliveryAddress}` : ''}
${data.message ? `\n*Additional Notes:*\n${data.message}` : ''}

---
Sent via Anmol Wholesale Quote System`;
  }

  // Success state
  if (quoteResult?.success) {
    return <QuoteSuccessState result={quoteResult} onReset={() => {
      setQuoteResult(null);
      form.reset();
      setCurrentStep(1);
    }} />;
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                  isActive && 'bg-primary text-primary-foreground',
                  isCompleted && 'bg-green-100 text-green-700',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Step 1: Products */}
          {currentStep === 1 && (
            <ProductsStep
              fields={fields}
              form={form}
              append={append}
              remove={remove}
              update={update}
              formatCurrency={formatCurrency}
              estimatedTotal={estimatedTotal}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Business Info */}
          {currentStep === 2 && (
            <BusinessInfoStep
              form={form}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <ReviewStep
              form={form}
              items={items}
              estimatedTotal={estimatedTotal}
              hasAllPrices={hasAllPrices}
              formatCurrency={formatCurrency}
              isLoading={isLoading}
              submissionType={submissionType}
              onBack={() => setCurrentStep(2)}
              onSubmit={(type) => form.handleSubmit((data) => onSubmit(data, type))()}
            />
          )}
        </form>
      </Form>
    </div>
  );
}

// Step 1: Products Selection
function ProductsStep({
  fields,
  form,
  append,
  remove,
  update,
  formatCurrency,
  estimatedTotal,
  onNext,
}: {
  fields: any[];
  form: any;
  append: (item: any) => void;
  remove: (index: number) => void;
  update: (index: number, item: any) => void;
  formatCurrency: (n: number) => string;
  estimatedTotal: number;
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Select Products for Quote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <QuoteItemRow
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
              onUpdate={(data: Partial<QuoteItem>) => {
                const current = form.getValues(`items.${index}`);
                update(index, { ...current, ...data });
              }}
              canRemove={fields.length > 1}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>

        {/* Add Item Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: '', quantity: GLOBAL_MOQ, sku: '' })}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Product
        </Button>

        <Separator />

        {/* Totals */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Total</p>
            <p className="text-2xl font-bold">
              {estimatedTotal > 0 ? formatCurrency(estimatedTotal) : 'Price on request'}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {fields.length} {fields.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {/* MOQ Notice */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Sparkles className="w-4 h-4" />
          <span>Minimum order quantity: <strong>{GLOBAL_MOQ} units</strong> per product</span>
        </div>

        {/* Next Button */}
        <Button
          type="button"
          onClick={onNext}
          className="w-full"
          disabled={fields.length === 0 || !form.getValues('items')[0]?.name}
        >
          Continue to Business Info
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Quote Item Row with Product Search
function QuoteItemRow({
  index,
  form,
  onRemove,
  onUpdate,
  canRemove,
  formatCurrency,
}: {
  index: number;
  form: any;
  onRemove: () => void;
  onUpdate: (data: Partial<QuoteItem>) => void;
  canRemove: boolean;
  formatCurrency: (n: number) => string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const item = form.watch(`items.${index}`);
  const lineTotal = (item.unitPrice || 0) * (item.quantity || 0);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&per_page=8`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.products || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeout = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSelectProduct = (product: Product) => {
    const price = product.price ? parseFloat(String(product.price)) : undefined;
    onUpdate({
      productId: product.id,
      name: product.name,
      sku: product.sku || '',
      unitPrice: price,
      image: product.images?.[0]?.src,
      quantity: Math.max(item.quantity || GLOBAL_MOQ, GLOBAL_MOQ),
    });
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(GLOBAL_MOQ, (item.quantity || GLOBAL_MOQ) + delta);
    form.setValue(`items.${index}.quantity`, newQty);
  };

  return (
    <Card className="border-muted">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-3 items-start">
          {/* Product Image */}
          <div className="col-span-2 md:col-span-1">
            {item.image ? (
              <div className="relative w-12 h-12 rounded overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Search/Name */}
          <div className="col-span-10 md:col-span-5" ref={wrapperRef}>
            {item.productId ? (
              <div className="space-y-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.sku && `SKU: ${item.sku} • `}
                  {item.unitPrice ? formatCurrency(item.unitPrice) : 'Price TBD'}
                </p>
                <button
                  type="button"
                  onClick={() => onUpdate({ productId: undefined, name: '', sku: '', unitPrice: undefined, image: undefined })}
                  className="text-xs text-primary hover:underline"
                >
                  Change product
                </button>
              </div>
            ) : (
              <div className="relative">
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search or type product name..."
                            value={searchQuery || field.value}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            className="pl-9"
                          />
                          {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Search Dropdown */}
                {isOpen && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted text-left"
                      >
                        {product.images?.[0] ? (
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                              sizes="32px"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.price ? formatCurrency(parseFloat(String(product.price))) : 'Price TBD'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="col-span-6 md:col-span-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= GLOBAL_MOQ}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={GLOBAL_MOQ}
                    value={field.value}
                    onChange={(e) => field.onChange(Math.max(GLOBAL_MOQ, parseInt(e.target.value) || GLOBAL_MOQ))}
                    className="h-8 w-16 text-center"
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Line Total & Remove */}
          <div className="col-span-6 md:col-span-3 flex items-center justify-between">
            <div className="text-right">
              {lineTotal > 0 ? (
                <p className="font-semibold text-primary">{formatCurrency(lineTotal)}</p>
              ) : (
                <p className="text-sm text-muted-foreground">TBD</p>
              )}
            </div>
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 2: Business Information
function BusinessInfoStep({ form, onBack, onNext }: {
  form: any;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Business AB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT / Org Number</FormLabel>
                <FormControl>
                  <Input placeholder="SE123456789001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="cafe">Café / Coffee Shop</SelectItem>
                  <SelectItem value="catering">Catering Service</SelectItem>
                  <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                  <SelectItem value="grocery">Grocery Store / Supermarket</SelectItem>
                  <SelectItem value="foodtruck">Food Truck</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="distributor">Distributor / Reseller</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+46 70 123 45 67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Delivery Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preferredDeliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street, City, Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back to Products
          </Button>
          <Button type="button" onClick={onNext} className="flex-1">
            Review Quote
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 3: Review & Submit
function ReviewStep({
  form,
  items,
  estimatedTotal,
  hasAllPrices,
  formatCurrency,
  isLoading,
  submissionType,
  onBack,
  onSubmit,
}: {
  form: any;
  items: QuoteItem[];
  estimatedTotal: number;
  hasAllPrices: boolean;
  formatCurrency: (n: number) => string;
  isLoading: boolean;
  submissionType: 'website' | 'whatsapp' | null;
  onBack: () => void;
  onSubmit: (type: 'website' | 'whatsapp') => void;
}) {
  const values = form.getValues();

  return (
    <div className="space-y-6">
      {/* Quote Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Quote Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Info Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{values.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{values.firstName} {values.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{values.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{values.phone}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">Products ({items.length})</h4>
            <div className="border rounded-lg divide-y">
              {items.map((item: QuoteItem, i: number) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {item.unitPrice ? formatCurrency(item.unitPrice * item.quantity) : 'TBD'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground">
                {hasAllPrices ? 'Estimated Total' : 'Total'}
              </p>
              <p className="text-2xl font-bold text-primary">
                {estimatedTotal > 0 ? formatCurrency(estimatedTotal) : 'Price on request'}
              </p>
            </div>
            <Calculator className="w-8 h-8 text-primary/50" />
          </div>

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes or Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Special delivery instructions, recurring order preferences, specific brands, etc."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Submission Options */}
      <Card>
        <CardHeader>
          <CardTitle>How would you like to submit?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website Submission */}
            <button
              type="button"
              onClick={() => onSubmit('website')}
              disabled={isLoading}
              className={cn(
                'p-6 rounded-xl border-2 transition-all text-left',
                'hover:border-primary hover:bg-primary/5',
                isLoading && submissionType === 'website' && 'border-primary bg-primary/5'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Submit via Website</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Creates a quote order in our system. We'll email you a formal quote.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Response within 24h
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Order tracking
                    </Badge>
                  </div>
                </div>
              </div>
              {isLoading && submissionType === 'website' && (
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Creating your quote...</span>
                </div>
              )}
            </button>

            {/* WhatsApp Submission */}
            <button
              type="button"
              onClick={() => onSubmit('whatsapp')}
              disabled={isLoading}
              className={cn(
                'p-6 rounded-xl border-2 transition-all text-left',
                'hover:border-green-500 hover:bg-green-50',
                isLoading && submissionType === 'whatsapp' && 'border-green-500 bg-green-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Send via WhatsApp</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Opens WhatsApp with your quote details. Chat directly with our team.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      <Phone className="w-3 h-3 mr-1" />
                      Instant chat
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Direct support
                    </Badge>
                  </div>
                </div>
              </div>
              {isLoading && submissionType === 'whatsapp' && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Opening WhatsApp...</span>
                </div>
              )}
            </button>
          </div>

          {/* Back Button */}
          <Button type="button" variant="outline" onClick={onBack} className="w-full">
            Back to Edit
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Features Teaser */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">Coming Soon</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Save quotes as templates for recurring orders</li>
                <li>• Track quote status in your dashboard</li>
                <li>• Convert accepted quotes to orders with one click</li>
                <li>• Request quote revisions online</li>
                <li>• PDF quote download and print</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Success State Component
function QuoteSuccessState({
  result,
  onReset,
}: {
  result: { success: boolean; quoteId?: string; orderId?: number; message?: string };
  onReset: () => void;
}) {
  return (
    <Card className="text-center">
      <CardContent className="py-12 space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Quote Request Received!</h2>
          {result.quoteId && (
            <p className="text-lg">
              Reference: <span className="font-mono font-bold text-primary">{result.quoteId}</span>
            </p>
          )}
          {result.orderId && (
            <p className="text-sm text-muted-foreground">
              Order ID: #{result.orderId}
            </p>
          )}
        </div>

        <p className="text-muted-foreground max-w-md mx-auto">
          {result.message || 'Thank you for choosing Anmol Wholesale. Our B2B team will review your request and send you a personalized quote within 24 business hours.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" onClick={onReset}>
            <Plus className="w-4 h-4 mr-2" />
            Submit Another Quote
          </Button>
          <Button asChild>
            <a href="/wholesale">
              Explore Wholesale
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* What's Next */}
        <div className="pt-6 border-t mt-6">
          <h4 className="font-semibold mb-4">What happens next?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">1</span>
              </div>
              <p className="font-medium">Review</p>
              <p className="text-muted-foreground text-xs">Our team reviews your request</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">2</span>
              </div>
              <p className="font-medium">Quote</p>
              <p className="text-muted-foreground text-xs">You receive a detailed quote</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">3</span>
              </div>
              <p className="font-medium">Order</p>
              <p className="text-muted-foreground text-xs">Accept and place your order</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
