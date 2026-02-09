import { siteConfig } from "@/site.config";
import { NextRequest, NextResponse } from "next/server";

/**
 * Locale-Specific Pages Sitemap Handler
 * Route: /[locale]/sitemap.xml
 * Generates sitemaps for SV, NO, DA locales dynamically
 * Redirects EN requests to main sitemap to avoid duplicates
 */

const LOCALES = ['en', 'sv', 'no', 'da'];
const DEFAULT_LOCALE = 'en';

interface Page {
    slug: string;
    priority: number;
    changefreq: string;
}

const PAGES: Page[] = [
    { slug: "", priority: 1.0, changefreq: "daily" }, // Homepage
    { slug: "about", priority: 0.8, changefreq: "monthly" },
    { slug: "contact", priority: 0.8, changefreq: "monthly" },
    { slug: "faq", priority: 0.7, changefreq: "monthly" },
    { slug: "shop", priority: 0.9, changefreq: "daily" },
    { slug: "blog", priority: 0.7, changefreq: "weekly" },
    { slug: "posts", priority: 0.7, changefreq: "weekly" },
    { slug: "privacy-policy", priority: 0.3, changefreq: "yearly" },
    { slug: "refund-return", priority: 0.3, changefreq: "yearly" },
    { slug: "terms-conditions", priority: 0.3, changefreq: "yearly" },
    { slug: "delivery-information", priority: 0.7, changefreq: "monthly" },
    { slug: "europe-delivery", priority: 0.7, changefreq: 'monthly' },
    { slug: "wholesale", priority: 0.8, changefreq: "monthly" },
    { slug: "wholesale/register", priority: 0.7, changefreq: "monthly" },
    { slug: "wholesale/quote", priority: 0.7, changefreq: "monthly" },
    { slug: "wholesale/quick-order", priority: 0.7, changefreq: "monthly" },
    { slug: "cart", priority: 0.6, changefreq: "daily" },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ locale: string }> }
) {
    const { locale } = await params;
    const baseUrl = siteConfig.site_domain;

    // Validate locale
    if (!LOCALES.includes(locale)) {
        return new NextResponse("Invalid locale", { status: 404 });
    }

    // If English is requested via /en/sitemap.xml, redirect to root sitemap-pages.xml
    // This prevents duplicate content issues
    if (locale === DEFAULT_LOCALE) {
        return NextResponse.redirect(`${baseUrl}/sitemap-pages.xml`, 301);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.map((page) => {
        // Current locale URL (e.g. /sv/about)
        const pageUrl = page.slug ? `/${locale}/${page.slug}` : `/${locale}`;

        const alternates = LOCALES.map(
            (altLocale) => {
                // Alternate URL logic
                let altUrl = '';
                if (altLocale === DEFAULT_LOCALE) {
                    // Default locale (en) has NO prefix
                    altUrl = page.slug ? `/${page.slug}` : `/`;
                } else {
                    // Other locales have prefix
                    altUrl = page.slug ? `/${altLocale}/${page.slug}` : `/${altLocale}`;
                }
                return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}${altUrl}" />`;
            }
        ).join('\n');

        return `  <url>
    <loc>${baseUrl}${pageUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.slug ? `/${page.slug}` : ''}" />
  </url>`;
    }).join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
