'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2, ShoppingCart, FileDown, Mail } from 'lucide-react';
import { ProductAutocomplete } from './product-autocomplete';
import { useCurrency } from '@/hooks/use-currency';
import { toast } from 'sonner';
import type { Product } from '@/types/woocommerce';

interface OrderLine {
  id: string;
  product: Product | null;
  quantity: number;
  price: number;
}

export function QuickOrderForm() {
  const [orderLines, setOrderLines] = useState<OrderLine[]>([
    { id: crypto.randomUUID(), product: null, quantity: 1, price: 0 }
  ]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { format: formatCurrency } = useCurrency();

  const addLine = () => {
    setOrderLines([...orderLines, {
      id: crypto.randomUUID(),
      product: null,
      quantity: 1,
      price: 0
    }]);
  };

  const removeLine = (id: string) => {
    if (orderLines.length === 1) {
      toast.error('You must have at least one order line');
      return;
    }
    setOrderLines(orderLines.filter(line => line.id !== id));
  };

  const updateProduct = (id: string, product: Product) => {
    setOrderLines(orderLines.map(line =>
      line.id === id
        ? { ...line, product, price: parseFloat(String(product.price || 0)) }
        : line
    ));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderLines(orderLines.map(line =>
      line.id === id ? { ...line, quantity } : line
    ));
  };

  const calculateTotal = () => {
    return orderLines.reduce((total, line) => {
      if (line.product && line.quantity > 0) {
        return total + (line.price * line.quantity);
      }
      return total;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    // Validate
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill in your contact information');
      return;
    }

    const validLines = orderLines.filter(line => line.product && line.quantity > 0);
    if (validLines.length === 0) {
      toast.error('Please add at least one product to your order');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/wholesale/quick-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
          items: validLines.map(line => ({
            product_id: line.product!.id,
            product_name: line.product!.name,
            quantity: line.quantity,
            price: line.price,
            total: line.price * line.quantity,
          })),
          total: calculateTotal(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit order');

      const data = await response.json();

      if (data.success) {
        toast.success('Order submitted successfully! Check your email for confirmation.');
        // Reset form
        setOrderLines([{ id: crypto.randomUUID(), product: null, quantity: 1, price: 0 }]);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const validLines = orderLines.filter(line => line.product && line.quantity > 0);
    if (validLines.length === 0) {
      toast.error('Please add at least one product to download PDF');
      return;
    }

    toast.info('PDF generation coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="customer-name">Name *</Label>
            <Input
              id="customer-name"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="customer-email">Email *</Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="john@company.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="customer-phone">Phone *</Label>
            <Input
              id="customer-phone"
              placeholder="+46 70 123 45 67"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Order Lines Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Products</h3>
          <Button
            onClick={addLine}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Line
          </Button>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 pb-2 border-b text-sm font-semibold text-muted-foreground">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1"></div>
        </div>

        {/* Order Lines */}
        <div className="space-y-4">
          {orderLines.map((line, index) => (
            <div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Product Search */}
              <div className="col-span-1 md:col-span-5">
                <Label className="md:hidden mb-1">Product</Label>
                <ProductAutocomplete
                  onSelect={(product) => updateProduct(line.id, product)}
                  selectedProduct={line.product}
                />
              </div>

              {/* Unit Price */}
              <div className="col-span-1 md:col-span-2">
                <Label className="md:hidden mb-1">Unit Price</Label>
                <div className="h-10 flex items-center text-sm font-medium text-muted-foreground">
                  {line.product ? formatCurrency(line.price) : '—'}
                </div>
              </div>

              {/* Quantity */}
              <div className="col-span-1 md:col-span-2">
                <Label className="md:hidden mb-1">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateQuantity(line.id, parseInt(e.target.value) || 1)}
                  className="w-full"
                  disabled={!line.product}
                />
              </div>

              {/* Line Total */}
              <div className="col-span-1 md:col-span-2">
                <Label className="md:hidden mb-1">Total</Label>
                <div className="h-10 flex items-center text-sm font-bold text-primary">
                  {line.product ? formatCurrency(line.price * line.quantity) : '—'}
                </div>
              </div>

              {/* Remove Button */}
              <div className="col-span-1 md:col-span-1">
                <Label className="md:hidden mb-1 invisible">Remove</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLine(line.id)}
                  className="h-10 w-10 text-destructive hover:text-destructive"
                  disabled={orderLines.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t flex justify-end">
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">Order Total</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(calculateTotal())}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={handleDownloadPDF}
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download PDF
        </Button>
        <Button
          size="lg"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Submit Order
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
