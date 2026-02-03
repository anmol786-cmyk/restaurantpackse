# SEO Analysis Report - RestaurantPack.se

**Report Date:** February 4, 2026
**Analysis Period:** January 26 - February 1, 2026 (7 days)
**Status:** CRITICAL - Immediate Action Required

---

## Executive Summary

The website is performing **extremely poorly** in search with **ZERO clicks** over the past 7 days despite having 43 impressions. The average search position is **15-20**, meaning the site appears on **page 2 of Google** or lower for most queries. The target market (Sweden) has minimal visibility.

### Key Metrics (Last 7 Days)

| Metric | Value | Status |
|--------|-------|--------|
| Total Clicks | **0** | CRITICAL |
| Total Impressions | 43 | Very Low |
| Click-Through Rate | 0% | CRITICAL |
| Average Position | 16.5 | Poor (Page 2) |
| Sweden Impressions | 8 | Very Low |
| Sweden Position | 19.12 | Poor |

---

## Critical Issues Identified

### 1. Zero Click-Through Rate
**Severity: CRITICAL**

Despite 43 impressions, the site received zero clicks. This indicates:
- Titles and descriptions are not compelling
- Positions are too low (page 2+) for visibility
- Search snippets don't match user intent

### 2. Poor Search Positions

| Page | Position | Issue |
|------|----------|-------|
| Homepage | 10.56 | Page 2 |
| Mini Electric Tandoor | 29.7 | Page 3 |
| Nordic Sugar 25kg | 7.88 | Good but no clicks |
| Ocean Pearl Basmati Rice | 16.29 | Page 2 |

### 3. Minimal Target Market Visibility

Sweden (your target market) stats:
- Only **8 impressions** (18% of total)
- Average position: **19.12** (page 2)
- Zero clicks

Most impressions are from irrelevant countries (Indonesia, Egypt, Malaysia).

### 4. Extremely Limited Query Coverage

Only **6 queries** are triggering impressions:

| Query | Position | Issue |
|-------|----------|-------|
| mini tandoor oven | 1 | Good position, no click |
| restaurant suppliers near me | 22 | Too low |
| anmol sweets stockholm | 26 | Too low |
| bulk pantry staples | 60 | Page 6! |
| electric tandoor | 65 | Page 7! |
| tandoor oven | 88 | Page 9! |

**Missing high-value queries:**
- "restaurang grossist stockholm" (restaurant wholesaler Stockholm)
- "indiska kryddor grossist" (Indian spices wholesale)
- "storköksvaror" (commercial kitchen supplies)
- "halal kött grossist" (halal meat wholesale)
- "basmati ris grossist" (basmati rice wholesale)

---

## Technical SEO Issues

### 1. Missing Google Search Console Verification
```typescript
// In app/layout.tsx - Currently COMMENTED OUT:
// verification: {
//   google: "YOUR_GOOGLE_VERIFICATION_CODE",
// },
```
**Fix:** Add Google Search Console verification code.

### 2. Wrong OpenGraph Locale
```typescript
// Current:
locale: "en_US"

// Should be:
locale: "sv_SE"
```

### 3. Missing Canonical URLs on Product Pages
Product pages don't include canonical URLs in metadata, leading to potential duplicate content issues.

### 4. Thin Meta Descriptions
Product descriptions are pulled from `short_description` which may be:
- Empty
- Too short (<100 characters)
- Not keyword-optimized

### 5. No Swedish Language Keywords
The site targets Sweden but uses primarily English content. Swedish-language keywords are essential for local SEO.

### 6. Missing Local Business Schema
No `LocalBusiness` schema for Stockholm location, missing:
- Opening hours
- Service area
- Local phone number format

---

## Device Performance

| Device | Impressions | Position |
|--------|-------------|----------|
| Desktop | 31 (72%) | 18.94 |
| Mobile | 12 (28%) | 10.25 |

Mobile positions are better but still no clicks. Mobile optimization may be affecting rankings.

---

## Competitor Analysis Needed

The queries "electric tandoor" (position 65) and "tandoor oven" (position 88) show major competitors are dominating these terms. Need to analyze:
- Who ranks on page 1 for these terms?
- What content do they have?
- What's their backlink profile?

---

## Recommended Actions

### Immediate (Week 1)

1. **Add Google Search Console Verification**
   ```typescript
   verification: {
     google: "YOUR_VERIFICATION_CODE",
   },
   ```

2. **Fix OpenGraph Locale**
   ```typescript
   locale: "sv_SE"
   ```

3. **Add Canonical URLs to Product Pages**
   ```typescript
   alternates: {
     canonical: `https://restaurantpack.se/product/${slug}`,
   },
   ```

4. **Optimize Homepage Title & Description**
   - Current: "Anmol Wholesale | Professional Restaurant Supply Stockholm"
   - Suggested: "Restaurang Grossist Stockholm | Anmol Wholesale | Indo-Pak Ingredienser & Utrustning"

### Short-term (Weeks 2-4)

5. **Create Swedish-Language Content**
   - Product descriptions in Swedish
   - Category pages with Swedish keywords
   - Blog posts targeting Swedish queries

6. **Optimize Product Pages for Key Terms**
   - "Mini Electric Tandoor" → Add Swedish: "Elektrisk Mini Tandoor"
   - Add FAQ schema to product pages
   - Include long-tail keywords in descriptions

7. **Build Local SEO Presence**
   - Google Business Profile optimization
   - Local citations (Eniro, Hitta.se)
   - Stockholm-focused landing page

8. **Improve Meta Descriptions**
   - Ensure all products have 150-160 character descriptions
   - Include call-to-action ("Köp nu", "Beställ idag")
   - Include price or discount mentions

### Medium-term (Months 2-3)

9. **Content Marketing Strategy**
   - Create guides: "Hur man väljer rätt grossist för din restaurang"
   - Recipe content using your products
   - Comparison articles: "Elektrisk Tandoor vs Traditionell"

10. **Technical Improvements**
    - Implement hreflang tags for Swedish/English
    - Add FAQ schema to key pages
    - Implement review/rating schema

11. **Backlink Building**
    - Partner with Swedish food bloggers
    - Restaurant industry directories
    - Local business associations

---

## Tracking & Measurement

### KPIs to Monitor Weekly:

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|---------------|---------------|
| Impressions | 43/week | 500/week | 2,000/week |
| Clicks | 0 | 25 | 150 |
| CTR | 0% | 5% | 7.5% |
| Avg Position | 16.5 | 12 | 8 |
| Sweden Impressions | 8 | 300 | 1,500 |

### Priority Keywords to Track:

**Swedish (Primary):**
- restaurang grossist stockholm
- indiska kryddor grossist
- storköksvaror grossist
- basmati ris storpack
- halal kött stockholm

**English (Secondary):**
- electric tandoor sweden
- restaurant supplies stockholm
- indian grocery wholesale

---

## Implementation Priority Matrix

| Action | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Google verification | High | Low | P0 |
| Fix locale/canonical | High | Low | P0 |
| Swedish meta content | High | Medium | P1 |
| Product page optimization | High | Medium | P1 |
| Local SEO setup | High | Medium | P1 |
| Blog content | Medium | High | P2 |
| Backlink building | High | High | P2 |

---

## Conclusion

The site has fundamental SEO issues preventing any organic traffic. The immediate focus should be:

1. **Fix technical issues** (verification, locale, canonicals)
2. **Optimize for Swedish market** (Swedish keywords, local SEO)
3. **Improve content quality** (better descriptions, more pages)
4. **Build authority** (backlinks, content marketing)

Without these changes, the site will continue to receive zero organic traffic despite having a functional e-commerce platform.

---

*Report generated by SEO Analysis Tool*
*Next review scheduled: February 11, 2026*
