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
        optimizePackageImports: ['lucide-react', 'date-fns'],
    },

    // Modern browser targets - reduces legacy JavaScript
    transpilePackages: [],
    modularizeImports: {
        'lucide-react': {
            transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        },
    },

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
            // Add your WordPress/CMS domain here for remote images
            // Example:
            // {
            //     protocol: 'https',
            //     hostname: 'your-wordpress-domain.com',
            //     pathname: '/wp-content/uploads/**',
            // },
        ],
    },
    // rewrites removed as we now use file-based sitemaps (app/sitemap.ts, etc.)
};

module.exports = withNextIntl(nextConfig);
