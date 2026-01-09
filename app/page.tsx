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
  title: "Anmol Wholesale - B2B Restaurant Supply & Foodservice Distribution | Restaurant Pack",
  description: "Sweden's leading B2B wholesale supplier for restaurants, grocery stores & caterers. Authentic Indo-Pak products, bulk ingredients, competitive pricing. Manufacturer of Anmol Electric Tandoor. European shipping available.",
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
      <div className="bg-slate-50 border-y border-slate-100 pb-8">
        <CategoryGrid categories={categories} />
      </div>

      {/* 4. Anmol Mini Tandoor Showcase */}
      <TandoorShowcase />

      {/* 4. Efficiency Utility */}
      <QuickOrder />

      {/* 5. Popular Wholesale Items */}
      <div className="py-12">
        <ProductShowcase
          title="Premium Bestsellers"
          products={trendingProducts}
          moreLink="/shop?sort=popularity"
        />
      </div>

      {/* 6. Brand Showcase */}
      <div className="py-12 bg-slate-50 border-y border-slate-100">
        <ProductShowcase
          title="Haldiram's Professional Range"
          products={haldiramProducts}
          moreLink="/brand/haldiram"
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
