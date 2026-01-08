'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cart-store';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateSwedishPostcode, formatSwedishPostcode } from '@/lib/shipping-service';

export function ShippingCalculator({ className }: { className?: string }) {
  const { shippingAddress, setShippingAddress } = useCartStore();

  const [postcode, setPostcode] = useState(shippingAddress?.postcode || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [country, setCountry] = useState(shippingAddress?.country || 'SE');
  const [postcodeError, setPostcodeError] = useState('');

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    setPostcodeError('');
  };

  const handlePostcodeBlur = () => {
    if (postcode) {
      if (country === 'SE' && !validateSwedishPostcode(postcode)) {
        setPostcodeError('Please enter a valid Swedish postcode (e.g., 123 45)');
      } else {
        // Format Swedish postcode
        if (country === 'SE') {
          setPostcode(formatSwedishPostcode(postcode));
        }
      }
    }
  };

  const handleCalculate = useCallback(() => {
    if (!postcode || !city) {
      return;
    }

    // Validate postcode before calculating
    if (country === 'SE' && !validateSwedishPostcode(postcode)) {
      setPostcodeError('Please enter a valid Swedish postcode');
      return;
    }

    setShippingAddress({
      postcode,
      city,
      country,
    });
  }, [postcode, city, country, setShippingAddress]);

  // Auto-calculate when all fields are filled (with debounce)
  useEffect(() => {
    if (postcode && city && !postcodeError) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    }
  }, [postcode, city, postcodeError, handleCalculate]);

  return (
    <Card className={className}>
      <div className="p-6">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold">
          <MapPin className="h-6 w-6" />
          Shipping Address
        </h2>

        <div className="space-y-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SE">Sweden</SelectItem>
                <SelectItem value="NO">Norway</SelectItem>
                <SelectItem value="DK">Denmark</SelectItem>
                <SelectItem value="FI">Finland</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postcode">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postcode"
                placeholder="123 45"
                value={postcode}
                onChange={(e) => handlePostcodeChange(e.target.value)}
                onBlur={handlePostcodeBlur}
                className={postcodeError ? 'border-destructive' : ''}
              />
              {postcodeError ? (
                <p className="text-xs text-destructive">{postcodeError}</p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Enter your postal code to see shipping options
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Stockholm"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* Stockholm restriction info */}
          {country === 'SE' && (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Some perishable items (fresh produce, frozen foods)
                can only be delivered within Stockholm area (postcodes 100 00 - 199 99).
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
