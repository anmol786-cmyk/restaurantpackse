# Anmol Wholesale Conversion Plan
## Converting Fourlines Grocery Template to Wholesale B2B Platform

---

## Executive Summary

Converting a Next.js 15 + WooCommerce headless grocery template into **Anmol Wholesale** (restaurantpack.se) - a wholesale B2B platform with innovative features.

**Current State**: Retail grocery store template (ideallivs.com traces) with solid e-commerce foundation
**Target State**: Wholesale B2B platform with bulk pricing, business accounts, and B2B-specific features

---

## Critical Findings from Exploration

### Architecture
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: WordPress + WooCommerce (headless via REST API)
- **State**: Zustand (cart, auth, wishlist)
- **Payments**: Stripe integration
- **Key Strength**: Centralized configuration system in `/config` directory

### Old Branding Traces Found
1. **Ideal Indiska LIVS** (ideallivs.com) - Previous grocery store
   - Hardcoded in homepage, footer, schema files
   - Logo URLs pointing to crm.ideallivs.com
   - Swedish market focus (Stockholm)

2. **Fourlines Agency** - Template creators
   - Attribution in package.json, README, LICENSE
   - Plugin names and function prefixes
   - Footer credit link

3. **Fourlines Grocery Store** - Generic template branding
   - Config files (brand.config.ts, brand-profile.ts)
   - Email placeholders (yourgrocerystore.com)

### Existing Wholesale Infrastructure
✅ **Already Present:**
- Bulk pricing framework in `commerce-rules.ts` (empty but structured)
- Quantity restrictions system
- WordPress plugin for product limits
- Business account support mentioned
- Bulk order/reservation page content

❌ **Missing for Wholesale:**
- B2B registration with business verification
- Tiered pricing UI display
- Minimum order quantities (MOQ) enforcement
- Quote/proposal system
- Payment terms (Net 30/60)
- Wholesale-specific dashboard

### Innovative Features to Leverage
- **AI Shopping Assistant** - Can adapt for wholesale product recommendations
- **WhatsApp Integration** - Perfect for B2B quote requests and order communication
- **Advanced Shipping** - DHL integration, zone-based rules, perishables handling
- **Prepared Meals Booking** - Pattern can be reused for custom wholesale orders

---

## User Decisions

✅ **Business Model**: Hybrid B2B/B2C - Keep retail alongside wholesale
✅ **Target Market**: Nordic/European expansion (beyond Sweden)
✅ **Product Focus**: General restaurant supplies + international/ethnic groceries
✅ **Launch Strategy**: Full-featured Phase 2 launch (8-10 weeks)

## Implementation Strategy

### Phase 1: Rebranding & Foundation (Weeks 1-2)
**Goal**: Establish Anmol Wholesale identity and international foundation

**1.1 Configuration-Based Rebranding**
- Update `config/brand.config.ts` with Anmol Wholesale identity
- Change business name, tagline, contact details
- Update from "grocery store" to "restaurant supply & foodservice"
- **International Focus**: Multi-currency support (SEK, EUR, NOK, DKK)
- Update SEO keywords for wholesale/B2B/restaurant supply

**1.2 Content Transformation**
- Update `config/content.config.ts` for wholesale messaging
- Change from consumer grocery to B2B restaurant supply
- Add wholesale benefits: bulk pricing, payment terms, reliable supply
- Update hero section: "Sweden's Leading Restaurant Wholesale Partner"

**1.3 Remove Old Branding**
- Search/replace all "Ideal Indiska LIVS" references (42 files)
- Update logo URLs from crm.ideallivs.com
- Remove "Fourlines Agency" attribution in user-facing areas
- Update `middleware.ts` domain redirects to restaurantpack.se
- Update `lib/schema/organization.ts` with new business details

**1.4 International Infrastructure**
- Add currency selector component (SEK/EUR/NOK/DKK)
- Update shipping zones for Nordic countries + EU
- Add multi-language preparation (Swedish, English, Norwegian, Danish)
- Update `public/robots.txt` with restaurantpack.se sitemap

### Phase 2: Core Wholesale Features (Weeks 3-6)
**Goal**: Essential B2B functionality for wholesale operations

**2.1 Business Registration System (Week 3)**
- Create `components/auth/business-register-form.tsx`
- Multi-step form: Contact Info → Business Details → Verification
- Collect: Company name, VAT number, business type (restaurant/cafe/catering/hotel)
- Two-tier approval: Instant "Business Basic" + Manual "Business Verified"
- Extend `types/woocommerce.d.ts` with BusinessCustomer interface
- Update `store/auth-store.ts` with business user roles

**2.2 Tiered Pricing System (Week 4)**
- Populate `config/commerce-rules.ts` with tiered pricing structure
- Create pricing tiers: 1-9 units (retail), 10-49 units (-10%), 50-99 units (-16%), 100+ units (-20%)
- Update `components/shop/product-card.tsx` to display pricing tiers
- Add role-based pricing: Retail vs Business Basic vs Business Verified
- Calculate total with tiered pricing in `store/cart-store.ts`
- Show "Open Business Account" CTA for non-logged-in users

**2.3 Minimum Order Quantities (Week 4)**
- Extend `config/commerce-rules.ts` with MOQ rules
- Update `components/shop/quantity-selector.tsx` with MOQ enforcement
- Add MOQ validation in cart store before adding items
- Display MOQ badges on product cards for business customers
- Cart validation prevents checkout if MOQ not met

**2.4 Quote Request System (Week 5)**
- Create `components/wholesale/quote-request-form.tsx`
- Create API route `app/api/quotes/request/route.ts`
- Form captures: Company details, product list, quantities, delivery date
- Email admin with quote request
- Send confirmation to customer with quote ID
- Store quotes in WooCommerce as custom order status "quote-pending"

**2.5 Payment Terms & Methods (Week 6)**
- Extend `components/checkout/payment-method-selector.tsx`
- Add invoice payment options: Net 30, Net 60 (for verified businesses)
- Keep Stripe for immediate card payments (all customers)
- Store payment terms preference in customer meta
- Display payment terms eligibility in business dashboard

### Phase 3: Business Dashboard & UX (Weeks 7-8)
**Goal**: Professional B2B customer experience

**3.1 Business Dashboard (Week 7)**
- Create `app/(shop)/dashboard/page.tsx`
- Overview cards: Monthly orders, total spent, outstanding invoices
- Quick actions: Reorder last order, view invoices, request quote
- Create `components/dashboard/order-history.tsx` with order table
- Create `components/dashboard/invoice-list.tsx` for payment tracking

**3.2 Quick Reorder & Lists (Week 7)**
- Add "Reorder" button on past orders (one-click add all items to cart)
- Create `components/dashboard/reorder-lists.tsx` for saved lists
- Allow customers to create named lists ("Weekly Stock", "Monthly Basics")
- One-click order entire list
- Store lists in customer meta_data or custom DB table

**3.3 Enhanced WhatsApp Integration (Week 8)**
- Adapt existing WhatsApp system for B2B
- WhatsApp quote requests
- Order confirmations via WhatsApp
- Bulk order notifications
- Business customer support via WhatsApp

**3.4 AI Assistant for Wholesale (Week 8)**
- Enhance existing AI chat with wholesale knowledge base
- Answer queries about bulk pricing, MOQs, payment terms
- Product recommendations based on business type
- Quick reorder suggestions based on history

### Phase 4: International Expansion Features (Weeks 9-10)
**Goal**: Support Nordic/European market expansion

**4.1 Multi-Currency & Localization (Week 9)**
- Implement currency selector component
- Update all price displays to support multiple currencies
- Currency conversion API integration (real-time rates)
- Store customer currency preference
- Update checkout to handle different currencies

**4.2 International Shipping (Week 9)**
- Extend shipping zones: Sweden, Norway, Denmark, Finland, EU countries
- Configure zone-based shipping rates
- Update `lib/shipping-service.ts` for international zones
- Add customs/VAT information for cross-border orders
- Delivery time estimates per country

**4.3 Multi-Language Foundation (Week 10)**
- Set up i18n infrastructure (next-intl or similar)
- Prepare content for translation: Swedish, English, Norwegian, Danish
- Language selector component
- Update all static content with translation keys
- Consider professional translation services

**4.4 VAT & Tax Compliance (Week 10)**
- VAT number validation for EU businesses
- Correct VAT rates per country
- Reverse charge mechanism for B2B cross-border
- Tax-exempt status for verified businesses
- Compliant invoicing with VAT breakdown

---

## Critical Files for Implementation

### Tier 1: Configuration & Branding (Week 1-2)
**Must modify first - affects entire site:**

1. **`config/brand.config.ts`** ⭐ HIGHEST PRIORITY
   - Central branding hub
   - Update: businessName, tagline, contact, features, currency, SEO
   - Add: hasWholesalePricing, hasBusinessAccounts flags

2. **`config/content.config.ts`**
   - All page copy and messaging
   - Transform from grocery to wholesale restaurant supply
   - Update hero, features, about sections

3. **`config/commerce-rules.ts`** ⭐ CORE WHOLESALE LOGIC
   - Populate TIERED_PRICING array with pricing tiers
   - Populate MOQ_RULES array with minimum order quantities
   - Add role-based pricing functions

4. **`site.config.ts`**
   - Site metadata and domain
   - Update to restaurantpack.se

5. **`app/page.tsx`**
   - Homepage with hardcoded "Ideal Indiska LIVS" content
   - Replace with Anmol Wholesale messaging

6. **`lib/schema/organization.ts`**
   - SEO structured data
   - Remove idealIndiskaOrganizationSchema function
   - Create anmolWholesaleOrganizationSchema

7. **`components/layout/footer.tsx`**
   - Logo URL, copyright, attribution
   - Update logo from crm.ideallivs.com

8. **`middleware.ts`**
   - Domain redirects
   - Update from ideallivs.com to restaurantpack.se

### Tier 2: Wholesale Features (Week 3-6)
**New components and extended functionality:**

9. **`components/auth/business-register-form.tsx`** (NEW)
   - Multi-step business registration
   - VAT/org number validation

10. **`types/woocommerce.d.ts`** (EXTEND)
    - Add BusinessCustomer interface
    - Add CustomerRole type
    - Add TieredPrice, MOQRule interfaces

11. **`store/auth-store.ts`** (EXTEND)
    - Add business user role support
    - Store business_info in user state

12. **`store/cart-store.ts`** (MODIFY)
    - Add tiered pricing calculation
    - Add MOQ validation before adding items
    - Update total calculation for wholesale prices

13. **`components/shop/product-card.tsx`** (MODIFY)
    - Display tiered pricing table for business users
    - Show "Open Business Account" CTA for retail users
    - Add MOQ badges

14. **`components/wholesale/quote-request-form.tsx`** (NEW)
    - Quote request form with validation
    - Email integration

15. **`app/api/quotes/request/route.ts`** (NEW)
    - API endpoint for quote requests
    - Email notifications

### Tier 3: Dashboard & UX (Week 7-8)
**Professional B2B experience:**

16. **`app/(shop)/dashboard/page.tsx`** (NEW)
    - Business dashboard layout
    - Overview cards and quick actions

17. **`components/dashboard/order-history.tsx`** (NEW)
    - Order table with reorder buttons

18. **`components/dashboard/reorder-lists.tsx`** (NEW)
    - Saved shopping lists
    - One-click reorder

19. **`components/checkout/payment-method-selector.tsx`** (EXTEND)
    - Add invoice payment options (Net 30/60)
    - Role-based payment method visibility

### Tier 4: International (Week 9-10)
**Multi-currency and localization:**

20. **`components/ui/currency-selector.tsx`** (NEW)
    - Currency switcher (SEK/EUR/NOK/DKK)

21. **`lib/currency-converter.ts`** (NEW)
    - Real-time currency conversion

22. **`app/i18n/` directory** (NEW)
    - i18n configuration
    - Translation files for SE/EN/NO/DK

23. **`lib/shipping-service.ts`** (EXTEND)
    - International shipping zones
    - Country-specific delivery times

---

## WooCommerce Backend Requirements

### Essential Plugins (Already Have)
✅ WooCommerce core
✅ WooCommerce REST API
✅ Simple JWT Authentication

### Required for Wholesale (New)
📦 **"WooCommerce Wholesale Prices"** or **"Dynamic Pricing and Discount Rules"**
   - Manages tiered pricing in WordPress admin
   - Cost: $49-79/year
   - Alternative: Use frontend pricing (Phase 1), migrate later

📦 **"WooCommerce PDF Invoices & Packing Slips"**
   - Generate professional invoices for B2B
   - Cost: Free (Pro $49/year)

📦 **"Advanced Custom Fields (ACF)"**
   - Store business metadata (VAT number, verification status, payment terms)
   - Cost: Free (Pro $49/year)

### Optional but Recommended
📦 **"WooCommerce Subscriptions"** - Recurring wholesale orders ($199/year)
📦 **"WooCommerce Multi-Currency"** - Better multi-currency support ($79/year)
📦 **"WPML"** or **"Polylang"** - Multi-language WordPress ($99-199/year)

### Custom WordPress Development Needed
- Business verification workflow (admin interface)
- Quote management system (custom order status)
- Multi-user account linking (customer meta)
- Payment terms enforcement

---

## Verification & Testing Strategy

### Phase 1 Verification (Week 2)
- [ ] All old branding removed (search for "Ideal", "Fourlines", "ideallivs.com")
- [ ] New branding appears in: Header, footer, homepage, SEO meta tags
- [ ] Logo URLs updated and loading
- [ ] Domain redirects working (ideallivs.com → restaurantpack.se)
- [ ] Currency displays correctly (SEK/EUR/NOK/DKK)

### Phase 2 Verification (Week 6)
- [ ] Business registration form works end-to-end
- [ ] New business customer appears in WooCommerce with metadata
- [ ] Tiered pricing displays correctly on product cards
- [ ] Cart calculates wholesale prices for business users
- [ ] MOQ validation prevents adding below minimum
- [ ] Quote request sends emails and creates record
- [ ] Payment method selector shows invoice options for verified businesses

### Phase 3 Verification (Week 8)
- [ ] Dashboard displays order history correctly
- [ ] Reorder button adds all items from past order to cart
- [ ] Saved lists can be created, edited, and reordered
- [ ] WhatsApp integration works for quote requests
- [ ] AI assistant answers wholesale-specific questions

### Phase 4 Verification (Week 10)
- [ ] Currency conversion works accurately
- [ ] Prices display in selected currency throughout site
- [ ] International shipping rates calculate correctly
- [ ] VAT handling correct for cross-border orders
- [ ] Language switcher changes all content
- [ ] Translations accurate (review with native speakers)

### End-to-End Testing Scenarios
1. **Retail Customer Journey**
   - Browse products → See retail prices → Add to cart → Checkout with card → Receive order

2. **Business Customer Journey - Basic**
   - Register business account → Instant approval → See basic wholesale pricing → Order with card

3. **Business Customer Journey - Verified**
   - Upload verification docs → Admin approves → See full wholesale pricing → Order with Net 30 terms

4. **Quote Request Flow**
   - Browse products → Request quote → Receive confirmation → Admin sends quote → Customer orders

5. **International Order**
   - Select EUR currency → Select Norway shipping → See correct VAT → Checkout → Customs info provided

---

## Success Metrics & KPIs

### Launch Criteria (Must-Have Before Going Live)
- ✅ All Phase 1-2 features complete and tested
- ✅ No old branding visible anywhere
- ✅ Business registration working
- ✅ Tiered pricing displaying and calculating correctly
- ✅ At least 50 products with wholesale pricing configured
- ✅ Payment processing working (Stripe + invoice setup)
- ✅ Mobile responsive on all pages
- ✅ Page load times < 3 seconds
- ✅ SEO meta tags updated
- ✅ Google Analytics / tracking configured

### Success Metrics (First 3 Months)
- **Registration**: 50+ business account registrations
- **Conversion**: 30%+ retail → business account conversion
- **Orders**: 100+ wholesale orders
- **AOV**: 3x higher average order value (business vs retail)
- **Retention**: 40%+ repeat orders within 30 days
- **Quote Conversion**: 60%+ quote requests → orders
- **Geography**: Orders from at least 3 Nordic countries

---

## Risk Mitigation & Contingency Plans

### Technical Risks
**Risk**: WooCommerce plugin incompatibilities
**Mitigation**: Start with frontend pricing, migrate to plugin after validation

**Risk**: International tax/VAT compliance errors
**Mitigation**: Consult with tax specialist, implement VAT validation, use established plugins

**Risk**: Currency conversion API costs/limits
**Mitigation**: Cache rates daily, use free tier initially (ECB API), upgrade if needed

### Business Risks
**Risk**: Slow business verification creates bottleneck
**Mitigation**: Two-tier system - instant basic access, verified for full benefits

**Risk**: Low business registration rates
**Mitigation**: Strong CTAs for retail users, clear wholesale benefits, referral program

**Risk**: International shipping complexity
**Mitigation**: Start with Nordic countries only, add EU gradually, partner with 3PL

---

## Next Steps & Action Items

### Immediate (This Week)
1. ✅ Review and approve this plan
2. [ ] Set up your WordPress backend with MCP Pro plugin (you mentioned this is in progress)
3. [ ] Provide business details for rebranding:
   - Company name: Anmol Wholesale
   - Contact email: info@restaurantpack.se (or preferred)
   - Phone number (Sweden): +46 XXX XXX XXX
   - Address (for invoicing/SEO)
   - VAT number (if applicable)
4. [ ] Upload Anmol Wholesale logo to WordPress media library
5. [ ] Create `.env.local` with API credentials

### Week 1-2 (Rebranding Phase)
1. [ ] Start Phase 1 implementation
2. [ ] Update all configuration files
3. [ ] Replace old branding across all files
4. [ ] Set up multi-currency infrastructure
5. [ ] Update SEO and meta tags
6. [ ] Deploy to staging environment for review

### Week 3 (Kickoff Phase 2)
1. [ ] Install WooCommerce plugins (ACF, Wholesale Prices, PDF Invoices)
2. [ ] Design business registration form UI/UX
3. [ ] Set up customer roles in WooCommerce
4. [ ] Begin implementing business registration system

### Weekly Cadence
- **Monday**: Plan week's tasks
- **Wednesday**: Mid-week progress check
- **Friday**: Deploy to staging, review progress
- **Weekend**: User testing and feedback

---

## Summary

This is an **8-10 week full-featured wholesale transformation** that will convert the Fourlines Grocery Template into a modern B2B/B2C hybrid platform for Anmol Wholesale serving the Nordic/European restaurant supply market.

**Key Differentiators**:
- Hybrid model (retail + wholesale) for maximum market reach
- Multi-currency support (SEK/EUR/NOK/DKK) from day one
- Two-tier business approval (instant basic + verified full access)
- Tiered pricing with clear volume discounts
- Professional B2B features (quote system, payment terms, dashboard)
- International expansion ready (Nordic + EU)
- Leverages existing infrastructure (WhatsApp, AI, shipping system)

**Total Effort**: ~400-500 hours over 10 weeks
**Launch Date**: Week 10-11 (full-featured release)
**Post-Launch**: Iterative improvements based on customer feedback

---

## Project Structure & Current Implementation Status

> **Last Updated**: January 2026

### Project Overview

```
restaurantpack.se/
├── app/                          # Next.js 15 App Router
│   ├── (shop)/                   # Shop grouped routes (cart, checkout, dashboard, etc.)
│   ├── api/                      # API endpoints (35+ routes)
│   ├── posts/                    # Blog functionality
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ai/                       # AI chat widget, recommendations
│   ├── auth/                     # Login, register forms
│   ├── cart/                     # Cart drawer, threshold messages
│   ├── checkout/                 # Billing, shipping, payment forms
│   ├── dashboard/                # User dashboard components
│   ├── home/                     # Homepage sections (hero, features, etc.)
│   ├── layout/                   # Header, footer, breadcrumbs
│   ├── shop/                     # Product cards, filters, quantity selector
│   ├── ui/                       # Radix UI component library
│   ├── whatsapp/                 # WhatsApp order integration
│   └── wholesale/                # Wholesale-specific components
├── config/                       # Centralized configuration
│   ├── brand.config.ts           # Business name, contact, features
│   ├── commerce-rules.ts         # MOQ, quantity discounts, pricing tiers
│   ├── content.config.ts         # Page copy, messaging
│   ├── shipping-zones.ts         # International shipping configuration
│   ├── theme.config.ts           # Color schemes, typography
│   └── vat-rates.ts              # VAT by country
├── lib/                          # Business logic & utilities
│   ├── woocommerce/              # WooCommerce API integration
│   ├── whatsapp/                 # WhatsApp messaging
│   ├── schema/                   # SEO structured data
│   ├── shipping-service.ts       # Shipping calculations
│   └── ...
├── store/                        # Zustand state management
│   ├── cart-store.ts             # Shopping cart with MOQ/discounts
│   ├── auth-store.ts             # User authentication
│   ├── wishlist-store.ts         # Saved products
│   └── currency-store.ts         # Currency preference
├── types/                        # TypeScript definitions
├── messages/                     # i18n translation files (en, sv, no, da)
└── public/                       # Static assets
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 |
| Backend | WordPress + WooCommerce (headless REST API) |
| State | Zustand with persistence |
| Styling | Tailwind CSS + Radix UI |
| Payments | Stripe (cards, Apple Pay, Google Pay, Klarna) |
| i18n | next-intl (EN, SV, NO, DA) |
| Currency | SEK, EUR, NOK, DKK with conversion API |

---

### Implementation Status Tracker

#### ✅ COMPLETED Features

| Feature | Key Files | Notes |
|---------|-----------|-------|
| **Core E-commerce** | `lib/woocommerce/`, `store/cart-store.ts` | Full WooCommerce integration |
| **Stripe Payments** | `app/api/stripe/`, `components/checkout/` | Cards, Apple Pay, Google Pay |
| **Shopping Cart** | `store/cart-store.ts`, `components/cart/` | Persistent, with notifications |
| **Wishlist** | `store/wishlist-store.ts`, `components/wishlist/` | Fully functional |
| **Shipping Zones** | `config/shipping-zones.ts`, `lib/shipping-service.ts` | Sweden, Nordic, EU zones |
| **WhatsApp Orders** | `lib/whatsapp/`, `components/whatsapp/` | Order via WhatsApp with Stripe links |
| **AI Shopping Assistant** | `components/ai/` | Product recommendations, chat |
| **Multi-currency** | `store/currency-store.ts`, `hooks/use-currency.ts` | SEK/EUR/NOK/DKK |
| **i18n Setup** | `i18n.ts`, `messages/` | Infrastructure ready |
| **SEO & Schema** | `lib/schema/` | Organization, product, breadcrumb schemas |
| **Global MOQ (5 units)** | `config/commerce-rules.ts:92` | All products require min 5 units |
| **Quantity Discounts** | `config/commerce-rules.ts:107-123` | Product 161 (Mini Electric Tandoor) |
| **Quote Request Flow** | `components/wholesale/quote-request-form-pro.tsx` | 3-step wizard, WC order creation, WhatsApp option |

#### ✅ RECENTLY COMPLETED (January 2026)

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| **Business Registration** | ✅ 100% | `components/auth/business-register-form.tsx` | 3-step wizard with credit application option |
| **Quick Order** | ✅ 100% | `components/wholesale/quick-order-form-enhanced.tsx` | CSV upload, templates, wholesale pricing |
| **Wholesale Price Display** | ✅ 100% | `components/wholesale/wholesale-price-display.tsx` | Status-aware, clickable register CTA |
| **Payment Terms (28-day Credit)** | ✅ 100% | `components/checkout/payment-terms-selector.tsx` | Pre-approval based, invoice option |
| **Free Shipping Banner** | ✅ 100% | Multiple files | Stockholm 5000kr threshold across site |
| **Business Dashboard** | ✅ 100% | `components/dashboard/business-stats.tsx` | Stats, spending metrics, growth tracking |
| **Reorder Lists** | ✅ 100% | `components/dashboard/reorder-lists.tsx` | Saved lists, one-click add to cart |
| **Invoice Tracking** | ✅ 100% | `components/dashboard/invoice-list.tsx` | View invoices, status, due dates |
| **VAT Number Validation** | ✅ 100% | `lib/vat-validation.ts`, `app/api/vat/validate/route.ts` | EU VIES API, format validation, Luhn check |
| **Multi-language Translations** | ✅ 100% | `messages/*.json` | EN, SV, NO, DA - all features translated |

#### ✅ ALL PLANNED FEATURES COMPLETED

---

### Key Configuration Files

#### `config/commerce-rules.ts` - Commerce Logic Hub

```typescript
// Global MOQ
export const GLOBAL_MOQ = 5;

// Quantity Discount Rules (add products here)
export const QUANTITY_DISCOUNT_RULES: QuantityDiscountRule[] = [
  {
    productId: 161,  // Mini Electric Tandoor
    productName: 'Mini Electric Tandoor',
    basePrice: 450,
    floorPrice: 370,
    tiers: [
      { minQuantity: 1, maxQuantity: 4, unitPrice: 450, label: 'Regular Price' },
      { minQuantity: 5, maxQuantity: 49, unitPrice: 400, label: 'Bulk Price (5+)' },
      { minQuantity: 50, maxQuantity: null, unitPrice: 400, label: 'Volume Price (50+)' },
    ],
    progressiveDiscount: {
      startAfterQuantity: 50,
      quantityStep: 10,
      discountPercent: 5,
    },
  },
  // Add more products here...
];

// Wholesale Tiers (for business accounts)
export const WHOLESALE_TIERS = [
  { minQuantity: 10, discount: 0.10, label: 'Bulk (10+)' },
  { minQuantity: 50, discount: 0.16, label: 'Wholesale (50+)' },
  { minQuantity: 100, discount: 0.20, label: 'Commercial (100+)' },
];
```

#### `config/shipping-zones.ts` - Shipping Configuration

- **Stockholm Area**: Same-day, own fleet
- **Sweden Domestic**: 1-2 days, PostNord
- **Nordic**: 2-4 days, DHL (299 SEK, free over 5000 SEK)
- **EU Core**: 3-6 days, DHL Express (499 SEK, free over 8000 SEK)

#### `store/cart-store.ts` - Cart State

- Handles MOQ enforcement
- Applies quantity discounts automatically
- Calculates tiered pricing for wholesale users
- Shipping integration

---

### API Routes Reference

| Endpoint | Purpose |
|----------|---------|
| `POST /api/stripe/create-payment-intent` | Create Stripe payment |
| `GET /api/products/search` | Product search |
| `POST /api/shipping/calculate` | Calculate shipping cost |
| `POST /api/quotes/request` | Submit quote request |
| `POST /api/wholesale/quick-order` | Quick order submission |
| `GET /api/currency/rates` | Currency conversion rates |
| `GET /api/sitemap/*` | SEO sitemaps |

---

### Recent Changes Log

| Date | Changes |
|------|---------|
| **Jan 2026** | **Quote Request Flow Enhancement** |
| | - Created `QuoteRequestFormPro` component with 3-step wizard |
| | - Product search with autocomplete from catalog |
| | - Quantity +/- controls with MOQ enforcement |
| | - Two submission options: Website (creates WooCommerce order) or WhatsApp |
| | - WooCommerce order creation with `_quote_request` meta flag |
| | - Professional email templates for admin and customer |
| | - Quote reference ID generation (QR-XXXXX-XXXX format) |
| | - Success state with "What's Next" steps |
| **Jan 2026** | Implemented Global MOQ (5 units) and Quantity Discounts for Product 161 |
| | - Added `QUANTITY_DISCOUNT_RULES` system in commerce-rules.ts |
| | - Created `QuantityDiscountDisplay` component |
| | - Updated quantity-selector with MOQ enforcement and discount hints |
| | - Updated cart-store to calculate discounted prices |
| | - Updated cart-drawer to show quantity discount pricing |

---

### Quote Request Flow

#### Overview
The quote request system allows B2B customers to request pricing for bulk orders. Quotes create pending orders in WooCommerce for tracking.

#### Flow Diagram
```
Customer visits /wholesale/quote
         ↓
Step 1: Select Products (search + quantity)
         ↓
Step 2: Business Information (company, contact)
         ↓
Step 3: Review & Choose Submission Method
         ↓
    ┌────┴────┐
    ↓         ↓
 Website    WhatsApp
    ↓         ↓
Creates WC   Opens WhatsApp
Order #      with message
    ↓         ↓
Admin/Customer  Direct chat
emails sent     with team
    ↓
Success screen with Quote Reference
```

#### Key Files

| File | Purpose |
|------|---------|
| `components/wholesale/quote-request-form-pro.tsx` | Enhanced 3-step quote wizard |
| `app/api/quotes/request/route.ts` | API endpoint (creates WC order, sends emails) |
| `app/(shop)/wholesale/quote/page.tsx` | Quote request page |

#### WooCommerce Integration

When a quote is submitted via website:
1. Order created with `status: 'pending'`
2. Meta data includes:
   - `_quote_id`: Unique quote reference
   - `_quote_request`: 'yes'
   - `_business_type`: Customer's business type
   - `_vat_number`: VAT/Org number
   - `_preferred_delivery`: Requested delivery date
   - `_quote_message`: Customer notes

#### Upcoming Features (Quote System)

| Feature | Status | Description |
|---------|--------|-------------|
| Quote Templates | Planned | Save quotes as templates for recurring orders |
| Quote Status Tracking | Planned | View quote status in customer dashboard |
| Quote-to-Order Conversion | Planned | One-click convert accepted quote to order |
| Quote Revisions | Planned | Request changes to quotes online |
| PDF Quote Download | Planned | Generate and download PDF quotes |
| Quote Expiry | Planned | Auto-expire quotes after X days |
| Admin Quote Dashboard | Planned | WP admin panel for quote management |

---

### How to Add New Quantity Discounts

1. Open `config/commerce-rules.ts`
2. Add entry to `QUANTITY_DISCOUNT_RULES` array:

```typescript
{
  productId: YOUR_PRODUCT_ID,
  productName: 'Product Name',
  basePrice: 100,      // Regular price
  floorPrice: 70,      // Minimum price (never go below)
  tiers: [
    { minQuantity: 1, maxQuantity: 4, unitPrice: 100, label: 'Regular' },
    { minQuantity: 5, maxQuantity: 49, unitPrice: 85, label: 'Bulk (5+)' },
    { minQuantity: 50, maxQuantity: null, unitPrice: 75, label: 'Volume (50+)' },
  ],
  progressiveDiscount: {  // Optional
    startAfterQuantity: 50,
    quantityStep: 10,
    discountPercent: 5,
  },
}
```

3. The system automatically:
   - Shows pricing table on product page
   - Enforces MOQ
   - Calculates correct prices in cart
   - Shows "add X more to save" suggestions

---

### Environment Variables Required

```env
# WooCommerce
WOOCOMMERCE_URL=https://your-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxx

# Stripe
STRIPE_SECRET_KEY=sk_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx

# WordPress
WORDPRESS_URL=https://your-site.com
```

---

### Next Priority Tasks

1. **Complete Quote Request Flow** - Email notifications, admin dashboard
2. **Business Registration** - VAT validation, WooCommerce customer meta
3. **Payment Terms** - Net 30/60 for verified businesses
4. **Business Dashboard** - Order history, reorder, invoices

---

## Business Registration System Documentation

### Overview
The wholesale business registration system allows B2B customers to register for wholesale pricing and benefits.

### Registration Flow

#### 1. Frontend Form (`/wholesale/register`)
**Component:** `components/auth/business-register-form.tsx`

3-step multi-step form:

| Step | Fields |
|------|--------|
| **1. Account** | First name, Last name, Username, Email, Password |
| **2. Business** | Company name, VAT/Org number, Business type |
| **3. Address** | Phone, Delivery address, City, Postcode, Country |

**Business Types:**
- Restaurant
- Café
- Catering Service
- Hotel / Hospitality
- Pizzeria
- Grocery Store / Retailer
- Other

**Supported Countries:** SE, NO, DK, FI, DE

#### 2. Backend Registration
**Server Action:** `app/actions/auth.ts` → `registerBusinessAction()`

Creates WooCommerce customer via REST API with metadata:

```javascript
meta_data: [
  { key: 'is_wholesale_customer', value: 'pending' },
  { key: 'company_name', value: '...' },
  { key: 'vat_number', value: '...' },
  { key: 'business_type', value: 'restaurant|cafe|catering|hotel|pizzeria|grocery|other' },
  { key: 'customer_type', value: 'business' }
]
```

#### 3. Wholesale Status Values
| Status | Meaning |
|--------|---------|
| `pending` | Awaiting admin verification |
| `yes` or `1` | Approved wholesale customer |
| `no` or `0` | Rejected/disabled |

#### 4. How Wholesale Status is Checked
**Component:** `components/wholesale/wholesale-price-display.tsx`

```javascript
const isWholesale = user?.meta_data?.some(m =>
  m.key === 'customer_type' && m.value === 'business'
) || user?.meta_data?.some(m =>
  m.key === 'is_wholesale_customer' && (m.value === '1' || m.value === 'yes')
);
```

#### 5. Admin Approval Workflow (WordPress)
1. WP Admin → WooCommerce → Customers
2. Find customer by email
3. Edit → Meta Data section
4. Change `is_wholesale_customer` from `pending` to `yes`
5. Save

### Dashboard Experience (`/my-account`)
**Component:** `app/(shop)/my-account/page.tsx`

All users (regular + business) see:
- Dashboard overview (orders count, downloads, addresses)
- Order history with status badges
- Downloads section
- Billing/Shipping address management
- Payment methods
- Profile settings

### Wholesale-Specific Features
- **Product Cards:** Show tiered pricing for verified wholesale customers
- **Pricing Display:** `components/wholesale/wholesale-price-display.tsx`
- **Quote System:** `components/wholesale/quote-request-form-pro.tsx`

### Files Reference
| File | Purpose |
|------|---------|
| `components/auth/business-register-form.tsx` | 3-step registration form |
| `app/actions/auth.ts` | Server actions for registration |
| `app/(shop)/my-account/page.tsx` | Customer dashboard |
| `components/wholesale/wholesale-price-display.tsx` | Wholesale pricing display |
| `components/wholesale/quote-request-form-pro.tsx` | Quote request form |
| `store/auth-store.ts` | Auth state (Zustand) |
| `lib/auth.ts` | Auth types and utilities |

### Enhancement Roadmap
- [x] Basic business registration form
- [x] WooCommerce customer creation with metadata
- [x] Credit application option (28-day terms)
- [x] Wholesale price display with status-aware UI
- [x] Quick order form with wholesale pricing
- [x] Payment terms selector (28-day credit for approved businesses)
- [x] Free shipping banner (5000kr Stockholm)
- [x] Business account badge in dashboard
- [x] Verification status notice ("Pending Approval")
- [x] Wholesale-specific dashboard tab with stats
- [x] Invoice tracking in dashboard
- [x] Reorder lists for quick reordering
- [x] VAT number validation (EU VIES API)
- [x] Multi-language translations (EN, SV, NO, DA)
- [ ] Email notifications for approval (backend/WooCommerce automation)
- [ ] PDF invoice generation
