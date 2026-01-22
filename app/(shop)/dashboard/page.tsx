import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { OrderHistory } from "@/components/dashboard/order-history";
import { ReorderLists } from "@/components/dashboard/reorder-lists";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  ShoppingCart,
  List,
  Building2,
  CreditCard
} from "lucide-react";
import { CreditApplication } from "@/components/dashboard/credit-application";

export const metadata: Metadata = {
  title: "Business Dashboard - Anmol Wholesale",
  description: "Manage your wholesale orders, track shipments, and access business tools.",
};

export default function DashboardPage() {
  // In a real implementation, check authentication here
  // const session = await getServerSession();
  // if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Business Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your wholesale orders, reorder quickly, and track your business account.
          </p>
        </div>

        {/* Dashboard Overview Cards */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardOverview />
        </Suspense>

        {/* Tabs for different sections */}
        <div className="mt-8">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="lists" className="gap-2">
                <List className="w-4 h-4" />
                <span>Reorder Lists</span>
              </TabsTrigger>
              <TabsTrigger value="credit" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Credit & Payments</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <Suspense fallback={<OrdersSkeleton />}>
                <OrderHistory />
              </Suspense>
            </TabsContent>

            <TabsContent value="lists" className="mt-6">
              <Suspense fallback={<ListsSkeleton />}>
                <ReorderLists />
              </Suspense>
            </TabsContent>

            <TabsContent value="credit" className="mt-6">
              <CreditApplication />
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <p className="text-muted-foreground">
                  Account management features coming soon. Contact support for account changes.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}

function ListsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  );
}
