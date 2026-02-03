'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { getCreditStatus } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Download,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import type { Order } from '@/types/woocommerce';
import { downloadInvoicePDF, getPaymentDueDate } from '@/lib/invoice-generator';
import { toast } from 'sonner';

interface InvoiceListProps {
  orders: Order[];
  isLoading?: boolean;
}

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'processing';

interface Invoice {
  id: number;
  orderId: number;
  orderNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethod: string;
  isCredit: boolean;
}

export function InvoiceList({ orders, isLoading = false }: InvoiceListProps) {
  const { user } = useAuthStore();
  const creditStatus = getCreditStatus(user);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState<number | null>(null);

  // Convert orders to invoices
  const invoices: Invoice[] = orders
    .filter((order) => {
      // Only include completed or processing orders
      return ['completed', 'processing', 'on-hold', 'pending'].includes(order.status);
    })
    .map((order) => {
      const isCredit = order.meta_data?.some(
        (m: any) => m.key === 'is_credit_payment' && m.value === 'yes'
      );
      const paymentDueDateMeta = order.meta_data?.find(
        (m: any) => m.key === 'payment_due_date'
      );
      const orderDate = new Date(order.date_created);
      const dueDate = paymentDueDateMeta
        ? new Date(paymentDueDateMeta.value as string)
        : addDays(orderDate, 28);

      let status: InvoiceStatus = 'paid';
      if (isCredit) {
        if (order.status === 'completed') {
          status = 'paid';
        } else if (differenceInDays(new Date(), dueDate) > 0) {
          status = 'overdue';
        } else {
          status = 'pending';
        }
      } else {
        status = order.status === 'completed' ? 'paid' : 'processing';
      }

      return {
        id: order.id,
        orderId: order.id,
        orderNumber: order.number || order.id.toString(),
        date: order.date_created,
        dueDate: dueDate.toISOString(),
        amount: parseFloat(order.total || '0'),
        currency: order.currency || 'SEK',
        status,
        paymentMethod: order.payment_method_title || 'Card',
        isCredit,
      };
    });

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalOutstanding = invoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
  const pendingCount = invoices.filter((i) => i.status === 'pending').length;

  const handleDownloadInvoice = async (invoiceId: number) => {
    const order = orders.find((o) => o.id === invoiceId);
    if (!order) {
      toast.error('Order record not found');
      return;
    }

    try {
      setIsGenerating(invoiceId);

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
      setIsGenerating(null);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-info hover:bg-info/90">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    return `${days} days`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {creditStatus === 'approved' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(totalOutstanding, 'SEK')}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Invoices</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className={overdueCount > 0 ? 'border-red-200 bg-red-50/50' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className={`text-2xl font-bold ${overdueCount > 0 ? 'text-red-600' : ''}`}>
                    {overdueCount}
                  </p>
                </div>
                <AlertCircle
                  className={`h-8 w-8 ${overdueCount > 0 ? 'text-red-500' : 'text-muted-foreground opacity-50'}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice History
              </CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Invoices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                    Overdue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => {
                const exportData = filteredInvoices.map(invoice => ({
                  'Invoice Number': invoice.orderNumber,
                  'Date': new Date(invoice.date).toLocaleDateString(),
                  'Due Date': new Date(invoice.dueDate).toLocaleDateString(),
                  'Amount': invoice.amount,
                  'Currency': invoice.currency,
                  'Status': invoice.status,
                  'Payment Method': invoice.paymentMethod
                }));
                import('@/lib/excel').then(({ exportToExcel }) => {
                  exportToExcel(exportData, 'Invoice-List', 'Invoices');
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="font-medium text-lg mb-1">No invoices found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your invoices will appear here after your first order'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        #{invoice.orderNumber}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
                          {invoice.isCredit && invoice.status !== 'paid' && (
                            <p
                              className={`text-xs ${invoice.status === 'overdue'
                                ? 'text-red-500'
                                : 'text-muted-foreground'
                                }`}
                            >
                              {getDaysUntilDue(invoice.dueDate)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {invoice.isCredit ? (
                            <Badge variant="outline" className="text-xs">
                              28-Day Credit
                            </Badge>
                          ) : (
                            invoice.paymentMethod
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a
                                href={`/my-account/orders/${invoice.orderId}`}
                                className="flex items-center"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Order
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              disabled={isGenerating === invoice.id}
                            >
                              {isGenerating === invoice.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
