import "./globals.css";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TopInfoBar } from "@/components/layout/top-info-bar";
import { SchemaScript } from "@/lib/schema/schema-script";
import { websiteSchema } from "@/lib/schema";
import { GoogleTagManager, GoogleTagManagerNoScript, FacebookPixel } from "@/components/analytics";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GeoMetaTags } from "@/components/seo/geo-meta-tags";
import { HreflangTags } from "@/components/seo/hreflang-tags";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";

import { getProductCategories } from "@/lib/woocommerce";

import type { Metadata } from "next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const fontHeading = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_name,
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
  // OpenGraph with locale configuration
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.site_domain,
    siteName: siteConfig.site_name,
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [
      {
        url: `${siteConfig.site_domain}/opengraph-image.jpeg`,
        width: 1200,
        height: 630,
        alt: siteConfig.site_name,
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [`${siteConfig.site_domain}/twitter-image.jpeg`],
  },
  // Additional metadata
  keywords: [
    "restaurant supply",
    "wholesale food",
    "B2B wholesale",
    "restaurant pack",
    "anmol wholesale",
    "bulk ingredients",
    "foodservice distributor",
    "catering supplies",
  ],
  authors: [{ name: siteConfig.site_name }],
  creator: siteConfig.site_name,
  publisher: siteConfig.site_name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Viewport configuration for mobile devices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Force dynamic rendering to prevent build timeouts
// The layout fetches categories from WooCommerce which can be slow
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getProductCategories({ parent: 0 });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Add your WordPress/CMS domain here */}
        {/* <link rel="preconnect" href="YOUR_WORDPRESS_DOMAIN" /> */}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />

        {/* Preload critical hero image - Add your hero image URL */}
        {/* <link
          rel="preload"
          as="image"
          href="YOUR_HERO_IMAGE_URL"
          fetchPriority="high"
        /> */}

        {/* Geo-Targeting Meta Tags */}
        <GeoMetaTags />

        {/* Hreflang Tags */}
        <HreflangTags canonicalUrl={siteConfig.site_domain} />

        {/* Google Tag Manager */}
        <GoogleTagManager />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontHeading.variable)} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <GoogleTagManagerNoScript />

        {/* Facebook Pixel */}
        <FacebookPixel />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Top Green Info Bar - Desktop only */}
          <TopInfoBar />

          {/* New Horizontal Header System */}
          <Header categories={categories} />

          {/* Main Layout Container */}
          <div className="flex flex-col min-h-screen">
            {/* Main Content Area */}
            <main className="flex-1 w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>

          <CartDrawer />
          <WishlistDrawer />
          <Toaster />
          <SonnerToaster position="top-center" richColors closeButton />
        </ThemeProvider>
        <AiChatWidget />

        {/* Global WebSite Schema */}
        <SchemaScript
          id="website-schema"
          schema={websiteSchema({
            name: siteConfig.site_name,
            url: siteConfig.site_domain,
            description: siteConfig.site_description,
            searchUrl: `${siteConfig.site_domain}/shop`,
          })}
        />
      </body>
    </html>
  );
}
