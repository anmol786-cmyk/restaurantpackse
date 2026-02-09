import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { Features } from "@/components/home/features";
import { QuickOrder } from "@/components/home/quick-order";
import { CTASection } from "@/components/home/cta-banner";
import { ProductShowcase } from "@/components/home/product-showcase";
import { TandoorShowcase } from "@/components/home/tandoor-showcase";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import { sortProductsStrategically } from "@/lib/utils/product-sorting";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { anmolWholesaleOrganizationSchemaFull } from "@/lib/schema/organization";
import { getTranslations } from 'next-intl/server';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const localeMap: Record<string, string> = {
    en: "en_US",
    sv: "sv_SE",
    no: "nb_NO",
    da: "da_DK",
  };

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: "https://restaurantpack.se",
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: "https://restaurantpack.se",
      type: "website",
      locale: localeMap[locale] || "en_US",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'productShowcase' });

  // Fetch data in parallel - get more products for better sorting
  const [categoriesRes, allProductsRes, haldiramRes] = await Promise.all([
    getProductCategories({ per_page: 8, orderby: 'count', order: 'desc', parent: 0 }),
    getProducts({ per_page: 50, orderby: 'popularity' }), // Fetch more products for strategic sorting
    getProducts({ per_page: 8, brand: 'haldiram' }),
  ]);

  const categories = categoriesRes || [];
  const haldiramProducts = haldiramRes?.data || [];

  // Apply strategic sorting to all products
  const allProducts = allProductsRes.data || [];
  const strategicallySortedProducts = sortProductsStrategically(allProducts);

  // Take top 8 products after strategic sorting
  const featuredProducts = strategicallySortedProducts.slice(0, 8);

  return (
    <main className="flex min-h-screen flex-col bg-white pb-20 overflow-x-hidden max-w-full">
      {/* 1. Hero Section - uses translations internally */}
      <Hero />

      {/* 2. Features Banner */}
      <Features />

      {/* 3. Strategic Category Access */}
      <div className="pt-0 pb-12 md:pb-20">
        <CategoryGrid categories={categories} />
      </div>

      {/* 4. Anmol Mini Tandoor Showcase */}
      <TandoorShowcase />

      {/* 4. Efficiency Utility */}
      <QuickOrder />

      {/* 5. Featured Products in Strategic Order */}
      <div className="py-12 md:py-20">
        <ProductShowcase
          title={t('bestsellers')}
          products={featuredProducts}
          moreLink="/shop"
        />
      </div>

      {/* 6. Brand Showcase */}
      <div className="py-12 md:py-20">
        <ProductShowcase
          title={t('haldiram')}
          products={haldiramProducts}
        />
      </div>

      {/* 9. Final CTA */}
      <CTASection />

      {/* SEO Structured Data */}
      <SchemaScript
        id="homepage-org-schema"
        schema={anmolWholesaleOrganizationSchemaFull()}
      />
    </main>
  );
}
