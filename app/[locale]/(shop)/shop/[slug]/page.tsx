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
        title: 'Product Not Found | Anmol Wholesale',
      };
    }

    // 1. Check for CUSTOMIZED SEO from RankMath in meta_data
    const rankMathTitle = product.meta_data?.find(m => m.key === 'rank_math_title')?.value;
    const rankMathDesc = product.meta_data?.find(m => m.key === 'rank_math_description')?.value;

    // 2. Build Smart Fallbacks for "Awesome SEO" if manual fields are empty
    const autoTitle = `${product.name} Wholesale Stockholm | Anmol Wholesale`;
    const plainDescription = product.short_description?.replace(/<[^>]*>/g, '').substring(0, 100) || '';
    const autoDesc = `Buy ${product.name} at competitive wholesale prices (up to 15% lower). Anmol Wholesale: Stockholm-based restaurant suppliers with 5+ years experience. Local & imported stock with own Scandinavian delivery system. ${plainDescription}`;

    const seoTitle = String(rankMathTitle || autoTitle);
    const seoDescription = String(rankMathDesc || autoDesc);

    return {
      title: seoTitle,
      description: seoDescription.substring(0, 160),
      openGraph: {
        title: seoTitle,
        description: seoDescription.substring(0, 160),
        images: product.images.map((img) => ({
          url: img.src,
          width: 800,
          height: 800,
          alt: img.alt || product.name,
        })),
        type: 'article',
        siteName: 'Anmol Wholesale',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription.substring(0, 160),
      },
      alternates: {
        canonical: `https://restaurantpack.se/shop/${resolvedParams.slug}`,
      },
    };
  } catch {
    return {
      title: 'Product Not Found | Anmol Wholesale',
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
