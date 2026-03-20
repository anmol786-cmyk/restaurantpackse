import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';

export const revalidate = 3600; // ISR: revalidate product pages hourly
import { ProductTemplate } from '@/components/templates';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SchemaScript } from '@/lib/schema/schema-script';
import { wooCommerceProductSchema, breadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/site.config';

interface ProductPageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'product' });

    try {
        const product = await getProductBySlug(resolvedParams.slug);

        if (!product) {
            return {
                title: t('notFound'),
            };
        }

        // Default fallback image if product has no images
        const defaultImage = {
            url: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
            width: 1200,
            height: 630,
            alt: 'Anmol Wholesale - Restaurant Supply Stockholm',
        };

        // Clean description with proper fallback
        const cleanDescription = product.short_description?.replace(/<[^>]*>/g, '').trim();
        const metaDescription = cleanDescription && cleanDescription.length > 50
            ? cleanDescription.substring(0, 160)
            : t('metaFallback', { name: product.name });

        const productUrl = `https://restaurantpack.se/product/${resolvedParams.slug}`;

        return {
            title: t('metaTitle', { name: product.name }),
            description: metaDescription,
            alternates: {
                canonical: productUrl,
            },
            openGraph: {
                title: t('ogTitle', { name: product.name }),
                description: metaDescription,
                type: 'website',
                url: productUrl,
                siteName: 'Anmol Wholesale',
                images: product.images && product.images.length > 0
                    ? product.images.map((img) => ({
                        url: img.src,
                        width: 800,
                        height: 800,
                        alt: img.alt || product.name,
                    }))
                    : [defaultImage],
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: metaDescription,
            },
        };
    } catch {
        return {
            title: t('notFound'),
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    let product;

    try {
        product = await getProductBySlug(resolvedParams.slug);
    } catch (error) {
        console.error('Failed to fetch product:', resolvedParams.slug, error);
        notFound();
    }

    if (!product) {
        console.error('Product not found:', resolvedParams.slug);
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id);

    // Build breadcrumbs with new URL structure
    const breadcrumbs = [
        { label: 'Shop', href: '/shop' },
        ...(product.categories && product.categories.length > 0
            ? [{
                label: product.categories[0].name,
                href: `/shop/category/${product.categories[0].slug}`
            }]
            : []),
        { label: product.name },
    ];

    const baseUrl = siteConfig.site_domain;
    const productSchema = wooCommerceProductSchema(product, {
        baseUrl,
        brandName: 'Anmol Wholesale',
        sellerName: 'Anmol Wholesale',
    });
    const breadcrumbJsonLd = breadcrumbSchema([
        { name: 'Home', url: baseUrl },
        { name: 'Shop', url: `${baseUrl}/shop` },
        ...(product.categories && product.categories.length > 0
            ? [{ name: product.categories[0].name, url: `${baseUrl}/product-category/${product.categories[0].slug}` }]
            : []),
        { name: product.name, url: `${baseUrl}/product/${product.slug}` },
    ]);

    return (
        <>
            <ProductTemplate
                product={product}
                breadcrumbs={breadcrumbs}
                relatedProducts={relatedProducts}
            />
            <SchemaScript id="product-schema" schema={productSchema} />
            <SchemaScript id="product-breadcrumb-schema" schema={breadcrumbJsonLd} />
        </>
    );
}
