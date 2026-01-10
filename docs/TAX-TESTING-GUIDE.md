# Tax Calculation Testing Guide

## Prerequisites

Before testing, ensure products in WooCommerce have the correct tax classes set:

### Setup Tax Classes in WooCommerce

1. **Navigate to:** WooCommerce → Settings → Tax → Standard Rates
2. **Verify Swedish VAT rates are configured:**
   - Standard Rate: 25%
   - Reduced Rate: 12% (for food products)

3. **Set Tax Classes on Products:**

#### Food Products (12% VAT):
- Go to Products → Edit Product
- Scroll to "Product Data" panel
- Tax Tab:
  - Tax status: `Taxable`
  - Tax class: `Reduced rate`
- Save product

#### Non-Food Products (25% VAT):
- Go to Products → Edit Product
- Tax Tab:
  - Tax status: `Taxable`
  - Tax class: `Standard` (or leave blank)
- Save product

## Test Scenarios

### Test 1: Single Tax Rate Cart (Food Products Only)

**Setup:**
1. Clear cart
2. Add only food products (12% VAT items) to cart

**Expected Result:**
- Cart should display: "Tax (12% included)"
- Example calculation:
  ```
  Product: Basmati Rice - 100 SEK (price includes 12% VAT)
  Subtotal (excl. tax): 89.29 SEK
  Tax (12% included):   10.71 SEK
  Total:               100.00 SEK
  ```

**How to Verify:**
1. Navigate to `/cart`
2. Check OrderSummary component
3. Tax line should show "12% included"
4. Proceed to `/checkout`
5. Verify same tax display

---

### Test 2: Single Tax Rate Cart (Non-Food Products Only)

**Setup:**
1. Clear cart
2. Add only non-food products (25% VAT items) to cart

**Expected Result:**
- Cart should display: "Tax (25% included)"
- Example calculation:
  ```
  Product: Tandoor Oven - 10,000 SEK (price includes 25% VAT)
  Subtotal (excl. tax): 8,000.00 SEK
  Tax (25% included):   2,000.00 SEK
  Total:               10,000.00 SEK
  ```

**How to Verify:**
1. Navigate to `/cart`
2. Check OrderSummary component
3. Tax line should show "25% included"
4. Proceed to `/checkout`
5. Verify same tax display

---

### Test 3: Mixed Tax Rate Cart (Food + Non-Food)

**Setup:**
1. Clear cart
2. Add mix of food (12%) and non-food (25%) products

**Expected Result:**
- Cart should display: "Tax (mixed rates included)" with breakdown
- Example calculation:
  ```
  Products:
  - Basmati Rice (12%):    100.00 SEK
  - Tandoor Oven (25%):  10,000.00 SEK

  Subtotal (excl. tax):  8,089.29 SEK
  Tax (mixed rates):     2,010.71 SEK
    12% VAT                 10.71 SEK
    25% VAT              2,000.00 SEK
  ─────────────────────────────────
  Total:                10,100.00 SEK
  ```

**How to Verify:**
1. Navigate to `/cart`
2. Check OrderSummary component
3. Should show "Tax (mixed rates included)"
4. Should show breakdown with border line:
   - 12% VAT: XX SEK
   - 25% VAT: YY SEK
5. Proceed to `/checkout`
6. Verify same display with breakdown

---

### Test 4: Wholesale Customer with Tiered Pricing

**Setup:**
1. Login as wholesale customer
2. Add products with quantity discounts
3. Mix of food and non-food products

**Expected Result:**
- Tiered discounts apply BEFORE tax calculation
- Tax calculated on discounted prices
- Example:
  ```
  Product: Basmati Rice (wholesale customer)
  - Regular: 100 SEK/unit
  - Buy 10+: 90 SEK/unit (10% discount)
  - Quantity: 12 units

  Line total: 1,080 SEK (includes 12% VAT)
  Subtotal:     964.29 SEK
  Tax (12%):    115.71 SEK
  ```

**How to Verify:**
1. Login as business account
2. Add products with quantity ≥ tier threshold
3. Cart should show tiered price
4. Tax should be calculated on discounted price
5. Verify in OrderSummary

---

### Test 5: Checkout Order Creation

**Setup:**
1. Create cart with mixed tax rates
2. Proceed through checkout
3. Complete order

**Expected Result:**
- WooCommerce order in admin should show:
  - Correct line items with tax class
  - Individual tax amounts per item
  - Total tax matching frontend calculation

**How to Verify:**
1. Complete checkout with test order
2. Go to WooCommerce Admin → Orders
3. Open the order
4. Check "Order Details" section:
   - Each line item should show correct tax
   - Tax total should match
5. Download order PDF/invoice
6. Verify tax breakdown is correct

---

### Test 6: Product Page Display

**Setup:**
1. View individual product pages

**Expected Result:**
- Product prices shown include VAT
- No explicit tax shown on product page (standard for Sweden)

**How to Verify:**
1. Navigate to any product page
2. Price displayed is tax-inclusive
3. No separate tax line (Swedish standard)

---

### Test 7: Quick Order Form (Wholesale)

**Setup:**
1. Navigate to `/wholesale/quick-order`
2. Add products using autocomplete

**Expected Result:**
- Prices shown include appropriate VAT
- Order total calculation includes tax
- Email confirmation shows correct tax

**How to Verify:**
1. Fill out quick order form
2. Check order total
3. Submit order
4. Check email confirmation
5. Verify tax amounts

---

## Common Issues and Solutions

### Issue: All products showing 25% VAT

**Cause:** Tax class not set correctly in WooCommerce

**Solution:**
1. Edit products in WooCommerce admin
2. Set Tax class to "Reduced rate" for food products
3. Clear product cache: WooCommerce → Status → Tools → Clear transients

### Issue: Tax not displaying in cart

**Cause:** Cart has 0 items or tax calculation error

**Solution:**
1. Check browser console for errors
2. Verify products have `tax_class` and `tax_status` in API response
3. Test with `npm run dev` and check console logs

### Issue: Mixed cart not showing breakdown

**Cause:** All products have same tax class

**Solution:**
- Only shows breakdown when cart has 2+ different tax rates
- Add products with different tax classes to test

### Issue: Build fails with tax calculation errors

**Cause:** Missing dependencies or TypeScript errors

**Solution:**
```bash
npm install
npm run build
```

---

## API Testing (for developers)

### Check Product Tax Data

```bash
# Fetch a product and verify tax fields
curl "https://your-site.com/api/products/123" | jq '.tax_class, .tax_status'
```

Expected response:
```json
{
  "tax_status": "taxable",
  "tax_class": "reduced-rate"  // or "" for standard
}
```

### Test Tax Calculation Function

Create a test file:

```typescript
import { calculateCartTax, getTaxRate } from '@/lib/tax/calculate-tax';

const foodProduct = {
  tax_class: 'reduced-rate',
  tax_status: 'taxable',
  // ... other product fields
};

const nonFoodProduct = {
  tax_class: '',
  tax_status: 'taxable',
  // ... other product fields
};

const items = [
  { product: foodProduct, quantity: 1, price: 100 },
  { product: nonFoodProduct, quantity: 1, price: 1000 }
];

const result = calculateCartTax(items, true);
console.log(result);
// Should show correct mixed tax calculation
```

---

## Acceptance Criteria

✅ **PASS** if:
- Food products show 12% VAT in cart/checkout
- Non-food products show 25% VAT in cart/checkout
- Mixed carts show breakdown of both rates
- WooCommerce orders have correct tax amounts
- Wholesale tiered pricing calculates tax on discounted prices
- Build completes without errors

❌ **FAIL** if:
- All products show same tax rate regardless of class
- Tax breakdown missing for mixed carts
- WooCommerce order tax doesn't match frontend
- Build errors related to tax calculation

---

## Rollback Plan

If issues are found in production:

1. **Immediate fix:**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push
   ```

2. **Disable tax display temporarily:**
   - Edit `components/checkout/order-summary.tsx`
   - Comment out tax breakdown section
   - Show generic "Tax calculated at checkout" message

3. **Contact support:**
   - Check WooCommerce tax settings
   - Verify product tax classes are set correctly
   - Review order confirmation emails

---

**Document Version:** 1.0
**Last Updated:** January 10, 2026
**Author:** Development Team
