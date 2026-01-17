# Hostinger VPS Deployment Guide

## 🚨 Current Issues & Solutions

### Issue 1: Vercel Speed Insights 404 Error
**Status:** ✅ FIXED
- **Cause:** Vercel-specific packages in dependencies
- **Solution:** Removed `@vercel/analytics` and `@vercel/speed-insights` from package.json
- **Action Required:** Run `npm install` to update dependencies

### Issue 2: Products Not Fetching / Shop Returns 404
**Status:** ⚠️ NEEDS ATTENTION
- **Likely Cause:** Missing environment variables on Hostinger VPS
- **Solution:** Follow the checklist below

---

## ✅ Deployment Checklist

### Step 1: Verify Environment Variables on Hostinger

Make sure ALL these variables are set in your Hostinger VPS environment:

```bash
# CRITICAL - Required for basic functionality
NEXT_PUBLIC_WORDPRESS_URL=https://crm.restaurantpack.se
WORDPRESS_API_URL=https://crm.restaurantpack.se/wp-json
WORDPRESS_CONSUMER_KEY=ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f
WORDPRESS_CONSUMER_SECRET=cs_cc8b959ab1b48a49778127dc13ae660b82b021a7

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://restaurantpack.se
NEXT_PUBLIC_SITE_NAME=Anmol Wholesale
API_HOST=https://crm.restaurantpack.se

# Environment
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false

# Fourlines MCP (if using)
FOURLINES_MCP_KEY=fmcp_1c5181b0a7559462b48932aaa1532169e3ba0b7ce5e7573a84d0aabd93b28431
NEXT_PUBLIC_FOURLINES_MCP_KEY=fmcp_1c5181b0a7559462b48932aaa1532169e3ba0b7ce5e7573a84d0aabd93b28431
```

### Step 2: Run Diagnostic Script

On your Hostinger VPS, run:

```bash
cd /path/to/your/app
node scripts/hostinger-diagnostic.js
```

This will check:
- ✅ All environment variables are set
- ✅ WooCommerce API connectivity
- ✅ WordPress REST API connectivity

### Step 3: Rebuild and Restart

After fixing environment variables:

```bash
# Install dependencies (removes Vercel packages)
npm install

# Build the application
npm run build

# Restart the application
pm2 restart restaurantpack
# OR if not using PM2:
npm run start
```

---

## 🔍 Common Issues & Solutions

### Products Not Loading

**Symptoms:**
- Shop page returns 404
- Product pages don't load
- API calls failing

**Solutions:**

1. **Check Environment Variables**
   ```bash
   # On your VPS, verify variables are set:
   echo $NEXT_PUBLIC_WORDPRESS_URL
   echo $WORDPRESS_CONSUMER_KEY
   ```

2. **Test WooCommerce API Manually**
   ```bash
   curl -u "ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f:cs_cc8b959ab1b48a49778127dc13ae660b82b021a7" \
     https://crm.restaurantpack.se/wp-json/wc/v3/products?per_page=1
   ```
   
   Expected: JSON response with products
   If error: Check WooCommerce backend is accessible

3. **Check Application Logs**
   ```bash
   # If using PM2:
   pm2 logs restaurantpack
   
   # Or check server logs:
   tail -f /var/log/nginx/error.log
   ```

4. **Verify Build Output**
   ```bash
   # Check if .next folder exists and is complete
   ls -la .next/
   
   # Should contain:
   # - server/
   # - static/
   # - BUILD_ID
   ```

### 404 Errors on All Pages

**Possible Causes:**
1. Next.js app not running on correct port
2. Nginx not properly configured
3. Build failed or incomplete

**Solutions:**

1. **Check if Next.js is running:**
   ```bash
   pm2 status
   # OR
   ps aux | grep node
   ```

2. **Verify port configuration:**
   ```bash
   # Next.js should be running on port 3000
   netstat -tulpn | grep 3000
   ```

3. **Check Nginx configuration:**
   ```nginx
   # Should have reverse proxy to localhost:3000
   location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

---

## 🚀 Recommended Deployment Process

### Using PM2 (Recommended)

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 ecosystem file:**
   ```bash
   # Save as ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'restaurantpack',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/your/app',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Environment Variables Location

Depending on your Hostinger setup, add variables to:

1. **Option A: .env.production file** (in project root)
   ```bash
   # Create .env.production
   nano .env.production
   # Paste all environment variables
   ```

2. **Option B: PM2 ecosystem file**
   ```javascript
   env: {
     NODE_ENV: 'production',
     NEXT_PUBLIC_WORDPRESS_URL: 'https://crm.restaurantpack.se',
     WORDPRESS_CONSUMER_KEY: 'ck_...',
     // ... all other variables
   }
   ```

3. **Option C: System environment** (in ~/.bashrc or /etc/environment)

---

## 🧪 Testing After Deployment

### 1. Test Health Endpoint
```bash
curl https://restaurantpack.se/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "nextjs": true,
    "wordpress": true,
    "woocommerce": true
  }
}
```

### 2. Test Shop Page
```bash
curl https://restaurantpack.se/shop
```

Should return HTML (not 404)

### 3. Test Product API
```bash
curl https://restaurantpack.se/api/products
```

Should return JSON with products

---

## 📞 Quick Diagnostic Commands

Run these on your VPS to diagnose issues:

```bash
# 1. Check if app is running
pm2 status

# 2. Check app logs
pm2 logs restaurantpack --lines 50

# 3. Check environment variables
pm2 env 0

# 4. Test WooCommerce connectivity
node scripts/hostinger-diagnostic.js

# 5. Check Nginx status
sudo systemctl status nginx

# 6. Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# 7. Restart everything
pm2 restart restaurantpack
sudo systemctl restart nginx
```

---

## 🔧 If Still Not Working

1. **SSH into your Hostinger VPS**
2. **Navigate to your app directory**
3. **Run the diagnostic script:**
   ```bash
   node scripts/hostinger-diagnostic.js
   ```
4. **Share the output** - it will tell us exactly what's wrong

---

## 📝 Next Steps After Fixing

Once products are loading:

1. ✅ Test all pages (home, shop, product pages, checkout)
2. ✅ Verify SSL certificate is working
3. ✅ Set up monitoring (PM2 monitoring or external service)
4. ✅ Configure automatic backups
5. ✅ Set up log rotation
6. ✅ Configure firewall rules
7. ✅ Enable caching (Redis/Nginx cache)

---

## 🆘 Emergency Rollback

If deployment is completely broken:

```bash
# Stop the app
pm2 stop restaurantpack

# Restore previous version (if you have git)
git checkout HEAD~1

# Rebuild
npm install
npm run build

# Restart
pm2 restart restaurantpack
```
