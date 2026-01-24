'use client';

import Link from 'next/link';
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

interface HeaderProps {
  className?: string;
  categories?: any[];
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap"
  >
    {children}
  </Link>
);

export function Header({ className, categories = [] }: HeaderProps) {
  const logoUrl = 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png';
  const { openChat, ChatWidget } = useAIChat();

  return (
    <>
      <header className={cn("w-full bg-white border-b border-slate-100 sticky top-0 z-50 transition-all duration-300 shadow-sm", className)}>
        <div className="site-container">
          {/* Desktop Header Row */}
          <div className="hidden xl:flex items-center h-20 gap-8">

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
                <span className="font-heading font-bold text-lg text-primary uppercase tracking-wide">
                  Anmol Wholesale
                </span>
              </Link>
            </div>

            {/* Search Bar area - Expands to fill space */}
            <div className="flex-1 max-w-xl">
              {/* We'll style the SearchModal trigger to look like a modern input */}
              <SearchModal />
            </div>

            {/* Right side navigation and actions */}
            <div className="flex items-center gap-8">
              {/* Navigation Links */}
              <nav className="flex items-center gap-6">
                <NavLink href="/shop">Products</NavLink>
                <NavLink href="/wholesale">Wholesale</NavLink>
                <NavLink href="/wholesale/quick-order">Quick Order</NavLink>
                <NavLink href="/wholesale/quote">Quotes</NavLink>
                <NavLink href="/wholesale/register">B2B Account</NavLink>
              </nav>

              <div className="h-6 w-px bg-slate-200 hidden xl:block" />

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={openChat}
                  className="flex items-center justify-center p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                  title="AI Assistant"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>

                <CurrencySelector variant="compact" />

                <UserNav />
                <WishlistIcon />

                {/* Cart with distinct B2B look */}
                <div className="pl-2">
                  <CartIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Header Row */}
          <div className="xl:hidden flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <div className="relative h-12 w-32">
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

            <div className="flex items-center gap-2">
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
