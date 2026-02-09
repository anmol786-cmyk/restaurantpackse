# Complete Multilingual (i18n) Feature

## Context
The project uses next-intl v4.7 with 4 locales (en, sv, no, da). The infrastructure is complete (routing, middleware, layouts, language selector, hreflang tags) and the home page components + header/footer are translated (143 keys, 18 namespaces). However, **22 inner pages have 100% hardcoded English text** (~690 strings total). The goal is to add translation keys and update every page to use next-intl.

## Approach
Work in 9 batches from simplest to most complex. Each batch:
1. Add English keys to `messages/en.json`
2. Add translated keys to `messages/sv.json`, `messages/no.json`, `messages/da.json`
3. Update page components to use `useTranslations` (client) or `getTranslations` (server)
4. Replace `import Link from 'next/link'` with `import { Link } from '@/i18n/navigation'`
5. Convert `export const metadata` to `export async function generateMetadata()` for locale-aware metadata

## Batches

### Batch 0: Fix existing components (~12 keys)
- `components/home/quick-order.tsx` — 3 hardcoded toast messages → `t('toastAdded')`, `t('toastNotFound')`, `t('toastError')`
- `components/home/cta-banner.tsx` — `'15 Years'` → `t('yearsValue')`
- `components/home/hero.tsx` — image alt text → `t('imageAlt')`
- `app/[locale]/page.tsx` — replace hardcoded metadata locale maps with `t()` calls, add `metadata` namespace

### Batch 1: Small pages (~16 keys, namespaces: `notFound`, `auth`)
- `app/[locale]/not-found.tsx` — 3 strings
- `app/not-found.tsx` — keep as English fallback (no locale context at root)
- `app/[locale]/(shop)/login/page.tsx` — 6 strings
- `app/[locale]/(shop)/register/page.tsx` — 4 strings

### Batch 2: Shop & product pages (~26 keys, namespaces: `shop`, `product`, `productCategory`, `blogCategory`)
- `app/[locale]/(shop)/shop/page.tsx` — title, description, breadcrumb
- `app/[locale]/product/[slug]/page.tsx` — metadata (currently has hardcoded Swedish), "Product Not Found"
- `app/[locale]/product-category/[[...slug]]/page.tsx` — "Category Not Found", metadata
- `app/[locale]/category/[slug]/page.tsx` — blog category strings

### Batch 3: Dashboard & contact (~34 keys, namespaces: `dashboardPage`, `contactPage`)
- `app/[locale]/(shop)/dashboard/page.tsx` — tab labels, descriptions
- `app/[locale]/contact/page.tsx` — contact methods, hours, form labels

### Batch 4: Cart & checkout success (~38 keys, namespaces: `cart`, `checkoutSuccess`)
- `app/[locale]/(shop)/cart/page.tsx` — client component, ~18 strings (empty cart, order summary, free shipping)
- `app/[locale]/(shop)/checkout/success/page.tsx` — ~20 strings

### Batch 5: About & wholesale sub-pages (~92 keys, namespaces: `aboutPage`, `quickOrderPage`, `quotePage`, `wholesaleRegister`)
- `app/[locale]/about/page.tsx` — ~35 strings, arrays of content objects → indexed keys
- `app/[locale]/(shop)/wholesale/quick-order/page.tsx` — ~20 strings
- `app/[locale]/(shop)/wholesale/quote/page.tsx` — ~28 strings
- `app/[locale]/(shop)/wholesale/register/page.tsx` — ~22 strings

### Batch 6: Content-heavy pages (~139 keys, namespaces: `deliveryPage`, `faqPage`, `europePage`)
- `app/[locale]/delivery-information/page.tsx` — ~38 strings
- `app/[locale]/faq/page.tsx` — ~50 strings (6 FAQ categories, 25+ Q&A pairs)
- `app/[locale]/europe-delivery/page.tsx` — ~42 strings

### Batch 7: Legal pages (~85 keys, namespaces: `privacyPolicy`, `termsConditions`, `refundReturn`)
- `app/[locale]/privacy-policy/page.tsx` — ~30 strings
- `app/[locale]/terms-conditions/page.tsx` — ~30 strings
- `app/[locale]/refund-return/page.tsx` — ~25 strings

### Batch 8: Very large pages (~240 keys, namespaces: `myAccount`, `checkoutPage`, `wholesaleLanding`)
- `app/[locale]/(shop)/checkout/page.tsx` — 993 lines, ~75 strings (validation, payment methods, steps)
- `app/[locale]/(shop)/my-account/page.tsx` — 1615 lines, ~85 strings (tabs, forms, toasts)
- `app/[locale]/(shop)/wholesale/page.tsx` — 424 lines, ~90 strings (hero, benefits, products, logistics)

### Also: Blog/posts pages
- `app/[locale]/blog/page.tsx` — "Our Blog" heading
- `app/[locale]/posts/page.tsx` — "All Posts", search UI

## Key Patterns
- **Client components**: `'use client'` + `useTranslations('namespace')` from `next-intl`
- **Server components**: `await getTranslations('namespace')` from `next-intl/server`
- **Metadata**: `await getTranslations({ locale, namespace })` inside `generateMetadata()`
- **Navigation**: `import { Link } from '@/i18n/navigation'` (not `next/link`)
- **Arrays of content**: Use indexed keys (`offers.item1.title`, `offers.item2.title`)
- **FAQ structure**: Nested by category (`faqPage.ordering.items.0.q`)

## Files Modified
- `messages/en.json`, `messages/sv.json`, `messages/no.json`, `messages/da.json` — ~690 new keys
- ~25 page files under `app/[locale]/`
- 3 component files (hero, cta-banner, quick-order)
- Total: ~30 files

## Verification
- Run `next build` after each batch to catch missing keys
- Visually check pages at `/sv/`, `/no/`, `/da/` prefixes
- Verify all 4 JSON files have identical key structures
- Check hreflang tags on sample pages
- Confirm `Link` imports use `@/i18n/navigation` throughout
