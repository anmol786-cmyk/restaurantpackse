import { siteConfig } from "@/site.config";
import { NextRequest, NextResponse } from "next/server";
import { generateSitemapXml } from "@/lib/sitemap-generator";
import { MetadataRoute } from "next";
import { getProducts, getProductCategories } from "@/lib/woocommerce/products-direct";

/**
 * Locale-Specific Complete Sitemap Handler
 * Route: /[locale]/sitemap.xml
 * Generates comprehensive sitemaps for SV, NO, DA locales
 * Includes: static pages, products, categories, and blog posts
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

    const items: MetadataRoute.Sitemap = [];

    // 1. Add static pages
    const pageItems = PAGES.map((page) => {
        const pageUrl = page.slug ? `/${locale}/${page.slug}` : `/${locale}`;
        const url = `${baseUrl}${pageUrl}`;

        const languages: Record<string, string> = {};
        LOCALES.forEach((altLocale) => {
            let altUrl = '';
            if (altLocale === DEFAULT_LOCALE) {
                altUrl = page.slug ? `/${page.slug}` : `/`;
            } else {
                altUrl = page.slug ? `/${altLocale}/${page.slug}` : `/${altLocale}`;
            }
            languages[altLocale] = `${baseUrl}${altUrl}`;
        });

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

    items.push(...pageItems);

    // 2. Add products
    try {
        const productsRes = await getProducts({ per_page: 100 });
        const products = productsRes.data;

        const productItems = products.map((product) => {
            const url = `${baseUrl}/${locale}/product/${product.slug}`;

            const languages: Record<string, string> = {};
            LOCALES.forEach((altLocale) => {
                if (altLocale === DEFAULT_LOCALE) {
                    languages[altLocale] = `${baseUrl}/product/${product.slug}`;
                } else {
                    languages[altLocale] = `${baseUrl}/${altLocale}/product/${product.slug}`;
                }
            });
            languages['x-default'] = `${baseUrl}/product/${product.slug}`;

            return {
                url,
                lastModified: new Date(product.date_modified || product.date_created),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
                alternates: { languages }
            };
        });

        items.push(...productItems);
    } catch (error) {
        console.error(`Error fetching products for ${locale} sitemap:`, error);
    }

    // 3. Add product categories
    try {
        const categories = await getProductCategories({ per_page: 100 });
        const filteredCategories = categories.filter(cat => cat.count > 0);

        const categoryItems = filteredCategories.map((category) => {
            const url = `${baseUrl}/${locale}/shop/${category.slug}`;

            const languages: Record<string, string> = {};
            LOCALES.forEach((altLocale) => {
                if (altLocale === DEFAULT_LOCALE) {
                    languages[altLocale] = `${baseUrl}/shop/${category.slug}`;
                } else {
                    languages[altLocale] = `${baseUrl}/${altLocale}/shop/${category.slug}`;
                }
            });
            languages['x-default'] = `${baseUrl}/shop/${category.slug}`;

            return {
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
                alternates: { languages }
            };
        });

        items.push(...categoryItems);
    } catch (error) {
        console.error(`Error fetching categories for ${locale} sitemap:`, error);
    }

    const xml = generateSitemapXml(items);

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600", // Revalidate hourly due to products
        },
    });
}
