# Hostinger Next.js SSR Configuration Guide

## Issue: Product and Shop Pages Return 404

### Root Cause
Hostinger might be serving your Next.js app as **static files** instead of running the **Next.js server**.

Your app requires **Server-Side Rendering (SSR)** because:
- Shop page fetches products on each request
- Product pages are dynamically generated
- API routes need Node.js runtime

---

## ✅ Correct Hostinger Configuration

### 1. Application Type
**Must be:** Node.js Application
**NOT:** Static Site Hosting

### 2. Build Command
```bash
npm run build
```

### 3. Start Command (CRITICAL)
```bash
npm run start
```

This runs `next start` which starts the production server.

### 4. Port Configuration
- Next.js runs on port **3000** by default
- Hostinger needs to proxy port 80/443 → 3000

---

## 🔍 Verify Your Setup

### Check 1: Is Next.js Server Running?

SSH into Hostinger and run:

```bash
# Check Node.js processes
ps aux | grep node

# Should show something like:
# node /path/to/app/.next/standalone/server.js
# OR
# npm run start
```

### Check 2: Is Port 3000 Listening?

```bash
netstat -tulpn | grep 3000

# Should show:
# tcp  0  0  0.0.0.0:3000  0.0.0.0:*  LISTEN  12345/node
```

### Check 3: Can You Access Locally?

From Hostinger SSH:

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/shop
```

All should return HTML/JSON, not 404.

---

## 🛠️ Fix: Proper Deployment Steps

### Option A: Using PM2 (Recommended)

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Start the app:**
   ```bash
   cd /path/to/your/app
   pm2 start npm --name "restaurantpack" -- start
   pm2 save
   pm2 startup
   ```

3. **Verify:**
   ```bash
   pm2 status
   pm2 logs restaurantpack
   ```

### Option B: Using Hostinger's Process Manager

If Hostinger has a built-in process manager:

1. **Set Start Command:**
   ```
   npm run start
   ```

2. **Set Working Directory:**
   ```
   /path/to/your/app
   ```

3. **Set Port:**
   ```
   3000
   ```

---

## 🌐 Nginx Configuration

Your Hostinger needs Nginx configured as reverse proxy:

```nginx
server {
    listen 80;
    server_name gray-tapir-760886.hostingersite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🧪 Testing After Configuration

### Test 1: Homepage
```bash
curl https://gray-tapir-760886.hostingersite.com/
```
Should return HTML

### Test 2: API Health
```bash
curl https://gray-tapir-760886.hostingersite.com/api/health
```
Should return JSON with `"woocommerce": true`

### Test 3: Shop Page
```bash
curl https://gray-tapir-760886.hostingersite.com/shop
```
Should return HTML with products

### Test 4: Product Page
```bash
curl https://gray-tapir-760886.hostingersite.com/product/rangkat-food-colour-powder-1kg
```
Should return HTML, not 404

---

## 📞 What to Check in Hostinger Dashboard

1. **Application Type:** Should say "Node.js" not "Static"
2. **Start Command:** Should be `npm run start` or `npm start`
3. **Build Command:** Should be `npm run build`
4. **Node Version:** 20.x or 22.x
5. **Port:** Should be proxied from 80/443 to 3000

---

## 🚨 Common Mistakes

### Mistake 1: Serving .next as Static Files
**Wrong:** Pointing web server directly to `.next` folder
**Right:** Running `npm start` and proxying to it

### Mistake 2: Using `next export`
**Wrong:** Adding `output: 'export'` to next.config.js
**Right:** Using default SSR mode

### Mistake 3: Not Starting the Server
**Wrong:** Just building and expecting it to work
**Right:** Build THEN start the server

---

## 💡 Quick Fix Commands

If nothing is working, try this sequence:

```bash
# 1. Stop any running processes
pm2 stop all
# OR
pkill -f node

# 2. Clean build
cd /path/to/your/app
rm -rf .next
rm -rf node_modules
npm install
npm run build

# 3. Start with PM2
pm2 start npm --name "restaurantpack" -- start

# 4. Check logs
pm2 logs restaurantpack

# 5. Test locally
curl http://localhost:3000/shop
```

---

## 📊 Expected vs Actual

### What SHOULD Happen:
1. ✅ Build creates `.next` folder with server files
2. ✅ `npm start` runs Next.js production server on port 3000
3. ✅ Nginx proxies requests to port 3000
4. ✅ Next.js handles routing and renders pages dynamically
5. ✅ All routes work (/shop, /product/*, /api/*)

### What's PROBABLY Happening:
1. ✅ Build succeeds
2. ❌ Server not started OR
3. ❌ Nginx serving static files instead of proxying OR
4. ❌ Port 3000 not accessible
5. ❌ Dynamic routes return 404

---

## 🎯 Action Items

1. **Verify Hostinger is configured as Node.js app** (not static)
2. **Ensure start command is set** to `npm run start`
3. **Check if Next.js server is running** (ps aux | grep node)
4. **Verify Nginx is proxying** to localhost:3000
5. **Test locally on the server** (curl localhost:3000/shop)

Share the results of these checks and we'll fix it! 🚀
