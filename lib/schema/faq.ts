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
                answer: 'Yes! We offer FREE delivery in the Stockholm area for wholesale orders over 5,000 SEK using our own fleet. For smaller orders, pallet freight rates apply or you can choose Ex-Warehouse pickup.',
            },
            {
                question: 'Do you deliver outside Stockholm?',
                answer: 'Yes, we deliver across Sweden and all of Europe via DHL Freight and DB Schenker. We specialize in B2B logistics for bulk restaurant supplies. Shipping rates are calculated based on weight and destination at checkout.',
            },
            {
                question: 'Can I pick up my order from the warehouse?',
                answer: 'Yes! We offer Ex-Warehouse pickup from our facility in Spånga. This is a popular option for local restaurants and grocery stores. Please select "Pickup" at checkout or contact your account manager.',
            },
            {
                question: 'Are your products Halal certified?',
                answer: 'Yes, we specialize in Halal certified products. Our bulk ingredients and many other restaurant supplies are Halal certified for the professional kitchen.',
            },
            {
                question: 'What types of wholesale products do you sell?',
                answer: 'We provide a complete range of Indo-Pak products for the foodservice industry, including bulk Basmati rice (20kg+), large-format spices, cooking oils, dairy, and the professional-grade Anmol Electric Tandoor.',
            },
            {
                question: 'What are your warehouse operating hours?',
                answer: 'Our Spånga warehouse is open Monday to Friday from 10:00 to 20:00, and Saturday to Sunday from 11:00 to 19:00 for pickups and inquiries.',
            },
            {
                question: 'What B2B payment methods do you accept?',
                answer: 'We accept Credit/Debit Cards, Stripe, Apple/Google Pay, and Bank Transfer. Verified business accounts can also apply for Invoice terms (Net 30).',
            },
            {
                question: 'How do you handle large pallet orders?',
                answer: 'We are experts in pallet logistics. Bulk orders are securely packed on standard pallets and delivered via tail-lift trucks to ensure easy unloading at your establishment.',
            },
            {
                question: 'Do you manufacture the Anmol Electric Tandoor?',
                answer: 'Yes, Anmol AB is the official manufacturer. We supply these professional tandoors directly to restaurants across Scandinavia and Europe.',
            },
            {
                question: 'How can I contact the wholesale team?',
                answer: 'You can reach our B2B team by phone at +46769178456 or email at wholesale@restaurantpack.se. We are also available on WhatsApp for wholesale inquiries.',
            },
        ],
    });
}
