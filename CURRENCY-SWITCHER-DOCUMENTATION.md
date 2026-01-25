# Currency Switcher Implementation Guide

This document provides a complete guide to implementing a multi-currency switcher in a Next.js application. This implementation supports SEK, EUR, NOK, and DKK with real-time exchange rates.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [File Structure](#file-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Usage in Components](#usage-in-components)
6. [Customization](#customization)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      UI LAYER                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  CurrencySelector Component                           │ │
│  │  - Dropdown with currency options                     │ │
│  │  - 3 variants: default, compact, icon-only            │ │
│  │  - Auto-refresh rates every hour                      │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    HOOK LAYER                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  useCurrency() Hook                                   │ │
│  │  - Simple wrapper for components                      │ │
│  │  - Returns: selectedCurrency, convert(), format()     │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              STATE MANAGEMENT (Zustand)                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  useCurrencyStore                                     │ │
│  │  - selectedCurrency (persisted to localStorage)       │ │
│  │  - exchangeRates                                      │ │
│  │  - setCurrency(), convertPrice(), formatPrice()       │ │
│  │  - updateExchangeRates()                              │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API LAYER                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  /api/currency/rates                                  │ │
│  │  - Fetches from ExchangeRate.host API                 │ │
│  │  - 1-hour cache                                       │ │
│  │  - Fallback to hardcoded rates on failure             │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Dependencies

```bash
npm install zustand lucide-react
```

### UI Components Required

This implementation uses shadcn/ui components:
- Button
- DropdownMenu (DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator)

Install shadcn/ui dropdown:
```bash
npx shadcn@latest add button dropdown-menu
```

---

## File Structure

```
your-project/
├── app/
│   └── api/
│       └── currency/
│           └── rates/
│               └── route.ts          # API endpoint for exchange rates
├── components/
│   └── ui/
│       └── currency-selector.tsx     # UI component
├── hooks/
│   └── use-currency.ts               # Custom hook for components
├── store/
│   └── currency-store.ts             # Zustand store
└── lib/
    └── utils.ts                      # Utility functions (cn helper)
```

---

## Step-by-Step Implementation

### Step 1: Create the Currency Store

Create `store/currency-store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define supported currencies
export type CurrencyCode = 'SEK' | 'EUR' | 'NOK' | 'DKK';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

// Currency definitions with flags and symbols
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
};

// Fallback exchange rates relative to SEK (base currency)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  SEK: 1.0,
  EUR: 0.089,    // 1 SEK ≈ 0.089 EUR
  NOK: 1.03,     // 1 SEK ≈ 1.03 NOK
  DKK: 0.67,     // 1 SEK ≈ 0.67 DKK
};

interface CurrencyState {
  selectedCurrency: CurrencyCode;
  exchangeRates: Record<CurrencyCode, number>;
  lastUpdated: string | null;
  isLoading: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  updateExchangeRates: () => Promise<void>;
  convertPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => number;
  formatPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'SEK',
      exchangeRates: EXCHANGE_RATES,
      lastUpdated: null,
      isLoading: false,

      setCurrency: (currency) => {
        set({ selectedCurrency: currency });
      },

      updateExchangeRates: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/currency/rates');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.rates) {
              set({
                exchangeRates: data.rates,
                lastUpdated: data.lastUpdated,
                isLoading: false,
              });
              console.log('Currency rates updated:', data.rates);
            }
          }
        } catch (error) {
          console.error('Failed to update exchange rates:', error);
          set({ isLoading: false });
        }
      },

      convertPrice: (priceInSEK, toCurrency) => {
        const currency = toCurrency || get().selectedCurrency;
        const rate = get().exchangeRates[currency];
        return Math.round(priceInSEK * rate * 100) / 100;
      },

      formatPrice: (priceInSEK, toCurrency) => {
        const currency = toCurrency || get().selectedCurrency;
        const convertedPrice = get().convertPrice(priceInSEK, currency);
        const currencyData = CURRENCIES[currency];

        // Format with appropriate decimals and symbol position
        if (currency === 'SEK' || currency === 'NOK' || currency === 'DKK') {
          // Nordic currencies: amount kr (space before symbol)
          return `${convertedPrice.toFixed(2)} ${currencyData.symbol}`;
        } else {
          // EUR: €amount (symbol before, no space)
          return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
        }
      },
    }),
    {
      name: 'currency-storage', // localStorage key
    }
  )
);
```

### Step 2: Create the Custom Hook

Create `hooks/use-currency.ts`:

```typescript
'use client';

import { useCurrencyStore } from '@/store/currency-store';

/**
 * Hook to format prices with the currently selected currency
 * Automatically converts from SEK base price to selected currency
 */
export function useCurrency() {
  const { selectedCurrency, convertPrice, formatPrice } = useCurrencyStore();

  return {
    selectedCurrency,
    /**
     * Convert a price from SEK to the selected currency
     */
    convert: (priceInSEK: number) => convertPrice(priceInSEK),
    /**
     * Format a price in SEK to the selected currency with proper symbol
     */
    format: (priceInSEK: number) => formatPrice(priceInSEK),
  };
}
```

### Step 3: Create the API Route

Create `app/api/currency/rates/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * Currency Exchange Rates API
 * Fetches real-time rates from ExchangeRate.host
 * Base currency: SEK
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch latest rates from ExchangeRate.host API
    const response = await fetch(
      'https://api.exchangerate.host/latest?base=SEK&symbols=EUR,NOK,DKK',
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Exchange rate API returned error');
    }

    // Format rates for our application
    const rates = {
      SEK: 1.0,
      EUR: data.rates.EUR || 0.089,
      NOK: data.rates.NOK || 1.03,
      DKK: data.rates.DKK || 0.67,
      lastUpdated: data.date || new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      rates,
      base: 'SEK',
      lastUpdated: rates.lastUpdated,
    });
  } catch (error: any) {
    console.error('Currency API error:', error);

    // Return fallback rates if API fails
    return NextResponse.json(
      {
        success: true,
        rates: {
          SEK: 1.0,
          EUR: 0.089,
          NOK: 1.03,
          DKK: 0.67,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
        base: 'SEK',
        fallback: true,
        message: 'Using fallback rates due to API error',
      },
      { status: 200 }
    );
  }
}
```

### Step 4: Create the Currency Selector Component

Create `components/ui/currency-selector.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCurrencyStore, CURRENCIES, type CurrencyCode } from '@/store/currency-store';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function CurrencySelector({ variant = 'default', className }: CurrencySelectorProps) {
  const { selectedCurrency, setCurrency, updateExchangeRates, lastUpdated, isLoading } =
    useCurrencyStore();
  const [open, setOpen] = useState(false);

  // Update rates on mount and every hour
  useEffect(() => {
    updateExchangeRates();
    const interval = setInterval(() => {
      updateExchangeRates();
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [updateExchangeRates]);

  const currentCurrency = CURRENCIES[selectedCurrency];

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setCurrency(currency);
    setOpen(false);
  };

  const handleRefreshRates = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateExchangeRates();
  };

  // Icon-only variant (for mobile)
  if (variant === 'icon-only') {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", className)}
            aria-label="Select currency"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {Object.values(CURRENCIES).map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currency.flag}</span>
                  <div>
                    <p className="font-medium text-sm">{currency.code}</p>
                    <p className="text-xs text-muted-foreground">{currency.name}</p>
                  </div>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Compact variant (for header)
  if (variant === 'compact') {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-9 gap-1.5 px-2.5", className)}
          >
            <span className="text-base">{currentCurrency.flag}</span>
            <span className="font-medium text-sm">{currentCurrency.code}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {Object.values(CURRENCIES).map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currency.flag}</span>
                  <span className="font-medium text-sm">{currency.code}</span>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant (full display)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-10 gap-2", className)}
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentCurrency.flag}</span>
          <span className="font-medium">{currentCurrency.code}</span>
          <span className="text-muted-foreground">({currentCurrency.symbol})</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center justify-between">
          <span>Select Currency</span>
          <button
            onClick={handleRefreshRates}
            disabled={isLoading}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
            title="Refresh exchange rates"
          >
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          </button>
        </div>
        {Object.values(CURRENCIES).map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="cursor-pointer py-2.5"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-xl">{currency.flag}</span>
                <div>
                  <p className="font-medium">{currency.code}</p>
                  <p className="text-xs text-muted-foreground">{currency.name}</p>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        {lastUpdated && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-[10px] text-muted-foreground text-center">
              Rates updated: {lastUpdated}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Usage in Components

### Add Currency Selector to Header

```tsx
// components/layout/header.tsx
import { CurrencySelector } from '@/components/ui/currency-selector';

export function Header() {
  return (
    <header>
      {/* Other header content */}
      <CurrencySelector variant="compact" />
    </header>
  );
}
```

### Display Prices with Currency Conversion

```tsx
// components/product-card.tsx
'use client';

import { useCurrency } from '@/hooks/use-currency';

interface ProductCardProps {
  product: {
    name: string;
    price: number; // Price in SEK (base currency)
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { format: formatCurrency } = useCurrency();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">{formatCurrency(product.price)}</p>
    </div>
  );
}
```

### In Cart/Checkout

```tsx
// components/cart/cart-item.tsx
'use client';

import { useCurrency } from '@/hooks/use-currency';

export function CartItem({ item }) {
  const { format: formatCurrency, convert } = useCurrency();

  const itemTotal = item.price * item.quantity;

  return (
    <div>
      <span>{item.name}</span>
      <span>{formatCurrency(item.price)} x {item.quantity}</span>
      <span>Total: {formatCurrency(itemTotal)}</span>
    </div>
  );
}
```

---

## Customization

### Adding New Currencies

1. Add to `CurrencyCode` type:
```typescript
export type CurrencyCode = 'SEK' | 'EUR' | 'NOK' | 'DKK' | 'GBP' | 'USD';
```

2. Add to `CURRENCIES` object:
```typescript
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  // ... existing currencies
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
};
```

3. Add fallback rates:
```typescript
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  // ... existing rates
  GBP: 0.076,  // 1 SEK ≈ 0.076 GBP
  USD: 0.095,  // 1 SEK ≈ 0.095 USD
};
```

4. Update API route symbols:
```typescript
'https://api.exchangerate.host/latest?base=SEK&symbols=EUR,NOK,DKK,GBP,USD'
```

### Changing Base Currency

If your prices are stored in a different currency (e.g., EUR instead of SEK):

1. Update the API call base:
```typescript
'https://api.exchangerate.host/latest?base=EUR&symbols=SEK,NOK,DKK'
```

2. Update the `convertPrice` logic accordingly

3. Rename functions to reflect the base currency (e.g., `priceInEUR` instead of `priceInSEK`)

### Alternative Exchange Rate APIs

If ExchangeRate.host doesn't work, alternatives include:

1. **Open Exchange Rates** (free tier available)
   ```
   https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID
   ```

2. **Fixer.io** (free tier available)
   ```
   https://data.fixer.io/api/latest?access_key=YOUR_ACCESS_KEY
   ```

3. **Exchange Rates API** (free, no key required)
   ```
   https://api.exchangeratesapi.io/latest?base=SEK
   ```

---

## Key Features

1. **Persistent Selection**: User's currency choice is saved to localStorage
2. **Real-time Rates**: Fetches live exchange rates from API
3. **Fallback Rates**: Uses hardcoded rates if API fails
4. **Auto-refresh**: Updates rates every hour automatically
5. **Manual Refresh**: Users can manually refresh rates
6. **Multiple Variants**: Three display modes for different UI contexts
7. **Type-safe**: Full TypeScript support

---

## Important Notes

1. **All prices in your database/WooCommerce should be stored in the base currency (SEK)**
2. **Conversion happens only at display time** - orders are still placed in base currency
3. **Exchange rates are approximate** - for actual transactions, use payment processor rates
4. **The component must be used in client components** (uses 'use client')

---

## Checklist for New Project

- [ ] Install dependencies: `zustand`, `lucide-react`
- [ ] Install shadcn/ui: `button`, `dropdown-menu`
- [ ] Create `store/currency-store.ts`
- [ ] Create `hooks/use-currency.ts`
- [ ] Create `app/api/currency/rates/route.ts`
- [ ] Create `components/ui/currency-selector.tsx`
- [ ] Add `<CurrencySelector />` to header
- [ ] Replace price displays with `useCurrency().format(price)`
- [ ] Test localStorage persistence
- [ ] Test API rate fetching
- [ ] Test fallback rates (disconnect network)
