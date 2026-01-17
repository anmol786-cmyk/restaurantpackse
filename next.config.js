const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // Increase timeout for static generation (helps with slow API calls during build)
    staticGenerationTimeout: 180, // 3 minutes instead of default 60 seconds

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
    async rewrites() {
        return [
            // Main sitemap index
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
            // Sub-sitemaps
            {
                source: '/sitemap-pages.xml',
                destination: '/api/sitemap/pages',
            },
            {
                source: '/sitemap-delivery.xml',
                destination: '/api/sitemap/delivery',
            },

            {
                source: '/sitemap-product-categories.xml',
                destination: '/api/sitemap/product-categories',
            },

            {
                source: '/sitemap-images.xml',
                destination: '/api/sitemap/images',
            },
            // Paginated product sitemaps
            {
                source: '/sitemap-products-:page.xml',
                destination: '/api/sitemap/products/:page',
            },
        ];
    },
};

module.exports = nextConfig;
