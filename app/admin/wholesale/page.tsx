import { getPendingWholesaleRequests } from '@/app/actions/admin';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminWholesalePage() {
    const { success, data, error } = await getPendingWholesaleRequests();

    if (!success) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load wholesale requests: {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <AdminDashboard
            initialRequests={data || []}
            pendingCount={data?.length || 0}
        />
    );
}
