import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { Features } from "@/components/home/features";
import { QuickOrder } from "@/components/home/quick-order";
import { CTASection } from "@/components/home/cta-banner";
import { ProductShowcase } from "@/components/home/product-showcase";
import { TandoorShowcase } from "@/components/home/tandoor-showcase";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { anmolWholesaleOrganizationSchemaFull } from "@/lib/schema/organization";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Anmol Wholesale | Professional Restaurant Supply Stockholm | 15% Lower Prices",
  description: "Sweden's leading B2B wholesale partner for restaurants & caterers. 15% lower prices on authentic Indo-Pak ingredients, bulk staples & professional equipment. Stockholm-based manufacturer of Anmol Electric Tandoor. Own Scandinavian delivery system.",
};

export default async function HomePage() {
  // Fetch data in parallel
  const [categoriesRes, trendingRes, haldiramRes] = await Promise.all([
    getProductCategories({ per_page: 8, orderby: 'count', order: 'desc', parent: 0 }),
    getProducts({ per_page: 8, orderby: 'popularity' }),
    getProducts({ per_page: 8, brand: 'haldiram' }),
  ]);

  const categories = categoriesRes || [];
  const trendingProducts = trendingRes.data || [];
  const haldiramProducts = haldiramRes?.data || [];

  return (
    <main className="flex min-h-screen flex-col bg-white pb-20 overflow-x-hidden max-w-full">
      {/* 1. Hero Section */}
      <Hero
        title="Your trusted partner for restaurant supplies in Sweden."
        subtitle="Anmol Wholesale is your one-stop destination for all your restaurant supply needs, specializing in Indo-Pak cuisine ingredients and equipment. From electric tandoors to spices and packing boxes, we have everything you need."
        badge="Direct-to-Warehouse Pricing"
      />

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

      {/* 5. Popular Wholesale Items */}
      <div className="py-12 md:py-20">
        <ProductShowcase
          title="Premium Bestsellers"
          products={trendingProducts}
          moreLink="/shop?sort=popularity"
        />
      </div>

      {/* 6. Brand Showcase */}
      <div className="py-12 md:py-20">
        <ProductShowcase
          title="Haldiram's Professional Range"
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
