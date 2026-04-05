# Full SEO Audit Report — restaurantpack.se
**Anmol Wholesale | B2B Restaurant Supply Sweden**
**Audit Date:** 2026-04-06
**Auditor:** Claude SEO (v1.8.0, customized for wholesale B2B)

---

## SEO Health Score: 61/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 68/100 | 22% | 15.0 |
| Content Quality | 58/100 | 23% | 13.3 |
| On-Page SEO | 62/100 | 20% | 12.4 |
| Schema / Structured Data | 72/100 | 10% | 7.2 |
| Performance (CWV) | 55/100 | 10% | 5.5 |
| AI Search Readiness | 52/100 | 10% | 5.2 |
| Images | 65/100 | 5% | 3.3 |
| **TOTAL** | | | **61.9** |

---

## Executive Summary

Restaurantpack.se is a well-built Next.js site with a strong technical foundation — SSR, hreflang, schema, sitemaps, and AI crawler access are all in place. However, several serious gaps are suppressing rankings:

**Top 5 Critical Issues:**
1. Shop page meta description is leftover grocery-store template text — completely wrong for a wholesale business
2. Blog is empty — zero published posts, a major content signal void
3. Google Search Console verification is unfinished (placeholder code in layout.tsx)
4. aggregateRating schema appears identical across multiple products (4.7/17) — likely hardcoded, risks Google penalty
5. Default locale is English at root while Swedish (the primary commercial language) lives at /sv/ — weakens Swedish SEO authority

**Top 5 Quick Wins:**
1. Fix the shop page meta description immediately (5 minutes)
2. Fix product and category page title duplication (30 minutes)
3. Add Google Search Console verification code (10 minutes)
4. Create `/llms.txt` for AI search visibility (15 minutes)
5. Add category intro text to top 5 categories (2 hours)

---

## 1. Technical SEO — Score: 68/100

### 1.1 Crawlability ✅ PASS (90/100)
- **robots.txt**: Excellent. Correctly blocks transactional paths (cart, checkout, my-account, API). All major crawlers explicitly allowed including Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Applebot.
- **Sitemaps**: Sitemap index at `/sitemap.xml` referencing sub-sitemaps (products, categories, pages, posts). All sitemaps include hreflang x4 (en, sv, no, da). Last-modified timestamps present.
- **AI crawlers**: ✅ All allowed — excellent for AI search visibility.
- **JavaScript rendering**: ✅ Next.js SSR — all content visible in initial HTML. AI crawlers can read all content.

**Issue:** `/_next/static/` is in Allow but `/_next/` is Disallowed above it — the Allow rule correctly overrides for assets, but worth verifying this doesn't accidentally block any critical JS chunks needed for rendering verification.

### 1.2 Indexability ⚠️ WARN (65/100)
- **Canonical tags**: Present on all audited pages and consistent with page URLs. ✅
- **Meta robots**: `index, follow, max-image-preview:large, max-snippet:-1` — correct ✅
- **Hreflang**: Implemented on all pages. Tags present: `en` (root), `sv` (/sv/), `no` (/no/), `da` (/da/), `x-default` (root). Technical implementation is correct.
- **Default locale is English**: `i18n/routing.ts` sets `defaultLocale: 'en'` with `localePrefix: 'as-needed'`. English lives at root `/`, Swedish at `/sv/`. For a Swedish-market wholesale business, this means Google associates the most authoritative domain root with English content. Swedish searchers typing "restaurang grossist" find the /sv/ pages, not the root. This dilutes Swedish authority.
- **Duplicate H1 tags**: Category pages (e.g., Rice) have the H1 tag appearing twice in the markup.
- **Only 24 products in sitemap**: For a wholesale distributor, a 24-product catalog is very thin. Either more products need to be added to WooCommerce, or the sitemap generation is incomplete.

### 1.3 Security ✅ PASS (85/100)
- HTTPS enforced ✅
- Canonical uses HTTPS ✅
- `poweredByHeader: false` in next.config.js — reduces attack surface ✅
- No mixed content detected on audited pages ✅
- **Gap**: Security headers (CSP, HSTS, X-Frame-Options) could not be verified via WebFetch — recommend checking via securityheaders.com

### 1.4 URL Structure ✅ PASS (80/100)
- Clean, descriptive URLs: `/product/mini-electric-tandoor-oven`, `/product-category/spices-flavouring` ✅
- No query parameter URLs in sitemaps ✅
- Category URLs use `/shop/category/` prefix consistently ✅
- **Issue**: Some category pages appear accessible at both `/product-category/rice` and `/shop/category/rice` — verify canonical consistency between these two URL patterns to prevent duplicate content.

### 1.5 Mobile Optimization ✅ PASS (85/100)
- Viewport meta: `width=device-width, initial-scale=1, maximum-scale=5` ✅
- Next.js framework indicates responsive design ✅
- `userScalable: true` — accessible ✅

### 1.6 Core Web Vitals ⚠️ WARN (55/100)
- `images: { unoptimized: true }` in next.config.js — **Next.js automatic image optimization is DISABLED**. This means no automatic WebP/AVIF conversion, no lazy loading, no size optimization. All product images served at original WooCommerce upload sizes. This is a significant LCP risk.
- Images from `crm.restaurantpack.se` are externally hosted — no CDN optimization
- `compress: true` in next.config.js ✅
- Google fonts preconnect present ✅
- CrUX field data not available (requires GSC setup) — cannot confirm real CWV scores

### 1.7 Structured Data ⚠️ WARN (72/100)
See Schema section below for details.

### 1.8 JavaScript Rendering ✅ PASS (95/100)
- Next.js App Router with SSR — critical SEO elements served in initial HTML
- Schema markup in `<script type="application/ld+json">` tags in server-rendered HTML ✅
- No client-side-only rendering of key SEO elements detected

### 1.9 IndexNow ❌ FAIL (0/100)
- No IndexNow implementation detected
- Would benefit from faster indexing on Bing (which powers ChatGPT local results)

---

## 2. Content Quality — Score: 58/100

### 2.1 Homepage (EN) ⚠️
- **Title**: "Wholesale Asian Groceries for Restaurants | Sweden | Anmol Wholesale" — Good, but "Asian Groceries" undersells the wholesale/B2B positioning. Could use "Restaurant Wholesale Supplier" instead.
- **H1**: "Wholesale Asian Groceries & Restaurant Supplies Sweden" — Acceptable but the primary Swedish keyword ("grossist") is absent.
- **Word count**: ~3,500–4,000 words ✅ — comprehensive, lots of product showcase content
- **Content quality**: Good USPs (next-day delivery, own fleet, 15% lower, halal certified). However, the product showcases (individual product H2s like "Nordic Sugar 25kg", "Ocean Pearl Basmati Rice") on the homepage feel like thin promotional blocks rather than genuine informational content.

### 2.2 Homepage (SV) ✅
- **Title**: "Grossist Asiatiska Livsmedel för Restauranger | Sverige | Anmol Wholesale" ✅ — excellent Swedish targeting
- **H1**: "Grossist Asiatiska Livsmedel & Restaurangvaror Sverige" ✅
- **Meta description**: "Premium grossistleverantör för restauranger. Indiska kryddor, basmatiris, tandoor-ugnar & bulkingredienser. Snabb leverans i Sverige & Europa." ✅

### 2.3 Shop Page ❌ CRITICAL
- **Title**: "Shop | Anmol Wholesale" — generic, no keywords whatsoever
- **Meta description**: "Browse our delicious menu featuring authentic cuisine, gourmet dishes, and more." — **This is leftover text from a restaurant/food delivery template. It has nothing to do with B2B wholesale supply.** This is an active SEO liability — it will confuse both Google and potential wholesale buyers who land on this page.
- **H1**: "Shop" (appears twice in markup — duplicate H1)

### 2.4 About Page ✅
- **Title**: "About Anmol Wholesale | Restaurant Expertise & Wholesale Power | Anmol Wholesale" ✅
- **Word count**: ~1,800–2,000 words ✅
- **Trust signals**: Founding date (2010), 150+ brands, 28+ countries, parent restaurant credibility ✅
- **Gap**: Swedish org number / Bolagsverket registration not mentioned. For B2B buyers, this is a trust signal.

### 2.5 Category Pages ❌ HIGH PRIORITY
- **Rice**: Only 1 product visible. Title "Rice | Anmol Wholesale | Anmol Wholesale" (brand repeated). Duplicate H1. Good intro paragraph ✅.
- **Spices & Flavouring**: Only 1 product visible. **No intro paragraph / category description text** — zero content above products. Title repetitive.
- **General**: Most category meta descriptions are thin (just the category name). Categories need 200-300 word intro text for SEO value.

### 2.6 Product Pages ⚠️
- **Tandoor**: 1,100 words ✅. But title has brand name twice: "...| Anmol Wholesale | Anmol Wholesale"
- **Basmati Rice**: 1,400+ words ✅. Good content depth.
- **AC/DC Fan**: 1,500+ words ✅. Good.
- **Pattern**: All product pages have strong word counts. The main issues are title tag duplication and suspicious review data.

### 2.7 Blog ❌ CRITICAL
- **Status**: EMPTY. Zero published posts.
- **Message**: "We are currently crafting amazing content for you. Check back soon!"
- This is a massive missed opportunity. A wholesale food supplier has enormous blog potential: recipe guides for chefs, ingredient sourcing guides, Swedish restaurant industry news, "how to open a restaurant in Sweden" etc. Without blog content, the site misses informational keyword traffic and E-E-A-T signals.

### 2.8 FAQ Page ✅
- 21 Q&As covering ordering, delivery, pricing, returns, EU sales ✅
- Good depth (2,400–2,800 words) ✅
- FAQPage schema implemented ✅

### 2.9 E-E-A-T Assessment
| Factor | Score | Signals |
|--------|-------|---------|
| Experience | 18/25 | Restaurant background, "chefs for chefs", 15+ years ✅. No direct case studies or before/after content ❌ |
| Expertise | 16/25 | Electric Tandoor manufacturer ✅. No certified staff credentials, no named experts ❌ |
| Authoritativeness | 12/25 | Facebook presence. No LinkedIn company page evident. No press mentions. No Wikipedia. ❌ |
| Trustworthiness | 18/25 | Address, phone, email, hours ✅. No Swedish org number displayed ❌. No BBB/Eniro citations evident ❌ |
| **Total** | **64/100** | |

---

## 3. On-Page SEO — Score: 62/100

### 3.1 Title Tags

| Page | Current Title | Issues |
|------|--------------|--------|
| Homepage (EN) | Wholesale Asian Groceries for Restaurants \| Sweden \| Anmol Wholesale | Good — could be stronger |
| Homepage (SV) | Grossist Asiatiska Livsmedel för Restauranger \| Sverige \| Anmol Wholesale | ✅ Strong |
| **Shop** | **Shop \| Anmol Wholesale** | ❌ CRITICAL — no keywords |
| About | About Anmol Wholesale \| Restaurant Expertise & Wholesale Power \| Anmol Wholesale | ✅ Good |
| Contact | Contact Anmol Wholesale \| B2B Support & Spånga Warehouse \| Anmol Wholesale | ✅ Good |
| FAQ | B2B Wholesale FAQ \| 15% Lower Prices \| Anmol Wholesale Stockholm \| Anmol Wholesale | ✅ Good (minor: brand twice) |
| Delivery | B2B Wholesale Delivery Stockholm \| 15% Lower Prices \| Anmol Wholesale | ✅ Good |
| Europe Delivery | European B2B Wholesale Shipping \| 15% Lower Prices \| Anmol Wholesale \| Anmol Wholesale | Brand repeated |
| Wholesale Hub | B2B Wholesale Hub \| 15% Lower Prices \| Anmol Wholesale Stockholm \| Anmol Wholesale | Brand repeated |
| Rice category | Rice \| Anmol Wholesale \| Anmol Wholesale | ❌ Brand repeated, no keywords |
| Tandoor product | Mini Electric Tandoor oven \| Wholesale \| Buy Wholesale \| Anmol Wholesale \| Anmol Wholesale | ❌ Brand repeated twice |
| Blog | Blog - Anmol Wholesale \| Anmol Wholesale | ❌ Generic, brand repeated |

**Root cause**: The title template in Next.js `layout.tsx` uses `template: '%s | ${siteConfig.site_name}'` — when a page already includes the brand name in its title string, it gets appended again by the template. Needs a pattern to avoid this duplication.

### 3.2 Meta Descriptions

| Page | Issue |
|------|-------|
| Shop | ❌ CRITICAL: "Browse our delicious menu featuring authentic cuisine" — wrong template |
| Blog | ❌ Vague: "Stay tuned for the latest articles, recipes, and news" |
| Rice category | ⚠️ Truncated in display |
| Spices category | ❌ Just the category name |

### 3.3 Heading Structure

| Page | H1 Count | Issues |
|------|---------|--------|
| Shop | 2 | Duplicate H1 |
| Rice category | 2 | Duplicate H1 |
| Homepage | 1 | Correct ✅ |
| Product pages | 1 | Correct ✅ |

### 3.4 Internal Linking
- Homepage has 25+ internal links ✅
- Product pages link to related products ✅
- **Gap**: No breadcrumb on some pages (Europe delivery page missing BreadcrumbList schema)
- **Gap**: Blog is empty so no blog-to-product internal links exist

### 3.5 Keyword Coverage (Swedish)
Primary Swedish keywords and their status:

| Keyword | Page Targeting It | Status |
|---------|------------------|--------|
| restaurang grossist | /sv/ homepage H1 ✅ | ✅ |
| grossist stockholm | /sv/ homepage | ✅ |
| storköksvaror grossist | Not found in visible content | ❌ MISSING |
| indiska kryddor grossist | Not prominent | ⚠️ Weak |
| basmati ris storpack | /sv/product/ocean-pearl | ⚠️ Product page only |
| elektrisk tandoor | Tandoor product page | ✅ |
| restaurang leverantör sverige | Partial | ⚠️ |
| engångsbehållare restaurang | Not found | ❌ MISSING |

---

## 4. Schema / Structured Data — Score: 72/100

### 4.1 What's Implemented ✅

| Schema Type | Location | Status |
|------------|---------|--------|
| Organization + Wholesaler + LocalBusiness | All pages (layout) | ✅ Excellent |
| WebSite + SearchAction | Homepage | ✅ |
| Product + Offer | All product pages | ✅ |
| BreadcrumbList | Product pages, category pages | ✅ |
| Article/BlogPosting | Blog posts | N/A (no posts) |
| FAQPage | FAQ page, Delivery page | ✅ |
| Service | Delivery, Europe delivery | ✅ |
| CollectionPage | Category pages | ✅ |

### 4.2 Schema Issues

**CRITICAL — Suspicious aggregateRating (Penalty Risk):**
Every audited product page shows **identical** aggregateRating: `4.7/5, 17 reviews`. This was found on:
- Mini Electric Tandoor Oven: 4.7/5, 17 reviews
- Ocean Pearl Basmati Rice: 4.7/5, 17 reviews
- 16-Inch AC/DC Stand Fan: 4.7/5, 17 reviews

This strongly suggests the rating is hardcoded in a product schema template, not sourced from real reviews. **Google explicitly prohibits fabricated or non-genuine review data in structured markup.** This can result in a manual action (penalty). The aggregateRating should either be:
1. Removed entirely from Product schema (safe)
2. Connected to real WooCommerce product reviews (correct)

**Missing — B2B-specific schema:**
- No `eligibleCustomerType: https://schema.org/Business` on Offer schema (signals B2B-only)
- No `PriceSpecification` with `minQuantity` for MOQ tiers
- No `DeliveryChargeSpecification` schema for free delivery threshold (5,000 SEK Stockholm)

**Missing — Organization schema gaps:**
- No `legalName: "Anmol AB"` in schema (though it exists in the organization.ts file as alternateName)
- No `vatID` or `taxID` in schema (Swedish org number would strengthen trust)
- No `numberOfEmployees` (optional but E-E-A-T signal)

### 4.3 Schema Opportunities

| Schema Type | Page | Priority |
|------------|------|---------|
| `Review` (real WooCommerce reviews) | Product pages | HIGH — replace hardcoded ratings |
| `PriceSpecification` with `minQuantity` | Product offers | MEDIUM |
| `eligibleCustomerType: Business` | All product Offers | MEDIUM |
| `DeliveryChargeSpecification` | Delivery page | MEDIUM |
| `BreadcrumbList` | Europe delivery page | LOW |

---

## 5. Performance (CWV) — Score: 55/100

> Note: No Google API credentials configured — scores are estimated from code analysis, not real CrUX field data.

### Estimated Issues

| Issue | Impact | Source |
|-------|--------|--------|
| `images: { unoptimized: true }` — Next.js image optimization disabled | **HIGH LCP risk** | next.config.js |
| Product images served from external domain (crm.restaurantpack.se) | LCP: no CDN optimization | Architecture |
| Google Fonts loaded (DM Sans + Sora) | Small FCP delay | layout.tsx |
| Facebook Pixel + GTM both active | Potential TBT/INP impact | layout.tsx |
| `compress: true` enabled | ✅ Reduces payload | next.config.js |
| No `loading="lazy"` audit on images | Unknown CLS risk | - |

**Key finding**: Disabling Next.js image optimization (`unoptimized: true`) was done to avoid Vercel 402 errors, but it means all product images are served at original resolution. For a product-heavy wholesale site, this is likely the biggest performance bottleneck.

### Recommendations
1. Enable Next.js image optimization (or use a CDN alternative like Cloudinary)
2. Run real PageSpeed Insights on `/` and `/sv/` to get actual LCP scores
3. Audit Facebook Pixel firing — ensure it doesn't block main thread

---

## 6. AI Search Readiness (GEO) — Score: 52/100

### 6.1 AI Crawler Access ✅ (100/100)
All major AI crawlers allowed in robots.txt: GPTBot, ClaudeBot, PerplexityBot, Applebot, Bingbot. Excellent.

### 6.2 llms.txt ❌ (0/100)
No `/llms.txt` file exists. This is an emerging standard for guiding AI crawlers to the most important content. Missed opportunity.

### 6.3 Server-Side Rendering ✅ (100/100)
Next.js SSR — all content visible in initial HTML. AI crawlers do not need to execute JavaScript to read content.

### 6.4 Citability Score ⚠️ (55/100)
- Homepage has 3,500+ words with many product-level blocks — citability per block is limited
- FAQ page is excellent for AI citation (21 structured Q&As) ✅
- Delivery page has good specific facts (delivery times, pricing thresholds) ✅
- **Missing**: "What is a restaurant wholesale supplier?" definition-style content in first 60 words
- **Missing**: Statistics blocks (e.g., "We supply 150+ brands to 500+ restaurants in Sweden")
- **Missing**: Self-contained 134-167 word answer blocks on key topics

### 6.5 Brand Signals ❌ (25/100)
| Platform | Status |
|---------|--------|
| Wikipedia | ❌ No presence detected |
| Reddit | ❌ No presence detected |
| YouTube | ❌ No channel/videos detected |
| LinkedIn | ❌ No company page referenced in schema |
| Facebook | ✅ AnmolWholesale page referenced |
| Bing Places | Unknown — likely not claimed |
| Google Business Profile | Referenced in schema but Bing not mentioned |

### 6.6 Structured Content for AI ✅ (70/100)
- FAQ schema present ✅
- Heading hierarchy clean (H1→H2→H3) ✅
- Tables used on some pages ✅
- Question-based H2/H3 headings on some pages ✅

---

## 7. Images — Score: 65/100

### 7.1 Alt Text Coverage ✅
All audited product images have alt text present. Examples:
- "Anmol Mini Tandoor oven electric, designed for European Market" ✅
- "Mini Electric Tandoor oven" ✅ (could be more descriptive)
- "Swedish Mini Electric Tandoor oven for pizza, roti and more" ✅

### 7.2 Image Optimization ❌
- Next.js image optimization disabled (`unoptimized: true`) — no automatic WebP/AVIF, no responsive srcset
- Product images hosted on `crm.restaurantpack.se` (WooCommerce) — no CDN optimization layer
- Format is likely JPEG/PNG at original upload size

### 7.3 Alt Text Quality ⚠️
Alt texts are present but could be more keyword-rich:
- "Mini Electric Tandoor oven" → "Anmol Mini Electric Tandoor Oven 450W - Wholesale Sweden"
- Product category descriptions could include model specs in alt text

### 7.4 Open Graph Image ✅
OG image present at `/opengraph-image.jpeg` (1200x630) ✅

---

## 8. Local SEO — Score: 68/100

### 8.1 Business Type: Wholesale Distributor (Hybrid — physical warehouse + service area)

### 8.2 GBP Signals ⚠️ (60/100)
- Physical address present on all pages (footer, contact, schema) ✅
- Google Maps embed on contact page ✅
- NAP consistent across page, schema, and footer ✅
- GBP category: Unknown — cannot verify from frontend. Should be "Wholesale Grocer" or "Food Distributor"
- **No GBP widget/reviews embed on homepage or product pages** — missed trust signal

### 8.3 NAP Consistency ✅ (90/100)
- Name: "Anmol Wholesale" consistent across all pages ✅
- Address: "Fagerstagatan 13, 163 53 Spånga, Sweden" consistent ✅
- Phone: "+46769178456" consistent ✅
- **Gap**: Swedish org/VAT number not displayed on any public page

### 8.4 Swedish/Nordic Citations ❌ (20/100)
- Eniro.se: Not confirmed ❌
- Hitta.se: Not confirmed ❌
- Allabolag.se: Auto-populated from Bolagsverket — should verify data ⚠️
- Ratsit.se: Not confirmed ❌
- LinkedIn Company Page: Not referenced anywhere ❌
- Bing Places: Not confirmed ❌ (critical for ChatGPT local results)

### 8.5 Local Schema ✅ (85/100)
- LocalBusiness + Wholesaler schema on all pages ✅
- Geo coordinates: 59.3833, 17.8981 (Spånga) ✅
- Opening hours specification ✅
- areaServed with named countries ✅
- **Minor gap**: Geo coordinates only 4 decimal places (recommended: 5+)

### 8.6 Reviews ⚠️
- No visible review embeds on site
- aggregateRating in schema is suspicious (see Schema section)
- No third-party review platform linked (Trustpilot, Google reviews)

---

## 9. Multi-Language SEO — Score: 74/100

### 9.1 Hreflang Implementation ✅
Hreflang tags correctly implemented on all pages:
- `hreflang="en"` → root URL (/)
- `hreflang="sv"` → /sv/
- `hreflang="no"` → /no/
- `hreflang="da"` → /da/
- `hreflang="x-default"` → root URL (/)

### 9.2 Content Localization ✅
- Swedish homepage title/meta/H1 correctly translated ✅
- URL structure consistent across locales ✅

### 9.3 Default Locale Issue ⚠️
- `defaultLocale: 'en'` — English at root `/`
- Swedish at `/sv/`
- For a Swedish B2B wholesale company, the root URL (highest authority) serves English content
- Swedish is the primary commercial language for this business
- The comment in routing.ts says "English has no prefix (preserves existing URLs / Google indexing)" — this was a deliberate decision but has SEO costs for Swedish rankings
- **Recommendation**: Either accept this tradeoff (valid if targeting international customers too) OR switch default to `sv` for maximum Swedish authority

### 9.4 Open Graph Locale ⚠️
- Homepage (root) has `og:locale: "en_US"` ✅
- But the Swedish page also shows `og:locale: "en_US"` based on layout defaults — should be `sv_SE` on Swedish pages

---

## Appendix: Pages Audited

| Page | URL | Status |
|------|-----|--------|
| Homepage EN | https://restaurantpack.se | ✅ Audited |
| Homepage SV | https://restaurantpack.se/sv | ✅ Audited |
| Shop | https://restaurantpack.se/shop | ✅ Audited |
| About | https://restaurantpack.se/about | ✅ Audited |
| Contact | https://restaurantpack.se/contact | ✅ Audited |
| FAQ | https://restaurantpack.se/faq | ✅ Audited |
| Delivery | https://restaurantpack.se/delivery-information | ✅ Audited |
| Europe Delivery | https://restaurantpack.se/europe-delivery | ✅ Audited |
| Wholesale Hub | https://restaurantpack.se/wholesale | ✅ Audited |
| Blog | https://restaurantpack.se/blog | ✅ Audited (empty) |
| Rice Category | https://restaurantpack.se/product-category/rice | ✅ Audited |
| Spices Category | https://restaurantpack.se/product-category/spices-flavouring | ✅ Audited |
| Tandoor Product | https://restaurantpack.se/product/mini-electric-tandoor-oven | ✅ Audited |
| Basmati Rice Product | https://restaurantpack.se/product/ocean-pearl-basmati-rice | ✅ Audited |
| AC/DC Fan Product | https://restaurantpack.se/product/16-inch-ac-dc-stand-fan | ✅ Audited |
| Anmol Tandoor (404) | https://restaurantpack.se/product/anmol-mini-electric-tandoor | ❌ 404 |
| robots.txt | https://restaurantpack.se/robots.txt | ✅ Audited |
| sitemap.xml | https://restaurantpack.se/sitemap.xml | ✅ Audited |
| sitemap-products.xml | https://restaurantpack.se/sitemap-products.xml | ✅ Audited (24 products) |
| sitemap-categories.xml | https://restaurantpack.se/sitemap-categories.xml | ✅ Audited (20 categories) |
| llms.txt | https://restaurantpack.se/llms.txt | ❌ 404 — Does not exist |
