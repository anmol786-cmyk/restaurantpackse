import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-8 md:py-12">
                {/* Header Skeleton */}
                <div className="mb-8 md:mb-12">
                    <div className="mb-6">
                        <Skeleton className="h-12 w-48 mb-4" />
                        <Skeleton className="h-6 w-full max-w-2xl" />
                    </div>
                    <div className="flex items-center justify-between border-t border-b border-primary/10 py-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-24" />
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-square w-full rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
