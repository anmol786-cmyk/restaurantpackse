# WooCommerce API Connection Troubleshooting

## Current Status
❌ **WooCommerce API: NOT CONNECTED**
✅ WordPress API: Connected
✅ Next.js: Running

## Issue Identified
The health check shows `"woocommerce": false`, which means the WooCommerce REST API authentication is failing.

---

## Immediate Actions Required

### Step 1: Deploy the Diagnostic Endpoint

1. **Commit and push the new diagnostic endpoint:**
   ```bash
   git add .
   git commit -m "Add WooCommerce diagnostic endpoint"
   git push
   ```

2. **On Hostinger, pull and rebuild:**
   ```bash
   cd /path/to/your/app
   git pull
   npm run build
   pm2 restart restaurantpack
   ```

3. **Access the diagnostic endpoint:**
   ```
   https://gray-tapir-760886.hostingersite.com/api/diagnostic/woocommerce
   ```

   This will show you EXACTLY what's wrong with detailed error messages.

---

## Step 2: Verify WooCommerce Credentials

Based on your screenshot, I saw:
- `WORDPRESS_CONSUMER_KEY`: `ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f`
- `WORDPRESS_CONSUMER_SECRET`: `cs_cc8b959ab1b48a49778127dc13ae660b82b021a7`

### Verify these credentials work:

**Test from your local machine:**
```bash
curl -u "ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f:cs_cc8b959ab1b48a49778127dc13ae660b82b021a7" \
  "https://crm.restaurantpack.se/wp-json/wc/v3/products?per_page=1"
```

**Expected:** JSON response with products
**If error:** The credentials are wrong or WooCommerce API is disabled

---

## Step 3: Check WooCommerce Backend Settings

Log into your WordPress admin at `https://crm.restaurantpack.se/wp-admin`

### Verify WooCommerce REST API is enabled:

1. **Go to:** WooCommerce → Settings → Advanced → REST API
2. **Check:** REST API is enabled
3. **Verify:** Your API keys exist and are active
4. **Permissions:** Should be "Read/Write"

### Check if API keys are correct:

1. Go to WooCommerce → Settings → Advanced → REST API
2. Find your API key (should show last 7 characters)
3. Compare with what you have in Hostinger environment variables
4. If different, regenerate and update Hostinger

---

## Common Causes & Solutions

### Cause 1: Wrong Credentials
**Symptoms:** 401 Unauthorized error
**Solution:** 
- Regenerate API keys in WooCommerce
- Update Hostinger environment variables
- Rebuild app

### Cause 2: Special Characters in Credentials
**Symptoms:** Authentication fails silently
**Solution:**
- Check if consumer secret has special characters
- Ensure they're properly escaped in environment variables
- No quotes around the values in Hostinger

### Cause 3: WooCommerce API Disabled
**Symptoms:** 404 or 403 errors
**Solution:**
- Enable REST API in WooCommerce settings
- Check if any security plugin is blocking API access

### Cause 4: IP Blocking / Firewall
**Symptoms:** Connection timeout or 403
**Solution:**
- Check if Hostinger IP is blocked
- Whitelist Hostinger VPS IP in WordPress security settings
- Check Cloudflare or other firewall settings

### Cause 5: SSL Certificate Issues
**Symptoms:** SSL verification errors
**Solution:**
- Ensure `crm.restaurantpack.se` has valid SSL
- Check if SSL is properly configured

---

## Diagnostic Checklist

Run these tests and share results:

### Test 1: Direct API Call from VPS
SSH into Hostinger and run:
```bash
curl -u "ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f:cs_cc8b959ab1b48a49778127dc13ae660b82b021a7" \
  "https://crm.restaurantpack.se/wp-json/wc/v3/products?per_page=1"
```

**Share the output**

### Test 2: Check Environment Variables on VPS
```bash
node -e "console.log('KEY:', process.env.WORDPRESS_CONSUMER_KEY); console.log('SECRET:', process.env.WORDPRESS_CONSUMER_SECRET);"
```

**Share if they're showing correctly**

### Test 3: Access Diagnostic Endpoint
```
https://gray-tapir-760886.hostingersite.com/api/diagnostic/woocommerce
```

**Share the JSON response**

---

## Quick Fix Attempts

### Attempt 1: Regenerate WooCommerce API Keys

1. **In WordPress Admin:**
   - WooCommerce → Settings → Advanced → REST API
   - Click "Add key"
   - Description: "Hostinger VPS"
   - User: Select admin user
   - Permissions: Read/Write
   - Click "Generate API key"

2. **Copy the new keys and update Hostinger environment variables:**
   - `WORDPRESS_CONSUMER_KEY`: (new consumer key)
   - `WORDPRESS_CONSUMER_SECRET`: (new consumer secret)

3. **Rebuild:**
   ```bash
   npm run build
   pm2 restart restaurantpack
   ```

### Attempt 2: Check for Typos

Double-check in Hostinger environment variables:
- No extra spaces before/after the keys
- No quotes around the values
- Exact copy-paste from WooCommerce (no manual typing)

### Attempt 3: Test with Basic WordPress Plugin

Install "WP REST API Authentication" plugin to see if it helps with API access.

---

## Next Steps

1. ✅ Deploy the diagnostic endpoint
2. ✅ Access it and share the output
3. ✅ Test the curl command from VPS
4. Based on the diagnostic output, we'll know exactly what to fix

The diagnostic endpoint will tell us:
- ✅ If environment variables are set
- ✅ Exact error message from WooCommerce
- ✅ Response status code
- ✅ Whether it's auth issue, network issue, or config issue

---

## Expected Diagnostic Output

**If credentials are wrong:**
```json
{
  "status": "❌ FAILED",
  "checks": {
    "response": {
      "status": 401,
      "statusText": "Unauthorized"
    }
  }
}
```

**If WooCommerce API is disabled:**
```json
{
  "status": "❌ FAILED",
  "checks": {
    "response": {
      "status": 404,
      "statusText": "Not Found"
    }
  }
}
```

**If working correctly:**
```json
{
  "status": "✅ SUCCESS",
  "checks": {
    "response": {
      "status": 200,
      "ok": true
    },
    "data": {
      "productsReturned": 1
    }
  }
}
```

Share the diagnostic output and we'll fix this immediately! 🎯
