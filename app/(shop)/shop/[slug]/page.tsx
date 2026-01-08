import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await getProductBySlug(resolvedParams.slug);

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: product.name,
      description: product.short_description?.replace(/<[^>]*>/g, '').substring(0, 160) || product.name,
      openGraph: {
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '').substring(0, 160),
        images: product.images.map((img) => ({
          url: img.src,
          width: 800,
          height: 800,
          alt: img.alt || product.name,
        })),
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product;

  try {
    product = await getProductBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);

  // Build breadcrumbs
  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    ...(product.categories && product.categories.length > 0
      ? [{ label: product.categories[0].name, href: `/shop/category/${product.categories[0].slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <ProductTemplate
      product={product}
      breadcrumbs={breadcrumbs}
      relatedProducts={relatedProducts}
    />
  );
}
