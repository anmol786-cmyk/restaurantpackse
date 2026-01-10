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
// Updated rates as of January 2025 - should be fetched from an API in production
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  SEK: 1.0,
  EUR: 0.089,    // 1 SEK ≈ 0.089 EUR (approx 11.25 SEK per EUR)
  NOK: 1.03,     // 1 SEK ≈ 1.03 NOK (close parity)
  DKK: 0.67,     // 1 SEK ≈ 0.67 DKK (approx 1.50 SEK per DKK)
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
