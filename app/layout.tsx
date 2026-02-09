import "./globals.css";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import { GoogleTagManager, GoogleTagManagerNoScript, FacebookPixel } from "@/components/analytics";
import { GeoMetaTags } from "@/components/seo/geo-meta-tags";
import { HreflangTags } from "@/components/seo/hreflang-tags";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

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
  verification: {
    google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    alternateLocale: ["en_US"],
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
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [`${siteConfig.site_domain}/twitter-image.jpeg`],
  },
  keywords: [
    "restaurang grossist stockholm",
    "storköksvaror grossist",
    "indiska kryddor grossist",
    "basmati ris storpack",
    "halal kött stockholm",
    "elektrisk tandoor",
    "restaurang leverantör sverige",
    "restaurant supply stockholm",
    "wholesale food sweden",
    "B2B wholesale",
    "anmol wholesale",
    "bulk ingredients",
    "foodservice distributor",
    "indian grocery wholesale",
    "electric tandoor sweden",
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />

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

        {children}
      </body>
    </html>
  );
}
