/**
 * Schema Generation System
 * Production-ready, framework-agnostic JSON-LD schema generators
 *
 * Usage:
 * import { productSchema, breadcrumbSchema, articleSchema } from '@/lib/schema';
 */

// Export all types
export * from './types';

// Export base utilities
export * from './base';

// Export schema generators
export * from './organization';
export * from './brand';
export * from './product';
export * from './category';
export * from './breadcrumb';
export * from './website';
export * from './article';
export * from './faq';
export * from './collection';
export * from './delivery';

/**
 * QUICK START EXAMPLES
 *
 * 1. Product Page:
 * ```tsx
 * import { wooCommerceProductSchema, breadcrumbSchema, productBreadcrumbs } from '@/lib/schema';
 *
 * const productJsonLd = wooCommerceProductSchema(product, { baseUrl: 'https://restaurantpack.se' });
 * const breadcrumbJsonLd = breadcrumbSchema(productBreadcrumbs(product, 'https://restaurantpack.se'));
 *
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
 * ```
 *
 * 2. Category Page:
 * ```tsx
 * import { productCategorySchema, breadcrumbSchema, categoryBreadcrumbs } from '@/lib/schema';
 *
 * const categoryJsonLd = productCategorySchema(category, products, 'https://restaurantpack.se');
 * const breadcrumbJsonLd = breadcrumbSchema(categoryBreadcrumbs(category, 'https://restaurantpack.se'));
 * ```
 *
 * 3. Homepage with Organization:
 * ```tsx
 * import { anmolWholesaleOrganizationSchemaFull, websiteSchema, schemaGraph } from '@/lib/schema';
 *
 * const graph = schemaGraph(
 *   anmolWholesaleOrganizationSchemaFull(),
 *   websiteSchema({ name: 'Anmol Wholesale', url: 'https://restaurantpack.se' })
 * );
 *
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
 * ```
 *
 * 4. Blog Post:
 * ```tsx
 * import { wordPressArticleSchema } from '@/lib/schema';
 *
 * const articleJsonLd = wordPressArticleSchema(post, 'https://restaurantpack.se');
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
 * ```
 *
 * 5. FAQ Page:
 * ```tsx
 * import { anmolWholesaleFAQSchema } from '@/lib/schema';
 *
 * const faqJsonLd = anmolWholesaleFAQSchema('https://restaurantpack.se');
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
 * ```
 */
