# Milestone: Branding Fix · Header Layout · Growth Phase 1

**Date:** 2026-06-20
**Status:** ✅ Complete & deployed to `main`
**Commits:** `7e7e1ad` (branding), `e515101` (layout), `8b12e67` (growth)

---

## 1. Branding — "Royal Sweets" fully removed

The legacy "Royal Sweets & Restaurant" name persisted in emails for months because it was **hardcoded in the shared email template header/footer**, not just the sender lines that people kept editing.

- `lib/email-template.ts` — header + copyright now use `brandConfig.businessName`.
- `app/actions/reservation.ts` — sender name + subject use brand config.
- `components/ai/food-concierge.tsx` — greeting + assistant renamed "Anmol Concierge".
- Verified: zero "Royal Sweets" references remain; live test email confirmed sender = "Anmol Wholesale".
- Note: `SMTP_FROM_NAME` (prod host env) also controls the email sender name.

## 2. Header layout — horizontal scroll fixed

Desktop header right-group rendered 1809px wide, pushing user/cart icons off-screen and causing horizontal scroll. `.site-container` caps at 1400px, so the full inline header can't fit below ~1440px.

- `components/layout/header.tsx` — full inline nav now at `min-[1440px]`; compact header (full hamburger nav) below. Search uses `min-w-0`, action icons `flex-shrink-0`. Fixed 24px mobile overflow at 360px.
- `components/search/search-modal.tsx` — truncated placeholder so the cramped search pill never spills over the nav.
- `components/ui/currency-selector.tsx` — `Coins` icon (was `Globe`) to distinguish from language selector.
- Verified zero overflow 360–1920px via Playwright.

## 3. Growth Phase 1 — B2B lead-capture trio

- **Gated catalogue:** `components/layout/catalogue-cta.tsx` captures Name/Company/Email → `app/api/leads/catalogue/route.ts` emails admin a lead notice + emails the lead the catalogue. No WooCommerce account auto-created (avoids unwanted "set password" email).
- **B2B hero:** `components/home/hero.tsx` — "Get Wholesale Pricing" → register, "Browse Catalogue" → shop (en/sv/no/da in `messages/*.json`).
- **First-order offer:** `app/actions/auth.ts` welcome email with code **FRIFRAKT** = free delivery, Stockholm only, min 3000 kr, 1 use/customer. Coupon created in WooCommerce (id 272).

---

## ⚠️ Outstanding manual step (WooCommerce admin)

For **FRIFRAKT** to actually zero the delivery cost: WooCommerce → Settings → Shipping → **Stockholm zone → Free shipping → "requires a valid free shipping coupon."** This also enforces Stockholm-only (Europe DHL/PostNord zones won't honor it).

## Next: Growth Phase 2 (not started)

- Standing-order reminders (build on `components/dashboard/reorder-lists.tsx`; reminder-based — true auto-billing needs WooCommerce Subscriptions plugin, no app DB).
- Referral program (shareable coupon codes + WooCommerce meta; attribution is the hard part without a DB).
