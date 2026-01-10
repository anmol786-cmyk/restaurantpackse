'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  calculateShippingCost,
  getDeliveryEstimate,
  SHIPPING_ZONES,
  COUNTRY_NAMES,
} from '@/config/shipping-zones';
import { useCurrency } from '@/hooks/use-currency';
import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShippingCalculatorProps {
  orderTotal?: number;
  onShippingCalculated?: (cost: number, country: string) => void;
}

export function ShippingCalculator({
  orderTotal = 0,
  onShippingCalculated,
}: ShippingCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState('SE');
  const [cartTotal, setCartTotal] = useState(orderTotal);
  const { format: formatCurrency } = useCurrency();

  const shippingResult = calculateShippingCost(selectedCountry, cartTotal);
  const deliveryEstimate = getDeliveryEstimate(selectedCountry);

  const handleCalculate = () => {
    if (onShippingCalculated) {
      onShippingCalculated(shippingResult.cost, selectedCountry);
    }
  };

  // Get unique countries from all zones
  const availableCountries = Array.from(
    new Set(SHIPPING_ZONES.filter((z) => z.enabled).flatMap((z) => z.countries))
  ).sort();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Shipping Calculator
          </h3>
          <p className="text-sm text-muted-foreground">
            Calculate shipping costs and delivery times for your order
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Delivery Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map((code) => (
                  <SelectItem key={code} value={code}>
                    {COUNTRY_NAMES[code] || code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orderTotal">Order Total (SEK)</Label>
            <Input
              id="orderTotal"
              type="number"
              min="0"
              step="0.01"
              value={cartTotal}
              onChange={(e) => setCartTotal(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </div>

        {shippingResult.zone ? (
          <div className="space-y-4">
            {/* Shipping Zone Info */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {shippingResult.zone.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {shippingResult.zone.courierService}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Delivery Time
                </span>
                <span className="text-sm font-semibold">{deliveryEstimate}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-base font-semibold">Shipping Cost</span>
                <span className="text-lg font-bold text-primary">
                  {shippingResult.isFree ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatCurrency(shippingResult.cost)
                  )}
                </span>
              </div>
            </div>

            {/* Free Shipping Threshold */}
            {!shippingResult.isFree && shippingResult.zone.freeShippingThreshold > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Add {formatCurrency(shippingResult.zone.freeShippingThreshold - cartTotal)} more
                  to qualify for free shipping to {COUNTRY_NAMES[selectedCountry]}!
                </AlertDescription>
              </Alert>
            )}

            {onShippingCalculated && (
              <Button onClick={handleCalculate} className="w-full">
                Apply Shipping
              </Button>
            )}
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Shipping is not available to {COUNTRY_NAMES[selectedCountry] || selectedCountry}.
              Please contact us for a custom quote.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
