/**
 * WordPress Pages API Functions
 *
 * Functions for fetching and working with WordPress pages via Fourlines MCP
 */

import {
  fetchFourlinesMCP,
  fetchFourlinesCached,
} from './api';
import { FOURLINES_MCP_CONFIG } from './config';

export interface WordPressPage {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: string;
  permalink: string;
  author: string;
  date: string;
  modified: string;
  featured_media?: number;
  slug?: string;
  meta?: Record<string, any>;
}

export interface PageQueryParams {
  type?: string;
  per_page?: number;
  page?: number;
  status?: string;
  slug?: string;
  search?: string;
}

/**
 * Get all pages with optional filters
 */
export async function getPages(params: PageQueryParams = {}): Promise<{
  items: WordPressPage[];
  total: number;
}> {
  const queryObj: Record<string, string> = {
    type: 'page',
    per_page: String(params.per_page || 20),
    page: String(params.page || 1),
  };

  // Add optional params
  if (params.status) queryObj.status = params.status;
  if (params.slug) queryObj.slug = params.slug;
  if (params.search) queryObj.search = params.search;

  const queryParams = new URLSearchParams(queryObj);
  const endpoint = `${FOURLINES_MCP_CONFIG.endpoints.posts}?${queryParams}`;

  const response = await fetchFourlinesCached<{ items: WordPressPage[]; total: number }>(
    endpoint,
    FOURLINES_MCP_CONFIG.cache.pages,
    ['pages']
  );

  return response;
}

/**
 * Get a single page by ID
 */
export async function getPageById(id: number): Promise<WordPressPage> {
  const endpoint = `${FOURLINES_MCP_CONFIG.endpoints.postById(id)}`;

  const page = await fetchFourlinesCached<WordPressPage>(
    endpoint,
    FOURLINES_MCP_CONFIG.cache.pages,
    ['pages', `page-${id}`]
  );

  return page;
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  try {
    const response = await getPages({ slug, per_page: 1 });

    if (response.items && response.items.length > 0) {
      return response.items[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching page by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get the homepage (front page)
 * First tries to get from site settings, then falls back to a page with slug 'home'
 * Always returns null on error, never throws
 */
export async function getHomepage(): Promise<WordPressPage | null> {
  try {
    // Try getting homepage by ID 1321 (the one we just created)
    // In production, you might want to get this from site settings
    const homepage = await getPageById(1321);
    return homepage;
  } catch (error) {
    console.error('Error fetching homepage by ID:', error);

    try {
      // Fallback: try to find by common slugs
      const slugsToTry = ['home', 'homepage', 'front-page'];

      for (const slug of slugsToTry) {
        try {
          const page = await getPageBySlug(slug);
          if (page) return page;
        } catch (slugError) {
          console.error(`Error trying slug "${slug}":`, slugError);
          // Continue to next slug
        }
      }
    } catch (fallbackError) {
      console.error('Error in homepage fallback:', fallbackError);
    }

    return null;
  }
}

/**
 * Parse WordPress page content
 * Extracts structured data from WordPress HTML content
 */
export function parsePageContent(content: string): {
  sections: { type: string; content: string; heading?: string }[];
} {
  const sections: { type: string; content: string; heading?: string }[] = [];

  // Simple parser - split by section tags or headings
  const sectionRegex = /<section[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/section>/gi;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    const className = match[1];
    const sectionContent = match[2];

    // Extract heading if present
    const headingMatch = sectionContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    const heading = headingMatch ? headingMatch[1].replace(/<[^>]*>/g, '') : undefined;

    sections.push({
      type: className || 'default',
      content: sectionContent,
      heading,
    });
  }

  return { sections };
}

/**
 * Decode HTML entities
 */
function decodeHTML(html: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };

  return html.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Extract hero content from page
 */
export function extractHeroContent(content: string): {
  title: string;
  subtitle: string;
} | null {
  const heroMatch = content.match(/<section[^>]*class="hero-section"[^>]*>([\s\S]*?)<\/section>/i);

  if (!heroMatch) return null;

  const heroContent = heroMatch[1];

  const titleMatch = heroContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const subtitleMatch = heroContent.match(/<p[^>]*class="hero-subtitle"[^>]*>(.*?)<\/p>/i);

  return {
    title: titleMatch ? decodeHTML(titleMatch[1].replace(/<[^>]*>/g, '')) : '',
    subtitle: subtitleMatch ? decodeHTML(subtitleMatch[1].replace(/<[^>]*>/g, '')) : '',
  };
}
