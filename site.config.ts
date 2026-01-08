/**
 * Site Configuration
 *
 * @template Anmol Wholesale - Restaurant Pack
 * @company Anmol Wholesale
 * @website https://restaurantpack.se
 */

type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  site_tagline?: string;
};

export const siteConfig: SiteConfig = {
  site_name: "Anmol Wholesale",
  site_description: "B2B wholesale supplier for restaurants, grocery stores, and caterers in Sweden & Europe. Authentic Indo-Pak products, bulk ingredients, competitive pricing. Manufacturer of Anmol Electric Tandoor.",
  site_domain: "https://restaurantpack.se",
  site_tagline: "From Our Restaurant Kitchen to Yours",
};
