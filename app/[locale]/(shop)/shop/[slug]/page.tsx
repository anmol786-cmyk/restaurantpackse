import { notFound, permanentRedirect } from 'next/navigation';
import { getProductBySlug, getProductCategoryBySlug } from '@/lib/woocommerce';

interface LegacyShopSlugProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Legacy /shop/<slug> URLs.
 * Products live at /product/<slug> and categories at /shop/category/<slug>;
 * this path used to render duplicates (and soft 404s for category slugs),
 * so it now 308-redirects to the canonical URL.
 */
export default async function LegacyShopSlugPage({ params }: LegacyShopSlugProps) {
  const { locale, slug } = await params;
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const category = await getProductCategoryBySlug(slug);
  if (category) {
    permanentRedirect(`${prefix}/shop/category/${slug}`);
  }

  const product = await getProductBySlug(slug);
  if (product) {
    permanentRedirect(`${prefix}/product/${slug}`);
  }

  notFound();
}
