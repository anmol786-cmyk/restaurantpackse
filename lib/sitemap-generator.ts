import { MetadataRoute } from 'next';

/**
 * Generates valid XML string for a URL Set sitemap
 */
export function generateSitemapXml(items: MetadataRoute.Sitemap): string {
    // Explicitly define header without leading newlines
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">';

    const urls = items.map(item => {
        let urlBlock = `  <url>
    <loc>${item.url}</loc>`;

        if (item.lastModified) {
            const dateStr = item.lastModified instanceof Date
                ? item.lastModified.toISOString()
                : new Date(item.lastModified).toISOString();
            urlBlock += `\n    <lastmod>${dateStr}</lastmod>`;
        }

        if (item.changeFrequency) {
            urlBlock += `\n    <changefreq>${item.changeFrequency}</changefreq>`;
        }

        if (item.priority !== undefined) {
            urlBlock += `\n    <priority>${item.priority.toFixed(1)}</priority>`;
        }

        if (item.alternates && item.alternates.languages) {
            Object.entries(item.alternates.languages).forEach(([lang, href]) => {
                urlBlock += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`;
            });
        }

        urlBlock += `\n  </url>`;
        return urlBlock;
    }).join('\n');

    const footer = '\n</urlset>';

    return (header + '\n' + urls + footer).trim();
}

/**
 * Generates valid XML string for a Sitemap Index
 */
export function generateSitemapIndexXml(sitemaps: string[]): string {
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    const content = sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n');

    const footer = '\n</sitemapindex>';
    return (header + '\n' + content + footer).trim();
}
