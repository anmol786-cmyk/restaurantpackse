'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import type { Order } from '@/types/woocommerce';

interface BusinessStatsProps {
  orders: Order[];
  isLoading?: boolean;
}

export function BusinessStats({ orders, isLoading = false }: BusinessStatsProps) {
  const { user } = useAuthStore();

  // Calculate stats from orders
  const calculateStats = () => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        thisMonthOrders: 0,
        thisMonthSpent: 0,
        lastMonthOrders: 0,
        lastMonthSpent: 0,
        growthPercent: 0,
      };
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const completedOrders = orders.filter(
      (o) => o.status === 'completed' || o.status === 'processing'
    );

    const totalSpent = completedOrders.reduce(
      (sum, order) => sum + parseFloat(order.total || '0'),
      0
    );

    const thisMonthOrders = completedOrders.filter(
      (o) => new Date(o.date_created) >= thisMonthStart
    );
    const thisMonthSpent = thisMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.total || '0'),
      0
    );

    const lastMonthOrders = completedOrders.filter((o) => {
      const orderDate = new Date(o.date_created);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    });
    const lastMonthSpent = lastMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.total || '0'),
      0
    );

    const growthPercent =
      lastMonthSpent > 0
        ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100
        : thisMonthSpent > 0
        ? 100
        : 0;

    return {
      totalOrders: completedOrders.length,
      totalSpent,
      averageOrderValue: completedOrders.length > 0 ? totalSpent / completedOrders.length : 0,
      thisMonthOrders: thisMonthOrders.length,
      thisMonthSpent,
      lastMonthOrders: lastMonthOrders.length,
      lastMonthSpent,
      growthPercent,
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.thisMonthOrders} this month
          </p>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats.totalSpent, 'SEK')}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime purchases
          </p>
        </CardContent>
      </Card>

      {/* This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Month
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats.thisMonthSpent, 'SEK')}</div>
          <div className="flex items-center text-xs">
            {stats.growthPercent >= 0 ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{stats.growthPercent.toFixed(0)}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500">{stats.growthPercent.toFixed(0)}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Order Value
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(stats.averageOrderValue, 'SEK')}
          </div>
          <p className="text-xs text-muted-foreground">
            Per order average
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
