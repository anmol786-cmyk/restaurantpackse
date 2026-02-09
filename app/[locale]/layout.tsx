import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

import { ThemeProvider } from "@/components/theme/theme-provider";
import { TopInfoBar } from "@/components/layout/top-info-bar";
import { SchemaScript } from "@/lib/schema/schema-script";
import { websiteSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { siteConfig } from "@/site.config";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { getProductCategories } from "@/lib/woocommerce";

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const categories = await getProductCategories({ parent: 0 });

  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* Top Green Info Bar - Desktop only */}
        <TopInfoBar />

        {/* Header with locale for language selector */}
        <Header categories={categories} locale={locale as Locale} />

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
    </NextIntlClientProvider>
  );
}
