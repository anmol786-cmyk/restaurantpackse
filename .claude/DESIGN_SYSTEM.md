# Anmol Wholesale Design System
## Royal Heritage Theme for Restaurant Pack B2B Platform

**Version:** 2.0
**Last Updated:** January 30, 2026
**Theme Name:** Royal Heritage

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Utility Classes](#utility-classes)
7. [Usage Guidelines](#usage-guidelines)

---

## Brand Identity

### Brand Values
- **Premium** - Luxury wholesale experience
- **Trustworthy** - Professional B2B reliability
- **Authentic** - Indo-Pak culinary heritage
- **Partner-Oriented** - Collaborative business relationships

### Visual Personality
The Royal Heritage theme combines:
- Deep **Burgundy** for royalty, tradition, and premium quality
- Rich **Gold** for luxury, celebration, and calls-to-action
- Warm **Neutrals** for elegance and readability

---

## Color System

### Primary Colors

#### Burgundy (Primary)
The main brand color representing royalty, trust, and premium quality.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--primary-50` | 343 100% 97% | #fef2f4 | Subtle backgrounds |
| `--primary-100` | 343 96% 93% | #fce7eb | Light highlights |
| `--primary-200` | 343 94% 85% | #f9cdd6 | Borders, dividers |
| `--primary-300` | 343 90% 72% | #f299b1 | Hover states |
| `--primary-400` | 343 85% 55% | #e54573 | Active states |
| `--primary-500` | **343 79% 35%** | **#9f1239** | **Main primary** |
| `--primary-600` | 343 85% 30% | #881337 | Pressed states |
| `--primary-700` | 343 90% 25% | #6b0f2c | Dark accents |
| `--primary-800` | 343 92% 20% | #560c23 | Very dark |
| `--primary-900` | 343 94% 15% | #41091a | Headings on light |
| `--primary-950` | 343 96% 10% | #2b0611 | Darkest |

**Tailwind Usage:**
```html
<div class="bg-primary text-primary-foreground">Primary button</div>
<div class="bg-primary-100 text-primary-900">Light card</div>
<div class="border-primary-300">Subtle border</div>
```

#### Gold (Accent)
The accent color for CTAs, highlights, and premium features.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--gold-50` | 48 100% 96% | #fefce8 | Light gold tint |
| `--gold-100` | 48 96% 89% | #fef9c3 | Subtle backgrounds |
| `--gold-200` | 48 97% 77% | #fef08a | Light highlights |
| `--gold-300` | 46 97% 65% | #fde047 | Borders |
| `--gold-400` | 43 96% 56% | #facc15 | Hover states |
| `--gold-500` | **45 93% 47%** | **#eab308** | **Main gold** |
| `--gold-600` | 38 92% 40% | #ca8a04 | Pressed states |
| `--gold-700` | 32 81% 33% | #a16207 | Deep gold |
| `--gold-800` | 26 83% 27% | #854d0e | Bronze |
| `--gold-900` | 23 78% 23% | #713f12 | Dark bronze |
| `--gold-950` | 26 83% 14% | #422006 | Darkest |

**Tailwind Usage:**
```html
<button class="bg-accent text-accent-foreground">Get Quote</button>
<span class="text-gold-500">Wholesale Price</span>
<div class="border-gold-300 bg-gold-50">Discount highlight</div>
```

### Semantic Colors

| Token | HSL | Usage |
|-------|-----|-------|
| `--success` | 160 84% 39% | Order completed, payment success |
| `--warning` | 38 92% 50% | Pending orders, low stock |
| `--info` | 199 89% 48% | Information, processing |
| `--destructive` | 0 84% 60% | Errors, cancellations |

### Neutral Colors

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | 30 20% 98% | Page background (warm off-white) |
| `--foreground` | 24 10% 10% | Primary text |
| `--card` | 0 0% 100% | Card backgrounds |
| `--muted` | 30 10% 96% | Muted backgrounds |
| `--muted-foreground` | 25 5% 45% | Secondary text |
| `--border` | 30 10% 90% | Borders and dividers |

---

## Typography

### Font Families

| Purpose | Font | Variable | Tailwind |
|---------|------|----------|----------|
| **Headings** | Plus Jakarta Sans | `--font-heading` | `font-heading` |
| **Body** | Inter | `--font-sans` | `font-sans` |

### Type Scale

#### Headings

| Element | Size | Weight | Line Height | Class |
|---------|------|--------|-------------|-------|
| H1 | 50px | 800 | 1.2 | `.h1` |
| H2 | 40px | 700 | 1.2 | `.h2` |
| H3 | 25px | 700 | 1.3 | `.h3` |
| H4 | 25px | 600 | 1.3 | `.h4` |
| H5 | 19px | 500 | 1.5 | `.h5` |
| H6 | 18px | 500 | 1.5 | `.h6` |

#### Body Text

| Name | Size | Weight | Class |
|------|------|--------|-------|
| Body XL | 17px | 400 | `.body-xl` |
| Body | 16px | 400 | `.body` or `p` |
| Body SM | 14px | 400 | `.body-sm` |
| Caption | 13.5px | 400 | `.caption` |
| Overline | 12px | 500 | `.overline` |

### Usage Examples

```html
<!-- Page Title -->
<h1 class="font-heading text-primary">Wholesale Products</h1>

<!-- Section Title -->
<h2 class="section-title">Featured Categories</h2>

<!-- Body Text -->
<p class="body-text">High-quality ingredients for professional kitchens.</p>

<!-- Labels -->
<span class="overline text-accent">Wholesale Price</span>
```

---

## Spacing & Layout

### Container

```css
.site-container {
  max-width: 1400px;
  padding: 16px (mobile) → 24px (tablet) → 32px (desktop);
  margin: 0 auto;
}
```

### Section Spacing

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `.page-section` | 32px | 48px | - |
| `.page-section-tight` | 24px | 32px | - |
| `.page-section-spacious` | 48px | 64px | - |
| `.site-section-padding` | 48px | 64px | 80px |

### Grid Layouts

```html
<!-- 2 Column Grid -->
<div class="grid-2">...</div>

<!-- 3 Column Grid -->
<div class="grid-3">...</div>

<!-- 4 Column Grid -->
<div class="grid-4">...</div>
```

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.75rem (12px) | Default radius |
| `rounded-sm` | 4px | Small elements |
| `rounded-md` | 6px | Inputs, small cards |
| `rounded-lg` | 8px | Cards, modals |
| `rounded-xl` | 12px | Large cards |
| `rounded-2xl` | 16px | Hero sections |

---

## Components

### Buttons

#### Primary Button (Burgundy)
```html
<button class="btn-primary">Add to Cart</button>
<button class="btn-primary btn-sm">Small Button</button>
<button class="btn-primary btn-lg">Large Button</button>
```

#### Gold/Accent Button
Use for special B2B actions: quotes, credit applications, wholesale signup.
```html
<button class="btn-gold">Request Quote</button>
<button class="btn-gold">Apply for Credit</button>
```

#### Secondary Button (Outline)
```html
<button class="btn-secondary">Learn More</button>
```

#### Ghost Button
```html
<button class="btn-ghost">Cancel</button>
```

### Cards

```html
<!-- Standard Card -->
<div class="card-base card-padding">
  <h3 class="card-title">Product Name</h3>
  <p class="body-text-sm">Description here</p>
</div>

<!-- Interactive Card (with hover) -->
<div class="card-interactive card-padding">
  ...
</div>

<!-- Stat Card (Dashboard) -->
<div class="stat-card">
  <span class="stat-value">1,234</span>
  <span class="stat-label">Total Orders</span>
  <span class="stat-change-positive">+12% from last month</span>
</div>
```

### Badges

```html
<!-- Standard Badges -->
<span class="badge-primary">B2B</span>
<span class="badge-muted">Standard</span>
<span class="badge-highlight">Featured</span>

<!-- Gold Badge (Premium/Wholesale) -->
<span class="badge-gold">Wholesale Price</span>

<!-- Status Badges -->
<span class="badge-success">In Stock</span>
<span class="badge-warning">Low Stock</span>
<span class="badge-info">Processing</span>
```

### Order Status Badges

```html
<span class="order-status-pending">Pending</span>
<span class="order-status-processing">Processing</span>
<span class="order-status-completed">Completed</span>
<span class="order-status-cancelled">Cancelled</span>
```

### Credit Status Indicators

```html
<div class="credit-status-good">
  <span>Credit Available: 50,000 kr</span>
</div>
<div class="credit-status-warning">
  <span>Credit Low: 5,000 kr</span>
</div>
<div class="credit-status-danger">
  <span>Credit Exhausted</span>
</div>
```

### Pricing Display

```html
<!-- Wholesale Price -->
<div>
  <span class="wholesale-price-label">Wholesale Price</span>
  <span class="wholesale-price">299 kr</span>
</div>

<!-- Standard Price Classes -->
<span class="price-large">1,299 kr</span>
<span class="price-medium">299 kr</span>
<span class="price-small">99 kr</span>
```

### Tier Pricing Table

```html
<div class="rounded-lg border border-border overflow-hidden">
  <div class="tier-price-row">
    <span>1-9 units</span>
    <span class="font-bold">100 kr/unit</span>
  </div>
  <div class="tier-price-row active">
    <span>10-49 units</span>
    <span class="font-bold text-accent">90 kr/unit</span>
  </div>
  <div class="tier-price-row">
    <span>50+ units</span>
    <span class="font-bold">80 kr/unit</span>
  </div>
</div>
```

### Forms

```html
<div class="space-y-4">
  <div>
    <label class="form-label">Company Name *</label>
    <input type="text" class="form-input" placeholder="Enter company name" />
    <p class="form-helper">Legal business name for invoicing</p>
  </div>

  <div>
    <label class="form-label">VAT Number *</label>
    <input type="text" class="form-input-error" />
    <p class="form-error">Invalid VAT number format</p>
  </div>
</div>
```

---

## Utility Classes

### Text Utilities

| Class | Description |
|-------|-------------|
| `.text-gold` | Gold accent color |
| `.text-gradient-royal` | Burgundy to gold gradient |
| `.text-gradient-primary` | Primary color |

### Layout Utilities

| Class | Description |
|-------|-------------|
| `.site-container` | Max-width container with responsive padding |
| `.site-section-padding` | Vertical section padding |
| `.section-gap` | Bottom margin for sections |
| `.section-header-gap` | Bottom margin for section headers |
| `.content-gap` | Standard content margin |

### Typography Utilities

| Class | Description |
|-------|-------------|
| `.page-title` | H1 for static pages |
| `.section-title` | H2 for sections |
| `.subsection-title` | H3 for subsections |
| `.card-title` | H4 for cards |
| `.body-text` | Standard body (16px) |
| `.body-text-sm` | Small body (14px) |
| `.label-text` | Uppercase labels |

### Dividers

```html
<div class="section-divider"></div>    <!-- 12px wide, 2px tall -->
<div class="section-divider-lg"></div> <!-- 16px wide, 4px tall -->
```

---

## Usage Guidelines

### Color Usage

1. **Primary (Burgundy)** - Use for:
   - Main navigation elements
   - Primary buttons (Add to Cart, Checkout)
   - Links and interactive elements
   - Section headings
   - Brand emphasis

2. **Accent (Gold)** - Use for:
   - Special CTAs (Request Quote, Apply for Credit)
   - Wholesale/discount highlights
   - Premium features
   - Success states related to savings
   - Badge highlights

3. **Neutrals** - Use for:
   - Body text (foreground)
   - Secondary text (muted-foreground)
   - Backgrounds and cards
   - Borders and dividers

### Button Hierarchy

1. **btn-primary** - Main action per page (Add to Cart, Checkout, Submit)
2. **btn-gold** - Special B2B actions (Get Quote, Apply Credit, Contact Sales)
3. **btn-secondary** - Secondary actions (Learn More, View Details)
4. **btn-ghost** - Tertiary actions (Cancel, Back)

### Card Backgrounds

- Cards should use `bg-card` (white) to stand out from `bg-background` (warm off-white)
- Use `card-base` for standard cards with subtle shadow
- Use `card-interactive` for clickable cards with hover effects

### Responsive Typography

- Headings scale down on mobile (see Tailwind responsive classes)
- Body text remains consistent (16px) for readability
- Use `md:` and `lg:` prefixes for responsive adjustments

### Dark Mode

The theme supports dark mode with adjusted colors:
- Background becomes warm dark gray
- Primary lightens slightly for contrast
- Gold remains bright for CTAs

---

## File References

| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables and utility classes |
| `tailwind.config.ts` | Tailwind theme extension |
| `app/layout.tsx` | Font configuration |
| `config/theme.config.ts` | Theme object definitions |
| `config/brand.config.ts` | Brand configuration |

---

## Quick Reference Card

```
COLORS
Primary:  bg-primary      text-primary      #9f1239 (Burgundy)
Gold:     bg-accent       text-accent       #eab308 (Gold)
          bg-gold-500     text-gold-500

BUTTONS
Primary:  btn-primary     btn-primary btn-sm     btn-primary btn-lg
Gold:     btn-gold        btn-gold btn-sm        btn-gold btn-lg
Outline:  btn-secondary
Ghost:    btn-ghost

BADGES
badge-primary   badge-gold   badge-success   badge-warning   badge-info

STATUS
order-status-pending   order-status-processing   order-status-completed
credit-status-good     credit-status-warning     credit-status-danger

TYPOGRAPHY
font-heading (Plus Jakarta Sans)   font-sans (Inter)
page-title   section-title   card-title   body-text   body-text-sm

CARDS
card-base   card-interactive   card-padding   card-padding-sm   card-padding-lg
stat-card   stat-value   stat-label
```

---

*Design System for Anmol Wholesale - Restaurant Pack*
*Royal Heritage Theme v2.0*
