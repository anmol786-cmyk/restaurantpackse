'use client';

import { useState, useEffect } from 'react';
import { WholesaleCustomer, getAllWholesaleCustomers } from '@/app/actions/admin';
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
import { Download, Loader2, Users, Search, RefreshCw, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; variant: string; icon: any }> = {
    'approved': { label: 'Approved', variant: 'success', icon: CheckCircle2 },
    'pending': { label: 'Pending', variant: 'warning', icon: Clock },
    'rejected': { label: 'Rejected', variant: 'destructive', icon: XCircle },
    'none': { label: 'None', variant: 'outline', icon: null },
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
    'restaurant': 'Restaurant',
    'cafe': 'Cafe',
    'catering': 'Catering',
    'hotel': 'Hotel',
    'pizzeria': 'Pizzeria',
    'grocery': 'Grocery',
    'other': 'Other',
};

export function CustomerDirectory() {
    const [customers, setCustomers] = useState<WholesaleCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        setIsLoading(true);
        const result = await getAllWholesaleCustomers(statusFilter);

        if (result.success && result.data) {
            setCustomers(result.data);
        } else {
            toast.error('Failed to load customers');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, [statusFilter]);

    // Filter customers by search term
    const filteredCustomers = customers.filter(customer => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            customer.email.toLowerCase().includes(term) ||
            customer.first_name.toLowerCase().includes(term) ||
            customer.last_name.toLowerCase().includes(term) ||
            customer.company_name.toLowerCase().includes(term) ||
            customer.vat_number.toLowerCase().includes(term)
        );
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const exportData = filteredCustomers.map(customer => ({
                'Company': customer.company_name,
                'VAT Number': customer.vat_number,
                'Contact Name': `${customer.first_name} ${customer.last_name}`.trim(),
                'Email': customer.email,
                'Phone': customer.phone,
                'City': customer.city,
                'Country': customer.country,
                'Business Type': BUSINESS_TYPE_LABELS[customer.business_type] || customer.business_type,
                'Status': STATUS_CONFIG[customer.status]?.label || customer.status,
                'Credit Limit': customer.credit_limit,
                'Credit Status': customer.credit_status,
                'Total Spent': parseFloat(customer.total_spent),
                'Orders': customer.orders_count,
                'Registered': format(new Date(customer.date_created), 'yyyy-MM-dd'),
            }));

            const { exportToExcel } = await import('@/lib/excel');
            exportToExcel(exportData, `Customer-Directory-${format(new Date(), 'yyyy-MM-dd')}`, 'Customers');
            toast.success('Customer directory exported successfully');
        } catch (error) {
            toast.error('Failed to export customers');
        } finally {
            setIsExporting(false);
        }
    };

    // Calculate stats
    const approvedCount = customers.filter(c => c.status === 'approved').length;
    const pendingCount = customers.filter(c => c.status === 'pending').length;
    const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || '0'), 0);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Customers</p>
                                <p className="text-2xl font-bold">{customers.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">{formatPrice(totalSpent, 'SEK')}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customer Table */}
            <Card>
                <CardHeader className="px-6 py-5 border-b bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Customer Directory
                            </CardTitle>
                            <CardDescription>
                                Wholesale customer accounts and business information
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={isLoading}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button variant="default" size="sm" onClick={handleExport} disabled={isExporting || isLoading}>
                                <Download className="h-4 w-4 mr-2" />
                                Export Excel
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
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Customers</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="font-medium text-lg mb-1">No customers found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchTerm ? 'Try adjusting your search' : 'No wholesale customers registered yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>VAT Number</TableHead>
                                        <TableHead>Business Type</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Total Spent</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => {
                                        const statusConfig = STATUS_CONFIG[customer.status] || STATUS_CONFIG.none;
                                        const StatusIcon = statusConfig.icon;
                                        return (
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{customer.company_name || 'N/A'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {customer.city}{customer.city && customer.country ? ', ' : ''}{customer.country}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p>{customer.first_name} {customer.last_name}</p>
                                                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                                                        {customer.phone && (
                                                            <p className="text-xs text-muted-foreground">{customer.phone}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {customer.vat_number || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {BUSINESS_TYPE_LABELS[customer.business_type] || customer.business_type || '-'}
                                                </TableCell>
                                                <TableCell>{customer.orders_count}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatPrice(parseFloat(customer.total_spent || '0'), 'SEK')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusConfig.variant as any} className="gap-1">
                                                        {StatusIcon && <StatusIcon className="h-3 w-3" />}
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
        </div>
    );
}
