import knowledgeBase from '@/data/knowledge-base.json';
import { brandConfig } from '@/config/brand.config';

interface KnowledgeBaseResponse {
    answer: string;
    confidence: 'high' | 'medium' | 'low';
    category?: string;
}

/**
 * Search the knowledge base for relevant information
 */
export function searchKnowledgeBase(query: string): KnowledgeBaseResponse {
    const lowerQuery = query.toLowerCase();

    // Check for keyword matches
    const matchedKeywords = findMatchingKeywords(lowerQuery);

    // Prioritize specific intents
    if (matchedKeywords.includes('shipping') || lowerQuery.includes('deliver')) {
        return getShippingInfo(lowerQuery);
    }

    if (matchedKeywords.includes('payment') || lowerQuery.includes('pay')) {
        return getPaymentInfo();
    }

    if (matchedKeywords.includes('order') || lowerQuery.includes('bulk') || lowerQuery.includes('quick order')) {
        return getOrderingInfo(lowerQuery);
    }

    if (matchedKeywords.includes('price') || lowerQuery.includes('wholesale')) {
        return getPricingInfo();
    }

    if (matchedKeywords.includes('tandoor') || lowerQuery.includes('oven')) {
        return getTandoorInfo();
    }

    if (matchedKeywords.includes('halal')) {
        return getDietaryInfo('halal');
    }

    if (matchedKeywords.includes('rice') || matchedKeywords.includes('flour') || matchedKeywords.includes('oil')) {
        return getProductInfo(lowerQuery);
    }

    if (matchedKeywords.includes('location') || lowerQuery.includes('warehouse') || lowerQuery.includes('visit')) {
        return getLocationInfo();
    }

    if (matchedKeywords.includes('hours') || lowerQuery.includes('open')) {
        return getHoursInfo();
    }

    if (matchedKeywords.includes('account') || lowerQuery.includes('register') || lowerQuery.includes('business')) {
        return getAccountInfo();
    }

    if (matchedKeywords.includes('packaging')) {
        return getPackagingInfo();
    }

    // Try to find FAQ match
    const faqMatch = findFAQMatch(lowerQuery);
    if (faqMatch) {
        return {
            answer: faqMatch.answer,
            confidence: 'high',
            category: faqMatch.category
        };
    }

    // Check for greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        return getGreetingResponse();
    }

    // Default response
    return getDefaultResponse();
}

function findMatchingKeywords(query: string): string[] {
    const matched: string[] = [];
    const keywords = knowledgeBase.keywords as Record<string, string[]>;

    Object.entries(keywords).forEach(([category, keywordList]) => {
        if (keywordList.some(keyword => query.includes(keyword.toLowerCase()))) {
            matched.push(category);
        }
    });
    return matched;
}

function findFAQMatch(query: string): { answer: string; category: string } | null {
    const faqs = knowledgeBase.faqs as Array<{ question: string; answer: string; category: string }>;

    return faqs.find(faq =>
        query.includes(faq.question.toLowerCase()) ||
        faq.question.toLowerCase().includes(query) ||
        calculateSimilarity(query, faq.question.toLowerCase()) > 0.5
    ) || null;
}

function getShippingInfo(query: string): KnowledgeBaseResponse {
    const shipping = knowledgeBase.shipping;

    if (query.includes('stockholm')) {
        return {
            answer: `**Stockholm Delivery:**\n\n🚚 **Same-day delivery** available via our own fleet\n📍 **Pickup available** at Fagerstagatan 13, Spånga\n💰 **Free shipping** for wholesale orders\n\nFor the fastest service, schedule a pickup from our warehouse!`,
            confidence: 'high',
            category: 'shipping'
        };
    }

    if (query.includes('europe') || query.includes('eu') || query.includes('international')) {
        const euZones = shipping.zones.filter(z => z.name.includes('EU'));
        const zoneInfo = euZones.map(z => `• **${z.name}**: ${z.delivery}, ${z.cost}`).join('\n');

        return {
            answer: `**European Shipping:**\n\n${zoneInfo}\n\nWe ship to all EU countries! No customs hassle within the EU.`,
            confidence: 'high',
            category: 'shipping'
        };
    }

    // General shipping info
    const zoneInfo = shipping.zones.slice(0, 4).map(z => `• **${z.name}**: ${z.delivery}`).join('\n');

    return {
        answer: `**Shipping Options:**\n\n${zoneInfo}\n\n📍 **Warehouse Pickup:** ${shipping.pickup}\n\nWe deliver across Sweden and all of Europe! [View shipping details](/delivery-information)`,
        confidence: 'high',
        category: 'shipping'
    };
}

function getPaymentInfo(): KnowledgeBaseResponse {
    const methods = knowledgeBase.payment.methods;
    const methodList = methods.map(m => `• **${m.name}**: ${m.description}`).join('\n');

    return {
        answer: `**Payment Methods:**\n\n${methodList}\n\n💡 **Tip:** Business accounts can apply for invoice payment and credit terms! [Register here](/wholesale/register)`,
        confidence: 'high',
        category: 'payment'
    };
}

function getOrderingInfo(query: string): KnowledgeBaseResponse {
    if (query.includes('quick') || query.includes('fast') || query.includes('bulk')) {
        const quickOrder = knowledgeBase.quickOrder;
        const benefits = quickOrder.benefits.map(b => `• ${b}`).join('\n');

        return {
            answer: `**Quick Order Feature:**\n\n${quickOrder.description}\n\n**Benefits:**\n${benefits}\n\n[Start Quick Order](/wholesale/quick-order) | [Browse Products](/shop)`,
            confidence: 'high',
            category: 'ordering'
        };
    }

    return {
        answer: `**How to Order:**\n\n1. Browse our [product catalog](/shop)\n2. Add items to cart\n3. Checkout with your preferred payment method\n\n💡 **For bulk orders:** Use our [Quick Order](/wholesale/quick-order) feature or contact us at wholesale@restaurantpack.se\n\n📞 Phone: ${knowledgeBase.contact.phone}`,
        confidence: 'high',
        category: 'ordering'
    };
}

function getPricingInfo(): KnowledgeBaseResponse {
    return {
        answer: `**Wholesale Pricing:**\n\nWe offer competitive B2B pricing - typically **15% lower** than market rates!\n\n**How to get wholesale pricing:**\n1. Register for a [Business Account](/wholesale/register)\n2. Get verified (usually within 24 hours)\n3. Access wholesale prices on all products\n\n**No minimum order required!** Order any amount.\n\nQuantity discounts apply automatically at checkout.`,
        confidence: 'high',
        category: 'pricing'
    };
}

function getTandoorInfo(): KnowledgeBaseResponse {
    const tandoor = knowledgeBase.products.featured[0];

    return {
        answer: `**Anmol Mini Electric Tandoor**\n\n🔥 Our flagship product - **manufactured by us in Stockholm!**\n\n• Price: **${tandoor.price} kr**\n• Perfect for naan, roti, chapati, and tandoori dishes\n• Compact design for European kitchens\n• Professional-grade quality\n• **15% lower** than market price (we're the manufacturer!)\n\n[View Product](/product/mini-electric-tandoor-oven) | [Contact for bulk orders](mailto:wholesale@restaurantpack.se)`,
        confidence: 'high',
        category: 'products'
    };
}

function getProductInfo(query: string): KnowledgeBaseResponse {
    const categories = knowledgeBase.products.categories;

    let matchedCategory = null;
    if (query.includes('rice')) {
        matchedCategory = categories.find(c => c.name.includes('Rice'));
    } else if (query.includes('flour') || query.includes('atta') || query.includes('besan')) {
        matchedCategory = categories.find(c => c.name.includes('Rice')); // Rice & Grains includes flour
    } else if (query.includes('oil') || query.includes('ghee')) {
        matchedCategory = categories.find(c => c.name.includes('Oils'));
    }

    if (matchedCategory) {
        const examples = matchedCategory.examples.join(', ');
        return {
            answer: `**${matchedCategory.name}:**\n\n${matchedCategory.description}\n\n**Popular products:** ${examples}\n\n[Browse all ${matchedCategory.name}](/shop)`,
            confidence: 'high',
            category: 'products'
        };
    }

    // General product info
    const categoryList = categories.slice(0, 5).map(c => `• ${c.name}`).join('\n');

    return {
        answer: `**Our Product Categories:**\n\n${categoryList}\n• ...and more!\n\n[Browse all products](/shop) | [Quick Order](/wholesale/quick-order)`,
        confidence: 'medium',
        category: 'products'
    };
}

function getPackagingInfo(): KnowledgeBaseResponse {
    const packagingCategory = knowledgeBase.products.categories.find(c => c.name === 'Packaging');

    if (packagingCategory) {
        const examples = packagingCategory.examples.join(', ');
        return {
            answer: `**Packaging Supplies:**\n\n${packagingCategory.description}\n\n**Available products:** ${examples}\n\nPerfect for sweet shops, restaurants, and catering businesses!\n\n[Browse Packaging](/product-category/packing)`,
            confidence: 'high',
            category: 'products'
        };
    }

    return getDefaultResponse();
}

function getDietaryInfo(type: string): KnowledgeBaseResponse {
    const dietary = knowledgeBase.dietary_options as Record<string, { available: boolean; description: string; note?: string; examples?: string[] }>;
    const info = dietary[type];

    if (info && info.available) {
        let answer = info.description;
        if (info.examples) {
            answer += `\n\n**Examples:** ${info.examples.join(', ')}`;
        }
        if (info.note) {
            answer += `\n\n💡 ${info.note}`;
        }
        return {
            answer,
            confidence: 'high',
            category: 'dietary'
        };
    }

    return getDefaultResponse();
}

function getLocationInfo(): KnowledgeBaseResponse {
    const contact = knowledgeBase.contact;
    const hours = knowledgeBase.hours;

    return {
        answer: `**Visit Our Warehouse:**\n\n📍 **Address:** ${contact.address}\n\n📞 **Phone:** ${contact.phone}\n📧 **Email:** ${contact.email}\n\n**Opening Hours:**\n${hours.weekday}\n${hours.saturday}\n${hours.sunday}\n\n[Get Directions](${brandConfig.contact.googleMapsUrl})`,
        confidence: 'high',
        category: 'location'
    };
}

function getHoursInfo(): KnowledgeBaseResponse {
    const hours = knowledgeBase.hours;

    return {
        answer: `**Opening Hours:**\n\n📅 ${hours.weekday}\n📅 ${hours.saturday}\n📅 ${hours.sunday}\n\n📍 Location: ${knowledgeBase.contact.address}\n\nWarehouse pickup available during these hours!`,
        confidence: 'high',
        category: 'hours'
    };
}

function getAccountInfo(): KnowledgeBaseResponse {
    return {
        answer: `**Business Account Benefits:**\n\n✅ Wholesale pricing (15% lower than retail)\n✅ Invoice payment (Net 28 days)\n✅ Credit terms for established partners\n✅ Dedicated account management\n✅ Priority support\n\n**How to register:**\n1. Visit [Business Registration](/wholesale/register)\n2. Fill in your company details\n3. Get verified within 24 hours\n4. Start ordering at wholesale prices!\n\nAlready have an account? [Login here](/login)`,
        confidence: 'high',
        category: 'account'
    };
}

function getGreetingResponse(): KnowledgeBaseResponse {
    return {
        answer: `Hello! Welcome to **Anmol Wholesale** - Sweden's trusted B2B supplier for restaurants and caterers. 👋\n\nHow can I help you today? I can assist with:\n• 📦 Product information\n• 🚚 Shipping & delivery\n• 💳 Payment options\n• 🏪 Wholesale pricing\n• 📍 Warehouse location`,
        confidence: 'high',
        category: 'greeting'
    };
}

function getDefaultResponse(): KnowledgeBaseResponse {
    return {
        answer: `Thanks for your question! At **${knowledgeBase.business.name}**, we're here to help.\n\nQuick links:\n• [Browse Products](/shop)\n• [Quick Order](/wholesale/quick-order)\n• [Business Registration](/wholesale/register)\n• [Contact Us](/contact)\n\n📞 Call us: ${knowledgeBase.contact.phone}\n📧 Email: ${knowledgeBase.contact.email}\n\nWhat would you like to know more about?`,
        confidence: 'low'
    };
}

// Simple similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
}

export function getGreeting(): string {
    return `Hello! I'm your **Anmol Wholesale Assistant**. 👋\n\nI can help you with:\n\n🛒 **Products** - Rice, flour, oils, tandoor ovens & more\n🚚 **Shipping** - Sweden & Europe delivery info\n💳 **Payments** - Card, Swish, Invoice options\n🏪 **Wholesale** - Business account & pricing\n📍 **Location** - Warehouse visit & pickup\n\nWhat can I help you with today?`;
}
