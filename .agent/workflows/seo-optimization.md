# SEO Optimization Workflow for Products
---
## Description
This workflow automates the generation of SEO‑friendly, 800‑word product descriptions and updates meta titles & descriptions for every product in WooCommerce. It leverages the existing OpenAI API key (already in `.env.local`) and the WooCommerce REST API.

## Prerequisites
1. **Environment Variables** (add to Hostinger/Local `.env.local`):
   ```bash
   # WooCommerce credentials (already present)
   WORDPRESS_URL=https://crm.restaurantpack.se
   WORDPRESS_CONSUMER_KEY=ck_...
   WORDPRESS_CONSUMER_SECRET=cs_...
   NEXT_PUBLIC_WORDPRESS_URL=https://crm.restaurantpack.se
   NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY=ck_...
   NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET=cs_...

   # OpenAI (already in brandcontext)
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_AI_ENABLED=true
   ```

2. **Node version 20+** (Hostinger already set).
3. **Install dependencies** (run once):
   ```bash
   npm i openai axios
   ```

## Steps
1. **Fetch all products** from WooCommerce (`GET /wp-json/wc/v3/products`).
2. **For each product**:
   - Build a prompt that includes:
     - Brand USPs (from `brandcontext.md`).
     - Product name, category, key attributes.
     - Desired length (800+ words).
     - Target audience (Swedish restaurants, cafés, bakeries, European B2B).
   - Call OpenAI `gpt‑4‑turbo` (or `gpt‑3.5‑turbo` for speed) to generate:
     - A **long description** (≥800 words) that weaves in the USPs, local delivery, competitive pricing, and the fact we manufacture the Electric Mini Tandoor where relevant.
     - An **SEO meta title** (≤60 characters) and **meta description** (≤160 characters) that include primary keywords like "wholesale basmati rice Stockholm", "restaurant supply Sweden", etc.
   - **Update the product** via WooCommerce `PUT /wp-json/wc/v3/products/{id}` with the new `description`, `meta_data` fields for `seo_title` and `seo_description` (or use standard `meta` fields if your theme reads them).
3. **Log results** to `seo‑run‑log.json` for audit.
4. **Optional**: Re‑run automatically via a cron job on Hostinger (`0 2 * * * npm run seo-optimize`).

## Implementation
- Add a new script `scripts/seo-optimize-products.ts` (see below).
- Add a npm script entry in `package.json`:
  ```json
  "scripts": {
    "seo-optimize": "ts-node scripts/seo-optimize-products.ts"
  }
  ```
- Create a tiny helper `lib/seo.ts` to build the prompt and parse the response.

---
## How to Run
```bash
# Local dev
npm run seo-optimize

# Production (Hostinger)
# Add a cron entry in Hostinger > Cron Jobs:
# 0 2 * * * cd /home/username/restaurantpack.se && npm run seo-optimize >> /home/username/seo.log 2>&1
```

---
## Safety Checks
- The script **never overwrites** a product description if it already exceeds 500 words (to avoid losing handcrafted copy).
- It validates that the OpenAI key is present before making any request.
- All API calls are wrapped in try/catch and logged.

---
## Next Steps
- Review a few generated descriptions manually before bulk‑run.
- Adjust the prompt in `lib/seo.ts` if you want a different tone (e.g., more formal vs. friendly).
- Extend the script to also generate **structured data** (`ProductSchema`) for richer SERP snippets.

---
**End of Workflow**
