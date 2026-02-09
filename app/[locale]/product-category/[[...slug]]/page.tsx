import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductCategoryBySlug, getProducts, getProductCategories } from '@/lib/woocommerce';
import { getProductBrands } from '@/lib/woocommerce/brands';
import { ArchiveTemplate } from '@/components/templates';
import { ShopTopBar } from '@/components/shop/shop-top-bar';
import { BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { wooCategorySchema, breadcrumbSchema, categoryBreadcrumbs } from '@/lib/schema';
import { siteConfig } from '@/site.config';
import { getTranslations } from 'next-intl/server';

interface ProductCategoryPageProps {
    params: Promise<{
        slug?: string[];
        locale: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.[resolvedParams.slug.length - 1] || '';
    const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'productCategory' });

    try {
        const category = await getProductCategoryBySlug(slug);

        if (!category) {
            return {
                title: t('notFound'),
            };
        }

        // Default fallback image if category has no image
        const defaultImage = {
            url: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
            width: 1200,
            height: 630,
            alt: 'Anmol Wholesale - Restaurant Supply Stockholm',
        };

        return {
            title: `${category.name} | Anmol Wholesale`,
            description: category.description?.replace(/\<[^>]*>/g, '').substring(0, 160) || t('shopProducts', { name: category.name }),
            openGraph: {
                title: category.name,
                description: category.description?.replace(/\<[^>]*>/g, '').substring(0, 160),
                images: category.image
                    ? [{
                        url: category.image.src,
                        width: 800,
                        height: 800,
                        alt: category.name,
                    }]
                    : [defaultImage],
                url: `${siteConfig.site_domain}/product-category/${resolvedParams.slug?.join('/')}`,
            },
        };
    } catch {
        return {
            title: t('notFound'),
        };
    }
}

export default async function ProductCategoryPage({ params, searchParams }: ProductCategoryPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    // Get the last segment as the category slug
    const categorySlug = resolvedParams.slug?.[resolvedParams.slug.length - 1] || '';

    let category;
    try {
        category = await getProductCategoryBySlug(categorySlug);
    } catch (error) {
        notFound();
    }

    if (!category) {
        notFound();
    }

    // Fetch categories and brands for filters
    const [categories, brandsData] = await Promise.all([
        getProductCategories(),
        getProductBrands({ hide_empty: true })
    ]);


    // Fetch products for this category
    const page = parseInt(resolvedSearchParams.page as string) || 1;
    const perPage = 20;

    const { data: products, total, totalPages } = await getProducts({
        category: category.id.toString(),
        page,
        per_page: perPage,
        orderby: (resolvedSearchParams.orderby as any) || 'date',
        order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
        min_price: resolvedSearchParams.min_price as string,
        max_price: resolvedSearchParams.max_price as string,
        brand: resolvedSearchParams.brand as string, // Support brand filtering within category
    });

    // Build breadcrumbs from slug array
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Shop', href: '/shop' },
    ];

    // Add intermediate categories if nested
    if (resolvedParams.slug && resolvedParams.slug.length > 1) {
        resolvedParams.slug.slice(0, -1).forEach((slug, index) => {
            const path = resolvedParams.slug!.slice(0, index + 1).join('/');
            breadcrumbs.push({
                label: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                href: `/product-category/${path}`
            });
        });
    }

    // Add current category
    breadcrumbs.push({ label: category.name });

    return (
        <>
            <ArchiveTemplate
                title={category.name}
                description={category.description}
                breadcrumbs={breadcrumbs}
                products={products}
                totalProducts={total}
                currentPage={page}
                totalPages={totalPages}
                basePath={`/product-category/${resolvedParams.slug?.join('/')}`}
                gridColumns={5}
                filterBar={
                    <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                        <ShopTopBar
                            categories={categories}
                            brands={brandsData}
                            totalProducts={total}
                        />
                    </Suspense>
                }
            />

            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(wooCategorySchema(category, products, {
                        baseUrl: siteConfig.site_domain,
                        websiteId: `${siteConfig.site_domain}/#website`,
                    }))
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema(
                        [
                            { name: 'Home', url: siteConfig.site_domain },
                            { name: 'Shop', url: `${siteConfig.site_domain}/shop` },
                            ...breadcrumbs.slice(1).map(b => ({
                                name: b.label,
                                url: b.href ? `${siteConfig.site_domain}${b.href}` : undefined
                            }))
                        ]
                    ))
                }}
            />
        </>
    );
}
