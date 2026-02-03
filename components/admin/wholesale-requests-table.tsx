'use client';

import { useState } from 'react';
import { WholesaleRequest, approveWholesaleRequest, rejectWholesaleRequest } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { CheckCircle2, XCircle, MoreHorizontal, Loader2, Building2, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface WholesaleRequestsTableProps {
    initialRequests: WholesaleRequest[];
}

export function WholesaleRequestsTable({ initialRequests }: WholesaleRequestsTableProps) {
    const [requests, setRequests] = useState<WholesaleRequest[]>(initialRequests);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleApprove = async (id: number) => {
        setProcessingId(id);
        const result = await approveWholesaleRequest(id);

        if (result.success) {
            toast.success('Wholesale account approved successfully');
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== id));
        } else {
            toast.error('Failed to approve account: ' + result.error);
        }
        setProcessingId(null);
    };

    const handleReject = async (id: number) => {
        if (!confirm('Are you sure you want to reject this application?')) return;

        setProcessingId(id);
        const result = await rejectWholesaleRequest(id);

        if (result.success) {
            toast.success('Wholesale account rejected');
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== id));
        } else {
            toast.error('Failed to reject account: ' + result.error);
        }
        setProcessingId(null);
    };

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-sm mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground max-w-sm">
                    There are no pending wholesale applications requiring review at this time.
                </p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="px-6 py-5 border-b bg-slate-50/50 dark:bg-slate-900/20">
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                    Review and approve business account requests ({requests.length} pending)
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px] pl-6">Company</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Business Type</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium pl-6">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground flex items-center gap-2">
                                            {request.company_name || 'N/A'}
                                            {request.credit_applied && (
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-primary/30 text-primary bg-primary/10">
                                                    Credit
                                                </Badge>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono mt-0.5">
                                            {request.vat_number || 'No VAT ID'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span>{request.first_name} {request.last_name}</span>
                                        <span className="text-xs text-muted-foreground">{request.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize font-normal">
                                        {request.business_type?.replace('-', ' ') || 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-3 w-3" />
                                        {request.date_created ? format(new Date(request.date_created), 'MMM d, yyyy') : 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="warning" className="capitalize">
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleReject(request.id)}
                                            disabled={processingId === request.id}
                                        >
                                            <XCircle className="h-4 w-4" />
                                            <span className="sr-only">Reject</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleApprove(request.id)}
                                            disabled={processingId === request.id}
                                        >
                                            {processingId === request.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-3 w-3" />
                                            )}
                                            Approve
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
    );
}
