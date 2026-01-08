'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserNav } from '@/components/layout/user-nav';
import { CartIcon } from '@/components/cart/cart-icon';
import { SearchModal } from '@/components/search/search-modal';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { cn } from '@/lib/utils';
import { MapPin, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ProductCategoryFull } from '@/types/woocommerce';
import { brandConfig } from '@/config/brand.config';
import { useAIChat } from '@/components/ai/ai-chat-widget';

interface TransparentHeaderProps {
  categories: ProductCategoryFull[];
  className?: string;
}

const TransparentNavLink = ({ href, children, isTransparent }: { href: string; children: React.ReactNode; isTransparent: boolean }) => (
  <Link
    href={href}
    className={cn(
      "group relative text-[0.65rem] xl:text-xs font-medium uppercase tracking-wider xl:tracking-widest transition-colors hover:text-primary whitespace-nowrap",
      isTransparent ? "text-white" : "text-foreground"
    )}
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
  </Link>
);


export function TransparentHeader({ categories, className }: TransparentHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const logoUrl = 'https://anmolsweets.se/wp-content/uploads/2021/01/logo.png';

  // Chat functionality
  const { openChat, ChatWidget } = useAIChat();

  useEffect(() => {
    const handleScroll = () => {
      // Hero section is h-screen (100vh), so we get the viewport height
      // Header becomes solid after scrolling past 80% of the hero section
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight * 0.8);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = !isScrolled;

  return (
    <>
      <header
        className={cn(
          "w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-transparent border-transparent shadow-none"
            : "bg-background/95 backdrop-blur-md border-b border-border/10 shadow-sm",
          className
        )}
      >
        <div className="w-full px-3 xl:px-5 py-[3px]">
          {/* Desktop Header Layout - Only show on XL screens (1280px+) */}
          <div className="hidden xl:flex flex-col gap-2">
            <div className="grid grid-cols-12 items-center h-24 gap-3">

              {/* Extreme Left: Location & AI Assistant */}
              <div className="col-span-1 flex justify-start gap-2">
                <a
                  href={brandConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors p-2 rounded-full",
                    isTransparent
                      ? "text-white hover:text-primary hover:bg-white/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  aria-label="Location"
                >
                  <MapPin className="h-5 w-5" />
                </a>
                <button
                  onClick={openChat}
                  className="text-foreground hover:text-primary hover:bg-primary/10 transition-all p-2 rounded-full"
                  aria-label="AI Ideal Indiska Assistant"
                  title="AI Ideal Indiska Assistant"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Left Navigation - Spread Out */}
              <div className="col-span-4 flex justify-between items-center px-2">
                <TransparentNavLink href="/shop" isTransparent={isTransparent}>Shop</TransparentNavLink>
                <TransparentNavLink href="/brands" isTransparent={isTransparent}>Brands</TransparentNavLink>
              </div>

              {/* Center: Logo & Brand */}
              <div className="col-span-2 flex flex-col items-center justify-center">
                <Link href="/" className="flex flex-col items-center group">
                  <div className="relative h-12 w-12 mb-1 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Image
                      src={logoUrl}
                      alt="Anmol Sweets"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "font-heading text-lg font-bold uppercase tracking-[0.15em] leading-none transition-colors group-hover:text-primary",
                      isTransparent ? "text-white" : "text-foreground"
                    )}>
                      Anmol Sweets
                    </span>
                    <span className={cn(
                      "font-heading text-[0.65rem] uppercase tracking-[0.37em] leading-tight mt-1 transition-colors",
                      isTransparent ? "text-white/90" : "text-primary"
                    )}>
                      & Restaurant
                    </span>
                  </div>
                </Link>
              </div>

              {/* Right Navigation - Spread Out */}
              <div className="col-span-4 flex justify-between items-center px-2">
                <TransparentNavLink href="/shop" isTransparent={isTransparent}>Shop</TransparentNavLink>
                <TransparentNavLink href="/blog" isTransparent={isTransparent}>Blog</TransparentNavLink>
                <TransparentNavLink href="/about" isTransparent={isTransparent}>About</TransparentNavLink>
                <TransparentNavLink href="/contact" isTransparent={isTransparent}>Contact</TransparentNavLink>
                <TransparentNavLink href="/bookings" isTransparent={isTransparent}>Reservations</TransparentNavLink>
              </div>

              {/* Extreme Right: Shop/Cart */}
              <div className={cn(
                "col-span-1 flex justify-end items-center gap-3 transition-colors",
                isTransparent && "[&_button]:text-white [&_svg]:text-white [&_a]:text-white"
              )}>
                <UserNav />
                <CartIcon />
              </div>
            </div>

            {/* Search Bar Row */}
            <div className="pb-3">
              <div className={cn(
                "max-w-2xl mx-auto transition-all",
                isTransparent && "[&_button]:bg-white/10 [&_button]:backdrop-blur-sm [&_button]:border-white/20 [&_button]:text-white [&_button]:hover:bg-white/20"
              )}>
                <SearchModal />
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Header Layout - Show below XL (below 1280px) */}
          <div className="xl:hidden flex flex-col gap-3">
            <div className="flex h-20 items-center justify-between">
              {/* Mobile Menu & AI Assistant */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "transition-colors",
                  isTransparent && "[&_button]:text-amber-100 [&_svg]:text-amber-100"
                )}>
                  <MobileMenu />
                </div>
                <button
                  onClick={openChat}
                  className={cn(
                    "transition-colors p-2 rounded-full",
                    isTransparent
                      ? "text-amber-100 hover:text-primary hover:bg-white/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  aria-label="AI Anmol Assistant"
                  title="AI Anmol Assistant"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Center Logo - Symbol Only */}
              <Link href="/" className="flex items-center">
                <div className="relative h-12 w-12 transition-transform duration-300 active:scale-95">
                  <Image
                    src={logoUrl}
                    alt="Anmol Sweets"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Right Actions */}
              <div className={cn(
                "flex items-center gap-3 transition-colors",
                isTransparent && "[&_button]:text-amber-100 [&_svg]:text-amber-100 [&_span]:text-amber-100"
              )}>
                <CartIcon />
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className={cn(
              "pb-3 transition-all",
              isTransparent && "[&_button]:bg-white/10 [&_button]:backdrop-blur-sm [&_button]:border-white/20 [&_button]:text-amber-100 [&_button]:hover:bg-white/20 [&_input]:text-amber-100 [&_input]:placeholder-amber-100/60"
            )}>
              <SearchModal />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
