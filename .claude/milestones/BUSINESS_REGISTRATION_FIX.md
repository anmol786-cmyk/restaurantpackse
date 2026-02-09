# Business Registration Flow - Bug Fix Session

**Date:** February 3, 2026
**Status:** ✅ FIXED & WORKING

---

## Issues Found & Fixed

### 1. VAT/Org Number Validation Too Strict
**File:** `components/auth/business-register-form.tsx`

**Problem:** The regex validation was rejecting valid Swedish org numbers and VAT formats.

**Fix:** Updated validation to accept multiple formats:
- Swedish Org Number: 10 digits (`559253-8069` or `5592538069`)
- Swedish VAT: SE + 12 digits (`SE559253806901`)
- Norwegian Org: 9 digits
- Danish CVR: 8 digits
- Generic EU VAT: Country code + 8-12 alphanumeric

### 2. Select Components Not Working
**File:** `components/auth/business-register-form.tsx`

**Problem:** Select components used `defaultValue` instead of `value`, breaking react-hook-form integration.

**Fix:** Changed all Select components to use `value={field.value}`:
- Business Type select
- Country select
- Estimated Monthly Volume select

### 3. Form Validation Mode Too Aggressive
**File:** `components/auth/business-register-form.tsx`

**Problem:** `mode: 'onChange'` showed errors on every keystroke.

**Fix:** Changed to `mode: 'onBlur'` for better UX.

### 4. Toast Notifications Not Showing
**File:** `app/layout.tsx`

**Problem:** Form used Sonner toast but only shadcn/ui Toaster was in layout.

**Fix:** Added Sonner Toaster to layout:
```tsx
import { Toaster as SonnerToaster } from "sonner";
// ...
<SonnerToaster position="top-center" richColors closeButton />
```

### 5. WooCommerce API Permissions
**Problem:** API keys had Read-only permission, couldn't create customers.

**Fix:** User updated WooCommerce REST API keys to Read/Write permission.

### 6. Simple JWT Login Blocking API
**Problem:** Plugin was protecting WooCommerce REST API endpoints.

**Fix:** User disabled "Protect Endpoints" in Simple JWT Login settings.

---

## Files Modified

| File | Changes |
|------|---------|
| `components/auth/business-register-form.tsx` | VAT validation, Select components, validation mode, error handling, debug logging |
| `app/layout.tsx` | Added Sonner Toaster |
| `app/actions/auth.ts` | Improved error handling, better logging |
| `lib/vat-validation.ts` | Fixed Swedish org number validation |

---

## Current Flow (Working)

1. User navigates to `/wholesale` → Clicks "Register as Business"
2. **Step 1:** Account info (name, email, username, password)
3. **Step 2:** Business info (company name, VAT/Org number, business type)
4. **Step 3:** Address info (phone, address, city, postcode, country) + optional credit application
5. Submit → Creates customer in WooCommerce with `is_wholesale_customer: 'pending'`
6. Success toast → Redirect to `/login`
7. User logs in → Sees "Pending Verification" status in dashboard

---

## Admin Workflow

**URL:** `/admin/wholesale`

Admin can:
- View all pending wholesale applications
- See company name, VAT, contact info, business type
- Approve or Reject applications
- Approved users get `is_wholesale_customer: 'yes'` and wholesale pricing

---

## TODO / Future Enhancements

- [ ] Add more details to admin table (phone, full address, credit amount requested)
- [ ] Email notification to user when approved/rejected
- [ ] Credit application separate approval workflow
- [ ] Welcome PDF generation on approval

---

## Testing Checklist

- [x] Register with Swedish org number (10 digits)
- [x] Register with Swedish VAT (SE + 12 digits)
- [x] Register without VAT (optional field)
- [x] Form validation shows proper errors
- [x] Toast notifications appear
- [x] Redirect to login after success
- [x] User created in WooCommerce
- [x] User appears in admin dashboard
- [x] Approve button works
- [ ] Reject button works
- [ ] Email notifications sent
