/**
 * FAQ Schema Generator
 * Framework-agnostic function for generating FAQPage schema
 */

import type { FAQPage, Question } from './types';
import { generateSchemaId, cleanSchema } from './base';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQInput {
    pageUrl: string;
    faqs: FAQItem[];
    name?: string;
    description?: string;
}

/**
 * Generate FAQPage Schema
 *
 * @param config - FAQ configuration
 * @returns Complete FAQPage schema object
 */
export function faqSchema(config: FAQInput): FAQPage {
    const schema: FAQPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': generateSchemaId(config.pageUrl, 'faqpage'),
        mainEntity: config.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    if (config.name) {
        schema.name = config.name;
    }

    if (config.description) {
        schema.description = config.description;
    }

    return cleanSchema(schema);
}

/**
 * Pre-configured FAQ for Anmol Wholesale
 * Common questions about delivery, products, and services
 */
export function anmolWholesaleFAQSchema(baseUrl: string = 'https://restaurantpack.se'): FAQPage {
    return faqSchema({
        pageUrl: `${baseUrl}/faq`,
        name: 'Frequently Asked Questions - Anmol Wholesale',
        description: 'Common questions about our products, delivery, and services',
        faqs: [
            {
                question: 'Do you offer free delivery in Stockholm?',
                answer: 'Yes! We offer FREE delivery in Stockholm for orders over 500 SEK. For orders between 300-499 SEK, delivery costs 30 SEK. Minimum order is 300 SEK.',
            },
            {
                question: 'Do you deliver outside Stockholm?',
                answer: 'Yes, we deliver across Sweden and all of Europe with DHL, PostNord, and DB Schenker. There is no minimum order value for European delivery. Rates are calculated at checkout based on your location and order weight.',
            },
            {
                question: 'Do you offer same-day delivery?',
                answer: 'Yes! We offer same-day delivery to nearby areas in Stockholm. Orders must be placed before 4 PM (16:00) for same-day delivery.',
            },
            {
                question: 'Are your products Halal certified?',
                answer: 'Yes, we specialize in Halal certified products. Our meat and many other products are Halal certified for your peace of mind.',
            },
            {
                question: 'What types of products do you sell?',
                answer: 'We offer a wide range of Indo-Pak products for restaurants and grocery stores including Basmati rice, spices and masalas, lentils and pulses, frozen foods, cooking oils, and the Anmol Electric Tandoor.',
            },
            {
                question: 'What are your warehouse hours?',
                answer: 'We are open Monday to Friday from 10:00 to 20:00, and Saturday to Sunday from 11:00 to 19:00.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept Credit Cards, Debit Cards, Stripe, Apple Pay, Google Pay, Bank Transfer, and Invoice for verified B2B accounts.',
            },
            {
                question: 'Can I return or exchange products?',
                answer: 'Yes, we have a 14-day return policy for unopened products. Please contact us at info@restaurantpack.se or call +46769178456 for return arrangements.',
            },
            {
                question: 'Do you have a physical location I can visit?',
                answer: 'Yes! Our warehouse is located at Fagerstagatan 13, 163 53 Spånga, Stockholm. You are welcome to visit us during our operating hours.',
            },
            {
                question: 'How can I contact you?',
                answer: 'You can reach us by phone at +46769178456 or email at info@restaurantpack.se. We are also available on WhatsApp for quick responses.',
            },
        ],
    });
}
