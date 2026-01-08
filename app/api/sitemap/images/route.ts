import { siteConfig } from "@/site.config";
import { getProducts } from "@/lib/woocommerce/products-direct";
import { getAllPosts } from "@/lib/wordpress";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    // Fetch products and posts in parallel
    const [productsRes, posts] = await Promise.all([
        getProducts({ per_page: 100, status: "publish" }),
        getAllPosts(),
    ]);

    const products = productsRes.data;

    const productImages = products
        .filter((p) => p.images && p.images.length > 0)
        .map(
            (p) => `  <url>
    <loc>${baseUrl}/product/${p.slug}</loc>
    <image:image>
      <image:loc>${p.images[0].src}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
    </image:image>
  </url>`
        )
        .join("\n");

    const postImages = posts
        .filter(
            (p) => (p as any)._embedded?.["wp:featuredmedia"]?.[0]?.source_url
        )
        .map(
            (p) => `  <url>
    <loc>${baseUrl}/${p.slug}</loc>
    <image:image>
      <image:loc>${(p as any)._embedded["wp:featuredmedia"][0].source_url}</image:loc>
      <image:title>${escapeXml(p.title.rendered)}</image:title>
    </image:image>
  </url>`
        )
        .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${productImages}
${postImages}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
