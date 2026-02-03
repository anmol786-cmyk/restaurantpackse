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
  site_description: "Sveriges ledande B2B restaurang grossist. 15% lägre priser på indiska kryddor, basmati ris, storköksvaror & elektrisk tandoor. Snabb leverans Stockholm & hela Sverige.",
  site_domain: "https://restaurantpack.se",
  site_tagline: "Restaurang Grossist Stockholm | 15% Lägre Grossistpriser",
};
