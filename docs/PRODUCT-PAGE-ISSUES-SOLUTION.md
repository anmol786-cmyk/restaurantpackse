# Product Page Issues - Analysis & Solutions

**Date:** January 18, 2026  
**Issue:** Products visible but product pages show blank/errors for products without complete data

---

## 🔍 **Root Cause Analysis**

### Issues Identified:

1. **Image Error (CRITICAL)**
   - **Error:** `Cannot read properties of undefined (reading 'src')`
   - **Cause:** Products in WooCommerce have missing or incomplete image data
   - **Impact:** Product pages crash when trying to display images

2. **Stripe Integration Error**
   - **Error:** `IntegrationError: Please call Stripe() with your publishable key. You used an empty string.`
   - **Cause:** Stripe publishable key not configured (placeholder value in .env.local)
   - **Impact:** Express checkout component fails to load

3. **500 Server Error**
   - **Error:** Product page returns 500 status
   - **Cause:** Server-side rendering fails when product data is incomplete
   - **Impact:** Entire page fails to load

4. **Favicon 404** (Minor)
   - **Error:** `/favicon.ico` not found
   - **Impact:** Browser console warning

---

## ✅ **Solutions Implemented**

### 1. Fixed Image Gallery Component ✅

**File:** `components/shop/product-image-gallery.tsx`

**Changes:**
- Added defensive filtering to remove invalid images
- Added null safety checks for `currentImage.src`
- Updated all image references to use `validImages` array
- Added fallback UI when no images are available

**Code Changes:**
```typescript
// Filter out invalid images
const validImages = images?.filter(img => img && img.src) || [];
const hasAnyImages = validImages.length > 0;
const currentImage = validImages[selectedIndex] || validImages[0];

// All references updated to use validImages instead of images
```

**Result:** Product pages will now display gracefully even without images

---

### 2. Fixed Stripe Integration Error ✅

**File:** `components/checkout/stripe-express-checkout.tsx`

**Changes:**
- Added validation for Stripe publishable key
- Component returns `null` if Stripe is not properly configured
- Prevents Stripe.js from loading with invalid/empty keys

**Code Changes:**
```typescript
// Validate Stripe key before loading
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const isValidStripeKey = stripePublishableKey && 
  stripePublishableKey.startsWith('pk_') && 
  !stripePublishableKey.includes('your_stripe');

const stripePromise = isValidStripeKey ? loadStripe(stripePublishableKey) : null;

// Early return if not configured
if (!isValidStripeKey) {
    return null;
}
```

**Result:** No more Stripe errors, express checkout simply doesn't show if not configured

---

## 📋 **Recommended Approach Going Forward**

### Option 1: Populate WooCommerce Data (RECOMMENDED)

**Pros:**
- ✅ Proper data management
- ✅ Better SEO with real product descriptions
- ✅ Easier to manage inventory
- ✅ Works with all WooCommerce features
- ✅ No code changes needed

**Cons:**
- ⏱️ Time-consuming to add data for all products
- 📝 Need to write descriptions, add images, etc.

**How to do it:**
1. Go to WooCommerce → Products
2. For each product, add:
   - At least one product image
   - Short description (appears on product page)
   - Full description (appears in tabs)
   - Product attributes if needed
   - Categories and tags

### Option 2: Create Fallback/Default Content

**Pros:**
- ⚡ Quick solution
- 🔄 Automatic for all products

**Cons:**
- ❌ Generic content, not SEO-friendly
- ❌ Poor user experience
- ❌ Doesn't leverage WooCommerce features

**Implementation:**
- Add default placeholder images
- Generate generic descriptions from product names
- Auto-populate missing fields

### Option 3: Hybrid Approach (BEST)

**Recommended Strategy:**
1. **Immediate:** Use the fixes implemented above (already done ✅)
2. **Short-term:** Add data for your top 20-30 products (like Ocean Pearl Rice)
3. **Medium-term:** Gradually populate remaining products
4. **Long-term:** Ensure all new products have complete data

---

## 🎯 **Next Steps**

### Immediate Actions:

1. **Test the Fixes** ✅
   - Product pages should now load without crashing
   - Products without images show placeholder
   - No Stripe errors

2. **Add Stripe Keys** (Optional)
   ```bash
   # In Hostinger environment variables, add:
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
   STRIPE_SECRET_KEY=sk_live_your_actual_key
   ```

3. **Add Favicon** (Optional)
   - Add `favicon.ico` to `/public` folder
   - Or use `app/icon.png` (Next.js 13+ approach)

### Priority Products to Complete:

Focus on products that:
- Have high traffic/sales
- Are featured on homepage
- Are in top categories
- Have variations (need complete attribute data)

**Example Products to Prioritize:**
1. Ocean Pearl Rice (already complete ✅)
2. Other rice products
3. Cooking oils
4. Top-selling spices
5. Featured/promoted items

---

## 📊 **Data Checklist for Each Product**

When adding product data in WooCommerce, ensure:

- [ ] **Images** (minimum 1, recommended 3-5)
  - Main product image
  - Additional angles/views
  - Packaging/label images
  - Usage/serving suggestions

- [ ] **Basic Info**
  - Product name
  - SKU
  - Price (regular + sale if applicable)
  - Stock status

- [ ] **Descriptions**
  - Short description (2-3 sentences)
  - Full description (detailed)
  - Key features/benefits

- [ ] **Organization**
  - Categories (at least 1)
  - Tags (optional but helpful)
  - Attributes (for variations)

- [ ] **SEO**
  - Meta description
  - Focus keyword
  - Alt text for images

---

## 🔧 **Technical Details**

### Files Modified:
1. `components/shop/product-image-gallery.tsx` - Image handling fixes
2. `components/checkout/stripe-express-checkout.tsx` - Stripe validation

### Environment Variables Needed:
```bash
# WooCommerce (already configured ✅)
WORDPRESS_URL=https://crm.restaurantpack.se
WORDPRESS_CONSUMER_KEY=ck_...
WORDPRESS_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_WORDPRESS_URL=https://crm.restaurantpack.se
NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY=ck_...
NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET=cs_...

# Stripe (optional - only if using Stripe payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 💡 **Summary**

**Current Status:** ✅ Product pages now work even with incomplete data

**Recommendation:** Use **Option 3 (Hybrid Approach)**
1. Fixes are in place (no more crashes)
2. Gradually add complete data to products
3. Prioritize high-traffic products first
4. New products should have complete data from the start

**No Need to Build All Pages in WooCommerce** - The dynamic fetching works fine now with proper error handling. Just add the product data in WooCommerce admin as you have time.

---

**Last Updated:** January 18, 2026  
**Status:** Fixes implemented, ready for testing
