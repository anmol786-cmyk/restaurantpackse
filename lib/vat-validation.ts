/**
 * VAT Number Validation Library
 * Validates EU VAT numbers using format checks and VIES API
 */

// VAT number formats by country (regex patterns)
const VAT_FORMATS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,           // Austria
  BE: /^BE0?\d{9,10}$/,       // Belgium
  BG: /^BG\d{9,10}$/,         // Bulgaria
  CY: /^CY\d{8}[A-Z]$/,       // Cyprus
  CZ: /^CZ\d{8,10}$/,         // Czech Republic
  DE: /^DE\d{9}$/,            // Germany
  DK: /^DK\d{8}$/,            // Denmark
  EE: /^EE\d{9}$/,            // Estonia
  EL: /^EL\d{9}$/,            // Greece
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/, // Spain
  FI: /^FI\d{8}$/,            // Finland
  FR: /^FR[A-Z0-9]{2}\d{9}$/, // France
  HR: /^HR\d{11}$/,           // Croatia
  HU: /^HU\d{8}$/,            // Hungary
  IE: /^IE\d{7}[A-Z]{1,2}$|^IE\d[A-Z]\d{5}[A-Z]$/, // Ireland
  IT: /^IT\d{11}$/,           // Italy
  LT: /^LT(\d{9}|\d{12})$/,   // Lithuania
  LU: /^LU\d{8}$/,            // Luxembourg
  LV: /^LV\d{11}$/,           // Latvia
  MT: /^MT\d{8}$/,            // Malta
  NL: /^NL\d{9}B\d{2}$/,      // Netherlands
  PL: /^PL\d{10}$/,           // Poland
  PT: /^PT\d{9}$/,            // Portugal
  RO: /^RO\d{2,10}$/,         // Romania
  SE: /^SE\d{12}$/,           // Sweden
  SI: /^SI\d{8}$/,            // Slovenia
  SK: /^SK\d{10}$/,           // Slovakia
  XI: /^XI\d{9}$|^XI\d{12}$|^XIGD\d{3}$/, // Northern Ireland
};

// Swedish organization number format (10 digits with optional hyphen)
// Accepts: 5592538069, 559253-8069, 559253 8069
const SWEDISH_ORG_FORMAT = /^\d{6}[\s\-]?\d{4}$/;

// Norwegian organization number format
const NORWEGIAN_ORG_FORMAT = /^\d{9}$/;

export interface VATValidationResult {
  valid: boolean;
  formatted: string | null;
  countryCode: string | null;
  vatNumber: string | null;
  companyName?: string;
  companyAddress?: string;
  error?: string;
}

/**
 * Normalize VAT number by removing spaces and converting to uppercase
 */
export function normalizeVATNumber(vatNumber: string): string {
  return vatNumber.replace(/[\s.-]/g, '').toUpperCase();
}

/**
 * Extract country code from VAT number
 */
export function extractCountryCode(vatNumber: string): string | null {
  const normalized = normalizeVATNumber(vatNumber);
  const match = normalized.match(/^([A-Z]{2})/);
  return match ? match[1] : null;
}

/**
 * Validate VAT number format (offline check)
 */
export function validateVATFormat(vatNumber: string): VATValidationResult {
  const normalized = normalizeVATNumber(vatNumber);

  // Check if it starts with a country code
  const countryCode = extractCountryCode(normalized);

  if (!countryCode) {
    return {
      valid: false,
      formatted: null,
      countryCode: null,
      vatNumber: null,
      error: 'VAT number must start with a valid EU country code (e.g., SE, DE, DK)',
    };
  }

  const pattern = VAT_FORMATS[countryCode];
  if (!pattern) {
    return {
      valid: false,
      formatted: null,
      countryCode,
      vatNumber: normalized.substring(2),
      error: `Country code ${countryCode} is not a valid EU member state`,
    };
  }

  if (!pattern.test(normalized)) {
    return {
      valid: false,
      formatted: null,
      countryCode,
      vatNumber: normalized.substring(2),
      error: `Invalid VAT number format for ${countryCode}`,
    };
  }

  return {
    valid: true,
    formatted: normalized,
    countryCode,
    vatNumber: normalized.substring(2),
  };
}

/**
 * Validate Swedish organization number
 */
export function validateSwedishOrgNumber(orgNumber: string): VATValidationResult {
  // Normalize: remove all spaces, hyphens, dots
  const normalized = orgNumber.replace(/[\s\-\.]/g, '');

  // Check if it's 10 digits
  if (!/^\d{10}$/.test(normalized)) {
    return {
      valid: false,
      formatted: null,
      countryCode: 'SE',
      vatNumber: null,
      error: 'Invalid Swedish organization number format. Expected 10 digits (e.g., 559253-8069)',
    };
  }

  // Luhn algorithm check for Swedish org numbers
  const digits = normalized.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return {
      valid: false,
      formatted: null,
      countryCode: 'SE',
      vatNumber: null,
      error: 'Invalid Swedish organization number (checksum failed). Please verify the number.',
    };
  }

  // Format as VAT number: SE + org number + 01
  const vatFormatted = `SE${normalized}01`;

  return {
    valid: true,
    formatted: vatFormatted,
    countryCode: 'SE',
    vatNumber: `${normalized}01`,
  };
}

/**
 * Validate Norwegian organization number
 */
export function validateNorwegianOrgNumber(orgNumber: string): VATValidationResult {
  const normalized = orgNumber.replace(/[\s-]/g, '');

  if (!NORWEGIAN_ORG_FORMAT.test(normalized)) {
    return {
      valid: false,
      formatted: null,
      countryCode: 'NO',
      vatNumber: null,
      error: 'Invalid Norwegian organization number format. Expected 9 digits.',
    };
  }

  // MOD11 check for Norwegian org numbers
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const digits = normalized.substring(0, 8).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }
  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : 11 - remainder;

  if (checkDigit === 10 || checkDigit !== parseInt(normalized[8])) {
    return {
      valid: false,
      formatted: null,
      countryCode: 'NO',
      vatNumber: null,
      error: 'Invalid Norwegian organization number (checksum failed)',
    };
  }

  // Norwegian VAT format: NO + org number + MVA
  return {
    valid: true,
    formatted: `NO${normalized}MVA`,
    countryCode: 'NO',
    vatNumber: normalized,
  };
}

/**
 * Validate VAT number using VIES API (EU official service)
 * This performs an online check against the EU VIES database
 */
export async function validateVATWithVIES(
  countryCode: string,
  vatNumber: string
): Promise<VATValidationResult> {
  try {
    // Use our API endpoint which calls VIES
    const response = await fetch('/api/vat/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode, vatNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        formatted: null,
        countryCode,
        vatNumber,
        error: error.message || 'VAT validation service unavailable',
      };
    }

    const result = await response.json();
    return {
      valid: result.valid,
      formatted: result.valid ? `${countryCode}${vatNumber}` : null,
      countryCode,
      vatNumber,
      companyName: result.name,
      companyAddress: result.address,
      error: result.valid ? undefined : 'VAT number not found in VIES database',
    };
  } catch (error) {
    console.error('VIES validation error:', error);
    return {
      valid: false,
      formatted: null,
      countryCode,
      vatNumber,
      error: 'Unable to validate VAT number. Please try again later.',
    };
  }
}

/**
 * Smart VAT/Org number validation
 * Automatically detects the type and validates accordingly
 */
export async function validateBusinessNumber(
  number: string,
  country: string
): Promise<VATValidationResult> {
  const normalized = normalizeVATNumber(number);

  // If it starts with country code, treat as VAT number
  if (/^[A-Z]{2}/.test(normalized)) {
    const formatResult = validateVATFormat(normalized);
    if (!formatResult.valid) {
      return formatResult;
    }

    // For EU countries, validate with VIES to get company name/address
    const countryCode = formatResult.countryCode as string;
    const vatNum = formatResult.vatNumber as string;

    try {
      const viesResult = await validateVATWithVIES(countryCode, vatNum);
      if (viesResult.valid) {
        return viesResult;
      }
      // If VIES says invalid specifically, return that
      if (viesResult.error === 'VAT number not found in VIES database') {
        return viesResult;
      }
    } catch (e) {
      console.warn('VIES validation failed, falling back to format check');
    }

    // Fallback to format/checksum check
    return formatResult;
  }

  // Country-specific validation
  switch (country.toUpperCase()) {
    case 'SE':
      return validateSwedishOrgNumber(number);
    case 'NO':
      return validateNorwegianOrgNumber(number);
    case 'DK':
      // Danish CVR number (8 digits)
      const dkNormalized = number.replace(/[\s-]/g, '');
      if (/^\d{8}$/.test(dkNormalized)) {
        return {
          valid: true,
          formatted: `DK${dkNormalized}`,
          countryCode: 'DK',
          vatNumber: dkNormalized,
        };
      }
      return {
        valid: false,
        formatted: null,
        countryCode: 'DK',
        vatNumber: null,
        error: 'Invalid Danish CVR number. Expected 8 digits.',
      };
    case 'FI':
      // Finnish Y-tunnus (7 digits + check digit)
      const fiNormalized = number.replace(/[\s-]/g, '');
      if (/^\d{7,8}$/.test(fiNormalized)) {
        return {
          valid: true,
          formatted: `FI${fiNormalized.padStart(8, '0')}`,
          countryCode: 'FI',
          vatNumber: fiNormalized.padStart(8, '0'),
        };
      }
      return {
        valid: false,
        formatted: null,
        countryCode: 'FI',
        vatNumber: null,
        error: 'Invalid Finnish Y-tunnus. Expected 7-8 digits.',
      };
    default:
      // For other countries, require full VAT format
      return {
        valid: false,
        formatted: null,
        countryCode: country,
        vatNumber: null,
        error: `Please enter VAT number with country prefix (e.g., ${country}XXXXXXXXX)`,
      };
  }
}

/**
 * Get VAT rate for a country
 */
export function getVATRate(countryCode: string): number {
  const rates: Record<string, number> = {
    SE: 25,   // Sweden
    NO: 25,   // Norway
    DK: 25,   // Denmark
    FI: 24,   // Finland
    DE: 19,   // Germany
    AT: 20,   // Austria
    BE: 21,   // Belgium
    BG: 20,   // Bulgaria
    CY: 19,   // Cyprus
    CZ: 21,   // Czech Republic
    EE: 20,   // Estonia
    EL: 24,   // Greece
    ES: 21,   // Spain
    FR: 20,   // France
    HR: 25,   // Croatia
    HU: 27,   // Hungary
    IE: 23,   // Ireland
    IT: 22,   // Italy
    LT: 21,   // Lithuania
    LU: 17,   // Luxembourg
    LV: 21,   // Latvia
    MT: 18,   // Malta
    NL: 21,   // Netherlands
    PL: 23,   // Poland
    PT: 23,   // Portugal
    RO: 19,   // Romania
    SI: 22,   // Slovenia
    SK: 20,   // Slovakia
  };

  return rates[countryCode.toUpperCase()] || 25;
}

/**
 * Check if reverse charge applies (B2B cross-border within EU)
 */
export function isReverseChargeApplicable(
  sellerCountry: string,
  buyerCountry: string,
  buyerHasValidVAT: boolean
): boolean {
  // Reverse charge applies when:
  // 1. Both are EU countries
  // 2. Different countries
  // 3. Buyer has valid VAT number
  const euCountries = Object.keys(VAT_FORMATS);

  return (
    euCountries.includes(sellerCountry.toUpperCase()) &&
    euCountries.includes(buyerCountry.toUpperCase()) &&
    sellerCountry.toUpperCase() !== buyerCountry.toUpperCase() &&
    buyerHasValidVAT
  );
}
