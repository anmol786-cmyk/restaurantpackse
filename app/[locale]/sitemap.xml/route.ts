import { siteConfig } from "@/site.config";
import { NextRequest, NextResponse } from "next/server";
import { generateSitemapXml } from "@/lib/sitemap-generator";
import { MetadataRoute } from "next";

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
    changefreq: "daily" | "monthly" | "weekly" | "yearly";
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
    if (locale === DEFAULT_LOCALE) {
        return NextResponse.redirect(`${baseUrl}/sitemap-pages.xml`, 301);
    }

    const items: MetadataRoute.Sitemap = PAGES.map((page) => {
        // Current locale URL (e.g. /sv/about)
        const pageUrl = page.slug ? `/${locale}/${page.slug}` : `/${locale}`;
        const url = `${baseUrl}${pageUrl}`;

        // Create alternates
        const languages: Record<string, string> = {};

        LOCALES.forEach((altLocale) => {
            let altUrl = '';
            if (altLocale === DEFAULT_LOCALE) {
                // Default locale (en) has NO prefix
                altUrl = page.slug ? `/${page.slug}` : `/`;
            } else {
                altUrl = page.slug ? `/${altLocale}/${page.slug}` : `/${altLocale}`;
            }
            languages[altLocale] = `${baseUrl}${altUrl}`;
        });

        // Add x-default (usually maps to English root)
        const defaultUrl = page.slug ? `/${page.slug}` : `/`;
        languages['x-default'] = `${baseUrl}${defaultUrl}`;

        return {
            url,
            lastModified: new Date(),
            changeFrequency: page.changefreq,
            priority: page.priority,
            alternates: { languages }
        };
    });

    const xml = generateSitemapXml(items);

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
