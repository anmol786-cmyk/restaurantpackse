'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Download,
  FileDown,
  Loader2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/woocommerce';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; icon: any; variant: any }> = {
  'pending': { label: 'Pending', icon: Clock, variant: 'secondary' },
  'processing': { label: 'Processing', icon: Package, variant: 'default' },
  'on-hold': { label: 'On Hold', icon: Clock, variant: 'secondary' },
  'completed': { label: 'Completed', icon: CheckCircle, variant: 'success' },
  'cancelled': { label: 'Cancelled', icon: XCircle, variant: 'destructive' },
  'refunded': { label: 'Refunded', icon: XCircle, variant: 'destructive' },
  'failed': { label: 'Failed', icon: XCircle, variant: 'destructive' },
  'trash': { label: 'Deleted', icon: XCircle, variant: 'destructive' },
};

export function OrderHistory() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [invoicingId, setInvoicingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?customer_id=${user.id}&per_page=20`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data.orders ?? []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = async (orderId: number, orderNumber: string) => {
    try {
      setInvoicingId(orderId);
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      if (!response.ok) throw new Error('Failed to generate invoice');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Invoice error:', error);
      toast.error('Failed to download invoice');
    } finally {
      setInvoicingId(null);
    }
  };

  const handleReorder = async (order: Order) => {
    setReorderingId(order.id);

    try {
      // Add all items from the order to cart
      for (const item of order.line_items) {
        // In production, fetch full product details
        // For now, we'll use mock product data
        const mockProduct: any = {
          id: item.product_id,
          name: item.name,
          slug: item.sku.toLowerCase(),
          price: item.price.toString(),
          images: item.image ? [item.image] : [],
          stock_status: 'instock',
        };

        addItem(mockProduct, item.quantity);
      }

      toast.success(`Added ${order.line_items.length} items to cart from order #${order.number}`);
    } catch (error) {
      console.error('Failed to reorder:', error);
      toast.error('Failed to add items to cart');
    } finally {
      setReorderingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your wholesale journey by placing your first order.
            </p>
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order History</CardTitle>
        <Button variant="outline" size="sm" onClick={() => {
          const exportData = orders.map(order => ({
            'Order Number': order.number,
            'Date': new Date(order.date_created).toLocaleDateString(),
            'Status': ORDER_STATUS_CONFIG[order.status]?.label || order.status,
            'Items': order.line_items.length,
            'Total': order.total,
            'Currency': order.currency
          }));
          import('@/lib/excel').then(({ exportToExcel }) => {
            exportToExcel(exportData, 'Order-History', 'Orders');
          });
        }}>
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Order #{order.number}</h4>
                      <Badge variant={statusConfig.variant as any}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date_created).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(parseFloat(order.total), order.currency)}</p>
                    <p className="text-xs text-muted-foreground">{order.line_items.length} items</p>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  {order.line_items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">{formatPrice(parseFloat(item.total), order.currency)}</span>
                    </div>
                  ))}
                  {order.line_items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.line_items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    disabled={reorderingId === order.id}
                    className="flex-1"
                  >
                    {reorderingId === order.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Adding to cart...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reorder
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order.id, order.number)}
                    disabled={invoicingId === order.id}
                    title="Download Invoice PDF"
                  >
                    {invoicingId === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/my-account/orders/${order.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
