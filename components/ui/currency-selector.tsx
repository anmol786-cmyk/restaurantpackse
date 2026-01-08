'use client';

import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrencyStore, CURRENCIES, type CurrencyCode } from '@/store/currency-store';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function CurrencySelector({ variant = 'default', className }: CurrencySelectorProps) {
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);

  const currentCurrency = CURRENCIES[selectedCurrency];

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setCurrency(currency);
    setOpen(false);
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
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Select Currency
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
