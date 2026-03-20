/**
 * Speakable Schema Generator
 * Marks content as suitable for text-to-speech by Google Assistant,
 * Google AI Overviews, Bing Copilot, and other AI search features.
 *
 * Google uses speakable schema to identify which content on a page
 * is most relevant for voice responses and AI-generated summaries.
 */

export interface SpeakableInput {
  pageUrl: string;
  cssSelectors?: string[];
  xPaths?: string[];
}

/**
 * Generate Speakable Schema
 * Points AI crawlers to the most authoritative content sections
 */
export function speakableSchema(config: SpeakableInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
    },
    url: config.pageUrl,
  };

  const spec: Record<string, unknown> = { '@type': 'SpeakableSpecification' };

  if (config.cssSelectors && config.cssSelectors.length > 0) {
    spec.cssSelector = config.cssSelectors;
  }

  if (config.xPaths && config.xPaths.length > 0) {
    spec.xpath = config.xPaths;
  }

  schema.speakable = spec;

  return schema;
}

/**
 * Pre-configured speakable schema for Anmol Wholesale homepage
 * Targets the hero heading, subtitle, and key feature sections
 */
export function homepageSpeakableSchema(baseUrl: string = 'https://restaurantpack.se') {
  return speakableSchema({
    pageUrl: baseUrl,
    cssSelectors: [
      'h1',
      '.hero-subtitle',
      '[data-speakable="true"]',
      'section:first-of-type h2',
    ],
  });
}

/**
 * Pre-configured speakable schema for product pages
 * Targets product name, description, and price
 */
export function productSpeakableSchema(productUrl: string) {
  return speakableSchema({
    pageUrl: productUrl,
    cssSelectors: [
      'h1',
      '[data-speakable="product-description"]',
      '[data-speakable="product-price"]',
    ],
  });
}

/**
 * Pre-configured speakable schema for FAQ page
 */
export function faqSpeakableSchema(baseUrl: string = 'https://restaurantpack.se') {
  return speakableSchema({
    pageUrl: `${baseUrl}/faq`,
    cssSelectors: [
      'h1',
      '[data-radix-accordion-content]',
      '[data-state="open"]',
    ],
  });
}
