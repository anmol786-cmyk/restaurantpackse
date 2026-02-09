import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { getProductBrands } from '@/lib/woocommerce/brands';
import { sortProductsStrategically } from '@/lib/utils/product-sorting';
import { ArchiveTemplate } from '@/components/templates';
import { ShopTopBar } from '@/components/shop/shop-top-bar';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shop' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface ShopPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    stock_status?: string;
    on_sale?: string;
    featured?: string;
    search?: string;
    brand?: string;
  }>;
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const t = await getTranslations('shop');
  const page = Number(resolvedParams.page) || 1;
  const perPage = 20;

  // Check if user has selected a specific ordering
  const useStrategicSorting = !resolvedParams.orderby || resolvedParams.orderby === 'strategic';

  // Get categories and brands for filters
  const [categories, brands] = await Promise.all([
    getProductCategories(),
    getProductBrands({ hide_empty: true })
  ]);

  // Build query params (without brand filter for API)
  const queryParams: any = {
    page: resolvedParams.brand ? 1 : (useStrategicSorting ? 1 : page), // Fetch all for strategic sorting
    per_page: resolvedParams.brand ? 100 : (useStrategicSorting ? 100 : perPage), // Fetch more for strategic sorting
    orderby: useStrategicSorting ? 'popularity' : (resolvedParams.orderby || 'popularity'),
    order: (resolvedParams.order as 'asc' | 'desc') || 'desc',
  };

  // Apply filters (excluding brand since we'll handle it client-side)
  if (resolvedParams.category) queryParams.category = resolvedParams.category;
  if (resolvedParams.min_price) queryParams.min_price = resolvedParams.min_price;
  if (resolvedParams.max_price) queryParams.max_price = resolvedParams.max_price;
  if (resolvedParams.stock_status) queryParams.stock_status = resolvedParams.stock_status;
  if (resolvedParams.on_sale) queryParams.on_sale = resolvedParams.on_sale === 'true';
  if (resolvedParams.featured) queryParams.featured = resolvedParams.featured === 'true';
  if (resolvedParams.search) queryParams.search = resolvedParams.search;

  let { data: products, total, totalPages } = await getProducts(queryParams);

  // Client-side brand filtering if brand param exists
  if (resolvedParams.brand) {
    products = products.filter(product =>
      product.brands?.some(b => b.slug === resolvedParams.brand)
    );
  }

  // Apply strategic sorting if no specific orderby is selected
  if (useStrategicSorting) {
    products = sortProductsStrategically(products);
  }

  // Recalculate pagination after filtering/sorting
  total = products.length;
  totalPages = Math.ceil(total / perPage);

  // Apply pagination
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedProducts = products.slice(start, end);

  return (
    <ArchiveTemplate
      title={t('title')}
      description={t('description')}
      breadcrumbs={[{ label: t('breadcrumb') }]}
      products={paginatedProducts}
      totalProducts={total}
      currentPage={page}
      totalPages={totalPages}
      basePath="/shop"
      gridColumns={5}
      filterBar={
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <ShopTopBar
            categories={categories}
            brands={brands}
            totalProducts={total}
          />
        </Suspense>
      }
    />
  );
}
