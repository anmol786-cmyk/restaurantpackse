import { siteConfig } from "@/site.config";
import { getProducts } from "@/lib/woocommerce/products-direct";
import { NextResponse } from "next/server";

/**
 * Main Sitemap Index
 * 
 * Generates a sitemap index that includes:
 * - Separate sitemaps for each locale (en, sv, no, da)
 * - Product sitemaps (paginated)
 * - Image sitemaps
 * - Category sitemaps
 * 
 * This allows submitting language-specific sitemaps to Google Search Console
 */

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = siteConfig.site_domain;
  const locales = ['en', 'sv', 'no', 'da'];

  // Fetch products to calculate how many product sitemaps we need
  const productsRes = await getProducts({ per_page: 1 });
  const totalProducts = productsRes.total;
  const productSitemapCount = Math.ceil(totalProducts / 100);

  const sitemaps: string[] = [];

  // Add locale-specific page sitemaps
  locales.forEach(locale => {
    sitemaps.push(`${baseUrl}/api/sitemap/pages/${locale}`);
  });

  // Add locale-specific post sitemaps
  locales.forEach(locale => {
    sitemaps.push(`${baseUrl}/api/sitemap/posts/${locale}`);
  });

  // Add locale-specific post category sitemaps
  locales.forEach(locale => {
    sitemaps.push(`${baseUrl}/api/sitemap/post-categories/${locale}`);
  });

  // Add delivery pages sitemap (locale-specific)
  locales.forEach(locale => {
    sitemaps.push(`${baseUrl}/api/sitemap/delivery/${locale}`);
  });

  // Add product category sitemaps (shared across locales but with hreflang)
  sitemaps.push(`${baseUrl}/api/sitemap/product-categories`);

  // Add paginated product sitemaps (shared across locales but with hreflang)
  for (let i = 1; i <= productSitemapCount; i++) {
    sitemaps.push(`${baseUrl}/api/sitemap/products/${i}`);
  }

  // Add image sitemap
  sitemaps.push(`${baseUrl}/api/sitemap/images`);

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
      .map(
        (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
      )
      .join("\n")}
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
