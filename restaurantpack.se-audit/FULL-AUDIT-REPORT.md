# restaurantpack.se — Full SEO Audit

**Date:** 2026-10-10 · **Business type:** B2B e-commerce / wholesale (food + restaurant packaging), Stockholm, with local pickup (hybrid local) · **Stack:** Next.js on Vercel, headless WooCommerce on Hostinger (`crm.restaurantpack.se`)

## SEO Health Score: 46 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 30 |
| Content Quality | 23% | 50 |
| On-Page SEO | 20% | 50 |
| Schema / Structured Data | 10% | 55 |
| Performance (CWV) | 10% | 35 |
| AI Search Readiness | 10% | 60 |
| Images | 5% | 50 |

## Search Console snapshot (Jan 23 – Oct 6, 2026)

- **50 clicks, 1,670 impressions, CTR 3%, average position 25.4** for the whole period, so the site is close to invisible.
- **Indexed: 46 pages. Not indexed: 115.**
  - Discovered – currently not indexed: **83** (Google knows the URL but won't spend crawl effort on it). Mostly `/sv/product/*` (22), `/sv/shop/*` (23), and all sv/no/da info pages.
  - Crawled – currently not indexed: **18**, including sv/no/da product pages and legacy `/product-category/...` and `/shop/category/...` URLs.
  - Page with redirect: 10 (trailing-slash URLs). Not found (404): 2. Redirect error: 1 (`?add-to-cart=166` redirects to itself). Soft 404: 1 (`/posts`).
- **Top pages by clicks:** `/` (25), `/product/mini-electric-tandoor-oven` (8), `/product/nordic-sugar-25kg` (3), `/product/ocean-pearl-basmati-rice` (3).
- **Queries with impressions but no clicks** (ranking position 50–90): granulated sugar, tortilla supplier, indisk takeaway emballage, gram flour, ocean pearl basmati rice.
- Core Web Vitals: not enough traffic for field data. Manual actions: none.
- Merchant listings: 4 invalid ("Duplicate field brand"). 8 items missing `shippingDetails` and `hasMerchantReturnPolicy`.
- Sitemaps submitted: `/sitemap.xml` (52 URLs, **no products or categories**), plus `/sv`, `/no`, `/da` sitemaps. The `/no` and `/da` sitemaps were last read in Feb 2026. `sitemap-products.xml` and `sitemap-categories.xml` are **not submitted** (they're only listed in robots.txt).

---

## Technical SEO (30/100)

### CRITICAL — Pages fail under crawler load (404s and empty pages)
I crawled all 297 sitemap URLs, 6 at a time (how Googlebot crawls):
- **8 product pages returned 404.** Re-tested one at a time, all 8 return 200.
- **44 pages rendered without an H1**, and 28 of them had their **canonical pointing to the homepage** (`/`). Re-tested one at a time, they render normally.

**Root cause (in the code):**
1. `lib/woocommerce/api.ts:97`: `cache: 'no-store', // Disable cache for debugging`. Every WooCommerce API call is live and never cached.
2. `app/[locale]/layout.tsx:21`: `export const dynamic = 'force-dynamic'` makes every page render on every request. Response headers: `cache-control: private, no-cache, no-store`, `x-vercel-cache: MISS` on **297/297** URLs. Median server response is **1.03 s** (p90 1.38 s).
3. `app/[locale]/product/[slug]/page.tsx:95-100`: **any** API error becomes `notFound()`, i.e. a 404. A temporary WordPress timeout tells Google the product no longer exists.

When Googlebot crawls, Hostinger WordPress gets a burst of live API calls. Some fail, and Google sees 404s, empty pages, or pages saying "the canonical is the homepage". Google then lowers its crawl rate, and new URLs sit in "Discovered – not indexed". **This is the main reason the site isn't doing well.**

**Fix:** remove `force-dynamic` and the debug `no-store`, and use ISR (`revalidate` 1–6 h on WooCommerce fetches) plus on-demand revalidation when a product changes. On API errors, throw (a 500, which Google retries) instead of returning `notFound()`. This also cuts the load on Hostinger.

### CRITICAL — Wrong canonicals
- `/wholesale/register`, `/wholesale/quote` and `/wholesale/quick-order` (all 4 languages, 12 URLs) have **canonical → `/`** (the homepage).
- `/sv/shop/<category>` (23 URLs, listed in the /sv sitemap) have **canonical → `/`**.
- `/sv|no|da/shop/category/<x>` and `/sv|no|da/posts/<x>` have **canonical → the English URL**, which tells Google not to index the translations.
- Fix: every indexable page should have a self-referencing canonical, plus hreflang that links the 4 language versions.

### HIGH — Sitemap problems
- The main `sitemap.xml` (the one submitted to GSC) has **no product or category URLs**. Products are only in `sitemap-products.xml`, which isn't submitted.
- Two category URL schemes appear in sitemaps: `/sv/shop/electronics` (locale sitemaps) and `/sv/shop/category/electronics` (sitemap-categories). A third, `/product-category/electronics`, also returns 200.
- The `/sv` sitemap includes `/sv/cart` (a transactional page) and `/sv/posts` (a soft 404).
- `sitemap.xml` `lastmod` is stuck at 2026-06-19. `sitemap-posts.xml` is empty.
- Fix: one sitemap index (`/sitemap.xml`) → products, categories, pages and posts. One canonical category scheme, with 301 redirects from the others. Drop cart, posts and checkout. Resubmit in GSC and remove the stale `/no` and `/da` entries.

### HIGH — Duplicate URL schemes for categories
`/shop/category/x`, `/shop/x` and `/product-category/x` all return 200 with similar content. Pick `/shop/category/x` (the one with self-canonicals) and 301 the other two.

### MEDIUM
- **hreflang** is missing on 184 of 297 URLs, including `/shop`, `/wholesale`, `/about` and their translations.
- `?add-to-cart=` URLs: a 308 that loops to itself (the GSC "Redirect error"). robots.txt blocks `/*?add-to-cart=*`, but the redirect should also be removed.
- `/posts` returns 200 with no content (soft 404). Redirect it to `/blog`.
- `www.restaurantpack.se` doesn't resolve (no DNS record). Add a CNAME and a 301 to the apex.
- robots.txt lists 5 sitemaps, including an empty one and ones that duplicate the main sitemap.

**What works:** HTTPS with an HTTP→HTTPS 308 redirect, trailing slashes 308 to the clean URL, robots.txt allows AI crawlers, no noindex on public pages, server-side rendered HTML (no JavaScript-only content).

## Content Quality (50/100)
- **Thin pages (<300 words):** 15 of 23 English category pages (105–250 words, e.g. dates 105, kraft-paper 106, dry-fruits 108), `/blog` (113), `/contact` (282), and 5 products (pappers-plant-kasse 116, skimmed milk powder 164, khanum ghee 165, köksrulle 186, medjool dates 271).
- **Blog:** 1 post, so there's almost no content beyond the catalogue.
- **Translations:** Swedish is the main market, but the indexed pages and clicks are almost all English. The sv/no/da versions are mostly unindexed, so for Swedish searches the site has very little presence.
- **E-E-A-T positives:** real address, org.nr, VAT number, own restaurant heritage (Anmol Sweets & Restaurant), FAQ.

## On-Page SEO (50/100)
- **Titles over 60 characters: 230 of 253.** Many end with the brand twice: "… | Anmol Wholesale | Anmol Wholesale".
- **Untranslated titles:** category titles on sv/no/da pages are English, e.g. "Rice Wholesale Stockholm | Anmol Wholesale | Anmol Wholesale".
- **Duplicate titles:** the same title appears across languages, e.g. /no/about and /da/about, and /no/contact and /da/contact.
- **Meta descriptions:** 49 are over 160 characters and 11 are under 70.
- **H1:** 101 pages have 2 identical H1s (e.g. `/shop` repeats "Wholesale Restaurant Supplies | B2B Shop" twice). Under load, 44 pages render with none (see Technical).

## Schema (55/100)
- **Product pages output the Product JSON-LD twice.** This is the cause of GSC's "Duplicate field brand".
- **Wrong brand:** `brand` is "Anmol Wholesale" for every product, even third-party brands such as Nordic Sugar, Hamdard, TRS and KOPE. Use the manufacturer brand.
- **Missing in offers:** `shippingDetails` and `hasMerchantReturnPolicy`. Also add a `priceSpecification` for the unit price and the carton MOQ (relevant to the new per-unit pricing).
- **Category pages have no ItemList or BreadcrumbList.**
- **Good:** Organization/LocalBusiness with geo and opening hours, FAQPage, WebSite with a SearchAction, and BreadcrumbList on products.

## Performance (35/100)
- Server response is **~1.0–1.4 s on every page** (no caching at all). A cached page should be under 100 ms.
- HTML is 202 KB median.
- No CrUX field data (too little traffic). The PageSpeed API quota was used up today, so lab data wasn't collected. Re-run after the caching fix.

## Images (50/100)
- **253 `<img>` tags without alt text** across the crawl, mostly repeated layout or product-card images.
- **82 pages have no `og:image`.**

## AI Search Readiness (60/100)
- `llms.txt` is present, and robots.txt allows GPTBot, ClaudeBot and PerplexityBot.
- The FAQPage schema and the knowledge base help.
- The same crawl-reliability problem limits AI crawlers too.
