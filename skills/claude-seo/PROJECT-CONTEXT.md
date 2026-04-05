# Project Context: restaurantpack.se — Anmol Wholesale

## Business Identity

| Field | Value |
|-------|-------|
| **Brand** | Anmol Wholesale |
| **Legal name** | Anmol AB |
| **Website** | https://restaurantpack.se |
| **Business model** | B2B Wholesale Distributor (NOT retail, NOT grocery store) |
| **Industry** | Restaurant Supply / Food Wholesale / Kitchen Equipment |
| **Founded** | 2010 |
| **Slogan** | "Kitchen to Kitchen" |

## Location & Service Area

| Field | Value |
|-------|-------|
| **Address** | Fagerstagatan 13, Spånga, Stockholm 163 53, Sweden |
| **Phone** | +46769178456 |
| **Email** | info@restaurantpack.se |
| **Coordinates** | 59.3833, 17.8981 |
| **Primary market** | Stockholm & Stockholm County |
| **National reach** | All of Sweden |
| **Export markets** | Norway, Denmark, Finland, Germany |
| **Opening hours** | Mon–Fri 10:00–20:00, Sat–Sun 11:00–19:00 |

## Target Audience (B2B ONLY)

- Restaurant owners and chefs
- Catering companies
- Hotel kitchens (HoReCa)
- Food stalls and market vendors
- Ethnic grocery store wholesalers
- Institutional kitchens (schools, care homes)
- **NOT**: individual consumers, home cooks, retail shoppers

## Product Categories

1. **Indian Spices & Masala** (bulk wholesale packs) — primary category
2. **Basmati Rice** (storpack, bulk bags — India Gate, Elephant etc.)
3. **Restaurant Packing** (disposable containers, boxes, trays)
4. **Electric Tandoor** (Anmol Mini Electric Tandoor — own product, ID 161)
5. **Kitchen Equipment** (tandoor, commercial appliances)
6. **Halal Meat** (select lines)
7. **Branded Products** (Haldiram snacks, MTR, etc.)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend/Commerce** | WooCommerce (crm.restaurantpack.se) |
| **Rendering** | SSR + SSG (Next.js) — AI crawlers CAN read content |
| **Analytics** | Google Tag Manager, Facebook Pixel |
| **CDN/Images** | WooCommerce uploads at crm.restaurantpack.se |
| **i18n** | next-intl — 4 locales: sv (default), en, no, da |

## Languages & Locales

| Locale | URL pattern | Priority |
|--------|------------|---------|
| Swedish (sv) | `/` (root, no prefix) | PRIMARY — most traffic |
| English (en) | `/en/` | Secondary |
| Norwegian (no) | `/no/` | Nordic expansion |
| Danish (da) | `/da/` | Nordic expansion |

**Critical**: Swedish-language SEO is the primary battleground. Keywords like
"restaurang grossist", "storköksvaror grossist", "indiska kryddor grossist" are
the highest-value targets.

## Existing SEO Implementation

### Already Done ✅
- robots.txt: well-structured, all AI crawlers allowed
- Organization + Wholesaler + LocalBusiness schema (JSON-LD, SSR)
- Website schema with SearchAction
- Hreflang tags (sv, en, no, da)
- Geo meta tags (geo.region, geo.placename, ICBM)
- Open Graph + Twitter Card metadata
- XML sitemaps: sitemap.xml (index), products, categories, posts, pages
- GTM + Facebook Pixel tracking
- Google verification code placeholder (NEEDS REAL CODE)
- Canonical tags (locale-aware)
- Multilingual metadata via next-intl translations
- Product schema on product pages
- BreadcrumbList schema
- Article schema on blog posts

### Known Gaps / Issues to Investigate
- Google Search Console verification not done (placeholder code in layout.tsx)
- No llms.txt file
- No IndexNow implementation
- Product schema may be missing `aggregateRating` (no reviews shown)
- No `/wholesale` dedicated landing page with SEO content
- Blog content may be thin / infrequent
- Cookie consent / GDPR banner status unknown

## Commerce Rules (SEO-relevant)

- **Global MOQ**: 6 units (minimum order per product)
- **MOQ-exempt products**: 238, 234, 232, 230, 228, 224, 222, 220, 185, 184, 270 (AC/DC Fan), 266 (Food Container)
- **Max quantity products**: India Gate Sona Masoori (ID 215, max 3), ID 193 (max 2), ID 4943 (max 3)
- **Quantity discount**: Anmol Mini Electric Tandoor (ID 161) — tiered pricing

## Competitors to Watch

- matdistribution.se
- storkok.se
- menigo.se (large, Sysco-owned)
- dagab.se
- Swedish ethnic/Asian grocery wholesalers

## Key Swedish SEO Keywords

| Keyword | Intent |
|---------|--------|
| restaurang grossist stockholm | Commercial, local |
| storköksvaror grossist | Commercial |
| indiska kryddor grossist | Commercial |
| basmati ris storpack | Commercial |
| elektrisk tandoor | Commercial + info |
| halal kött stockholm | Commercial |
| restaurang leverantör sverige | Commercial |
| engångsbehållare restaurang | Commercial |
| restaurant supply sweden | Commercial (EN) |
| wholesale food sweden | Commercial (EN) |

## Schema Types in Use

- `Wholesaler` + `LocalBusiness` + `Organization` (homepage)
- `Product` + `Offer` (product pages)
- `BreadcrumbList` (all pages)
- `Article` / `BlogPosting` (blog)
- `WebSite` + `SearchAction` (homepage)
- `ItemList` (category pages)

## Industry-Specific SEO Notes

1. **B2B buyer journey is longer** — content should address wholesale pricing, MOQ, delivery terms, business account registration
2. **Trust signals matter more** — B2B buyers check company credibility before ordering. VAT number, org number, physical address are critical.
3. **Swedish org number** should be visible (Anmol AB) — helps Google verify legitimacy
4. **Eniro.se / Hitta.se** are Sweden's primary business directories (equivalent to Yelp/BBB in US)
5. **ratsit.se / allabolag.se** — Swedish business rating/info sites, citation opportunities
6. **REKO / food safety certificates** — if held, display prominently (E-E-A-T for food wholesale)
7. **Price transparency** — "15% lägre priser" claim needs substantiation on product/landing pages
