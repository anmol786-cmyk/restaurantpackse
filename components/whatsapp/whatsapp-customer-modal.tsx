/**
 * WhatsApp Customer Info Modal
 * Collects customer information before creating WhatsApp order
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type {
  WhatsAppCustomerData,
  WhatsAppShippingAddress,
  WhatsAppBillingAddress,
} from '@/types/whatsapp';

// Validation schema
const customerFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format'),
  address_1: z.string().min(1, 'Street address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required').default('SE'),
  billingSameAsShipping: z.boolean().default(true),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

export interface WhatsAppCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    customer: WhatsAppCustomerData;
    shipping: WhatsAppShippingAddress;
    billing?: WhatsAppBillingAddress;
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

export function WhatsAppCustomerModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: WhatsAppCustomerModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      country: 'SE',
      billingSameAsShipping: true,
    },
  });

  const billingSameAsShipping = watch('billingSameAsShipping');

  const onFormSubmit = (data: CustomerFormData) => {
    const customer: WhatsAppCustomerData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    };

    const shipping: WhatsAppShippingAddress = {
      address_1: data.address_1,
      address_2: data.address_2,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country,
    };

    const billing: WhatsAppBillingAddress | undefined = data.billingSameAsShipping
      ? undefined
      : {
          ...shipping,
          email: data.email,
          phone: data.phone,
        };

    onSubmit({
      customer,
      shipping,
      billing,
      notes: data.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Information</DialogTitle>
          <DialogDescription>
            Please provide your contact and shipping details to create your WhatsApp
            order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+46 70 123 4567"
                {...register('phone')}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Shipping Address</h3>

            <div>
              <Label htmlFor="address_1">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address_1"
                {...register('address_1')}
                disabled={isLoading}
              />
              {errors.address_1 && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.address_1.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address_2">Apartment, suite, etc. (optional)</Label>
              <Input
                id="address_2"
                {...register('address_2')}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input id="city" {...register('city')} disabled={isLoading} />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State / Province (optional)</Label>
                <Input id="state" {...register('state')} disabled={isLoading} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">
                  Postcode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postcode"
                  {...register('postcode')}
                  disabled={isLoading}
                />
                {errors.postcode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.postcode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="SE"
                  disabled={isLoading}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Same as Shipping */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="billingSameAsShipping"
              {...register('billingSameAsShipping')}
              defaultChecked={true}
              disabled={isLoading}
            />
            <Label
              htmlFor="billingSameAsShipping"
              className="text-sm font-normal cursor-pointer"
            >
              Billing address same as shipping
            </Label>
          </div>

          {/* Order Notes */}
          <div>
            <Label htmlFor="notes">Order Notes (optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Any special instructions for your order..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Continue to WhatsApp'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
