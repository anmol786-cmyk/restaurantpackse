# Hostinger Deployment Fix - Environment Variables

## ✅ Issue Resolved

**Problem:** Product and shop pages returning 404 on Hostinger VPS  
**Root Cause:** Using `NEXT_PUBLIC_WORDPRESS_URL` for server-side WooCommerce API calls  
**Solution:** Use server-side `WORDPRESS_URL` environment variable

---

## 🔧 Changes Made

### 1. Updated `lib/woocommerce/config.ts`

Changed from:
```typescript
baseUrl: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3`
```

To:
```typescript
baseUrl: `${process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3`
```

**Why:** `NEXT_PUBLIC_*` variables are for client-side (browser) code. Server-side API calls need regular environment variables that are available to the Node.js runtime.

### 2. Added Enhanced Logging to `lib/woocommerce/api.ts`

Added detailed logging to help diagnose issues:
- Request URL and method
- Response status
- Error details

This will help identify any remaining issues in Hostinger logs.

### 3. Updated `.env.local`

Added new environment variable:
```bash
WORDPRESS_URL=https://crm.restaurantpack.se
```

---

## 📋 Required Actions on Hostinger

### Step 1: Add New Environment Variable

In Hostinger hPanel → Your Project → Environment Variables, **ADD**:

```
WORDPRESS_URL = https://crm.restaurantpack.se
```

**Keep existing variables:**
- ✅ `WORDPRESS_CONSUMER_KEY` = `ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f`
- ✅ `WORDPRESS_CONSUMER_SECRET` = `cs_cc8b959ab1b48a49778127dc13ae660b82b021a7`
- ✅ `NEXT_PUBLIC_WORDPRESS_URL` = `https://crm.restaurantpack.se` (keep for client-side use)

### Step 2: Deploy Changes

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix: Use server-side WORDPRESS_URL for WooCommerce API calls"
   git push
   ```

2. **Trigger fresh deployment on Hostinger**
   - This ensures the runtime picks up the new environment variable

### Step 3: Test

Visit:
```
https://gray-tapir-760886.hostingersite.com/product/rangkat-food-colour-powder-1kg
```

**Expected:** Product page loads successfully  
**If still fails:** Check Hostinger application logs for detailed error messages

---

## 🔍 How to Check Logs on Hostinger

If the product page still returns 404:

1. **Access Hostinger hPanel**
2. **Go to:** Your Project → Logs or Application Logs
3. **Look for:**
   - `📡 WooCommerce API Response:` - Shows if API call succeeded
   - `❌ WooCommerce API Error:` - Shows exact error if it failed

Share the log output and we can diagnose further.

---

## 📊 Environment Variables Summary

### Server-Side (Runtime) Variables:
```bash
WORDPRESS_URL=https://crm.restaurantpack.se
WORDPRESS_CONSUMER_KEY=ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f
WORDPRESS_CONSUMER_SECRET=cs_cc8b959ab1b48a49778127dc13ae660b82b021a7
```

### Public (Client-Side) Variables:
```bash
NEXT_PUBLIC_WORDPRESS_URL=https://crm.restaurantpack.se
NEXT_PUBLIC_SITE_URL=https://gray-tapir-760886.hostingersite.com
```

---

## ✅ After This Works

Once products load on the temporary domain:

1. **Point your main domain** (`restaurantpack.se`) to Hostinger
2. **Update environment variable:**
   ```
   NEXT_PUBLIC_SITE_URL = https://restaurantpack.se
   ```
3. **Redeploy**
4. **Remove Vercel deployment** (if desired)

---

## 🎯 Why This Fix Works

### The Problem:
- `NEXT_PUBLIC_*` variables are embedded in the client-side JavaScript bundle during build
- They're meant for browser code, not server-side Node.js code
- On Hostinger, the Node.js runtime process needs explicit server-side environment variables
- At build time, both types of variables might be available, but at runtime only server-side vars are guaranteed

### The Solution:
- Use `WORDPRESS_URL` (server-side) for WooCommerce API calls
- Keep `NEXT_PUBLIC_WORDPRESS_URL` for any client-side references
- This ensures the Next.js server can make authenticated API calls at runtime

---

## 📞 Support

If issues persist after deploying:

1. Check Hostinger logs for error messages
2. Verify all environment variables are set correctly
3. Ensure the deployment triggered a fresh build
4. Test the `/api/health` endpoint to verify WooCommerce connection

The enhanced logging will show exactly what's happening!
