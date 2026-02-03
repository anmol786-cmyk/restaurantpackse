'use client';

import { useState, useEffect } from 'react';
import { AdminOrder, getAdminOrders } from '@/app/actions/admin';
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
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, Loader2, Package, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
    'pending': { label: 'Pending', variant: 'secondary' },
    'processing': { label: 'Processing', variant: 'default' },
    'on-hold': { label: 'On Hold', variant: 'secondary' },
    'completed': { label: 'Completed', variant: 'success' },
    'cancelled': { label: 'Cancelled', variant: 'destructive' },
    'refunded': { label: 'Refunded', variant: 'destructive' },
    'failed': { label: 'Failed', variant: 'destructive' },
};

export function AdminOrdersTable() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async () => {
        setIsLoading(true);
        const result = await getAdminOrders({
            status: statusFilter !== 'all' ? statusFilter : undefined,
            per_page: 50
        });

        if (result.success && result.data) {
            setOrders(result.data);
            setTotalOrders(result.total || result.data.length);
        } else {
            toast.error('Failed to load orders');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    // Filter orders by search term
    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            order.number.toLowerCase().includes(term) ||
            order.customer_email.toLowerCase().includes(term) ||
            order.customer_name.toLowerCase().includes(term) ||
            order.company_name.toLowerCase().includes(term)
        );
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const exportData = filteredOrders.map(order => ({
                'Order #': order.number,
                'Date': format(new Date(order.date_created), 'yyyy-MM-dd HH:mm'),
                'Customer': order.customer_name,
                'Company': order.company_name,
                'Email': order.customer_email,
                'Status': ORDER_STATUS_CONFIG[order.status]?.label || order.status,
                'Items': order.items_count,
                'Total': parseFloat(order.total),
                'Currency': order.currency,
                'Payment Method': order.payment_method,
                'Payment Terms': order.payment_terms,
            }));

            const { exportToExcel } = await import('@/lib/excel');
            exportToExcel(exportData, `Orders-Report-${format(new Date(), 'yyyy-MM-dd')}`, 'Orders');
            toast.success('Orders exported successfully');
        } catch (error) {
            toast.error('Failed to export orders');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportWithLineItems = async () => {
        setIsExporting(true);
        try {
            const exportData: any[] = [];
            filteredOrders.forEach(order => {
                order.line_items.forEach(item => {
                    exportData.push({
                        'Order #': order.number,
                        'Date': format(new Date(order.date_created), 'yyyy-MM-dd'),
                        'Customer': order.customer_name,
                        'Company': order.company_name,
                        'Product': item.name,
                        'Quantity': item.quantity,
                        'Line Total': parseFloat(item.total),
                        'Order Total': parseFloat(order.total),
                        'Status': ORDER_STATUS_CONFIG[order.status]?.label || order.status,
                    });
                });
            });

            const { exportToExcel } = await import('@/lib/excel');
            exportToExcel(exportData, `Orders-Detailed-${format(new Date(), 'yyyy-MM-dd')}`, 'Order Details');
            toast.success('Detailed orders exported successfully');
        } catch (error) {
            toast.error('Failed to export orders');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Card>
            <CardHeader className="px-6 py-5 border-b bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Reports
                        </CardTitle>
                        <CardDescription>
                            View and export order data ({totalOrders} total orders)
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting || isLoading}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Summary
                        </Button>
                        <Button variant="default" size="sm" onClick={handleExportWithLineItems} disabled={isExporting || isLoading}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Detailed
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="font-medium text-lg mb-1">No orders found</h3>
                        <p className="text-sm text-muted-foreground">
                            {searchTerm ? 'Try adjusting your search' : 'No orders match the selected filter'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => {
                                    const statusConfig = ORDER_STATUS_CONFIG[order.status] || { label: order.status, variant: 'outline' };
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.number}</TableCell>
                                            <TableCell>
                                                {format(new Date(order.date_created), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{order.customer_name || 'Guest'}</p>
                                                    {order.company_name && (
                                                        <p className="text-xs text-muted-foreground">{order.company_name}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{order.items_count}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatPrice(parseFloat(order.total), order.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm">{order.payment_method || 'N/A'}</p>
                                                    {order.payment_terms !== 'immediate' && (
                                                        <Badge variant="outline" className="text-xs mt-1">
                                                            {order.payment_terms}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusConfig.variant as any}>
                                                    {statusConfig.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
