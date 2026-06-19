'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { UserNav } from '@/components/layout/user-nav';
import { CartIcon } from '@/components/cart/cart-icon';
import { WishlistIcon } from '@/components/wishlist/wishlist-icon';
import { SearchModal } from '@/components/search/search-modal';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { cn } from '@/lib/utils';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings';
import { getProductCategories } from '@/lib/woocommerce';
import { brandConfig } from '@/config/brand.config';
import { brandProfile } from '@/config/brand-profile';
import { AiChatWidget, useAIChat } from '@/components/ai/ai-chat-widget';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { LanguageSelector } from '@/components/ui/language-selector';
import type { Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  className?: string;
  categories?: any[];
  locale?: Locale;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
  >
    {children}
  </Link>
);

export function Header({ className, categories = [], locale = 'en' }: HeaderProps) {
  const logoUrl = 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png';
  const { openChat, ChatWidget } = useAIChat();
  const t = useTranslations('nav');

  return (
    <>
      <header className={cn("w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300 shadow-sm", className)}>
        <div className="site-container">
          {/* Desktop Header Row */}
          <div className="hidden min-[1440px]:flex items-center h-20 gap-4 min-w-0">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="group flex items-center gap-3">
                <div className="relative h-14 w-[3.5rem] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={logoUrl}
                    alt={brandProfile.name}
                    fill
                    className="object-contain object-left"
                    sizes="128px"
                    priority
                  />
                </div>
                <span className="font-heading font-bold text-lg text-primary uppercase tracking-wide whitespace-nowrap">
                  Anmol Wholesale
                </span>
              </Link>
            </div>

            {/* Search Bar area - Expands to fill space, shrinks before pushing icons */}
            <div className="flex-1 min-w-0 max-w-md">
              <SearchModal />
            </div>

            {/* Right side navigation and actions - never shrinks, stays on screen */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Navigation Links */}
              <nav className="flex items-center gap-4">
                <NavLink href="/shop">{t('shop')}</NavLink>
                <NavLink href="/wholesale">{t('wholesale')}</NavLink>
                <NavLink href="/wholesale/quick-order">{t('quickOrder')}</NavLink>
                <NavLink href="/wholesale/quote">{t('quotes')}</NavLink>
                <NavLink href="/wholesale/register">{t('b2bAccount')}</NavLink>
                <NavLink href="/about">{t('about')}</NavLink>
                <NavLink href="/contact">{t('contact')}</NavLink>
              </nav>

              <div className="h-6 w-px bg-border" />

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openChat}
                  className="flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                  title="AI Assistant"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>

                <LanguageSelector variant="compact" currentLocale={locale} />
                <CurrencySelector variant="compact" />

                <UserNav />
                <WishlistIcon />

                {/* Cart with distinct B2B look */}
                <div className="pl-1">
                  <CartIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Header Row */}
          <div className="min-[1440px]:hidden flex h-16 items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <Link href="/">
                <div className="relative h-12 w-28 sm:w-32">
                  <Image
                    src={logoUrl}
                    alt={brandProfile.name}
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
              <LanguageSelector variant="icon-only" currentLocale={locale} />
              <CurrencySelector variant="icon-only" />
              <SearchModal variant="icon" />
              <CartIcon />
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
