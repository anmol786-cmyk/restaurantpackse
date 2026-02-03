'use client';

import { useAuthStore } from '@/store/auth-store';
import { getCreditStatus, getCreditLimit, getCreditTermsDays } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    HelpCircle
} from 'lucide-react';

import Link from 'next/link';

export function CreditStatusVisualizer() {
    const { user } = useAuthStore();

    if (!user) return null;

    const creditStatus = getCreditStatus(user);
    const creditLimit = getCreditLimit(user);
    const creditUsed = Number(user.meta_data?.find(m => m.key === 'credit_used')?.value || 0);
    const creditAvailable = Math.max(0, creditLimit - creditUsed);
    const creditUsagePercent = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;
    const termsDays = getCreditTermsDays(user);

    // Determine status color and icon
    const getStatusDisplay = () => {
        switch (creditStatus) {
            case 'approved':
                return {
                    label: 'Active Credit Line',
                    color: 'text-green-600 bg-green-50 border-green-200',
                    icon: CheckCircle2,
                    badge: 'success' as const
                };
            case 'pending':
                return {
                    label: 'Application Pending',
                    color: 'text-orange-600 bg-orange-50 border-orange-200',
                    icon: Clock,
                    badge: 'warning' as const
                };
            case 'rejected':
                return {
                    label: 'Application Rejected',
                    color: 'text-red-600 bg-red-50 border-red-200',
                    icon: AlertCircle,
                    badge: 'destructive' as const
                };
            default:
                return {
                    label: 'No Credit Line',
                    color: 'text-muted-foreground bg-muted border-border',
                    icon: HelpCircle,
                    badge: 'outline' as const
                };
        }
    };

    const status = getStatusDisplay();
    const StatusIcon = status.icon;

    if (creditStatus === 'none' && !user.meta_data?.some(m => m.key === 'is_wholesale_customer')) {
        return null; // Don't show for retail customers who haven't expressed interest
    }

    return (
        <Card className="overflow-hidden border-burgundy/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-burgundy/5 to-transparent border-b border-burgundy/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-burgundy/10 rounded-lg">
                            <CreditCard className="h-5 w-5 text-burgundy" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-burgundy">Business Credit Status</CardTitle>
                            <CardDescription>Manage your wholesale purchasing power</CardDescription>
                        </div>
                    </div>
                    <Badge variant={status.badge} className="gap-1 px-3 py-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {creditStatus === 'approved' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Credit Limit</p>
                                <p className="text-2xl font-bold">{formatPrice(creditLimit, 'SEK')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Available Credit</p>
                                <p className="text-2xl font-bold text-green-600">{formatPrice(creditAvailable, 'SEK')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    Used Credit
                                    <span title="Total value of outstanding invoices" className="cursor-help flex items-center">
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    </span>
                                </p>
                                <p className="text-2xl font-bold text-burgundy">{formatPrice(creditUsed, 'SEK')}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Credit Utilization</span>
                                <span className={creditUsagePercent > 80 ? 'text-red-600 font-bold' : 'text-muted-foreground'}>
                                    {Math.round(creditUsagePercent)}%
                                </span>
                            </div>
                            <Progress
                                value={creditUsagePercent}
                                className="h-2"
                            // The indicator color logic would typically be handled via a wrapper or custom component props,
                            // but for standard shadcn Progress we can just rely on the default primary color
                            // or add a utility class if we extended the component.
                            />
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                <p className="italic">
                                    * Payment terms: Net {termsDays} days
                                </p>
                                {creditUsed > 0 && (
                                    <Link
                                        href="/my-account?tab=orders"
                                        className="text-primary hover:underline font-medium flex items-center gap-1"
                                    >
                                        View Invoices
                                        <CheckCircle2 className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ) : creditStatus === 'pending' ? (
                    <div className="py-4 text-center space-y-3">
                        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold">Application Under Review</p>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Our team is currently reviewing your credit application for your business.
                                We will notify you via email once a decision has been made.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Apply for a business credit line to enjoy flexible payment terms and faster checkout.
                        </p>
                        <Link href="/dashboard/credit-application" className="inline-flex items-center justify-center rounded-md bg-burgundy px-4 py-2 text-sm font-medium text-white hover:bg-burgundy/90">
                            Apply Now
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
