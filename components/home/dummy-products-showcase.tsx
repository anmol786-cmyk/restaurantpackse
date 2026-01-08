/**
 * ⚠️ DUMMY COMPONENT - FOR VISUALIZATION ONLY - SAFE TO DELETE ⚠️
 *
 * This component displays dummy products for layout testing.
 *
 * TO REMOVE:
 * 1. Delete this file: components/home/dummy-products-showcase.tsx
 * 2. Remove the import from app/page.tsx
 * 3. Connect to real WooCommerce products
 */

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import dummyData from "@/data/dummy-products.json";

export function DummyProductsShowcase() {
  const products = dummyData.products;

  return (
    <section className="w-full py-16 bg-background">
      <div className="px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            ⚠️ DEMO PRODUCTS - For Layout Testing Only
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Fresh arrivals from different categories
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-muted overflow-hidden">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Sale Badge */}
                {product.on_sale && (
                  <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    SALE
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                  {product.categories[0].name}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.short_description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    {product.on_sale && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.regular_price}
                      </span>
                    )}
                  </div>

                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm font-medium">Add</span>
                  </button>
                </div>

                {/* Stock Status */}
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="inline-flex items-center text-xs text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 dark:text-yellow-500 text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Demo Data Notice
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                These are dummy products for layout visualization only. Images are from Unsplash.
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                <strong>To remove:</strong> Delete <code>components/home/dummy-products-showcase.tsx</code> and <code>data/dummy-products.json</code>, then connect to your WooCommerce API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
