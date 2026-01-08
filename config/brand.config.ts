/**
 * Brand Configuration
 *
 * Centralized branding for easy customization.
 * Change these values to rebrand the entire application.
 *
 * @template Anmol Wholesale - Restaurant Pack
 * @company Anmol Wholesale
 * @website https://restaurantpack.se
 */

export const brandConfig = {
  // Business Information
  businessName: "Anmol Wholesale",
  tagline: "From Our Restaurant Kitchen to Yours",
  description: "Sweden's trusted B2B wholesale supplier for restaurants, grocery stores, and caterers. Backed by Anmol Sweets & Restaurant's culinary expertise. Authentic Indo-Pak products, bulk ingredients, and manufacturer of the Anmol Electric Tandoor.",

  // Cuisine Type
  cuisineType: "Restaurant Supply & Wholesale Distribution",
  cuisineDescription: "professional foodservice and restaurant supplies",

  // Contact Information
  contact: {
    address: "Fagerstagatan 13, 163 53 Spånga, Sweden",
    phone: "+46769178456",
    phoneSecondary: "+46769178456",
    whatsapp: "+46769178456",
    email: "info@restaurantpack.se",
    reservationEmail: "wholesale@restaurantpack.se",
    privacyEmail: "info@restaurantpack.se",
    googleMapsUrl: "https://maps.google.com/?q=Fagerstagatan+13,+Spånga",
    googleBusinessProfile: "https://maps.google.com/?q=Anmol+Wholesale+Spånga",
  },

  // Business Hours
  hours: {
    weekday: "Monday - Friday: 10:00 – 20:00",
    saturday: "Saturday: 11:00 – 19:00",
    sunday: "Sunday: 11:00 – 19:00",
    delivery: "Own delivery fleet for Stockholm area - Ex-warehouse pricing available",
    europe: "European shipping via DHL, PostNord, DB Schenker",
  },

  // Features
  features: {
    hasHalalCertification: true,
    hasVegetarianOptions: true,
    hasVeganOptions: true,
    hasDelivery: true,
    hasOnlineOrdering: true,
    hasEuropeShipping: true,
    hasWholesalePricing: true,
    hasBusinessAccounts: true,
    hasBulkOrdering: true,
  },

  // Dietary Options (for filters)
  dietaryOptions: [
    { id: 'halal', label: 'Halal', enabled: true },
    { id: 'vegetarian', label: 'Vegetarian', enabled: true },
    { id: 'vegan', label: 'Vegan', enabled: true },
    { id: 'organic', label: 'Organic', enabled: true },
    { id: 'gluten-free', label: 'Gluten Free', enabled: true },
  ],

  // Social Media
  // Note: Update these with actual Anmol Wholesale social media handles when available
  social: {
    facebook: "https://www.facebook.com/anmolwholesale",
    instagram: "https://www.instagram.com/anmolwholesale",
    twitter: "https://www.twitter.com/anmolwholesale",
    youtube: "https://www.youtube.com/@anmolwholesale",
    tiktok: "", // Not active yet
  },

  // Currency
  currency: {
    code: "SEK",
    symbol: "kr",
    supportedCurrencies: ["SEK", "EUR", "NOK", "DKK"],
  },

  // SEO
  seo: {
    defaultTitle: "Anmol Wholesale - Restaurant Supply & Foodservice Distribution | Restaurant Pack",
    titleTemplate: "%s | Anmol Wholesale",
    defaultDescription: "Leading B2B wholesale supplier for restaurants, grocery stores, and caterers in Sweden & Europe. Authentic Indo-Pak products, bulk ingredients, competitive pricing. Manufacturer of Anmol Electric Tandoor.",
    keywords: ["wholesale food supplier", "restaurant supplies Sweden", "bulk food distributor", "Indo-Pak wholesale", "foodservice supplier", "B2B grocery", "Anmol Electric Tandoor", "restaurant wholesale Stockholm", "catering supplies", "ethnic food wholesale"],
  },
} as const;

// Type export for TypeScript
export type BrandConfig = typeof brandConfig;
