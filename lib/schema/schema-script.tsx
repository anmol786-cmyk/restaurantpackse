/**
 * Schema Script Component
 * React component for injecting JSON-LD schemas into Next.js pages
 */

import React from 'react';

/**
 * SchemaScript Component
 * Renders a JSON-LD script tag with proper formatting
 *
 * @param schema - Schema object(s) to render
 * @param id - Optional ID for the script tag
 */
export function SchemaScript({
  schema,
  id
}: {
  schema: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}) {
  // Handle both single schema and array of schemas
  const schemaData = Array.isArray(schema)
    ? schema.length === 1
      ? schema[0]
      : { '@context': 'https://schema.org', '@graph': schema }
    : schema;

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 0), // Minified for production
      }}
    />
  );
}

/**
 * PrettySchemaScript Component
 * Same as SchemaScript but with pretty-printed JSON (useful for development)
 *
 * @param schema - Schema object(s) to render
 * @param id - Optional ID for the script tag
 */
export function PrettySchemaScript({
  schema,
  id
}: {
  schema: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}) {
  // Handle both single schema and array of schemas
  const schemaData = Array.isArray(schema)
    ? schema.length === 1
      ? schema[0]
      : { '@context': 'https://schema.org', '@graph': schema }
    : schema;

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 2), // Pretty-printed
      }}
    />
  );
}

/**
 * MultiSchemaScript Component
 * Renders multiple schemas as a graph structure
 *
 * @param schemas - Array of schema objects
 * @param id - Optional ID for the script tag
 */
export function MultiSchemaScript({
  schemas,
  id
}: {
  schemas: Record<string, unknown>[];
  id?: string;
}) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': schemas.filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph, null, 0),
      }}
    />
  );
}
