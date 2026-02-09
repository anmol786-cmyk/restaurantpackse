'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth-store';
import { Section, Container } from '@/components/craft';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Package, User, MapPin, LogOut, Loader2, Eye, LayoutDashboard, Download, CreditCard, Edit, Save, X, Building2, Clock, CheckCircle2, FileText, AlertCircle, Presentation } from 'lucide-react';
import { getCustomerOrdersAction, updateCustomerAction, getCustomerQuotesAction } from '@/app/actions/auth';
import { getBusinessInfo, formatBusinessType, getCreditStatus, getCreditLimit, getCreditTermsDays, type WholesaleStatus } from '@/lib/auth';
import { useCartStore } from '@/store/cart-store';
import type { Order } from '@/types/woocommerce';
import { format, addDays } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { CreditApplication } from '@/components/dashboard/credit-application';
import { BusinessStats } from '@/components/dashboard/business-stats';
import { ReorderLists } from '@/components/dashboard/reorder-lists';
import { InvoiceList } from '@/components/dashboard/invoice-list';
import { downloadInvoicePDF, getPaymentDueDate, downloadQuotePDF } from '@/lib/invoice-generator';
import { CreditStatusVisualizer } from '@/components/dashboard/credit-status-visualizer';

// Helper function to download Wholesale Agreement PDF
async function downloadWholesaleAgreement(businessInfo: ReturnType<typeof getBusinessInfo>, user: any) {
  try {
    const params = new URLSearchParams({
      companyName: businessInfo.companyName || '',
      vatNumber: businessInfo.vatNumber || '',
      businessType: businessInfo.businessType || 'Wholesale',
      contactName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
      contactEmail: user?.email || '',
      contactPhone: user?.billing?.phone || '',
      address: user?.billing?.address_1 || '',
      city: user?.billing?.city || '',
      postcode: user?.billing?.postcode || '',
    });

    const response = await fetch(`/api/documents/wholesale-agreement?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to generate agreement');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Wholesale-Agreement-${businessInfo.companyName || 'draft'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Wholesale Agreement downloaded!');
  } catch (error) {
    console.error('Error downloading wholesale agreement:', error);
    toast.error('Failed to download agreement. Please try again.');
  }
}

function MyAccountContent() {
  const t = useTranslations('myAccount');
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const { addItemFromLineItem } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Quote history state
  const [quotes, setQuotes] = useState<Order[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState<number | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<number | null>(null);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  // Address editing state
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    country: 'SE',
    phone: '',
  });
  const [shippingData, setShippingData] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    country: 'SE',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'orders', 'downloads', 'addresses', 'payment', 'profile', 'business'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Get business info
  const businessInfo = getBusinessInfo(user);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
      setBillingData({
        first_name: user.billing?.first_name || user.first_name || '',
        last_name: user.billing?.last_name || user.last_name || '',
        address_1: user.billing?.address_1 || '',
        address_2: user.billing?.address_2 || '',
        city: user.billing?.city || '',
        postcode: user.billing?.postcode || '',
        country: user.billing?.country || 'SE',
        phone: user.billing?.phone || '',
      });
      setShippingData({
        first_name: user.shipping?.first_name || user.first_name || '',
        last_name: user.shipping?.last_name || user.last_name || '',
        address_1: user.shipping?.address_1 || '',
        address_2: user.shipping?.address_2 || '',
        city: user.shipping?.city || '',
        postcode: user.shipping?.postcode || '',
        country: user.shipping?.country || 'SE',
      });
    }
  }, [user]);

  // Fetch customer orders
  useEffect(() => {
    async function fetchOrders() {
      console.log('Fetching orders for user:', user);
      console.log('User ID:', user?.id);

      if (!user?.id || user.id === 0) {
        console.log('No valid user ID, skipping order fetch');
        setIsLoadingOrders(false);
        setOrdersError(
          'Your account is not properly linked to our order system. This usually happens when there was an issue creating your customer profile. Please contact our support team to resolve this issue.'
        );
        return;
      }

      try {
        setIsLoadingOrders(true);
        setOrdersError(null);
        console.log('Calling getCustomerOrdersAction with ID:', user.id);
        const result = await getCustomerOrdersAction(user.id, {
          per_page: 20,
          page: 1,
        });

        console.log('Orders result:', result);

        if (result.success && result.data) {
          setOrders(result.data);
          console.log('Loaded', result.data.length, 'orders');
        } else {
          setOrdersError(result.error || 'Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError('An unexpected error occurred');
      } finally {
        setIsLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    } else {
      setIsLoadingOrders(false);
    }
  }, [user?.id, user]);

  // Fetch customer quotes (for business customers)
  useEffect(() => {
    async function fetchQuotes() {
      if (!user?.id || user.id === 0) {
        setIsLoadingQuotes(false);
        return;
      }

      try {
        setIsLoadingQuotes(true);
        setQuotesError(null);
        const result = await getCustomerQuotesAction(user.id, {
          per_page: 20,
          page: 1,
        });

        if (result.success && result.data) {
          setQuotes(result.data);
        } else {
          setQuotesError(result.error || 'Failed to load quotes');
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setQuotesError('An unexpected error occurred');
      } finally {
        setIsLoadingQuotes(false);
      }
    }

    if (user && businessInfo.isBusinessCustomer) {
      fetchQuotes();
    } else {
      setIsLoadingQuotes(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user]);

  // Handle repeat order from quote
  const handleRepeatOrder = async (quote: Order) => {
    if (!quote.line_items || quote.line_items.length === 0) {
      toast.error('No items found in this quote');
      return;
    }

    setIsReordering(quote.id);

    try {
      let addedCount = 0;
      for (const item of quote.line_items) {
        if (item.product_id) {
          addItemFromLineItem({
            product_id: item.product_id,
            name: item.name,
            price: item.price?.toString() || '0',
            quantity: item.quantity,
            image: item.image,
          });
          addedCount++;
        }
      }

      toast.success(`Added ${addedCount} item(s) from quote to cart`);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding quote items to cart:', error);
      toast.error('Failed to add items to cart');
    } finally {
      setIsReordering(null);
    }
  };

  // Get quote status from metadata
  const getQuoteStatus = (quote: Order) => {
    const quoteId = quote.meta_data?.find((m: any) => m.key === '_quote_id')?.value;
    const status = quote.status;

    // Map WooCommerce order status to quote status
    if (status === 'pending') return { label: 'Pending Review', color: 'yellow' };
    if (status === 'processing') return { label: 'Being Processed', color: 'blue' };
    if (status === 'on-hold') return { label: 'Awaiting Response', color: 'orange' };
    if (status === 'completed') return { label: 'Accepted', color: 'green' };
    if (status === 'cancelled') return { label: 'Cancelled', color: 'red' };
    if (status === 'failed') return { label: 'Declined', color: 'red' };

    return { label: status || 'Unknown', color: 'gray' };
  };

  // Get quote/order reference ID from metadata
  const getQuoteRef = (quote: Order): string => {
    // Check for quick order first
    const quickOrderId = quote.meta_data?.find((m: any) => m.key === '_quick_order_id')?.value;
    if (typeof quickOrderId === 'string') return quickOrderId;

    // Then check for quote
    const quoteId = quote.meta_data?.find((m: any) => m.key === '_quote_id')?.value;
    if (typeof quoteId === 'string') return quoteId;

    return `#${quote.id}`;
  };

  // Determine if order is a quick order or quote request
  const isQuickOrder = (order: Order): boolean => {
    return order.meta_data?.some((m: any) => m.key === '_quick_order_request' && m.value === 'yes') || false;
  };

  // Get order type label
  const getOrderTypeLabel = (order: Order): string => {
    return isQuickOrder(order) ? t('quickOrder') : t('quote');
  };

  if (!user) return null;

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast.error('Unable to update profile');
      return;
    }

    setIsSavingProfile(true);
    try {
      const result = await updateCustomerAction(user.id, {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
      });

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Profile updated successfully!');
        setIsEditingProfile(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save billing address
  const handleSaveBilling = async () => {
    if (!user?.id) {
      toast.error('Unable to update address');
      return;
    }

    setIsSavingAddress(true);
    try {
      const result = await updateCustomerAction(user.id, {
        billing: billingData,
      });

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Billing address updated successfully!');
        setIsEditingBilling(false);
      } else {
        toast.error(result.error || 'Failed to update billing address');
      }
    } catch (error) {
      toast.error('Failed to update billing address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Save shipping address
  const handleSaveShipping = async () => {
    if (!user?.id) {
      toast.error('Unable to update address');
      return;
    }

    setIsSavingAddress(true);
    try {
      const result = await updateCustomerAction(user.id, {
        shipping: shippingData,
      });

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Shipping address updated successfully!');
        setIsEditingShipping(false);
      } else {
        toast.error(result.error || 'Failed to update shipping address');
      }
    } catch (error) {
      toast.error('Failed to update shipping address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Helper function to get order status badge variant
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="info">Processing</Badge>;
      case 'on-hold':
        return <Badge variant="warning">On Hold</Badge>;
      case 'pending':
        return <Badge variant="outline-warning">Pending Payment</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper to get status badge
  const getWholesaleStatusBadge = (status: WholesaleStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Not Approved</Badge>;
      default:
        return null;
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    try {
      setIsGeneratingPDF(orderId);

      const isCredit = order.meta_data?.some(
        (m: any) => m.key === 'is_credit_payment' && m.value === 'yes'
      );

      const paymentTermsMeta = order.meta_data?.find(
        (m: any) => m.key === 'payment_terms'
      );

      // Determine payment terms
      let paymentTerms: 'immediate' | 'net_28' | 'net_60' = 'immediate';
      if (isCredit) {
        if (paymentTermsMeta?.value === 'net_60') {
          paymentTerms = 'net_60';
        } else {
          paymentTerms = 'net_28';
        }
      }

      const invoiceDate = new Date(order.date_created);
      const dueDate = getPaymentDueDate(invoiceDate, paymentTerms);

      await downloadInvoicePDF({
        order,
        invoiceNumber: order.number || order.id.toString(),
        invoiceDate,
        dueDate,
        paymentTerms,
      });

      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice PDF');
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  const handleDownloadQuote = async (quoteId: number) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    try {
      setIsGeneratingPDF(quoteId);

      const quoteRef = getQuoteRef(quote);
      const quoteDate = new Date(quote.date_created);
      const validUntil = addDays(quoteDate, 14); // Quotes valid for 14 days by default

      await downloadQuotePDF({
        order: quote,
        quoteNumber: quoteRef,
        date: quoteDate,
        validUntil,
      });

      toast.success('Quote PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Failed to generate quote PDF');
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  return (
    <Section className="bg-muted/30 dark:bg-muted/10">
      <Container>
        {/* Verification Status Banner */}
        {businessInfo.isBusinessCustomer && businessInfo.wholesaleStatus === 'pending' && (
          <Alert className="mb-6 border-warning/30 bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">{t('verificationPending')}</AlertTitle>
            <AlertDescription className="text-warning/80">
              {t('verificationPendingDesc')}
            </AlertDescription>
          </Alert>
        )}

        {businessInfo.isBusinessCustomer && businessInfo.wholesaleStatus === 'approved' && (
          <Alert className="mb-6 border-success/30 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">{t('wholesaleActive')}</AlertTitle>
            <AlertDescription className="text-success/80">
              {t('wholesaleActiveDesc')}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {t('title')}
              </h1>
              {businessInfo.isBusinessCustomer && (
                <Badge variant="gold">
                  <Building2 className="w-3 h-3 mr-1" />
                  {t('businessBadge')}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {t('welcomeBack', { name: user.first_name })}
              {businessInfo.companyName && (
                <span className="ml-2 text-primary font-medium">({businessInfo.companyName})</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {businessInfo.isBusinessCustomer && getWholesaleStatusBadge(businessInfo.wholesaleStatus)}
            <Button variant="outline" onClick={() => logout()} className="gap-2">
              <LogOut className="h-4 w-4" />
              {t('signOut')}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${businessInfo.isBusinessCustomer ? 'grid-cols-4 lg:grid-cols-7' : 'grid-cols-3 lg:grid-cols-6'}`}>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabDashboard')}</span>
            </TabsTrigger>
            {businessInfo.isBusinessCustomer && (
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabBusiness')}</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabOrders')}</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabDownloads')}</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabAddresses')}</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabPayment')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabProfile')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboardTitle')}</CardTitle>
                <CardDescription>{t('dashboardDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Credit Status Visualizer */}
                <CreditStatusVisualizer />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const ordersTab = document.querySelector('[value="orders"]') as HTMLElement;
                    ordersTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t('ordersLabel')}</h3>
                    </div>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground">{t('totalOrders')}</p>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const downloadsTab = document.querySelector('[value="downloads"]') as HTMLElement;
                    downloadsTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t('downloadsLabel')}</h3>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">{t('availableDownloads')}</p>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const addressesTab = document.querySelector('[value="addresses"]') as HTMLElement;
                    addressesTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t('addressesLabel')}</h3>
                    </div>
                    <p className="text-2xl font-bold">{user.billing?.address_1 ? '2' : '0'}</p>
                    <p className="text-sm text-muted-foreground">{t('savedAddresses')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('accountInfo')}</h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t('nameLabel')}</span>
                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t('emailLabel')}</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t('customerSince')}</span>
                      <span className="font-medium">{user.date_created ? format(new Date(user.date_created), 'MMM dd, yyyy') : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Account Tab - Only shown for business customers */}
          {businessInfo.isBusinessCustomer && (
            <TabsContent value="business">
              <div className="space-y-6">
                {/* Business Stats */}
                <BusinessStats orders={orders} isLoading={isLoadingOrders} />

                {/* Business Status Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {t('businessAccount')}
                        </CardTitle>
                        <CardDescription>{t('businessAccountDesc')}</CardDescription>
                      </div>
                      {getWholesaleStatusBadge(businessInfo.wholesaleStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Info Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {t('companyInfo')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('companyNameLabel')}</span>
                            <span className="font-medium">{businessInfo.companyName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('businessTypeLabel')}</span>
                            <span className="font-medium">{formatBusinessType(businessInfo.businessType)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('vatNumberLabel')}</span>
                            <span className="font-medium font-mono">{businessInfo.vatNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {t('accountBenefits')}
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            {businessInfo.wholesaleStatus === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>{t('wholesalePricing')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {businessInfo.wholesaleStatus === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>{t('volumeDiscounts')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {businessInfo.wholesaleStatus === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>{t('prioritySupport')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {getCreditStatus(user) === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={getCreditStatus(user) === 'approved' ? "" : "text-muted-foreground"}>
                              {t('creditTerms', { days: getCreditTermsDays(user) })}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-foreground">{t('quickActions')}</h4>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="gold">
                          <Link href="/wholesale/quote">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('requestQuote')}
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/shop">
                            <Package className="h-4 w-4 mr-2" />
                            {t('browseProducts')}
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/contact">
                            <User className="h-4 w-4 mr-2" />
                            {t('contactSales')}
                          </Link>
                        </Button>
                        {businessInfo.wholesaleStatus === 'approved' && (
                          <Button
                            variant="outline"
                            onClick={() => downloadWholesaleAgreement(businessInfo, user)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t('wholesaleAgreement')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Verification Notice */}
                {businessInfo.wholesaleStatus === 'pending' && (
                  <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">{t('verificationInProgress')}</h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            {t('verificationInProgressDesc')}
                          </p>
                          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                            {t('verificationMeanwhile')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Orders & Quotes History Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {t('ordersQuotes')}
                        </CardTitle>
                        <CardDescription>{t('ordersQuotesDesc')}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {quotes.length > 0 && (
                          <Button variant="outline" size="sm" onClick={() => {
                            const exportData = quotes.map(quote => ({
                              'Quote/Ref': quote.number || quote.id,
                              'Date': new Date(quote.date_created).toLocaleDateString(),
                              'Status': quote.status,
                              'Total Items': quote.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                              'Total Amount': quote.total,
                              'Currency': quote.currency
                            }));
                            import('@/lib/excel').then(({ exportToExcel }) => {
                              exportToExcel(exportData, 'Quotes-History', 'Quotes');
                            });
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            {t('exportExcel')}
                          </Button>
                        )}
                        <Button asChild size="sm">
                          <Link href="/wholesale/quote">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('newQuote')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingQuotes ? (
                      <div className="flex h-32 flex-col items-center justify-center">
                        <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm text-neutral-500">{t('loadingOrders')}</p>
                      </div>
                    ) : quotesError ? (
                      <div className="flex h-32 flex-col items-center justify-center text-center">
                        <AlertCircle className="mb-2 h-6 w-6 text-red-400" />
                        <p className="text-sm text-red-600">{quotesError}</p>
                      </div>
                    ) : quotes.length === 0 ? (
                      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                        <FileText className="mb-2 h-6 w-6 text-neutral-400" />
                        <p className="text-sm text-neutral-500">{t('noOrdersQuotes')}</p>
                        <Button asChild variant="link" size="sm">
                          <Link href="/wholesale/quote">{t('requestFirstQuote')}</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {quotes.map((quote) => {
                          const status = getQuoteStatus(quote);
                          const quoteRef = getQuoteRef(quote);
                          const totalItems = quote.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                          const orderType = getOrderTypeLabel(quote);
                          const isQuick = isQuickOrder(quote);

                          return (
                            <div
                              key={quote.id}
                              className="rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${isQuick ? 'bg-accent/20 text-accent-foreground dark:bg-accent/30' : 'bg-primary/10 text-primary dark:bg-primary/20'}`}>
                                      {isQuick ? `\u26a1 ${t('quickOrder')}` : `\ud83d\udcdd ${t('quote')}`}
                                    </span>
                                    <h4 className="font-semibold">{quoteRef}</h4>
                                    <Badge
                                      className={`text-xs ${status.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                                        status.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                          status.color === 'blue' ? 'bg-info hover:bg-info/90' :
                                            status.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                                              status.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                                                'bg-gray-500 hover:bg-gray-600'
                                        }`}
                                    >
                                      {status.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted {format(new Date(quote.date_created), 'MMM dd, yyyy')} • {totalItems} item(s) • {quote.currency} {quote.total}
                                  </p>

                                  {/* Show items preview */}
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {quote.line_items?.slice(0, 3).map((item, idx) => (
                                      <span key={idx} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                        {item.name} x{item.quantity}
                                      </span>
                                    ))}
                                    {quote.line_items && quote.line_items.length > 3 && (
                                      <span className="text-xs text-muted-foreground">
                                        {t('moreItems', { count: quote.line_items.length - 3 })}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadQuote(quote.id)}
                                    disabled={isGeneratingPDF === quote.id}
                                  >
                                    {isGeneratingPDF === quote.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <Download className="h-4 w-4 mr-1" />
                                    )}
                                    PDF
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRepeatOrder(quote)}
                                    disabled={isReordering === quote.id}
                                  >
                                    {isReordering === quote.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <Package className="h-4 w-4 mr-1" />
                                    )}
                                    {t('repeatOrder')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Credit Terms Section */}
                <CreditApplication />

                {/* Invoice Tracking */}
                <InvoiceList orders={orders} isLoading={isLoadingOrders} />

                {/* Reorder Lists */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('reorderLists')}</CardTitle>
                    <CardDescription>{t('reorderListsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReorderLists />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>{t('downloadsTitle')}</CardTitle>
                <CardDescription>{t('downloadsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Product Catalogue Card */}
                  <div className="flex flex-col border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/30">
                        <Presentation className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t('productCatalogue')}</h3>
                        <p className="text-sm text-neutral-500">{t('catalogueFormat')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {t('catalogueDesc')}
                    </p>
                    <Button
                      onClick={async () => {
                        try {
                          setIsGeneratingPDF(999);
                          toast.info('Generating product catalogue...');

                          // Fetch PPTX from API route
                          const response = await fetch('/api/catalog');

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || 'Failed to generate catalogue');
                          }

                          // Download the file
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Anmol-Wholesale-Catalog-${new Date().toISOString().split('T')[0]}.pptx`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);

                          toast.success('Catalogue downloaded successfully');
                        } catch (error: any) {
                          console.error('Catalog generation error:', error);
                          toast.error(error.message || 'Failed to generate catalogue');
                        } finally {
                          setIsGeneratingPDF(null);
                        }
                      }}
                      disabled={isGeneratingPDF === 999}
                      variant="gold"
                      className="w-full mt-auto"
                    >
                      {isGeneratingPDF === 999 ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {t('downloadCatalogue')}
                    </Button>
                  </div>

                  {/* Company Presentation Card */}
                  <div className="flex flex-col border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-burgundy/10 rounded-lg">
                        <Building2 className="h-6 w-6 text-burgundy" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t('companyPresentation')}</h3>
                        <p className="text-sm text-neutral-500">{t('presentationFormat')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {t('presentationDesc')}
                    </p>
                    <Button
                      onClick={async () => {
                        try {
                          setIsGeneratingPDF(998);
                          toast.info('Generating company presentation...');

                          const response = await fetch('/api/presentation');

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || 'Failed to generate presentation');
                          }

                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Anmol-Wholesale-Presentation-${new Date().toISOString().split('T')[0]}.pptx`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);

                          toast.success('Presentation downloaded successfully');
                        } catch (error: any) {
                          console.error('Presentation generation error:', error);
                          toast.error(error.message || 'Failed to generate presentation');
                        } finally {
                          setIsGeneratingPDF(null);
                        }
                      }}
                      disabled={isGeneratingPDF === 998}
                      variant="outline"
                      className="w-full mt-auto"
                    >
                      {isGeneratingPDF === 998 ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {t('downloadPresentation')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t('orderHistory')}</CardTitle>
                <CardDescription>{t('orderHistoryDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex h-48 flex-col items-center justify-center">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-neutral-500">{t('loadingOrders')}</p>
                  </div>
                ) : ordersError ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-center dark:border-red-800 dark:bg-red-900/10">
                    <Package className="mb-2 h-8 w-8 text-red-400" />
                    <p className="text-sm text-red-600 dark:text-red-400">{ordersError}</p>
                    <Button variant="link" onClick={() => window.location.reload()}>
                      {t('tryAgain')}
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                    <Package className="mb-2 h-8 w-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500">{t('noOrdersFound')}</p>
                    <Button variant="link" onClick={() => router.push('/shop')}>
                      {t('startShopping')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.number || order.id}</h3>
                              <p className="text-sm text-neutral-500">
                                {format(new Date(order.date_created), 'MMM dd, yyyy')} at{' '}
                                {format(new Date(order.date_created), 'hh:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.line_items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              {item.image?.src && (
                                <div className="relative h-12 w-12 flex-shrink-0">
                                  <Image
                                    src={item.image.src}
                                    alt={item.name}
                                    fill
                                    sizes="48px"
                                    className="rounded object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-neutral-500">
                                  {t('quantity')} {item.quantity} × {order.currency} {item.price}
                                </p>
                              </div>
                              <p className="font-semibold">
                                {order.currency} {item.total}
                              </p>
                            </div>
                          ))}
                          {order.line_items.length > 3 && (
                            <p className="text-sm text-neutral-500">
                              {t('moreItems', { count: order.line_items.length - 3 })}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
                          <div className="text-sm">
                            <span className="text-neutral-500">{t('totalLabel')}</span>
                            <span className="text-lg font-bold text-primary">
                              {order.currency} {order.total}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(order.id)}
                              disabled={isGeneratingPDF === order.id}
                            >
                              {isGeneratingPDF === order.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              {t('invoicePDF')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/my-account/orders/${order.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t('viewDetails')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('profileDetails')}</CardTitle>
                    <CardDescription>{t('profileDetailsDesc')}</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('editProfile')}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        disabled={isSavingProfile}
                      >
                        {isSavingProfile ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            email: user.email || '',
                          });
                        }}
                        variant="outline"
                        size="sm"
                        disabled={isSavingProfile}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('firstNameLabel')}</Label>
                    <Input
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      disabled={!isEditingProfile || isSavingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lastNameLabel')}</Label>
                    <Input
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      disabled={!isEditingProfile || isSavingProfile}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('emailLabel')}</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditingProfile || isSavingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('usernameLabel')}</Label>
                    <Input value={user.username} disabled />
                    <p className="text-xs text-muted-foreground">{t('usernameNote')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>{t('addressesTitle')}</CardTitle>
                <CardDescription>{t('addressesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Billing Address */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{t('billingAddress')}</h3>
                      {!isEditingBilling ? (
                        <Button onClick={() => setIsEditingBilling(true)} variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            onClick={handleSaveBilling}
                            size="sm"
                            disabled={isSavingAddress}
                          >
                            {isSavingAddress ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditingBilling(false);
                              setBillingData({
                                first_name: user.billing?.first_name || user.first_name || '',
                                last_name: user.billing?.last_name || user.last_name || '',
                                address_1: user.billing?.address_1 || '',
                                address_2: user.billing?.address_2 || '',
                                city: user.billing?.city || '',
                                postcode: user.billing?.postcode || '',
                                country: user.billing?.country || 'SE',
                                phone: user.billing?.phone || '',
                              });
                            }}
                            variant="ghost"
                            size="sm"
                            disabled={isSavingAddress}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {!isEditingBilling ? (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                        <p>{user.billing?.first_name} {user.billing?.last_name}</p>
                        <p>{user.billing?.address_1}</p>
                        {user.billing?.address_2 && <p>{user.billing.address_2}</p>}
                        <p>{user.billing?.city}, {user.billing?.postcode}</p>
                        <p>{user.billing?.country}</p>
                        {user.billing?.phone && <p>Phone: {user.billing.phone}</p>}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{t('firstNameLabel')}</Label>
                            <Input
                              value={billingData.first_name}
                              onChange={(e) => setBillingData({ ...billingData, first_name: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">{t('lastNameLabel')}</Label>
                            <Input
                              value={billingData.last_name}
                              onChange={(e) => setBillingData({ ...billingData, last_name: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('addressLine1')}</Label>
                          <Input
                            value={billingData.address_1}
                            onChange={(e) => setBillingData({ ...billingData, address_1: e.target.value })}
                            disabled={isSavingAddress}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('addressLine2')}</Label>
                          <Input
                            value={billingData.address_2}
                            onChange={(e) => setBillingData({ ...billingData, address_2: e.target.value })}
                            disabled={isSavingAddress}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{t('cityLabel')}</Label>
                            <Input
                              value={billingData.city}
                              onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">{t('postcodeLabel')}</Label>
                            <Input
                              value={billingData.postcode}
                              onChange={(e) => setBillingData({ ...billingData, postcode: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('phoneLabel')}</Label>
                          <Input
                            value={billingData.phone}
                            onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                            disabled={isSavingAddress}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{t('shippingAddress')}</h3>
                      {!isEditingShipping ? (
                        <Button onClick={() => setIsEditingShipping(true)} variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            onClick={handleSaveShipping}
                            size="sm"
                            disabled={isSavingAddress}
                          >
                            {isSavingAddress ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditingShipping(false);
                              setShippingData({
                                first_name: user.shipping?.first_name || user.first_name || '',
                                last_name: user.shipping?.last_name || user.last_name || '',
                                address_1: user.shipping?.address_1 || '',
                                address_2: user.shipping?.address_2 || '',
                                city: user.shipping?.city || '',
                                postcode: user.shipping?.postcode || '',
                                country: user.shipping?.country || 'SE',
                              });
                            }}
                            variant="ghost"
                            size="sm"
                            disabled={isSavingAddress}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {!isEditingShipping ? (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                        <p>{user.shipping?.first_name} {user.shipping?.last_name}</p>
                        <p>{user.shipping?.address_1}</p>
                        {user.shipping?.address_2 && <p>{user.shipping.address_2}</p>}
                        <p>{user.shipping?.city}, {user.shipping?.postcode}</p>
                        <p>{user.shipping?.country}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{t('firstNameLabel')}</Label>
                            <Input
                              value={shippingData.first_name}
                              onChange={(e) => setShippingData({ ...shippingData, first_name: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">{t('lastNameLabel')}</Label>
                            <Input
                              value={shippingData.last_name}
                              onChange={(e) => setShippingData({ ...shippingData, last_name: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('addressLine1')}</Label>
                          <Input
                            value={shippingData.address_1}
                            onChange={(e) => setShippingData({ ...shippingData, address_1: e.target.value })}
                            disabled={isSavingAddress}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('addressLine2')}</Label>
                          <Input
                            value={shippingData.address_2}
                            onChange={(e) => setShippingData({ ...shippingData, address_2: e.target.value })}
                            disabled={isSavingAddress}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs">{t('cityLabel')}</Label>
                            <Input
                              value={shippingData.city}
                              onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">{t('postcodeLabel')}</Label>
                            <Input
                              value={shippingData.postcode}
                              onChange={(e) => setShippingData({ ...shippingData, postcode: e.target.value })}
                              disabled={isSavingAddress}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentMethods')}</CardTitle>
                <CardDescription>{t('paymentMethodsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <CreditCard className="mb-2 h-8 w-8 text-neutral-400" />
                  <p className="text-sm text-neutral-500">{t('noSavedPayments')}</p>
                  <p className="text-xs text-neutral-400 mt-1">{t('paymentsSavedNote')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </Section >
  );
}

export default function MyAccountPage() {
  return (
    <Suspense fallback={
      <Section className="bg-neutral-50 dark:bg-neutral-900/50">
        <Container>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </Section>
    }>
      <MyAccountContent />
    </Suspense>
  );
}
