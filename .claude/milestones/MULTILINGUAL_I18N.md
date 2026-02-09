# Multilingual (i18n) Feature - Progress & Architecture

## Status: PHASE 2 & 3 COMPLETE - Phase 4 next morning
**Started:** February 2026
**Last Updated:** February 9, 2026 (evening)
**Next Session:** February 10, 2026 (morning) - Phase 4: Remaining pages

---

## Architecture Overview

### Technology Stack
- **Library:** `next-intl` (App Router integration)
- **Locales:** `en` (English), `sv` (Swedish), `no` (Norwegian), `da` (Danish)
- **Default Locale:** `en` (no URL prefix)
- **URL Strategy:** `localePrefix: 'as-needed'`
  - English: `/shop`, `/wholesale`, `/about`
  - Swedish: `/sv/shop`, `/sv/wholesale`, `/sv/about`
  - Norwegian: `/no/shop`, `/no/wholesale`, `/no/about`
  - Danish: `/da/shop`, `/da/wholesale`, `/da/about`

### File Structure
```
i18n/
  routing.ts          # Locale config, names, flags
  navigation.ts       # next-intl Link, redirect, usePathname, useRouter
  request.ts          # Server-side getRequestConfig
messages/
  en.json             # English translations (source)
  sv.json             # Swedish translations
  no.json             # Norwegian translations
  da.json             # Danish translations
app/
  [locale]/           # All pages under locale dynamic segment
    layout.tsx         # NextIntlClientProvider wrapper
    page.tsx           # Home page
    (shop)/            # E-commerce routes
    about/             # Static pages
    contact/
    ...
```

### Key Components
- **LanguageSelector** (`components/ui/language-selector.tsx`): Dropdown with flags, 3 variants (default, compact, icon-only)
- **HreflangTags** (`components/seo/hreflang-tags.tsx`): SEO hreflang for all 4 locales
- **Middleware** (`middleware.ts`): Locale detection, domain redirects, locale routing

---

## Completion Tracker

### Phase 1: Infrastructure (COMPLETE)
- [x] Install and configure `next-intl`
- [x] Create `i18n/routing.ts` with 4 locales
- [x] Create `i18n/navigation.ts` with navigation utilities
- [x] Create `i18n/request.ts` for server-side config
- [x] Update `next.config.js` with `createNextIntlPlugin`
- [x] Set up `middleware.ts` for locale routing
- [x] Create `app/[locale]/layout.tsx` with `NextIntlClientProvider`
- [x] Migrate all pages from `app/` to `app/[locale]/`
- [x] Create translation files for all 4 languages

### Phase 2: Component Integration (COMPLETE - Feb 9, 2026)
- [x] Add `LanguageSelector` component to header (desktop + mobile)
- [x] Add `HreflangTags` to root layout for SEO
- [x] Integrate `useTranslations('nav')` into Header navigation
- [x] Integrate `getTranslations('footer')` into Footer component (server component)
- [x] Integrate `useTranslations('nav')` into Mobile Menu
- [x] Integrate `useTranslations('topBar')` into Top Info Bar
- [x] Integrate `useTranslations('hero')` into Hero component
- [x] Integrate `useTranslations('features')` into Features component
- [x] Integrate `useTranslations('quickOrder')` into Quick Order section
- [x] Integrate `useTranslations('cta')` into CTA Banner
- [x] Integrate `getTranslations()` into Home page (locale-aware metadata + translated props)
- [x] Build passes with no errors

### Phase 3: Translation Keys (COMPLETE - Feb 9, 2026)
- [x] Add homepage-specific keys (hero, features, quickOrder, cta, productShowcase)
- [x] Add navigation keys (nav namespace - including blog, myAccount, bulkQuote)
- [x] Add footer keys (footer namespace - catalog, logistics, partnership, all links)
- [x] Add topBar keys (anmolAdvantage, chatB2B, exWarehouse)
- [x] Add wholesale/B2B keys
- [x] Add checkout/cart keys
- [x] Add common UI keys (startShopping, viewNewArrivals, allProducts)
- [x] Translate all new keys to Swedish (sv.json)
- [x] Translate all new keys to Norwegian (no.json)
- [x] Translate all new keys to Danish (da.json)

### Phase 4: Remaining Pages (PENDING - Feb 10 morning)
- [ ] Wholesale landing page - heavy content, many hardcoded strings
- [ ] About page
- [ ] Contact page
- [ ] FAQ page
- [ ] Delivery information pages
- [ ] Privacy policy, terms, refund pages
- [ ] Blog/posts pages
- [ ] Product detail pages (UI chrome only - product data stays from WooCommerce)
- [ ] Category pages (UI chrome only - category data stays from WooCommerce)

---

## Translation Namespaces

| Namespace | Keys | Purpose |
|-----------|------|---------|
| `common` | 21 | Generic UI actions and labels |
| `nav` | 16 | Navigation links |
| `hero` | 9 | Home page hero section |
| `features` | 8 | Features banner |
| `wholesale` | 10 | B2B wholesale content |
| `quickOrder` | 25 | Quick order form + SKU section |
| `shipping` | 16 | Shipping zones and info |
| `vat` | 10 | VAT-related terms |
| `contact` | 5 | Contact information |
| `footer` | 18 | Footer content and links |
| `business` | 12 | Business registration |
| `credit` | 12 | Credit terms |
| `dashboard` | 16 | Account dashboard |
| `freeShipping` | 4 | Free shipping messaging |
| `checkout` | 7 | Checkout flow |
| `cta` | 6 | CTA banner section |
| `topBar` | 3 | Top info bar |
| `productShowcase` | 2 | Product showcase titles |

---

## WooCommerce Data - Translation Strategy

### The Problem
Product names, descriptions, categories, and attributes come from the WooCommerce REST API.
These are NOT stored in our Next.js translation files - they live in the WordPress/WooCommerce database.

### Options for Translating WooCommerce Data

#### Option A: WPML / WooCommerce Multilingual Plugin (Recommended)
- Install **WPML + WooCommerce Multilingual** on the WordPress backend
- Translate products, categories, attributes directly in WooCommerce admin
- WooCommerce API supports `?lang=sv` parameter to fetch translated content
- Our Next.js app passes the current locale to API calls: `getProducts({ lang: locale })`
- **Pros:** Native WooCommerce solution, SEO-friendly, full product translation
- **Cons:** Requires WPML license (~$99/year), manual translation effort per product
- **Best for:** Full professional multilingual e-commerce

#### Option B: TranslatePress / Weglot (Auto-translate)
- Plugins that auto-translate content using Google/DeepL APIs
- Can be configured to serve translated WooCommerce API responses
- **Pros:** Fast setup, automatic translation, lower effort
- **Cons:** Machine translation quality varies, ongoing API costs, less control
- **Best for:** Quick launch with acceptable translation quality

#### Option C: Client-side Translation Layer (Custom)
- Keep WooCommerce data in original language (English/Swedish)
- Add a translation layer in Next.js that uses a translation API (DeepL/Google)
- Cache translations in a local JSON file or database
- **Pros:** No WordPress plugin needed, full control
- **Cons:** Added complexity, API costs, latency for first translation
- **Best for:** When you can't modify the WordPress setup

#### Option D: Keep Product Data in Original Language (Current)
- Products stay in Swedish/English as entered in WooCommerce
- Only UI chrome (buttons, labels, navigation, headings) is translated
- Product names/descriptions are understood by Nordic audience anyway
- **Pros:** Zero effort, no extra costs, no translation drift
- **Cons:** Not fully localized, product content stays single-language
- **Best for:** MVP / initial launch where Nordic languages are similar enough

### Current Approach: Option D
Product data stays in its original WooCommerce language. All UI elements around it
(header, footer, nav, buttons, labels, section titles) are translated via next-intl.

### Recommended Next Step
If full product translation is needed, go with **Option A (WPML)** - it's the
industry standard for WooCommerce multilingual and works with the REST API out of
the box. Just add `lang` parameter to API calls.

---

## What's Already Translated (Components)

| Component | File | Hook Used |
|-----------|------|-----------|
| Hero | `components/home/hero.tsx` | `useTranslations('hero')` + `common` |
| Features | `components/home/features.tsx` | `useTranslations('features')` |
| QuickOrder | `components/home/quick-order.tsx` | `useTranslations('quickOrder')` |
| CTASection | `components/home/cta-banner.tsx` | `useTranslations('cta')` |
| Header | `components/layout/header.tsx` | `useTranslations('nav')` |
| MobileMenu | `components/layout/mobile-menu.tsx` | `useTranslations('nav')` |
| TopInfoBar | `components/layout/top-info-bar.tsx` | `useTranslations('topBar')` + `common` |
| Footer | `components/layout/footer.tsx` | `getTranslations('footer')` + `common` + `nav` |
| HomePage | `app/[locale]/page.tsx` | `getTranslations()` for metadata + showcase |

---

## Notes
- Build verified: `next build` passes with zero errors (Feb 9, 2026)
- Product names/descriptions come from WooCommerce API - see WooCommerce strategy above
- Category names come from WooCommerce and are also CMS-managed
- SEO metadata is locale-aware on the homepage (4-language titles + descriptions)
- The wholesale landing page has the most hardcoded content remaining (~400 lines)
