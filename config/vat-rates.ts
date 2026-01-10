/**
 * VAT & Tax Configuration for EU Countries
 * Standard VAT rates by country (2025)
 */

export interface VATConfig {
  countryCode: string;
  countryName: string;
  standardRate: number; // Percentage
  reducedRate: number; // For food products
  currency: string;
  requiresVATNumber: boolean; // For B2B reverse charge
}

export const VAT_RATES: Record<string, VATConfig> = {
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    standardRate: 25,
    reducedRate: 12, // Food products
    currency: 'SEK',
    requiresVATNumber: true,
  },
  NO: {
    countryCode: 'NO',
    countryName: 'Norway',
    standardRate: 25,
    reducedRate: 15, // Food products
    currency: 'NOK',
    requiresVATNumber: true,
  },
  DK: {
    countryCode: 'DK',
    countryName: 'Denmark',
    standardRate: 25,
    reducedRate: 25, // No reduced rate in Denmark
    currency: 'DKK',
    requiresVATNumber: true,
  },
  FI: {
    countryCode: 'FI',
    countryName: 'Finland',
    standardRate: 24,
    reducedRate: 14, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    standardRate: 19,
    reducedRate: 7, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    standardRate: 20,
    reducedRate: 5.5, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  NL: {
    countryCode: 'NL',
    countryName: 'Netherlands',
    standardRate: 21,
    reducedRate: 9, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  BE: {
    countryCode: 'BE',
    countryName: 'Belgium',
    standardRate: 21,
    reducedRate: 6, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  AT: {
    countryCode: 'AT',
    countryName: 'Austria',
    standardRate: 20,
    reducedRate: 10, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  IT: {
    countryCode: 'IT',
    countryName: 'Italy',
    standardRate: 22,
    reducedRate: 10, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  ES: {
    countryCode: 'ES',
    countryName: 'Spain',
    standardRate: 21,
    reducedRate: 10, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  PT: {
    countryCode: 'PT',
    countryName: 'Portugal',
    standardRate: 23,
    reducedRate: 6, // Food products
    currency: 'EUR',
    requiresVATNumber: true,
  },
  PL: {
    countryCode: 'PL',
    countryName: 'Poland',
    standardRate: 23,
    reducedRate: 5, // Food products
    currency: 'PLN',
    requiresVATNumber: true,
  },
  CZ: {
    countryCode: 'CZ',
    countryName: 'Czech Republic',
    standardRate: 21,
    reducedRate: 15, // Food products
    currency: 'CZK',
    requiresVATNumber: true,
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    standardRate: 20,
    reducedRate: 0, // Most food is zero-rated
    currency: 'GBP',
    requiresVATNumber: true,
  },
};

/**
 * Get VAT configuration for a country
 */
export function getVATConfig(countryCode: string): VATConfig | null {
  return VAT_RATES[countryCode.toUpperCase()] || null;
}

/**
 * Calculate VAT amount
 */
export function calculateVAT(
  amount: number,
  countryCode: string,
  isFoodProduct: boolean = true
): {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  vatRate: number;
} {
  const config = getVATConfig(countryCode);

  if (!config) {
    return {
      netAmount: amount,
      vatAmount: 0,
      grossAmount: amount,
      vatRate: 0,
    };
  }

  const vatRate = isFoodProduct ? config.reducedRate : config.standardRate;
  const netAmount = amount;
  const vatAmount = (netAmount * vatRate) / 100;
  const grossAmount = netAmount + vatAmount;

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100,
    vatRate,
  };
}

/**
 * Validate EU VAT number format
 * Basic format validation (actual validation requires API call to VIES)
 */
export function validateVATNumberFormat(vatNumber: string): {
  valid: boolean;
  countryCode: string | null;
  message?: string;
} {
  if (!vatNumber) {
    return { valid: false, countryCode: null, message: 'VAT number is required' };
  }

  // Remove spaces and convert to uppercase
  const cleaned = vatNumber.replace(/\s/g, '').toUpperCase();

  // Extract country code (first 2 letters)
  const countryCode = cleaned.substring(0, 2);

  // Check if country code is valid
  if (!VAT_RATES[countryCode]) {
    return {
      valid: false,
      countryCode: null,
      message: 'Invalid country code in VAT number',
    };
  }

  // Basic format checks by country
  const patterns: Record<string, RegExp> = {
    SE: /^SE\d{12}$/, // Sweden: SE + 12 digits
    NO: /^NO\d{9}MVA$/, // Norway: NO + 9 digits + MVA
    DK: /^DK\d{8}$/, // Denmark: DK + 8 digits
    FI: /^FI\d{8}$/, // Finland: FI + 8 digits
    DE: /^DE\d{9}$/, // Germany: DE + 9 digits
    FR: /^FR[A-Z0-9]{2}\d{9}$/, // France: FR + 2 chars + 9 digits
    NL: /^NL\d{9}B\d{2}$/, // Netherlands: NL + 9 digits + B + 2 digits
    BE: /^BE0?\d{9}$/, // Belgium: BE + optional 0 + 9 digits
    AT: /^ATU\d{8}$/, // Austria: ATU + 8 digits
    IT: /^IT\d{11}$/, // Italy: IT + 11 digits
    ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/, // Spain: ES + char + 7 digits + char
    PT: /^PT\d{9}$/, // Portugal: PT + 9 digits
    PL: /^PL\d{10}$/, // Poland: PL + 10 digits
    CZ: /^CZ\d{8,10}$/, // Czech: CZ + 8-10 digits
    GB: /^GB(\d{9}|\d{12}|(GD|HA)\d{3})$/, // UK: Various formats
  };

  const pattern = patterns[countryCode];

  if (!pattern) {
    return {
      valid: false,
      countryCode,
      message: 'VAT format validation not available for this country',
    };
  }

  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      countryCode,
      message: `Invalid VAT number format for ${VAT_RATES[countryCode].countryName}`,
    };
  }

  return {
    valid: true,
    countryCode,
  };
}

/**
 * Check if B2B reverse charge applies
 * (Customer is in different EU country with valid VAT number)
 */
export function shouldApplyReverseCharge(
  sellerCountry: string,
  buyerCountry: string,
  hasValidVAT: boolean
): boolean {
  // Reverse charge applies when:
  // 1. Seller and buyer are in different EU countries
  // 2. Buyer has a valid VAT number
  // 3. Both countries are in the EU

  if (sellerCountry === buyerCountry) {
    return false;
  }

  if (!hasValidVAT) {
    return false;
  }

  const sellerInEU = !!VAT_RATES[sellerCountry];
  const buyerInEU = !!VAT_RATES[buyerCountry];

  return sellerInEU && buyerInEU;
}

/**
 * Get VAT display text for invoices
 */
export function getVATDisplayText(
  countryCode: string,
  isReverseCharge: boolean,
  isFoodProduct: boolean = true
): string {
  const config = getVATConfig(countryCode);

  if (!config) {
    return 'VAT not applicable';
  }

  if (isReverseCharge) {
    return `VAT 0% (Reverse Charge - Article 196 of Council Directive 2006/112/EC)`;
  }

  const rate = isFoodProduct ? config.reducedRate : config.standardRate;
  return `VAT ${rate}% (${config.countryName})`;
}
