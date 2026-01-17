# Complete Guide: Migrating Next.js from Vercel to Hostinger VPS

**Last Updated:** January 17, 2026  
**Project:** restaurantpack.se  
**Next.js Version:** 15.5.9

---

## 📋 Table of Contents

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Code Changes Required](#code-changes-required)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Hostinger Configuration](#hostinger-configuration)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Post-Migration Verification](#post-migration-verification)

---

## 🔍 Pre-Migration Checklist

### What to Check Before Starting

- [ ] List all environment variables from Vercel
- [ ] Identify Vercel-specific packages in `package.json`
- [ ] Check if using Vercel-specific features (Edge Functions, Image Optimization, etc.)
- [ ] Verify WooCommerce/external API credentials are still valid
- [ ] Document current deployment workflow
- [ ] Take screenshots of Vercel configuration

---

## 🔧 Code Changes Required

### 1. Remove Vercel-Specific Packages

**File:** `package.json`

Remove these dependencies:
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.5.0",        // ❌ Remove
    "@vercel/speed-insights": "^1.3.1",   // ❌ Remove
  }
}
```

**Command:**
```bash
npm uninstall @vercel/analytics @vercel/speed-insights
```

---

### 2. Remove Vercel Component Imports

**File:** `app/layout.tsx`

**Remove these imports:**
```typescript
import { Analytics } from "@vercel/analytics/react";        // ❌ Remove
import { SpeedInsights } from "@vercel/speed-insights/next"; // ❌ Remove
```

**Remove these components:**
```typescript
<Analytics />       // ❌ Remove
<SpeedInsights />   // ❌ Remove
```

---

### 3. Fix Environment Variables for Server-Side API Calls

**⚠️ CRITICAL:** This is the most important change!

**File:** `lib/woocommerce/config.ts` (or wherever your API config is)

**WRONG (Vercel style):**
```typescript
export const WC_API_CONFIG = {
  baseUrl: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3`,
  // ❌ NEXT_PUBLIC_* vars don't work for server-side calls on Hostinger
};
```

**CORRECT (Hostinger style):**
```typescript
export const WC_API_CONFIG = {
  baseUrl: `${process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3`,
  // ✅ Use server-side env var with fallback
};
```

**Why:** 
- `NEXT_PUBLIC_*` variables are embedded in client-side JavaScript during build
- They're not available to the Node.js runtime on Hostinger VPS
- Server-side API calls need regular environment variables

---

### 4. Add Dynamic Rendering to Prevent Build Timeouts

**File:** `app/layout.tsx` (or any layout that fetches data)

**Add these exports:**
```typescript
// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
```

**Why:**
- Prevents WooCommerce API calls during build time
- Avoids 60-second timeout errors
- Pages render on-demand instead of at build time

---

### 5. Disable Vercel Image Optimization

**File:** `next.config.js`

**Already correct if you have:**
```javascript
images: {
  unoptimized: true, // ✅ Required for non-Vercel hosting
}
```

---

## 🔐 Environment Variables Setup

### Critical Distinction: Server-Side vs Client-Side

| Variable Type | When to Use | Available Where |
|--------------|-------------|-----------------|
| `VARIABLE_NAME` | Server-side API calls, secrets | Node.js runtime only |
| `NEXT_PUBLIC_VARIABLE_NAME` | Client-side code, public data | Browser & Node.js |

### Required Environment Variables for Hostinger

**Add these in Hostinger hPanel → Environment Variables:**

#### 1. WordPress/WooCommerce (Server-Side)
```bash
WORDPRESS_URL=https://crm.restaurantpack.se
WORDPRESS_CONSUMER_KEY=ck_8a752976c9bf7171588e051caf39297959a13145
WORDPRESS_CONSUMER_SECRET=cs_f7b2dd2e9dabfbf9f4f185f90e8f076ce9e22343
```

#### 2. Site Configuration (Public)
```bash
NEXT_PUBLIC_WORDPRESS_URL=https://crm.restaurantpack.se
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
```

#### 3. API & Services
```bash
API_HOST=https://crm.restaurantpack.se
WORDPRESS_API_URL=https://crm.restaurantpack.se/wp-json
```

#### 4. Stripe (if using)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 5. Email/SMTP
```bash
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_TLS=true
SMTP_USER=info@your-domain.com
SMTP_PASSWORD=your_password
SMTP_FROM=info@your-domain.com
SMTP_FROM_NAME=Your Site Name
ADMIN_EMAIL=info@your-domain.com
CONTACT_EMAIL=info@your-domain.com
WHOLESALE_EMAIL=wholesale@your-domain.com
DIGITAL_EMAIL=info@your-domain.com
```

#### 6. WhatsApp
```bash
NEXT_PUBLIC_WHATSAPP_BUSINESS_NAME=Your Business
NEXT_PUBLIC_WHATSAPP_PHONE=+46XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_PHONE_ORDERS=+46XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_PHONE_SUPPORT=+46XXXXXXXXX
```

#### 7. Analytics (Optional)
```bash
NEXT_PUBLIC_UMAMI=your_umami_url
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_website_id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=000000000000000
```

#### 8. System
```bash
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
```

#### 9. Webhook
```bash
HOOK_KEY=your_webhook_key
```

---

## ⚙️ Hostinger Configuration

### Build Configuration

**In Hostinger hPanel → Build Settings:**

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Branch** | main |
| **Node Version** | 20.x (recommended) or 22.x |
| **Root Directory** | `.` (or `/` if option available) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Package Manager** | npm |

### Start Command

**⚠️ CRITICAL:** Make sure Hostinger has a "Start Command" configured:

```bash
npm run start
```

**If no Start Command field exists:**
- Use PM2 process manager (see below)
- Or configure in Hostinger's application settings

---

## 🚀 Deployment Process

### Step-by-Step Deployment

1. **Make Code Changes**
   ```bash
   # Remove Vercel packages
   npm uninstall @vercel/analytics @vercel/speed-insights
   
   # Update code as per sections above
   # Commit changes
   git add .
   git commit -m "Migrate from Vercel to Hostinger VPS"
   git push
   ```

2. **Configure Hostinger**
   - Add all environment variables
   - Set build configuration
   - Connect GitHub repository

3. **First Deployment**
   - Trigger deployment
   - Monitor build logs
   - Expected build time: 1-3 minutes

4. **Verify Deployment**
   - Check `/api/health` endpoint
   - Test product pages
   - Verify WooCommerce connection

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Timeouts (60+ seconds)

**Error:**
```
Failed to build /page because it took more than 60 seconds
```

**Solution:**
Add to layout that fetches data:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 3600;
```

---

### Issue 2: WooCommerce API Returns 404/401

**Error in `/api/health`:**
```json
{
  "checks": {
    "woocommerce": false
  }
}
```

**Solutions:**

1. **Check environment variables are set:**
   ```bash
   WORDPRESS_URL=https://crm.restaurantpack.se  # ← Must be set!
   WORDPRESS_CONSUMER_KEY=ck_...
   WORDPRESS_CONSUMER_SECRET=cs_...
   ```

2. **Verify API credentials in WooCommerce:**
   - Go to WooCommerce → Settings → Advanced → REST API
   - Check if keys are active
   - Regenerate if needed

3. **Test manually:**
   ```bash
   curl -u "ck_key:cs_secret" \
     "https://crm.restaurantpack.se/wp-json/wc/v3/products?per_page=1"
   ```

---

### Issue 3: Module Not Found Errors

**Error:**
```
Module not found: Can't resolve '@vercel/analytics/react'
```

**Solution:**
Remove all Vercel imports from code (see Section 2)

---

### Issue 4: Static Files 404

**Error:**
```
_next/static/chunks/app/page-xxx.js 404
```

**Possible Causes:**
1. Next.js server not running
2. Build didn't complete properly
3. Nginx misconfiguration

**Solutions:**

1. **Check if server is running:**
   ```bash
   ps aux | grep node
   ss -tulpn | grep 3000
   ```

2. **Restart the application:**
   ```bash
   pm2 restart app-name
   # OR
   npm run start
   ```

3. **Clear build cache and rebuild:**
   ```bash
   rm -rf .next
   npm run build
   npm run start
   ```

---

### Issue 5: Environment Variables Not Loading

**Symptom:** Variables work locally but not on Hostinger

**Solutions:**

1. **Verify variables are set in Hostinger hPanel**
2. **Restart application after adding variables**
3. **Check variable names (case-sensitive)**
4. **No quotes around values in Hostinger**

---

## ✅ Post-Migration Verification

### Health Check Endpoints

1. **API Health:**
   ```
   https://your-domain.com/api/health
   ```
   
   **Expected:**
   ```json
   {
     "status": "healthy",
     "checks": {
       "nextjs": true,
       "wordpress": true,
       "woocommerce": true  ← All should be true
     }
   }
   ```

2. **Test WooCommerce Keys:**
   ```
   https://your-domain.com/api/test-keys
   ```

### Page Testing Checklist

- [ ] Homepage loads
- [ ] `/shop` page loads with products
- [ ] `/product/[slug]` pages load
- [ ] `/api/health` returns healthy status
- [ ] Images load correctly
- [ ] Forms work (contact, checkout)
- [ ] Stripe payment works (if applicable)
- [ ] WhatsApp integration works

---

## 🔄 Switching Domains

### From Temporary to Production Domain

1. **Update environment variable:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://restaurantpack.se  # Change from temporary
   ```

2. **Point DNS to Hostinger:**
   - A Record: Point to Hostinger IP
   - Wait for DNS propagation (up to 48 hours)

3. **Redeploy:**
   - Trigger new deployment
   - Verify SSL certificate is active

4. **Remove Vercel deployment** (optional)

---

## 📊 Performance Comparison

| Metric | Vercel | Hostinger VPS |
|--------|--------|---------------|
| **Build Time** | 2-3 min | 1-3 min |
| **Cold Start** | ~500ms | N/A (always warm) |
| **Monthly Cost** | $20-100+ | $5-20 |
| **Control** | Limited | Full |
| **Scaling** | Automatic | Manual |

---

## 🛠️ Optional: PM2 Setup (Recommended)

If Hostinger doesn't auto-start your app:

```bash
# Install PM2
npm install -g pm2

# Start app
cd /path/to/app
pm2 start npm --name "restaurantpack" -- start

# Save configuration
pm2 save

# Auto-start on reboot
pm2 startup

# Monitor
pm2 logs restaurantpack
pm2 status
```

---

## 📝 Migration Checklist

Use this checklist for your next migration:

### Pre-Migration
- [ ] Export all Vercel environment variables
- [ ] Document current build settings
- [ ] Test locally with production env vars
- [ ] Backup database (if applicable)

### Code Changes
- [ ] Remove `@vercel/analytics` and `@vercel/speed-insights`
- [ ] Remove Vercel imports from `layout.tsx`
- [ ] Change `NEXT_PUBLIC_*` to server-side vars for API calls
- [ ] Add `dynamic = 'force-dynamic'` to layouts fetching data
- [ ] Verify `images.unoptimized = true` in `next.config.js`

### Hostinger Setup
- [ ] Add all environment variables
- [ ] Configure build settings
- [ ] Set Node version to 20.x
- [ ] Ensure start command is configured
- [ ] Connect GitHub repository

### Deployment
- [ ] Push code changes
- [ ] Trigger first deployment
- [ ] Monitor build logs
- [ ] Check for errors

### Verification
- [ ] Test `/api/health` endpoint
- [ ] Verify WooCommerce connection
- [ ] Test all major pages
- [ ] Check static files load
- [ ] Verify forms and integrations

### DNS & Domain
- [ ] Update `NEXT_PUBLIC_SITE_URL`
- [ ] Point DNS to Hostinger
- [ ] Verify SSL certificate
- [ ] Test production domain

---

## 🆘 Troubleshooting Commands

```bash
# Check if app is running
ps aux | grep node

# Check port
ss -tulpn | grep 3000

# View logs (if using PM2)
pm2 logs restaurantpack

# Restart app
pm2 restart restaurantpack

# Check environment variables
node -e "console.log(process.env.WORDPRESS_URL)"

# Test WooCommerce API
curl -u "key:secret" "https://crm.domain.com/wp-json/wc/v3/products?per_page=1"

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Support Resources

- **Hostinger Support:** https://www.hostinger.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **WooCommerce REST API:** https://woocommerce.github.io/woocommerce-rest-api-docs/

---

## 🎯 Key Takeaways

1. **Never use `NEXT_PUBLIC_*` for server-side API calls**
2. **Always use `dynamic = 'force-dynamic'` for data-fetching layouts**
3. **Remove all Vercel-specific packages and imports**
4. **Ensure start command is configured**
5. **Test thoroughly before switching DNS**

---

**Last Updated:** January 17, 2026  
**Tested On:** restaurantpack.se migration  
**Success Rate:** Pending final 404 resolution
