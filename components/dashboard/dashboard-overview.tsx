'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

interface DashboardStats {
  totalOrders: number;
  monthlyOrders: number;
  totalSpent: number;
  pendingOrders: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
}

export function DashboardOverview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    monthlyOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    averageOrderValue: 0,
    lastOrderDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // In production, fetch from WooCommerce API
        // For now, mock data
        await new Promise(resolve => setTimeout(resolve, 500));

        setStats({
          totalOrders: 24,
          monthlyOrders: 8,
          totalSpent: 145670,
          pendingOrders: 2,
          averageOrderValue: 6070,
          lastOrderDate: '2025-01-07',
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const cards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      subtitle: `${stats.monthlyOrders} this month`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Spent',
      value: formatPrice(stats.totalSpent, 'SEK'),
      subtitle: `Avg ${formatPrice(stats.averageOrderValue, 'SEK')} per order`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      subtitle: 'Awaiting fulfillment',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Last Order',
      value: stats.lastOrderDate
        ? new Date(stats.lastOrderDate).toLocaleDateString('sv-SE', {
            month: 'short',
            day: 'numeric'
          })
        : 'No orders',
      subtitle: stats.lastOrderDate ? 'Recent activity' : 'Place your first order',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {card.subtitle}
              {i === 1 && (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
