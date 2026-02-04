'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { getWholesaleStatus, getBusinessInfo, getCreditStatus, getCreditLimit } from '@/lib/auth';
import { CREDIT_TERMS } from '@/config/commerce-rules';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Wallet,
  Calendar,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Helper function to download Credit Agreement PDF
async function downloadCreditAgreement(businessInfo: { companyName?: string | null; vatNumber?: string | null }, user: any) {
  try {
    const params = new URLSearchParams({
      companyName: businessInfo.companyName || '',
      vatNumber: businessInfo.vatNumber || '',
      contactName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
      contactEmail: user?.email || '',
      contactPhone: user?.billing?.phone || '',
      address: user?.billing?.address_1 || '',
      city: user?.billing?.city || '',
      postcode: user?.billing?.postcode || '',
    });

    const response = await fetch(`/api/documents/credit-agreement?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to generate agreement');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credit-Agreement-${businessInfo.companyName || 'draft'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Credit Agreement downloaded!');
  } catch (error) {
    console.error('Error downloading credit agreement:', error);
    toast.error('Failed to download agreement. Please try again.');
  }
}

const creditApplicationSchema = z.object({
  expected_monthly_volume: z.string().min(1, 'Please select expected monthly order volume'),
  invoice_contact_name: z.string().min(2, 'Contact name is required'),
  invoice_contact_email: z.string().email('Valid email is required'),
  invoice_contact_phone: z.string().min(5, 'Valid phone number is required'),
  accept_terms: z.boolean().refine(val => val === true, 'You must accept the credit terms'),
});

type CreditApplicationFormValues = z.infer<typeof creditApplicationSchema>;

export function CreditApplication() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const wholesaleStatus = getWholesaleStatus(user);
  const businessInfo = getBusinessInfo(user);
  const creditStatus = getCreditStatus(user);
  const creditLimit = getCreditLimit(user);

  // Calculate credit usage (in production, this would come from actual order data)
  const creditUsed = user?.meta_data?.find(m => m.key === 'credit_used')?.value || 0;
  const creditAvailable = creditLimit - Number(creditUsed);
  const creditUsagePercent = creditLimit > 0 ? (Number(creditUsed) / creditLimit) * 100 : 0;

  const form = useForm<CreditApplicationFormValues>({
    resolver: zodResolver(creditApplicationSchema),
    defaultValues: {
      expected_monthly_volume: '',
      invoice_contact_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
      invoice_contact_email: user?.email || '',
      invoice_contact_phone: user?.billing?.phone || '',
      accept_terms: false,
    },
  });

  async function onSubmit(data: CreditApplicationFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/credit/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          company_name: businessInfo.companyName,
          vat_number: businessInfo.vatNumber,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Credit application submitted successfully!');
        setJustSubmitted(true);
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Credit application error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // State 1: Not a business customer - Show CTA to register
  if (wholesaleStatus === 'none') {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Become a Business Customer</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Register as a business customer to unlock credit payment options, wholesale pricing, and exclusive benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Credit Terms</p>
                  <p className="text-xs text-muted-foreground">Net {CREDIT_TERMS.defaultCreditDays} payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Wallet className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Credit Limit</p>
                  <p className="text-xs text-muted-foreground">Up to {formatPrice(CREDIT_TERMS.defaultCreditLimit, 'SEK')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Invoice Payment</p>
                  <p className="text-xs text-muted-foreground">Easy billing management</p>
                </div>
              </div>
            </div>
            <Button asChild variant="premium" size="lg">
              <Link href="/register?type=business">
                Register as Business <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 2: Business pending verification
  if (wholesaleStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Business Verification Pending</CardTitle>
              <CardDescription>Your business account is being reviewed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Awaiting Approval</AlertTitle>
            <AlertDescription>
              Our team is reviewing your business registration. This typically takes 1-2 business days.
              Once approved, you can apply for credit payment terms.
            </AlertDescription>
          </Alert>
          {businessInfo.companyName && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm"><span className="text-muted-foreground">Company:</span> {businessInfo.companyName}</p>
              {businessInfo.vatNumber && (
                <p className="text-sm"><span className="text-muted-foreground">VAT Number:</span> {businessInfo.vatNumber}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // State 3: Verified business with approved credit - Show credit status
  if (creditStatus === 'approved') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Credit Account Active</CardTitle>
                  <CardDescription>Net {CREDIT_TERMS.defaultCreditDays} payment terms</CardDescription>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">Approved</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credit Limit Display */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credit Used</span>
                <span className="font-medium">{formatPrice(Number(creditUsed), 'SEK')} / {formatPrice(creditLimit, 'SEK')}</span>
              </div>
              <Progress value={creditUsagePercent} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Credit</span>
                <span className="font-semibold text-green-600">{formatPrice(creditAvailable, 'SEK')}</span>
              </div>
            </div>

            {/* Credit Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs">Credit Limit</span>
                </div>
                <p className="text-lg font-semibold">{formatPrice(creditLimit, 'SEK')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Payment Terms</span>
                </div>
                <p className="text-lg font-semibold">Net {CREDIT_TERMS.defaultCreditDays}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">Min. Order</span>
                </div>
                <p className="text-lg font-semibold">{formatPrice(CREDIT_TERMS.minOrderForCredit, 'SEK')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Company Name</span>
                <p className="font-medium">{businessInfo.companyName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">VAT Number</span>
                <p className="font-medium">{businessInfo.vatNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCreditAgreement(businessInfo, user)}
                className="w-full md:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Credit Agreement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State 4: Credit application pending (from server or just submitted)
  if (creditStatus === 'pending' || justSubmitted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <CardTitle className="text-lg">Credit Application Under Review</CardTitle>
              <CardDescription>Your application is being processed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Submitted</AlertTitle>
            <AlertDescription>
              Thank you for applying for credit terms. Our team will review your application and contact you within 2-3 business days.
            </AlertDescription>
          </Alert>
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Company:</span> {businessInfo.companyName}</p>
            <p className="text-sm"><span className="text-muted-foreground">Requested Terms:</span> Net {CREDIT_TERMS.defaultCreditDays}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 5: Credit rejected
  if (creditStatus === 'rejected') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Credit Application Not Approved</CardTitle>
              <CardDescription>Your credit application was not approved at this time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Application Declined</AlertTitle>
            <AlertDescription>
              Unfortunately, we were unable to approve your credit application at this time.
              You can still place orders using other payment methods. Please contact our support team for more information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // State 6: Verified business without credit - Show application form
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Apply for Credit Terms</CardTitle>
            <CardDescription>Get Net {CREDIT_TERMS.defaultCreditDays} payment terms for your business</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Payment Terms</span>
              <p className="font-semibold">Net {CREDIT_TERMS.defaultCreditDays} days</p>
            </div>
            <div>
              <span className="text-muted-foreground">Default Credit Limit</span>
              <p className="font-semibold">{formatPrice(CREDIT_TERMS.defaultCreditLimit, 'SEK')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Minimum Order</span>
              <p className="font-semibold">{formatPrice(CREDIT_TERMS.minOrderForCredit, 'SEK')}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="expected_monthly_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Monthly Order Volume</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expected monthly volume" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5000-15000">5,000 - 15,000 SEK</SelectItem>
                      <SelectItem value="15000-30000">15,000 - 30,000 SEK</SelectItem>
                      <SelectItem value="30000-50000">30,000 - 50,000 SEK</SelectItem>
                      <SelectItem value="50000-100000">50,000 - 100,000 SEK</SelectItem>
                      <SelectItem value="100000+">100,000+ SEK</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Invoice Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+46 70 123 45 67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="invoice_contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="invoices@company.com" {...field} />
                    </FormControl>
                    <FormDescription>Invoices and payment reminders will be sent to this email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the credit payment terms
                    </FormLabel>
                    <FormDescription>
                      By checking this box, I agree to pay all invoices within {CREDIT_TERMS.defaultCreditDays} days of the invoice date.
                      Late payments may result in suspension of credit privileges and additional fees.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="md:w-auto"
                onClick={() => downloadCreditAgreement(businessInfo, user)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Preview Credit Agreement
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1" variant="premium">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Credit Application
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
