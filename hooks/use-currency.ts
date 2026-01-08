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
