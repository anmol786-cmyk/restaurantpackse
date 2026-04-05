# SEO Action Plan — restaurantpack.se
**Anmol Wholesale | Priority: Critical → High → Medium → Low**
**Generated:** 2026-04-06

---

## CRITICAL — Fix Immediately (blocks rankings or risks penalties)

### C-1: Fix Shop Page Meta Description
**File:** `messages/en.json`, `messages/sv.json`, `messages/no.json`, `messages/da.json`
**Current (EN):** "Browse our delicious menu featuring authentic cuisine, gourmet dishes, and more."
**This is leftover restaurant template text — not appropriate for a B2B wholesale supplier.**

**Suggested EN:** "Browse 150+ wholesale products for restaurants — Indian spices, basmati rice, bulk oils, packing & more. B2B pricing with MOQ from 6 units. Shop now."
**Suggested SV:** "Bläddra bland 150+ grossistprodukter för restauranger — indiska kryddor, basmatiris, emballage och mer. B2B-priser med MOQ från 6 enheter."

---

### C-2: Fix Fake/Hardcoded aggregateRating in Product Schema
**File:** Wherever Product schema is generated — likely `lib/schema/product.ts` or the product template component
**Issue:** All products show identical `4.7/5, 17 reviews` — this is hardcoded or copied from a template.
**Risk:** Google manual action for misleading structured data.

**Fix options (choose one):**
1. **Remove aggregateRating entirely** from Product schema until real reviews are collected from WooCommerce
2. **Wire it to real WooCommerce review data** — fetch `average_rating` and `rating_count` from the WooCommerce product API and pass to schema

```typescript
// In product schema — only include if real data exists
...(product.rating_count > 0 && {
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.rating_count,
    bestRating: 5,
    worstRating: 1,
  }
})
```

---

### C-3: Complete Google Search Console Verification
**File:** `app/layout.tsx` line 96
**Current:** `google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE"`
**Fix:** Replace with actual verification code from Google Search Console
**Why critical:** Without GSC, you have no visibility into indexation errors, keyword performance, Core Web Vitals field data, or manual actions.

Steps:
1. Go to Google Search Console → Add Property → URL prefix → https://restaurantpack.se
2. Choose "HTML tag" verification method
3. Copy the content value from the meta tag
4. Replace placeholder in `app/layout.tsx`

---

### C-4: Fix Title Tag Duplication (Template Issue)
**File:** `app/layout.tsx` and individual page metadata
**Issue:** The title template `'%s | ${siteConfig.site_name}'` appends "Anmol Wholesale" to every page. When pages already include "Anmol Wholesale" in their title string, it appears twice.

**Affected pages:**
- "Mini Electric Tandoor oven | Wholesale | Buy Wholesale | **Anmol Wholesale | Anmol Wholesale**"
- "Blog - **Anmol Wholesale | Anmol Wholesale**"
- "**Rice | Anmol Wholesale | Anmol Wholesale**"
- "European B2B Wholesale Shipping | 15% Lower Prices | **Anmol Wholesale | Anmol Wholesale**"

**Fix:** In each page's `generateMetadata`, ensure the title string does NOT include "Anmol Wholesale" — let the layout template add it. Example:

```typescript
// WRONG (creates duplication):
title: "Mini Electric Tandoor | Wholesale | Anmol Wholesale"

// CORRECT (template adds brand):
title: "Mini Electric Tandoor | Restaurant Wholesale Supply Sweden"
// Renders as: "Mini Electric Tandoor | Restaurant Wholesale Supply Sweden | Anmol Wholesale"
```

---

## HIGH — Fix Within 1 Week

### H-1: Fix Shop Page Title
**File:** `app/[locale]/(shop)/page.tsx` (or wherever shop metadata is)
**Current:** "Shop | Anmol Wholesale"
**Suggested EN:** "Wholesale Restaurant Supplies | B2B Shop | Anmol Wholesale"
**Suggested SV:** "Grossistvaror för restauranger | B2B-shop | Anmol Wholesale"

---

### H-2: Add Category Intro Text (Top Priority Categories)
**Files:** Category page components / WooCommerce category description
**Issue:** Spices & Flavouring has zero text above products. Rice has text but only 1 product.

Add 150-250 word intro paragraphs to these categories (in Swedish AND English):

1. **Spices & Flavouring** — "Wholesale Indian spices for restaurants. Cumin, turmeric, coriander... MOQ 6 units. Delivered across Sweden."
2. **Rice / Basmati Rice** — "Wholesale basmati rice for professional kitchens. India Gate, Ocean Pearl. Bulk bags. Sweden delivery."
3. **Packing** — "Restaurant packing supplies wholesale — disposable containers, kraft paper bags, sweet boxes."
4. **Oils & Fats** — "Wholesale cooking oils for restaurants. Pomace olive oil, frying oil in 10L bulk."
5. **Electronics (Tandoor)** — "Professional electric tandoor ovens direct from manufacturer. Anmol Mini Electric Tandoor."

---

### H-3: Create /llms.txt
**File:** Create `public/llms.txt`
**Why:** Guides AI crawlers (ChatGPT, Perplexity, Claude) to your most important content for citation.

```
# Anmol Wholesale — B2B Restaurant Supply Sweden
> Sweden's wholesale supplier for restaurants and professional kitchens. Authentic Indo-Pak ingredients, bulk food supplies, and the Anmol Electric Tandoor. Located in Spånga, Stockholm.

## Core Pages
- [Wholesale Hub](https://restaurantpack.se/wholesale): B2B account registration, wholesale pricing, and partner information
- [Shop](https://restaurantpack.se/shop): Full product catalog with 150+ wholesale products
- [FAQ](https://restaurantpack.se/faq): Wholesale ordering, MOQ, delivery, and payment terms
- [Delivery Information](https://restaurantpack.se/delivery-information): Stockholm fleet, DHL Sweden, EU shipping details
- [About](https://restaurantpack.se/about): Company background, 15+ years experience, manufacturer credentials
- [Contact](https://restaurantpack.se/contact): Warehouse address, phone, email, opening hours

## Key Facts
- Physical warehouse: Fagerstagatan 13, Spånga, Stockholm 163 53, Sweden
- Phone: +46769178456
- Email: info@restaurantpack.se
- Minimum order: 6 units (MOQ) on most products
- Free Stockholm delivery on orders over 5,000 SEK
- Open Mon-Fri 10:00-20:00, Sat-Sun 11:00-19:00
- Serves: Sweden, Norway, Denmark, Finland, Germany
- Founded: 2010 by restaurateurs with 15+ years experience
- Manufacturer of Anmol Mini Electric Tandoor (450 SEK/unit wholesale)
- 150+ brands stocked, 28+ countries supplied

## Products
- [Anmol Mini Electric Tandoor](https://restaurantpack.se/product/mini-electric-tandoor-oven): Own-manufactured electric tandoor, 450 SEK wholesale, MOQ 6
- [Ocean Pearl Basmati Rice](https://restaurantpack.se/product/ocean-pearl-basmati-rice): 5kg wholesale pack, 115 SEK, MOQ 6
- [Wholesale Spices & Flavouring](https://restaurantpack.se/shop/category/spices-flavouring): Indian spices bulk wholesale
- [Restaurant Packing](https://restaurantpack.se/shop/category/packing): Disposable containers, kraft bags, sweet boxes
```

---

### H-4: Start Blog Content — First 4 Posts (Swedish Priority)
**File:** WordPress backend at crm.restaurantpack.se
**Issue:** Blog is completely empty. Content is a critical E-E-A-T signal.

**Priority posts (write in Swedish first):**

1. **"Grossistguide: Hur restauranger sparar 15% på kryddor och råvaror"**
   Target: "restaurang grossist guide", "spara pengar restaurang"
   Format: 1,500 words, practical guide, specific product recommendations

2. **"Elektrisk Tandoor för restaurang: Komplett guide (2025)"**
   Target: "elektrisk tandoor", "tandoor ugn restaurang", "köpa tandoor"
   Format: 1,200 words, product guide with specs comparison

3. **"Basmati ris grossist: Välj rätt kvalitet för din restaurang"**
   Target: "basmati ris grossist", "india gate basmati", "basmati ris storpack"
   Format: 1,000 words, buyer's guide comparing grades/brands

4. **"Restaurang Grossist Stockholm: Allt du behöver veta"**
   Target: "restaurang grossist stockholm", "storköksvaror stockholm"
   Format: 1,200 words, local guide covering what a wholesale supplier provides

---

### H-5: Claim Nordic Business Directory Listings
**Priority order:**
1. **Google Business Profile** — verify and optimize category ("Wholesale Grocer" + secondary: "Food Distributor", "Restaurant Supply Store")
2. **Bing Places** — critical for ChatGPT local search (claim at bingplaces.com)
3. **Apple Business Connect** — claim at businessconnect.apple.com
4. **Eniro.se** — Sweden's #1 business directory
5. **Hitta.se** — claim and verify NAP
6. **LinkedIn Company Page** — create if not exists; reference in Organization schema `sameAs`
7. **Allabolag.se / Ratsit.se** — verify auto-populated data is correct

---

### H-6: Add Swedish Org Number to Contact/About Pages
**Files:** Contact page component, About page component
**Add:** "Org. nr: [Anmol AB's Bolagsverket number]" and "VAT: SE[number]" in footer or contact section
**Why:** Critical B2B trust signal. Swedish restaurant owners verify suppliers via Allabolag.se — displaying org number openly signals legitimacy.

---

## MEDIUM — Fix Within 1 Month

### M-1: Fix Category Page Titles
Update all category page titles to include keywords and remove brand duplication.

| Category | Current | Suggested |
|----------|---------|---------|
| Rice | Rice \| Anmol Wholesale \| Anmol Wholesale | Wholesale Basmati Rice for Restaurants \| Sweden |
| Spices | Spices & Flavouring \| Anmol Wholesale | Wholesale Indian Spices & Masala \| Restaurant Supply |
| Packing | Packing \| Anmol Wholesale | Restaurant Packing Wholesale \| Containers & Boxes |
| Oils & Fats | Oils & Fats \| Anmol Wholesale | Wholesale Cooking Oils for Restaurants \| 10L Bulk |
| Tandoor | Tandoor Oven \| Anmol Wholesale | Electric Tandoor Oven Wholesale \| Sweden |

---

### M-2: Add B2B-Specific Schema to Product Offers
**File:** `lib/schema/product.ts`
Add to all Product `Offer` schemas:

```json
{
  "@type": "Offer",
  "eligibleCustomerType": "https://schema.org/Business",
  "eligibleQuantity": {
    "@type": "QuantitativeValue",
    "minValue": 6,
    "unitCode": "C62"
  },
  "priceValidUntil": "2027-01-01"
}
```

---

### M-3: Add DeliveryChargeSpecification Schema
**File:** `lib/schema/delivery.ts`
Add to the Organization or website schema:

```json
{
  "@type": "DeliveryChargeSpecification",
  "name": "Free Stockholm Delivery",
  "appliesToDeliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
  "freeDeliveryThreshold": {
    "@type": "MonetaryAmount",
    "currency": "SEK",
    "value": 5000
  },
  "eligibleRegion": {
    "@type": "City",
    "name": "Stockholm"
  }
}
```

---

### M-4: Fix Image Optimization
**File:** `next.config.js`
**Current:** `unoptimized: true` (all images served unoptimized)
**Issue:** This was set to avoid Vercel 402 errors, but it kills CWV scores.

**Options:**
1. Enable optimization again and configure Vercel image optimization properly: `unoptimized: false`
2. Use a self-hosted image CDN (e.g., Cloudflare Images) and configure `loader`
3. At minimum: manually optimize WooCommerce product images to WebP before upload

If staying with Vercel: remove `unoptimized: true` and test if the 402 issue was related to plan limits (now resolved) or configuration.

---

### M-5: Add MOQ and Payment Terms to Wholesale Page
**File:** Wholesale page component
**Issue:** The /wholesale page doesn't clearly state MOQ (6 units default) or payment terms.
**Add:** A visible "Wholesale Terms" section covering:
- Global MOQ: 6 units
- Products exempt from MOQ (packing items)
- Payment terms: Net 30/60 for approved businesses
- How to apply for credit terms
- Account approval process and timeline

---

### M-6: Fix Geo Coordinate Precision in Schema
**File:** `lib/schema/organization.ts` lines 119-120
**Current:** `latitude: 59.3833, longitude: 17.8981` (4 decimal places)
**Fix:** `latitude: 59.38330, longitude: 17.89810` — use 5+ decimal places as recommended

---

### M-7: Add IndexNow
**Why:** Bing (which powers ChatGPT local search) indexes faster with IndexNow notifications.
**File:** `app/api/` — create IndexNow API route or add to build process
**Implementation:** Simple — generate a key, add `/{key}.txt` to public/, add key to robots.txt, call IndexNow API on product/page changes.

---

### M-8: Improve Alt Text on Product Images
**Target:** Make alt texts keyword-rich and descriptive
**Examples:**
- "Mini Electric Tandoor oven" → "Anmol Mini Electric Tandoor Oven — Wholesale Restaurant Supply Sweden"
- "Anmol Mini Tandoor oven electric" → "Anmol 450W Electric Tandoor Oven for Professional Kitchens — Made in Stockholm"

---

## LOW — Backlog

### L-1: Consider Making Swedish the Default Locale
**File:** `i18n/routing.ts`
**Change:** `defaultLocale: 'sv'` → Swedish at root, English at `/en/`
**Impact:** Major SEO benefit for Swedish rankings. Swedish content gets root authority.
**Caution:** This is a breaking change. All existing `/` links become `/` serving Swedish. English users get /en/. Requires redirect setup and 301s from old en URLs to /en/.
**Decision:** Discuss with business owner — depends on how important international (English) traffic is vs. Swedish rankings.

### L-2: Add Speakable Schema for Voice Search
Already have `lib/schema/speakable.ts` — verify it's implemented on product and FAQ pages.

### L-3: Create LinkedIn Company Page
LinkedIn is a critical B2B authority signal and AI citation source. Create company page and add URL to Organization schema `sameAs` array.

### L-4: Add RSL 1.0 Licensing Declaration
Emerging standard for AI content licensing. Add to robots.txt or as HTTP header.

### L-5: Build Wikipedia Presence
Long-term E-E-A-T play — create Wikipedia article for "Anmol Electric Tandoor" or "Anmol Wholesale" once the brand has sufficient secondary sources.

### L-6: Request Google Reviews from Existing Customers
Real Google reviews (once GBP is claimed and optimized) will:
- Enable genuine aggregateRating in Product schema
- Improve local pack rankings
- Provide social proof for B2B buyers

### L-7: Check /product-category/ vs /shop/category/ Canonical Consistency
Two URL patterns appear accessible — verify they have consistent canonicals pointing to one version to avoid duplicate content.

---

## Summary Timeline

| Week | Actions |
|------|---------|
| **This week** | C-1 (shop meta), C-2 (fake ratings), C-3 (GSC), C-4 (title duplication) |
| **Week 2** | H-1 (shop title), H-3 (llms.txt), H-5 (GBP + Bing Places claim), H-6 (org number) |
| **Week 3** | H-2 (category intro text), H-4 (first 2 blog posts) |
| **Week 4** | H-4 (blog posts 3+4), M-1 (category titles), M-2 (B2B schema) |
| **Month 2** | M-3, M-4 (image optimization), M-5 (wholesale terms), M-7 (IndexNow) |
| **Month 3** | L-3 (LinkedIn), L-6 (review strategy), L-7 (canonical audit) |
| **Month 4+** | L-1 (locale switch decision), L-5 (Wikipedia), ongoing blog cadence |

---

## KPI Targets

| Metric | Now (Baseline) | 3 Months | 6 Months |
|--------|---------------|---------|---------|
| SEO Health Score | 61/100 | 72/100 | 80/100 |
| Swedish keywords top-10 | Unknown (no GSC) | 5 target keywords | 15 target keywords |
| Indexed pages | ~64 (sitemap) | 80+ | 100+ |
| Product catalog | 24 products | 40+ | 60+ |
| Blog posts | 0 | 8 | 20 |
| Google reviews | Unknown | 10+ | 25+ |
| Core Web Vitals | Unknown (CrUX N/A) | Pass all 3 | Pass all 3 |
