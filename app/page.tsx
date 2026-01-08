import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { BannerStrip } from "@/components/home/banner-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { anmolWholesaleOrganizationSchemaFull } from "@/lib/schema/organization";

// Revalidate page every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Anmol Wholesale - B2B Restaurant Supply & Foodservice Distribution | Restaurant Pack",
  description: "Sweden's leading B2B wholesale supplier for restaurants, grocery stores & caterers. Authentic Indo-Pak products, bulk ingredients, competitive pricing. Manufacturer of Anmol Electric Tandoor. European shipping available.",
};

export default async function HomePage() {
  // Fetch data in parallel
  const [categoriesRes, trendingRes, newArrivalsRes, dealsRes, haldiramRes, freshProduceRes] = await Promise.all([
    getProductCategories({ per_page: 6, orderby: 'count', order: 'desc', parent: 0 }),
    getProducts({ per_page: 8, orderby: 'popularity' }),
    getProducts({ per_page: 8, orderby: 'date' }),
    getProducts({ per_page: 8, on_sale: true }),
    getProducts({ per_page: 8, brand: 'haldiram' }),
    getProducts({ per_page: 8, category: 'fresh-produce' }),
  ]);

  const categories = categoriesRes || [];
  const trendingProducts = trendingRes.data || [];
  const newProducts = newArrivalsRes.data || [];
  const dealProducts = dealsRes.data || [];
  const haldiramProducts = haldiramRes?.data || [];
  const freshProduceProducts = freshProduceRes?.data || [];


  return (
    <main className="flex min-h-screen flex-col bg-background pb-20 overflow-x-hidden max-w-full">
      {/* 1. Hero Section */}
      <Hero
        title="From Our Restaurant Kitchen to Yours"
        subtitle="Sweden's trusted B2B wholesale supplier for restaurants, grocery stores, and caterers. Authentic Indo-Pak products, bulk ingredients, and manufacturer of the Anmol Electric Tandoor. Backed by Anmol Sweets & Restaurant expertise."
        badge="Wholesale Pricing - Bulk & Pallet Discounts"
      />

      {/* 2. Top Categories */}
      <CategoryGrid categories={categories} />

      {/* 3. Promotion/Deals Grid */}
      <PromotionGrid />

      {/* 4. Special Offers */}
      <ProductShowcase
        title="Wholesale Deals - Bulk Pricing Available"
        products={dealProducts}
        moreLink="/deals"
      />

      {/* 4. Banner Strip */}
      <BannerStrip />

      {/* 5. Trending Products */}
      <ProductShowcase
        title="Top Sellers for Restaurants & Caterers"
        products={trendingProducts}
        moreLink="/shop?sort=bestsellers"
      />

      {/* 5a. Haldiram Section */}
      <ProductShowcase
        title="Haldiram's - Authentic Indian Snacks"
        products={haldiramProducts}
        moreLink="/brand/haldiram"
      />

      {/* 6. New Arrivals */}
      <ProductShowcase
        title="New Stock - Just Added to Catalog"
        products={newProducts}
        moreLink="/shop?sort=new"
      />

      {/* 7. Fresh Produce Section */}
      <ProductShowcase
        title="Fresh Produce - Premium Quality"
        products={freshProduceProducts}
        moreLink="/product-category/fresh-produce"
      />

      {/* SEO Structured Data */}
      <SchemaScript
        id="homepage-org-schema"
        schema={anmolWholesaleOrganizationSchemaFull()}
      />
    </main>
  );
}
