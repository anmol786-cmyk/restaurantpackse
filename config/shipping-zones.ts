/**
 * International Shipping Zones Configuration
 * Shipping rates and delivery times for Nordic and EU countries
 */

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  baseRate: number; // in SEK
  freeShippingThreshold: number; // in SEK
  estimatedDays: {
    min: number;
    max: number;
  };
  courierService: string;
  enabled: boolean;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  // Zone 1: Sweden (Domestic)
  {
    id: 'se-domestic',
    name: 'Sweden - Domestic',
    countries: ['SE'],
    baseRate: 0, // Free for wholesale
    freeShippingThreshold: 0,
    estimatedDays: { min: 1, max: 2 },
    courierService: 'Own Fleet / PostNord',
    enabled: true,
  },

  // Zone 2: Sweden - Stockholm Area (Same Day)
  {
    id: 'se-stockholm',
    name: 'Stockholm Area - Same Day',
    countries: ['SE'],
    baseRate: 0,
    freeShippingThreshold: 0,
    estimatedDays: { min: 0, max: 1 },
    courierService: 'Own Delivery Fleet',
    enabled: true,
  },

  // Zone 3: Nordic Countries
  {
    id: 'nordic',
    name: 'Nordic Countries',
    countries: ['NO', 'DK', 'FI'],
    baseRate: 299, // SEK
    freeShippingThreshold: 5000,
    estimatedDays: { min: 2, max: 4 },
    courierService: 'DHL / PostNord',
    enabled: true,
  },

  // Zone 4: EU Core (Germany, Netherlands, Belgium, Austria)
  {
    id: 'eu-core',
    name: 'EU Core Countries',
    countries: ['DE', 'NL', 'BE', 'AT', 'LU'],
    baseRate: 499, // SEK
    freeShippingThreshold: 8000,
    estimatedDays: { min: 3, max: 6 },
    courierService: 'DHL Express',
    enabled: true,
  },

  // Zone 5: EU West (France, UK, Ireland)
  {
    id: 'eu-west',
    name: 'EU Western Europe',
    countries: ['FR', 'GB', 'IE'],
    baseRate: 599, // SEK
    freeShippingThreshold: 10000,
    estimatedDays: { min: 4, max: 7 },
    courierService: 'DHL Express',
    enabled: true,
  },

  // Zone 6: EU South (Italy, Spain, Portugal, Greece)
  {
    id: 'eu-south',
    name: 'EU Southern Europe',
    countries: ['IT', 'ES', 'PT', 'GR'],
    baseRate: 699, // SEK
    freeShippingThreshold: 12000,
    estimatedDays: { min: 5, max: 9 },
    courierService: 'DHL Express / DB Schenker',
    enabled: true,
  },

  // Zone 7: EU East (Poland, Czech, Hungary, etc.)
  {
    id: 'eu-east',
    name: 'EU Eastern Europe',
    countries: ['PL', 'CZ', 'HU', 'SK', 'SI', 'HR', 'RO', 'BG'],
    baseRate: 799, // SEK
    freeShippingThreshold: 15000,
    estimatedDays: { min: 6, max: 10 },
    courierService: 'DHL / DB Schenker',
    enabled: true,
  },

  // Zone 8: Baltic States
  {
    id: 'baltic',
    name: 'Baltic States',
    countries: ['EE', 'LV', 'LT'],
    baseRate: 599, // SEK
    freeShippingThreshold: 10000,
    estimatedDays: { min: 4, max: 7 },
    courierService: 'DHL / DB Schenker',
    enabled: true,
  },
];

/**
 * Get shipping zone for a country code
 */
export function getShippingZone(countryCode: string): ShippingZone | null {
  // Check for Stockholm area (special handling - would need postal code)
  // For now, treat all SE as domestic

  return (
    SHIPPING_ZONES.find(
      (zone) => zone.enabled && zone.countries.includes(countryCode.toUpperCase())
    ) || null
  );
}

/**
 * Calculate shipping cost
 */
export function calculateShippingCost(
  countryCode: string,
  orderTotal: number
): {
  cost: number;
  zone: ShippingZone | null;
  isFree: boolean;
} {
  const zone = getShippingZone(countryCode);

  if (!zone) {
    return { cost: 0, zone: null, isFree: false };
  }

  // Check if order qualifies for free shipping
  if (orderTotal >= zone.freeShippingThreshold) {
    return { cost: 0, zone, isFree: true };
  }

  return { cost: zone.baseRate, zone, isFree: false };
}

/**
 * Get delivery estimate text
 */
export function getDeliveryEstimate(countryCode: string): string {
  const zone = getShippingZone(countryCode);

  if (!zone) {
    return 'Delivery time not available';
  }

  if (zone.estimatedDays.min === 0) {
    return 'Same day delivery available';
  }

  if (zone.estimatedDays.min === zone.estimatedDays.max) {
    return `${zone.estimatedDays.min} business days`;
  }

  return `${zone.estimatedDays.min}-${zone.estimatedDays.max} business days`;
}

/**
 * Country codes to names mapping
 */
export const COUNTRY_NAMES: Record<string, string> = {
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  DE: 'Germany',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  LU: 'Luxembourg',
  FR: 'France',
  GB: 'United Kingdom',
  IE: 'Ireland',
  IT: 'Italy',
  ES: 'Spain',
  PT: 'Portugal',
  GR: 'Greece',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  SK: 'Slovakia',
  SI: 'Slovenia',
  HR: 'Croatia',
  RO: 'Romania',
  BG: 'Bulgaria',
  EE: 'Estonia',
  LV: 'Latvia',
  LT: 'Lithuania',
};
