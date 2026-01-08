import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'SEK' | 'EUR' | 'NOK' | 'DKK';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
};

// Exchange rates relative to SEK (base currency)
// These should ideally be fetched from an API in production
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  SEK: 1.0,
  EUR: 0.087,    // 1 SEK ≈ 0.087 EUR
  NOK: 1.02,     // 1 SEK ≈ 1.02 NOK
  DKK: 0.65,     // 1 SEK ≈ 0.65 DKK
};

interface CurrencyState {
  selectedCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => number;
  formatPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'SEK',

      setCurrency: (currency) => {
        set({ selectedCurrency: currency });
      },

      convertPrice: (priceInSEK, toCurrency) => {
        const currency = toCurrency || get().selectedCurrency;
        const rate = EXCHANGE_RATES[currency];
        return Math.round(priceInSEK * rate * 100) / 100;
      },

      formatPrice: (priceInSEK, toCurrency) => {
        const currency = toCurrency || get().selectedCurrency;
        const convertedPrice = get().convertPrice(priceInSEK, currency);
        const currencyData = CURRENCIES[currency];

        // Format with appropriate decimals and symbol position
        if (currency === 'SEK' || currency === 'NOK' || currency === 'DKK') {
          // Nordic currencies: amount kr (space before)
          return `${convertedPrice.toFixed(2)} ${currencyData.symbol}`;
        } else {
          // EUR: €amount (no space)
          return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
        }
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
