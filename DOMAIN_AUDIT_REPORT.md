# Domain Reference Audit Report

**Date:** February 4, 2026
**Auditor:** Claude Code
**Status:** COMPLETED - All issues fixed

---

## Critical Issues Found & Fixed

### 1. robots.txt - CRITICAL (FIXED)
**File:** `app/robots.txt`
**Issue:** Sitemap URL pointed to wrong domain
```diff
- Sitemap: https://ideallivs.com/sitemap.xml
+ Sitemap: https://restaurantpack.se/sitemap.xml
```
**Impact:** Google couldn't find sitemap for months, causing indexing failure.

### 2. Apple Pay Domain Association (FIXED)
**File:** `public/.well-known/apple-developer-merchantid-domain-association`
**Issue:** Instructions referenced wrong domain
```diff
- 2. Add domain: www.ideallivs.com
+ 2. Add domain: restaurantpack.se
```

---

## Files Reviewed (No Issues)

### Legitimate Old Domain References
These files intentionally reference old domains for redirect purposes:

| File | Purpose | Status |
|------|---------|--------|
| `middleware.ts` | Redirects ideallivs.com → restaurantpack.se | OK (Redirect logic) |

### Documentation Files (Non-Critical)
| File | Notes |
|------|-------|
| `iterative-fluttering-dragon.md` | Internal dev notes about migration |
| `fourlines-mcp-pro/*.php` | WordPress plugin comments |

---

## Verified Correct References

All these files correctly use `restaurantpack.se` or `crm.restaurantpack.se`:

- `site.config.ts` → `https://restaurantpack.se`
- `config/brand.config.ts` → Correct URLs
- `config/brand-profile.ts` → Correct URLs
- `lib/schema/*.ts` → All schemas use correct domain
- `.env.local` → `crm.restaurantpack.se`
- All sitemap routes → Correct base URL
- All email templates → Correct domain

---

## Domains Whitelist

### Allowed Domains (Should Appear in Code)
- `restaurantpack.se` - Main website
- `crm.restaurantpack.se` - WooCommerce/WordPress backend
- `anmolsweets.se` - Parent company (legitimate reference in schema)
- `schema.org` - Structured data
- `google.com`, `facebook.com`, `whatsapp.com` - Third-party integrations
- `fonts.googleapis.com` - Google Fonts
- `stripe.com` - Payment processing

### Blocked Domains (Should NOT Appear)
- ❌ `ideallivs.com` - Old domain (except in redirect middleware)
- ❌ `yourgrocerystore.com` - Placeholder
- ❌ `example.com` - Placeholder
- ❌ Any other client domains

---

## Recommendations

1. **Regular Audits:** Run domain audit before every major deployment
2. **Pre-commit Hook:** Add grep check for blocked domains
3. **Environment Variables:** Use `NEXT_PUBLIC_SITE_URL` instead of hardcoded URLs where possible

---

## Audit Command

To re-run this audit manually:
```bash
# Search for potential issues
grep -rn "ideallivs\|yourgrocerystore\|example\.com" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.txt" . | grep -v node_modules | grep -v .next
```

---

*Audit completed successfully. All critical issues resolved.*
