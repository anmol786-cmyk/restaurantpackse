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
  site_description: "Sweden's premier B2B restaurant supplier & food wholesaler. 15% lower prices on authentic Indo-Pak ingredients, bulk staples & professional kitchen equipment. Stockholm-based manufacturer of the Electric Mini Tandoor.",
  site_domain: "https://restaurantpack.se",
  site_tagline: "Restaurant Supplies Stockholm | 15% Lower Wholesale Prices",
};
