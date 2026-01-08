import { ReactNode, Suspense } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductPagination } from '@/components/shop/product-pagination';
import { ProductSort } from '@/components/shop/product-sort';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import type { Product } from '@/types/woocommerce';

interface ArchiveTemplateProps {
  title: string;
  description?: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  basePath: string;
  sidebar?: ReactNode;
  filterBar?: ReactNode;
  gridColumns?: 2 | 3 | 4 | 5;
}

export function ArchiveTemplate({
  title,
  description,
  breadcrumbs,
  products,
  totalProducts,
  currentPage,
  totalPages,
  basePath,
  sidebar,
  filterBar,
  gridColumns = 3,
}: ArchiveTemplateProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="site-container py-8 md:py-12">
        {/* Archive Header - Responsive Layout */}
        <div className="mb-8 md:mb-12">
          {/* Mobile: Two Column Layout */}
          <div className="grid grid-cols-2 md:hidden gap-4 mb-6">
            {/* Column 1: Breadcrumbs + Title */}
            <div className="flex flex-col gap-3">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
              )}
              <h1 className="font-heading text-2xl font-semibold text-primary">
                {title}
              </h1>
            </div>

            {/* Column 2: Description */}
            <div className="flex items-start">
              {description && (
                <div className="text-muted-foreground">
                  {typeof description === 'string' ? (
                    <p className="text-sm">{description}</p>
                  ) : (
                    description
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Three Column Layout (Left Aligned, More Space for Description) */}
          <div className="hidden md:grid md:grid-cols-8 gap-6 mb-6">
            {/* Column 1: Breadcrumbs (2/8) */}
            <div className="col-span-2 flex items-start overflow-hidden">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="w-full">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              )}
            </div>

            {/* Column 2: Title (2/8) */}
            <div className="col-span-2 flex items-center">
              <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-primary">
                {title}
              </h1>
            </div>

            {/* Column 3: Description (4/8) - Maximum Space */}
            <div className="col-span-4 flex items-center">
              {description && (
                <div className="text-muted-foreground">
                  {typeof description === 'string' ? (
                    <p className="text-base">{description}</p>
                  ) : (
                    description
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Custom Filter Bar (Top) */}
          {filterBar ? (
            <div className="mb-8">
              {filterBar}
            </div>
          ) : (
            <div className="flex items-center justify-between border-t border-b border-primary/10 py-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{products.length}</span> of{' '}
                <span className="font-medium text-primary">{totalProducts}</span> products
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                {sidebar && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-4">
                        {sidebar}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                {/* Sorting */}
                <div className={sidebar ? '' : 'ml-auto'}>
                  <Suspense fallback={<Skeleton className="h-10 w-[200px]" />}>
                    <ProductSort showLabel={false} />
                  </Suspense>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className={sidebar ? 'lg:grid lg:grid-cols-4 lg:gap-8' : ''}>
          {/* Sidebar (Desktop) */}
          {sidebar && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">{sidebar}</div>
            </aside>
          )}

          {/* Product Grid */}
          <div className={sidebar ? 'lg:col-span-3' : ''}>
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={gridColumns} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <ProductPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={basePath}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold text-primary">
                  No products found
                </h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn&apos;t find any products matching your criteria. Try adjusting your filters or browse all products.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-2xl">
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                      🔧 Development Note
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Products may not load in local development due to Vercel Security Checkpoint.
                      <br />
                      <strong>Don&apos;t worry:</strong> Products will load correctly when deployed to Vercel.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
