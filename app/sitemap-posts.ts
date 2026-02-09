import { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getAllPosts } from '@/lib/wordpress';

/**
 * Blog Posts Sitemap
 * Route: /sitemap-posts.xml
 * Lists all blog posts with hreflang annotations
 */

const LOCALES = ['en', 'sv', 'no', 'da'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.site_domain;

    // Fetch recent posts (up to 100)
    const posts = await getAllPosts({ per_page: 100 } as any);

    if (!posts || posts.length === 0) {
        return [];
    }

    return posts.map((post) => {
        // Default URL (English)
        const url = `${baseUrl}/posts/${post.slug}`;

        // Create alternate language links
        const alternates = {
            languages: {} as Record<string, string>,
        };

        LOCALES.forEach((altLocale) => {
            const localePath = altLocale === 'en' ? '' : `/${altLocale}`;
            alternates.languages[altLocale] = `${baseUrl}${localePath}/posts/${post.slug}`;
        });

        return {
            url,
            lastModified: new Date(post.modified || post.date),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates,
        };
    });
}

export const revalidate = 3600; // Revalidate hourly
