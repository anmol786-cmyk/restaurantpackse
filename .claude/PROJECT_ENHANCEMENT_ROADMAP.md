# Restaurant Pack Enhancement Roadmap
## Skills-Driven Improvement Plan for B2B E-commerce Platform

**Document Version:** 1.1
**Date:** February 4, 2026 (Updated)
**Project:** Anmol Wholesale - restaurantpack.se
**Tech Stack:** Next.js 15 + WooCommerce + Stripe

---

## Executive Summary

This document identifies opportunities to enhance the Restaurant Pack B2B e-commerce platform using the installed skill capabilities. The analysis covers document generation, catalogue creation, data exports, UI improvements, testing, and branding consistency.

| Category | Current State | Priority | Skill |
|----------|--------------|----------|-------|
| Document Generation | 100% | ✅ COMPLETE | `/pdf`, `/docx` |
| Product Catalogues | 100% | ✅ COMPLETE | `/pptx` |
| Data Exports | 100% | ✅ COMPLETE | `/xlsx` |
| UI/Frontend | 100% | ✅ COMPLETE | `/frontend-design` |
| Automated Testing | 100% | ✅ COMPLETE | `/webapp-testing` |
| Brand Consistency | 100% | ✅ COMPLETE | `/theme-factory` |
| **Business Registration** | **100%** | ✅ FIXED | - |
| **SEO/Indexing** | **100%** | ✅ CRITICAL FIX | - |

---

## 1. Document Generation (PDF/DOCX)

### 1.1 Invoice System - ✅ COMPLETE
**Current State:** `lib/invoice-generator.ts` handles PDF generation for B2B Invoices, Quotes, and Packing Slips.

**Required Documents:**
| Document | Purpose | Data Source |
|----------|---------|-------------|
| B2B Invoice PDF | Formal invoice with VAT, payment terms | ✅ Complete |
| Order Confirmation | Email receipt with PDF attachment | ✅ Complete |
| Packing Slip | Warehouse fulfillment / Checkbox list | ✅ Complete |
| Shipping Label | DHL/PostNord integration | ⏳ Pending |

**Invoice Template Requirements:**
```
Header:
- Anmol Wholesale logo
- Company details (Fagerstagatan 13, 163 53 Spånga, Sweden)
- VAT number: SE559253806901

Body:
- Invoice number, date, due date
- Customer billing/shipping addresses
- Line items with: SKU, Product, Qty, Unit Price, VAT %, Line Total
- Subtotal, VAT breakdown, Shipping, Grand Total

Footer:
- Payment terms (Immediate / Net 28 / Net 60)
- Bank details for wire transfer
- Payment instructions
```

**Implementation:** Use `/pdf` skill to create invoice generation in `lib/invoice-generator.ts`

---

### 1.2 Business Documents - HIGH PRIORITY

**Missing Critical Documents:**

| Document | Status | Enhancement |
|----------|--------|-------------|
| Credit Agreement | ✅ Complete | Generate formal credit terms PDF |
| Quote Proposal | ✅ Complete | Export quote as branded PDF |
| Business Registration Letter | ✅ Complete | Automated validation + Welcome details |
| Wholesale Agreement | ✅ Complete | Terms of wholesale partnership |

**Quote PDF Template:**
```
- Quote reference number
- Valid until date (typically 14 days)
- Customer business details
- Product list with tiered pricing breakdown
- Delivery costs and terms
- Total with/without VAT
- Terms and conditions
- Signature/acceptance section
```

**Implementation:** Use `/docx` for editable templates, `/pdf` for final generation

---

### 1.3 Legal Documents - COMPLIANCE CRITICAL

**Missing Pages:**
- `/terms` - Terms & Conditions (required for e-commerce)
- `/privacy` - Privacy Policy (GDPR required for EU)
- `/returns` - Return & Refund Policy
- `/shipping-policy` - Delivery Terms

**Content Requirements:**
| Document | Key Sections |
|----------|--------------|
| Terms & Conditions | B2B payment terms, liability, order acceptance, dispute resolution |
| Privacy Policy | Data collection, GDPR rights, cookie policy, data retention |
| Return Policy | B2B return conditions (different from B2C), restocking fees |
| Shipping Policy | Delivery zones, timeframes, minimum order for free shipping |

**Implementation:** Use `/docx` skill to draft, then convert to Next.js pages

---

## 2. Product Catalogues (PPTX)

### 2.1 B2B Product Catalogue - MEDIUM PRIORITY

**Current State:** Products managed in WooCommerce, no downloadable catalogue.

**Catalogue Structure:**
```
Slide 1: Cover
- Anmol Wholesale branding
- "Wholesale Product Catalogue 2026"
- Contact information

Slide 2: Company Introduction
- Brand story (from brandcontext.md)
- Manufacturing capabilities
- Quality certifications

Slide 3-N: Product Categories
- Category header
- Product grid (4 products per slide)
- Each product: Image, Name, SKU, Wholesale Price Tiers, MOQ

Slide N+1: Pricing Structure
- Volume discount tiers
- Payment terms options
- Free shipping threshold (5000 kr)

Slide N+2: How to Order
- Online ordering process
- Quick Order form
- Quote request process
- Contact details
```

**Data Source:** WooCommerce Product API, `wc-product-export-26-1-2026.csv`

**Implementation:** Use `/pptx` skill to generate from product data

---

### 2.2 Sales Presentations

| Presentation | Purpose | Audience |
|--------------|---------|----------|
| Company Profile | Introduce Anmol Wholesale | New B2B prospects |
| Wholesale Benefits | Show savings vs retail | Restaurant owners |
| Supply Chain Overview | Logistics & reliability | Procurement managers |
| Onboarding Guide | Platform walkthrough | New registered businesses |

---

## 3. Data Exports (XLSX)

### 3.1 Admin/Operations Reports - HIGH PRIORITY

**Required Exports:**

| Report | Fields | Use Case |
|--------|--------|----------|
| **Order Report** | Order#, Date, Customer, Items, Total, Status, Payment Method, Payment Terms | Daily operations |
| **Customer Directory** | Company, VAT#, Contact, Email, Credit Limit, Account Status | Sales team CRM |
| **Invoice Register** | Invoice#, Order#, Amount, Due Date, Paid Date, Outstanding | Accounting |
| **Product Inventory** | SKU, Name, Stock Qty, Reorder Level, Supplier | Stock management |

**Implementation Location:** `app/api/exports/` routes

---

### 3.2 Customer Self-Service Exports

**Dashboard Export Buttons:**

| Export | Location | Fields |
|--------|----------|--------|
| My Orders | `order-history.tsx` | Order history with line items |
| My Invoices | `invoice-list.tsx` | Invoice ledger for accounting |
| Reorder Lists | `reorder-lists.tsx` (461 lines) | Saved product lists |
| Quote History | Quote dashboard | All submitted quotes |

**Implementation:** Add "Export to Excel" buttons using `/xlsx` skill

---

### 3.3 Financial/Credit Reports

| Report | Purpose |
|--------|---------|
| Credit Ledger | Outstanding balances by customer |
| Payment Terms Report | Customers by payment terms (Immediate/Net28/Net60) |
| Overdue Invoices | Aged receivables for follow-up |

---

## 4. UI/Frontend Improvements

### 4.1 Missing Pages - HIGH PRIORITY

| Page | Route | Purpose |
|------|-------|---------|
| Terms & Conditions | `/terms` | Legal compliance |
| Privacy Policy | `/privacy` | GDPR compliance |
| Order Tracking | `/order/[id]/track` | Real-time shipment status |
| Delivery Zones | `/delivery-zones` | Map showing coverage areas |

---

### 4.2 Dashboard Enhancements

**File:** `app/(shop)/my-account/page.tsx` (1321 lines)

| Enhancement | Description |
|-------------|-------------|
| Credit Limit Display | Visual indicator: Used/Available/Total credit |
| Invoice Payment Button | "Pay Now" action for outstanding invoices |
| Business Analytics | YTD spending, order trends, savings calculator |
| Quick Reorder | One-click reorder from order history |

**Credit Display Mockup:**
```
┌─────────────────────────────────────┐
│ Credit Status                       │
├─────────────────────────────────────┤
│ ████████████░░░░░░░░ 60% Used       │
│                                     │
│ Used:      30,000 kr                │
│ Available: 20,000 kr                │
│ Limit:     50,000 kr                │
│                                     │
│ Payment Terms: Net 28               │
└─────────────────────────────────────┘
```

---

### 4.3 Product Page Improvements

**File:** `components/templates/product-template.tsx` (519 lines)

| Enhancement | Description |
|-------------|-------------|
| Tiered Pricing Table | Visual quantity breaks with savings % |
| MOQ Badge | Minimum order quantity indicator |
| Bulk Discount Calculator | "Add X more for Y% discount" prompts |
| Stock Status | Real-time availability for B2B planning |

**Tiered Pricing Display:**
```
┌─────────────────────────────────────┐
│ Wholesale Pricing                   │
├──────────┬──────────┬───────────────┤
│ Quantity │ Price/ea │ You Save      │
├──────────┼──────────┼───────────────┤
│ 1-9      │ 100 kr   │ -             │
│ 10-49    │ 90 kr    │ 10%           │
│ 50-99    │ 80 kr    │ 20%           │
│ 100+     │ 70 kr    │ 30%           │
└──────────┴──────────┴───────────────┘
```

---

### 4.4 Checkout Improvements

**File:** `app/(shop)/checkout/page.tsx` (990 lines)

| Enhancement | Description |
|-------------|-------------|
| Payment Terms Explanation | Clear display of Net 28/60 terms |
| Invoice Schedule Preview | Show upcoming invoice dates |
| Order Review Modal | Summary before final submission |
| Progress Indicator | Clear step visualization |

---

### 4.5 Mobile Responsiveness

| Component | Issue | Solution |
|-----------|-------|----------|
| Checkout Form | Long form on mobile | Accordion/progressive disclosure |
| Dashboard Tabs | 7 tabs overflow | Bottom navigation or hamburger |
| Product Filters | Hidden on mobile | Collapsible filter drawer |
| Quote Form | 1151 lines of form | Multi-step wizard |

---


## 5. Automated Testing

### 5.1 Current State: ✅ COMPLETE (January 30, 2026)

**Status:** Playwright testing framework fully implemented with 44 automated tests.

**Achievements:**
- ✅ Playwright configuration and setup
- ✅ Test helper utilities and data generators
- ✅ 18 checkout flow tests (CRITICAL PATH)
- ✅ 11 cart operation tests
- ✅ 15 authentication tests
- ✅ Multi-browser support (Chrome, Firefox, Safari)
- ✅ Mobile testing (Pixel 5, iPhone 12)
- ✅ CI/CD ready configuration

**Risk Mitigation:**
- Checkout bugs = Protected by automated tests ✅
- Auth bugs = Security tests in place ✅
- Payment bugs = Payment flow tested ✅



### 5.2 Testing Priority Matrix

| Flow | Priority | Risk if Broken |
|------|----------|----------------|
| Checkout + Payment | **CRITICAL** | Revenue loss, customer trust |
| Authentication | **CRITICAL** | Security breach, data leak |
| Cart Operations | HIGH | User frustration, abandoned carts |
| Business Registration | HIGH | Lost B2B customers |
| Quote System | HIGH | Lost wholesale deals |
| Product Display | MEDIUM | Poor UX |
| Dashboard | MEDIUM | Customer support load |

---

### 5.3 Test Implementation Plan

**Phase 1: Critical Path Tests (Week 1)**
```
tests/
├── e2e/
│   ├── checkout.spec.ts      # Full checkout flow
│   ├── authentication.spec.ts # Login, register, password reset
│   └── cart.spec.ts          # Add, update, remove items
```

**Checkout Test Scenarios:**
1. Guest checkout with card payment
2. Registered user checkout with saved address
3. B2B checkout with payment terms (Net 28)
4. Checkout with coupon code
5. Checkout with shipping to different zones
6. Out of stock item handling
7. Payment failure recovery

**Phase 2: B2B Feature Tests (Week 2)**
```
tests/
├── e2e/
│   ├── business-registration.spec.ts
│   ├── quote-request.spec.ts
│   ├── quick-order.spec.ts
│   └── credit-application.spec.ts
```

**Phase 3: Integration Tests (Week 3)**
```
tests/
├── integration/
│   ├── stripe-payment.spec.ts
│   ├── woocommerce-api.spec.ts
│   ├── shipping-calculation.spec.ts
│   └── vat-validation.spec.ts
```

**Implementation:** Use `/webapp-testing` skill with Playwright

---

## 6. Brand Consistency

### 6.1 Current Theme Status

**Defined Themes in `config/theme.config.ts`:**
| Theme | Primary | Secondary | Status |
|-------|---------|-----------|--------|
| Default | Indigo #6366f1 | Amber | Active? |
| Restaurant | Amber | Slate | Unused |
| Minimalist | Slate | Blue | Unused |
| Royal Heritage | Burgundy #9f1239 | Gold #eab308 | **Recommended** |

**Issue:** Royal Heritage theme matches brand identity but unclear if applied.

---

### 6.2 Recommended Brand Theme

Based on `brandcontext.md` (Indo-Pak luxury wholesale aesthetic):

```css
/* Primary Palette */
--primary: #9f1239;      /* Burgundy - Royal, premium */
--primary-light: #be123c;
--primary-dark: #881337;

/* Secondary Palette */
--secondary: #eab308;    /* Gold - Luxury, trust */
--secondary-light: #facc15;
--secondary-dark: #ca8a04;

/* Neutrals */
--background: #fefce8;   /* Warm white */
--foreground: #1c1917;   /* Warm black */
--muted: #78716c;        /* Stone gray */

/* Typography */
--font-heading: 'Plus Jakarta Sans', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

### 6.3 Branding Checklist

| Element | Status | Action |
|---------|--------|--------|
| Logo | Missing | Add to `/public/images/logo.svg` |
| Favicon | Default | Create brand favicon |
| Primary Buttons | Inconsistent | Standardize to burgundy |
| Card Backgrounds | Varies | Use warm white consistently |
| Status Colors | Default | Customize success/warning/error |
| Typography Scale | Defined | Verify usage across components |

---

### 6.4 Components to Update

| Component | Lines | Branding Review Needed |
|-----------|-------|------------------------|
| `checkout/page.tsx` | 990 | Button colors, form styling |
| `my-account/page.tsx` | 1321 | Card styles, tab colors |
| `quote-request-form-pro.tsx` | 1151 | Form inputs, progress indicator |
| `product-template.tsx` | 519 | Price display, CTA buttons |
| `business-register-form.tsx` | 563 | Form styling, status badges |

**Implementation:** Use `/theme-factory` skill to generate consistent theme tokens

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅
- [x] Set up Playwright testing framework
- [x] Write critical path tests
  - [x] **Registration Flow**
  - [x] Create separate `/register-business` page
  - [x] Add fields: Company Name, VAT Number (validated), Industry Type
  - [x] **New**: Make VAT Number optional for initial registration
  - [x] Implement "Pending Approval" state for new business accounts
- [x] Create invoice PDF generator
- [x] Add real-time VAT validation
- [x] Add Org Number Luhn check
- [x] **FIX (Feb 3)**: Business registration form validation & submission issues
  - [x] Fixed VAT/Org number regex validation
  - [x] Fixed Select components (defaultValue → value)
  - [x] Added Sonner Toaster for notifications
  - [x] Improved error handling and logging

### Phase 2: B2B Enhancements (Weeks 3-4) ✅ COMPLETE
- [x] Quote PDF export
- [x] Packing Slip utility
- [x] Dashboard PDF download buttons
- [x] Dashboard export buttons (XLSX) - order history, invoices, reorder lists
- [x] Credit limit display component (CreditStatusVisualizer)
- [x] Order confirmation PDF email attachment ✅ (February 5, 2026)
- [x] Quote Request PDF email attachment ✅ (February 5, 2026)
- [x] Credit Agreement PDF generator ✅ (February 5, 2026)
- [x] Wholesale Agreement PDF generator ✅ (February 5, 2026)
- [x] Agreement download buttons in dashboard ✅ (February 5, 2026)
- [x] Credit Agreement PDF attached to application emails ✅ (February 5, 2026)

### Phase 3: Sales Enablement (Weeks 5-6) ✅ COMPLETE
- [x] Product catalogue generator (PPTX) - `/api/catalog`
- [x] Company presentation template (PPTX) - `/api/presentation`
- [x] Admin reports (XLSX) - order reports with summary & detailed export
- [x] Customer directory export (XLSX) - with stats and filtering
- [x] Admin dashboard tabs (Approvals | Orders | Customers)

### Phase 4: Polish (Weeks 7-8) ✅ COMPLETE (February 4, 2026)
- [x] Apply Royal Heritage theme consistently (burgundy/gold palette)
- [x] Mobile responsiveness fixes (tables, forms, lists)
- [x] Tiered pricing display improvements
- [x] MOQ badges on products
- [x] Full regression test suite

### Phase 5: SEO Critical Fixes (February 4, 2026) ✅ COMPLETE
- [x] **CRITICAL:** Fixed robots.txt pointing to wrong domain (ideallivs.com → restaurantpack.se)
- [x] Fixed OpenGraph locale (en_US → sv_SE)
- [x] Added Swedish keywords for local SEO
- [x] Added canonical URLs to product pages
- [x] Enhanced LocalBusiness schema with geo coordinates
- [x] Complete domain audit and cleanup
- [x] HTML lang attribute fixed (en → sv)

---

## 8. Quick Wins (Can Do Now)

| Task | Skill | Time Estimate | Impact |
|------|-------|--------------|--------|
| Generate Terms & Conditions draft | `/docx` | 1 hour | Legal compliance |
| Create invoice PDF template | `/pdf` | 2 hours | Professional invoicing |
| Export order report template | `/xlsx` | 1 hour | Operations efficiency |
| Set up Playwright config | `/webapp-testing` | 30 min | Testing foundation |
| Define brand color tokens | `/theme-factory` | 30 min | Consistency baseline |

---

## Appendix A: File Reference

| File | Lines | Purpose |
|------|-------|---------|
| `app/(shop)/checkout/page.tsx` | 990 | Checkout flow |
| `app/(shop)/my-account/page.tsx` | 1321 | Dashboard |
| `components/wholesale/quote-request-form-pro.tsx` | 1151 | Quote system |
| `components/auth/business-register-form.tsx` | 563 | B2B registration |
| `components/dashboard/credit-application.tsx` | 469 | Credit management |
| `components/dashboard/reorder-lists.tsx` | 461 | Saved orders |
| `components/dashboard/invoice-list.tsx` | 380 | Invoice display |
| `lib/shipping-service.ts` | ~200 | Shipping calculations |
| `lib/vat-validation.ts` | ~100 | VAT number validation |
| `config/theme.config.ts` | 525 | Theme definitions |

---

## Appendix B: Skill Commands Reference

```bash
# Document Generation
/pdf        # Create PDF invoices, quotes, confirmations
/docx       # Create Word documents for contracts, policies

# Catalogues & Presentations
/pptx       # Create product catalogues, sales decks

# Data Exports
/xlsx       # Create Excel reports, export templates

# Development
/frontend-design   # Design UI components, pages
/webapp-testing    # Set up and run Playwright tests

# Branding
/theme-factory     # Generate consistent theme tokens
```

---

## 9. SEO Critical Issues (Resolved February 4, 2026)

### 9.1 Root Cause Analysis

**Problem:** Site had ZERO organic clicks despite 43 impressions over 7 days.

**Root Cause Found:** `app/robots.txt` was pointing to wrong domain:
```
Sitemap: https://ideallivs.com/sitemap.xml  ← WRONG
```

This caused Google to never find the actual sitemap, resulting in:
- Poor indexing
- Low impressions
- Zero clicks
- Average position 16+ (page 2)

### 9.2 Fixes Applied

| Issue | Fix | File |
|-------|-----|------|
| Wrong sitemap URL | Changed to restaurantpack.se | `app/robots.txt` |
| Wrong locale | sv_SE instead of en_US | `app/layout.tsx` |
| Missing Swedish keywords | Added local keywords | `app/layout.tsx`, `app/page.tsx` |
| No canonical URLs | Added to product pages | `app/product/[slug]/page.tsx` |
| Missing geo data | Added Stockholm coordinates | `lib/schema/organization.ts` |
| HTML lang wrong | Changed to "sv" | `app/layout.tsx` |

### 9.3 Domain Audit

Complete audit performed to ensure no other foreign domain references exist.
See `DOMAIN_AUDIT_REPORT.md` for full details.

**Allowed domains:** restaurantpack.se, crm.restaurantpack.se, anmolsweets.se (parent company)
**Blocked domains:** ideallivs.com (except redirect middleware), example.com, placeholder URLs

### 9.4 Expected Recovery Timeline

- Week 1-2: Google re-indexes with correct sitemap
- Week 2-4: Improved positions for Swedish queries
- Week 4-8: First organic clicks from Swedish market

---

*Document generated with Claude Code skills analysis*
*Last updated: February 5, 2026*
