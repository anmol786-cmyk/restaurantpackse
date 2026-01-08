/**
 * WebSite and WebPage Schema Generators
 * Framework-agnostic functions for generating website and page schemas
 */

import type { WebSite, WebPage } from './types';
import { generateSchemaId, sanitizeSchemaText, cleanSchema } from './base';

/**
 * Generate WebSite Schema
 *
 * @param config - Website configuration
 * @returns Complete WebSite schema object
 */
export function websiteSchema(config: {
  name: string;
  url: string;
  description?: string;
  organizationId?: string;
  searchUrl?: string;
}): WebSite {
  const schema: WebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': generateSchemaId(config.url, 'website'),
    name: config.name,
    url: config.url,
  };

  // Description
  if (config.description) {
    schema.description = sanitizeSchemaText(config.description);
  }

  // Publisher (link to organization)
  if (config.organizationId) {
    schema.publisher = {
      '@id': config.organizationId,
    };
  }

  // Search functionality
  if (config.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return cleanSchema(schema);
}

/**
 * Generate WebPage Schema
 *
 * @param config - Webpage configuration
 * @returns Complete WebPage schema object
 */
export function webpageSchema(config: {
  name: string;
  url: string;
  description?: string;
  websiteId?: string;
  language?: string;
  datePublished?: string;
  dateModified?: string;
}): WebPage {
  const schema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': generateSchemaId(config.url, 'webpage'),
    name: config.name,
    url: config.url,
  };

  // Description
  if (config.description) {
    schema.description = sanitizeSchemaText(config.description);
  }

  // Link to parent website
  if (config.websiteId) {
    schema.isPartOf = {
      '@id': config.websiteId,
    };
  }

  // Language
  if (config.language) {
    schema.inLanguage = config.language;
  }

  // Dates
  if (config.datePublished) {
    schema.datePublished = config.datePublished;
  }

  if (config.dateModified) {
    schema.dateModified = config.dateModified;
  }

  return cleanSchema(schema);
}

/**
 * Pre-configured Anmol Sweets WebSite Schema
 */
export function anmolWebsiteSchema(baseUrl: string = 'https://anmolsweets.se'): WebSite {
  return websiteSchema({
    name: 'Anmol Sweets & Restaurant',
    url: baseUrl,
    description: 'Experience the authentic flavors of Pakistan & India in Stockholm. Famous for our Halwa Puri, fresh Mithai, and traditional curries.',
    organizationId: generateSchemaId(baseUrl, 'organization'),
    searchUrl: `${baseUrl}/shop`,
  });
}

/**
 * Generate graph structure with multiple schemas
 * Useful for combining Website, Organization, and other schemas
 *
 * @param schemas - Array of schema objects
 * @returns Graph structure with all schemas
 */
export function schemaGraph(...schemas: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.filter(Boolean),
  };
}
