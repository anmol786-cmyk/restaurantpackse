const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // Optimize bundle
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            'date-fns',
            'framer-motion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
        ],
    },

    // Modern browser targets - reduces legacy JavaScript
    transpilePackages: [],

    // Webpack configuration for path aliases (fixes Vercel build issues)
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname),
        };
        return config;
    },

    images: {
        unoptimized: true, // Disable Vercel image optimization to avoid 402 errors
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crm.restaurantpack.se',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'restaurantpack.se',
            },
        ],
    },
    // rewrites removed as we now use file-based sitemaps (app/sitemap.ts, etc.)

    async redirects() {
        return [
            // ── Malformed URLs: old footer/nav bug where label was appended to href ──
            {
                source: '/delivery-informationLeveringsinfo',
                destination: '/delivery-information',
                permanent: true,
            },
            {
                source: '/wholesalePartnerprogram',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/europe-deliveryEuropafrakt',
                destination: '/europe-delivery',
                permanent: true,
            },

            // ── WooCommerce /brand/ taxonomy pages (not in Next.js) → relevant shop pages ──
            {
                source: '/brand/ocean-pearl',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/brand/ocean-pearl/',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/brand/nordzucker',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/brand/nordzucker/',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/brand/anmol',
                destination: '/shop',
                permanent: true,
            },
            {
                source: '/brand/anmol/',
                destination: '/shop',
                permanent: true,
            },
            // Wildcard catch-all for any other /brand/* URLs
            {
                source: '/brand/:slug*',
                destination: '/shop',
                permanent: true,
            },

            // ── Old product URL missing /product/ prefix ──
            {
                source: '/professional-frying-oil-frityrolja-10-litre-commercial',
                destination: '/product/professional-frying-oil-frityrolja-10-litre-commercial',
                permanent: true,
            },

            // ── WordPress ?page_id= URLs from old WooCommerce/CRM site ──
            {
                source: '/',
                has: [{ type: 'query', key: 'page_id' }],
                destination: '/',
                permanent: true,
            },
        ];
    },
};

module.exports = withNextIntl(nextConfig);
