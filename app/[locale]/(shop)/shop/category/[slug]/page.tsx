import { notFound } from 'next/navigation';
import { getProductsByCategory, getProductCategoryBySlug } from '@/lib/woocommerce';
import { ArchiveTemplate } from '@/components/templates';
import type { Metadata } from 'next';


interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const category = await getProductCategoryBySlug(resolvedParams.slug);

    if (!category) {
      return {
        title: 'Category Not Found | Anmol Wholesale',
      };
    }

    const seoTitle = `${category.name} Wholesale Stockholm | Anmol Wholesale`;
    const plainDescription = category.description?.replace(/<[^>]*>/g, '').substring(0, 100) || '';
    const seoDescription = `Browse our professional-grade ${category.name} at 15% lower wholesale prices. Anmol Wholesale: Stockholm-based B2B restaurant supplier with own Scandinavian delivery. ${plainDescription}`;

    return {
      title: seoTitle,
      description: seoDescription.substring(0, 160),
      openGraph: {
        title: seoTitle,
        description: seoDescription.substring(0, 160),
        type: 'website',
        url: `https://restaurantpack.se/shop/category/${resolvedParams.slug}`,
        siteName: 'Anmol Wholesale',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription.substring(0, 160),
      },
      alternates: {
        canonical: `https://restaurantpack.se/shop/category/${resolvedParams.slug}`,
      },
    };
  } catch {
    return {
      title: 'Category Not Found | Anmol Wholesale',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 20;

  let category;

  try {
    category = await getProductCategoryBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const { data: products, total, totalPages } = await getProductsByCategory(resolvedParams.slug, {
    page,
    per_page: perPage,
    orderby: (resolvedSearchParams.orderby as 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating') || 'popularity',
    order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
    status: 'publish',
  });

  return (
    <ArchiveTemplate
      title={category.name}
      description={
        category.description ? (
          <div dangerouslySetInnerHTML={{ __html: category.description }} />
        ) : undefined
      }
      breadcrumbs={[
        { label: 'Shop', href: '/shop' },
        { label: 'Categories', href: '/shop/categories' },
        { label: category.name },
      ]}
      products={products}
      totalProducts={total}
      currentPage={page}
      totalPages={totalPages}
      basePath={`/shop/category/${resolvedParams.slug}`}
      gridColumns={5}
    />
  );
}
