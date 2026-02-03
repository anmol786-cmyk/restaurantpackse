'use client';

import { useState } from 'react';
import { WholesaleRequest } from '@/app/actions/admin';
import { WholesaleRequestsTable } from './wholesale-requests-table';
import { AdminOrdersTable } from './admin-orders-table';
import { CustomerDirectory } from './customer-directory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Package, Users, LayoutDashboard } from 'lucide-react';

interface AdminDashboardProps {
    initialRequests: WholesaleRequest[];
    pendingCount: number;
}

export function AdminDashboard({ initialRequests, pendingCount }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('approvals');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
                        Admin Dashboard
                    </h1>
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="h-6">
                            {pendingCount} pending
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground">
                    Manage wholesale accounts, view orders, and export business reports.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="approvals" className="gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Approvals</span>
                        {pendingCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                {pendingCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="gap-2">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Orders</span>
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Customers</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approvals">
                    <WholesaleRequestsTable initialRequests={initialRequests} />
                </TabsContent>

                <TabsContent value="orders">
                    <AdminOrdersTable />
                </TabsContent>

                <TabsContent value="customers">
                    <CustomerDirectory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
