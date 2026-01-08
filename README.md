# Fourlines Grocery Template

A production-ready, feature-rich headless WooCommerce grocery store template built with Next.js 15, TypeScript, and Tailwind CSS. Includes Stripe payments, WhatsApp integration, AI-powered features, and comprehensive e-commerce functionality.

**Built by [Fourlines Agency](https://fourlinesagency.com)**

---

## 🚀 Features

### Core E-commerce
- ✅ **WooCommerce Integration** - Full REST API integration with product catalog, cart, and checkout
- ✅ **Stripe Payments** - Complete payment processing with Apple Pay, Google Pay, Klarna support
- ✅ **Smart Shopping Cart** - Persistent cart with local storage and real-time updates
- ✅ **Product Variations** - Full support for variable products with attribute selection
- ✅ **Wishlist System** - Save products for later with persistent storage
- ✅ **Product Search & Filters** - Advanced filtering by category, price, dietary options
- ✅ **Customer Accounts** - User authentication with JWT and order history

### Advanced Features
- 🤖 **AI Shopping Assistant** - Intelligent chatbot for product recommendations
- 📱 **WhatsApp Integration** - Direct ordering via WhatsApp with Stripe payment links
- 🚚 **Advanced Shipping** - Multiple shipping methods, zones, and real-time calculation
- 📊 **Analytics Ready** - Google Tag Manager, Facebook Pixel, Vercel Analytics
- 🌍 **Multi-Region Support** - Configurable delivery zones and international shipping
- 🎨 **4 Theme Presets** - Pre-configured color schemes (easily customizable)
- 🔍 **SEO Optimized** - Dynamic sitemaps, schema markup, OpenGraph tags

### Developer Experience
- ⚡ **Next.js 15** - Latest features including React Server Components
- 📘 **TypeScript** - Fully typed for better development experience
- 🎨 **Tailwind CSS** - Utility-first styling with custom theme system
- 🧩 **Radix UI** - Accessible component primitives
- 📦 **Modular Architecture** - Clean separation of concerns with config files

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18.17+** installed
- **WordPress site** with WooCommerce installed
- **WooCommerce REST API** credentials (Consumer Key & Secret)
- **Stripe account** (for payments)
- Basic knowledge of Next.js and React

---

## 🛠️ Installation

### 1. Clone or Download

```bash
# If using git
git clone https://github.com/yourusername/fourlines-grocery-template.git
cd fourlines-grocery-template

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_URL="https://your-wordpress-site.com"
NEXT_PUBLIC_WORDPRESS_API_URL="https://your-wordpress-site.com/wp-json"
WORDPRESS_API_URL="https://your-wordpress-site.com/wp-json"

# WooCommerce REST API Credentials
WORDPRESS_CONSUMER_KEY="ck_xxxxxxxxxxxxx"
WORDPRESS_CONSUMER_SECRET="cs_xxxxxxxxxxxxx"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxx"

# Email Configuration
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
ADMIN_EMAIL="admin@yourdomain.com"
```

### 4. Configure Your Brand

Update the configuration files in `/config`:

**`config/brand.config.ts`** - Main branding:
```typescript
export const brandConfig = {
  businessName: "Your Store Name",
  tagline: "Your Tagline",
  contact: {
    phone: "+1234567890",
    email: "hello@yourstore.com",
    // ...
  },
  // ...
}
```

**`config/brand-profile.ts`** - Detailed business info
**`config/content.config.ts`** - Page content and copy
**`config/theme.config.ts`** - Colors and styling
**`site.config.ts`** - Site metadata

### 5. Update Image Domains

In `next.config.js`, add your WordPress domain for remote images:

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'your-wordpress-domain.com',
    pathname: '/wp-content/uploads/**',
  },
],
```

### 6. Add Your Logo

Replace the logo reference in `components/layout/header.tsx`:

```typescript
const logoUrl = '/logo.png'; // Place your logo in /public folder
// Or use a remote URL from your WordPress uploads
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 WordPress Setup

### Required WordPress Plugins

1. **WooCommerce** - Core e-commerce functionality
2. **WooCommerce REST API** - Enable REST API in WooCommerce settings
3. **Simple JWT Login** (Optional) - For customer authentication
4. **Fourlines MCP Pro** (Included in `/fourlines-mcp-pro`) - Enhanced shipping features

### WooCommerce Configuration

1. **Enable REST API:**
   - Go to WooCommerce → Settings → Advanced → REST API
   - Add key, select Read/Write permissions
   - Copy the Consumer Key and Secret to `.env.local`

2. **Configure Shipping Zones:**
   - Go to WooCommerce → Settings → Shipping
   - Set up your shipping zones and methods

3. **Set Up Payment Gateways:**
   - Configure Stripe or other payment methods
   - The template supports Stripe, but you can enable others

### Installing Fourlines MCP Pro Plugin

1. Copy the `/fourlines-mcp-pro` folder to your WordPress `wp-content/plugins/` directory
2. Activate the plugin in WordPress Admin → Plugins
3. Generate an API key in plugin settings
4. Add the key to your `.env.local` as `FOURLINES_MCP_KEY`

---

## 🎨 Customization

### Theme Colors

Edit `config/theme.config.ts` to change colors:

```typescript
export const themes = {
  default: {
    primary: "142 76 87",    // Main brand color
    secondary: "217 83 79",  // Accent color
    // ...
  }
}
```

The template includes 4 pre-configured themes: Default, Emerald, Ocean, and Sunset.

### Content Customization

All page content is centralized in `config/content.config.ts`. Update text for:
- Homepage hero section
- About page content
- Contact page
- Footer content
- Common phrases

### Layout Customization

Key layout files:
- `components/layout/header.tsx` - Header/navigation
- `components/layout/footer.tsx` - Footer
- `app/layout.tsx` - Root layout with metadata

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Update these in your hosting platform:
- Change Stripe keys to live keys (pk_live_xxx, sk_live_xxx)
- Update `NEXT_PUBLIC_SITE_URL` to your production domain
- Set `NODE_ENV=production`

### Build Locally

```bash
npm run build
npm run start
```

---

## 📚 Project Structure

```
fourlines-grocery-template/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Shop pages group
│   ├── api/                      # API routes
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── ai/                      # AI assistant
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout flow
│   ├── layout/                  # Layout components
│   ├── shop/                    # Product displays
│   └── ui/                      # Reusable UI components
├── config/                       # Configuration files ⭐
│   ├── brand.config.ts          # Brand identity
│   ├── brand-profile.ts         # Business details
│   ├── content.config.ts        # Page content
│   ├── theme.config.ts          # Theme colors
│   └── commerce-rules.ts        # Business logic
├── lib/                          # Utility libraries
│   ├── woocommerce/             # WooCommerce API
│   ├── whatsapp/                # WhatsApp integration
│   └── schema/                  # SEO schemas
├── store/                        # State management (Zustand)
├── fourlines-mcp-pro/           # WordPress plugin
├── public/                       # Static assets
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 🔌 API Endpoints

The template includes these API routes:

### Stripe
- `POST /api/stripe/create-payment-intent` - Create payment
- `GET /api/stripe/config` - Get publishable key

### Products & Orders
- `GET /api/products` - Search/filter products
- `POST /api/orders` - Create order
- `GET /api/orders/[orderId]` - Get order details

### Shipping
- `POST /api/shipping/calculate` - Calculate shipping cost
- `GET /api/shipping/methods` - Available methods

### SEO
- `GET /api/sitemap` - Dynamic sitemap
- `GET /api/feed` - RSS feed

---

## 🤝 Support

For questions or issues:
- 📧 Email: hello@fourlinesagency.com
- 🌐 Website: [fourlinesagency.com](https://fourlinesagency.com)
- 📖 Documentation: Check `/docs` folder (coming soon)

---

## 📄 License

MIT License - Feel free to use this template for your projects.

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**Made with ❤️ by [Fourlines Agency](https://fourlinesagency.com)**
