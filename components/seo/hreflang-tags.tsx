/**
 * Hreflang Tags for International SEO
 * Tells search engines which language/region versions exist
 * English = default (no prefix), Swedish/Norwegian/Danish = prefixed
 */

interface HreflangTagsProps {
  canonicalUrl: string;
  pathname?: string;
}

export function HreflangTags({ canonicalUrl, pathname = '' }: HreflangTagsProps) {
  const baseUrl = canonicalUrl.replace(/\/$/, '');
  const path = pathname.replace(/^\//, '');

  return (
    <>
      {/* English version (default - no prefix) */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/${path}`} />

      {/* Swedish version */}
      <link rel="alternate" hrefLang="sv" href={`${baseUrl}/sv/${path}`} />
      <link rel="alternate" hrefLang="sv-SE" href={`${baseUrl}/sv/${path}`} />

      {/* Norwegian version */}
      <link rel="alternate" hrefLang="no" href={`${baseUrl}/no/${path}`} />
      <link rel="alternate" hrefLang="nb-NO" href={`${baseUrl}/no/${path}`} />

      {/* Danish version */}
      <link rel="alternate" hrefLang="da" href={`${baseUrl}/da/${path}`} />
      <link rel="alternate" hrefLang="da-DK" href={`${baseUrl}/da/${path}`} />

      {/* Default/fallback - points to English (unprefixed) */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/${path}`} />
    </>
  );
}
