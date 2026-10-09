# restaurantpack.se — SEO Action Plan (2026-10-10)

## Critical (this week): unblocks indexing
1. **Turn caching back on.**
   - Remove `cache: 'no-store'` (marked "for debugging") in `lib/woocommerce/api.ts:97` and use `next: { revalidate: 3600 }`.
   - Remove `export const dynamic = 'force-dynamic'` from `app/[locale]/layout.tsx:21`.
   - Add on-demand revalidation (a WooCommerce webhook → `revalidateTag`) so price and stock edits show up straight away.
   - Target: `x-vercel-cache: HIT`, server response under 200 ms.
2. **Stop turning API errors into 404s.** In the product and category pages, call `notFound()` only when WooCommerce says the item doesn't exist. Rethrow other errors, so Google sees a 5xx and retries.
3. **Fix canonicals.**
   - Make them self-referencing on `/wholesale/register|quote|quick-order`, `/sv|no|da/shop/*` and `/sv|no|da/posts/*`.
   - Never fall back to `/` when data fails to load.
4. **Fix the sitemaps.**
   - Make `/sitemap.xml` a sitemap index → products, categories, pages and posts, with real `lastmod` values.
   - Remove `/sv/cart` and `/posts`.
   - In GSC: submit the index, and remove the stale `/no` and `/da` sitemaps.

## High (weeks 2–3)
5. **One category URL scheme.** Keep `/shop/category/<slug>` and 301 `/shop/<slug>` and `/product-category/<slug>` to it.
6. **Add hreflang** to every page type (shop, wholesale, about, contact, faq…). It's currently missing on 184 URLs.
7. **Fix the duplicate Product JSON-LD.**
   - Output one Product block, with the real manufacturer `brand`.
   - Add `shippingDetails` and `hasMerchantReturnPolicy`, then validate the Merchant listings fix in GSC.
8. **Fix titles.**
   - Remove the doubled "| Anmol Wholesale" and keep titles under 60 characters.
   - Translate category titles for sv/no/da.
9. **H1s:** remove the duplicate H1 (101 pages).
10. **Small redirects:**
    - Remove the self-looping `?add-to-cart` 308.
    - Redirect `/posts` to `/blog`.
    - Add the `www` DNS record with a 301 to the apex.
11. **Request indexing** in GSC for the top product and category URLs once items 1–4 are live, then watch Pages → "Discovered – not indexed".

## Medium (month 2): content and authority
12. **Expand thin category pages to 300–500 words.** Cover the buying guide, carton/pack sizes, delivery and pickup, and FAQ. Priority order: sugar, rice and basmati, flours, packaging and takeaway containers, dates.
13. **Expand thin product pages:** pappers-plant-kasse, skimmed milk powder, khanum ghee, köksrulle and dates.
14. **Swedish-first content:** Swedish is the market, so make sure the sv pages carry the strongest copy and get indexed (they mostly aren't today).
15. **Write blog posts for queries already showing impressions:** "indisk takeaway emballage", "granulated sugar 25kg grossist", "gram flour/besan grossist", "basmati ris grossist Stockholm", "tortilla supplier".
16. **Images:**
    - Add alt text (253 images are missing it).
    - Add `og:image` on the 82 pages without one.
17. **Add ItemList and BreadcrumbList schema** on category pages.

## Ongoing
- Re-run the crawl after deploy. Check: 0 random 404s, every page with an H1 and a self canonical, and cache HITs.
- Re-run PageSpeed (the quota was used up today) and watch CrUX once there's enough traffic.
- Check GSC weekly: indexed pages (now 46), impressions and the merchant listings report.
- Google Business Profile: confirm the address is **Fagerstagatan 11** and that it links to restaurantpack.se.
