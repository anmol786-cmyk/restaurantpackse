/**
 * Content Configuration
 *
 * All brand-specific content and copy centralized in one place.
 * To rebrand: Just update this file and brand.config.ts
 *
 * @template Anmol Wholesale - Restaurant Pack
 * @company Anmol Wholesale
 * @website https://restaurantpack.se
 */

import { brandConfig } from './brand.config';

export const contentConfig = {
  // Homepage Content
  home: {
    hero: {
      badge: `Professional ${brandConfig.cuisineType}`,
      title: brandConfig.businessName,
      description: `${brandConfig.tagline} - Your trusted B2B partner for authentic Indo-Pak products, bulk ingredients, and professional kitchen equipment. Backed by the expertise of Anmol Sweets & Restaurant.`,
      cta: {
        primary: 'Browse Wholesale Catalog',
        secondary: 'Request Quote',
      },
    },
    features: [
      {
        title: 'Wholesale Pricing',
        description: 'Competitive B2B pricing with bulk and pallet discounts',
        icon: 'trending-down',
      },
      {
        title: 'Anmol Electric Tandoor',
        description: 'Exclusive manufacturer of high-quality electric tandoors',
        icon: 'flame',
      },
      {
        title: 'Reliable Supply Chain',
        description: 'Own delivery fleet + European shipping via DHL, PostNord, DB Schenker',
        icon: 'truck',
      },
      {
        title: 'Restaurant Expertise',
        description: 'Backed by Anmol Sweets & Restaurant - we understand your kitchen',
        icon: 'chef-hat',
      },
    ],
    featuredSection: {
      title: 'Featured Products',
      description: 'Top picks for restaurants, caterers, and grocery stores',
      cta: 'View Full Catalog',
    },
    callToAction: {
      title: `Partner with ${brandConfig.businessName}`,
      description: `Join hundreds of restaurants, grocery stores, and caterers across Sweden and Europe. Get wholesale pricing, reliable supply, and expert support.`,
      buttons: {
        primary: 'Open Business Account',
        secondary: 'Request Quote',
      },
    },
    about: {
      badge: 'Our Story',
      title: 'From Our Restaurant Kitchen to Yours',
      paragraphs: [
        `${brandConfig.businessName} was born from the success of Anmol Sweets & Restaurant, a beloved culinary landmark in Stockholm. We're not just suppliers - we're restaurateurs who understand the pressures of the professional kitchen.`,
        `As manufacturers of the Anmol Electric Tandoor and distributors of authentic Indo-Pak products, we provide the same quality ingredients and equipment that make our own restaurant successful. Your success is our success.`,
      ],
      cta: 'Learn More About Us',
    },
  },

  // Shop Page Content
  menu: {
    title: 'Wholesale Catalog',
    description: `Browse our complete selection of ${brandConfig.cuisineDescription}. From bulk staples to specialty ingredients and professional equipment.`,
    metadata: {
      title: `Wholesale Catalog - ${brandConfig.businessName}`,
      description: `B2B wholesale products for restaurants, grocery stores, and caterers. Indo-Pak specialties, bulk ingredients, and kitchen equipment.`,
    },
  },

  // About Page Content
  about: {
    metadata: {
      title: `About Us - ${brandConfig.businessName}`,
      description: `From Anmol Sweets & Restaurant to wholesale distribution. Learn how we became Sweden's trusted B2B supplier for Indo-Pak products and restaurant equipment.`,
    },
    hero: {
      title: `About ${brandConfig.businessName}`,
      subtitle: `From our restaurant kitchen to yours - Backed by Anmol Sweets & Restaurant since 2010`,
    },
    sections: {
      story: {
        title: 'Our Story',
        content: [
          `${brandConfig.businessName} was born from the success and real-world experience of Anmol Sweets & Restaurant, a beloved culinary landmark in Stockholm. We're not just suppliers; we're restaurateurs. We understand the pressures of the professional kitchen, the critical importance of ingredient consistency, and the need for a reliable supply chain.`,
          `Our mission is simple: leverage our culinary expertise to source and provide the best possible products to our B2B partners, helping them achieve the same level of authenticity and quality that defines our own restaurant. We supply what we use - no compromises.`,
        ],
      },
      philosophy: {
        title: 'What Makes Us Different',
        intro: `As restaurant owners serving restaurant owners, we bring unique advantages to our B2B partners:`,
        points: [
          {
            title: 'Unmatched Authenticity',
            description: 'Our Indo-Pak restaurant background guarantees deep understanding of authentic flavors and quality',
          },
          {
            title: 'Manufacturer of Anmol Electric Tandoor',
            description: 'We design and produce our own professional kitchen equipment',
          },
          {
            title: 'Competitive Wholesale Pricing',
            description: 'Bulk and pallet discounts for restaurants, caterers, and grocery stores',
          },
          {
            title: 'Flexible Logistics',
            description: 'Own delivery fleet for Stockholm + DHL/PostNord/DB Schenker for Europe',
          },
          {
            title: 'Expert Support',
            description: 'Advice from professional chefs who use these products daily',
          },
        ],
      },
      special: {
        title: 'Why Partner with Us',
        content: [
          `We supply restaurants, grocery stores, caterers, and food chains across Sweden, Germany, Norway, and Finland. Every product in our catalog has been tested in our own professional kitchen at Anmol Sweets & Restaurant.`,
          `From bulk basmati rice to our signature electric tandoors, we provide consistent quality, competitive pricing, and reliable delivery. Our warehouse in Spånga ensures fast turnaround for Stockholm-area clients, while our European logistics network serves the broader Nordic and EU markets.`,
        ],
      },
      visit: {
        title: 'Work With Us',
        content: [
          `Opening a business account with ${brandConfig.businessName} gives you access to wholesale pricing, flexible payment terms, and dedicated account management. Whether you need regular weekly deliveries or one-time bulk orders, we're your reliable partner.`,
          `Visit our warehouse at Fagerstagatan 13 in Spånga, or place orders online 24/7. We also offer ex-warehouse pickup for customers who prefer to arrange their own logistics.`,
        ],
      },
    },
    values: [
      {
        emoji: '👨‍🍳',
        title: 'Restaurant Expertise',
        description: 'Backed by Anmol Sweets & Restaurant - we understand professional kitchens',
      },
      {
        emoji: '🏭',
        title: 'Manufacturing',
        description: 'We produce the Anmol Electric Tandoor - quality you can trust',
      },
      {
        emoji: '🤝',
        title: 'Partnership Focus',
        description: 'Your success is our success - dedicated B2B support',
      },
    ],
    cta: {
      title: `Ready to Partner with ${brandConfig.businessName}?`,
      description: 'Open a business account today and unlock wholesale pricing',
      buttons: {
        primary: 'Open Business Account',
        secondary: 'Contact Us',
      },
    },
  },

  // Contact Page Content
  contact: {
    metadata: {
      title: `Contact Us - ${brandConfig.businessName}`,
      description: 'Get in touch for wholesale inquiries, business accounts, or quote requests. We serve restaurants, grocery stores, and caterers across Europe.',
    },
    title: 'Get in Touch',
    description: `Have a wholesale inquiry or need a custom quote? Our B2B team is here to help. Reach out for business account setup, product information, or logistics questions.`,
  },

  // Reservations/Bulk Orders Page Content
  reservations: {
    metadata: {
      title: `Request Wholesale Quote - ${brandConfig.businessName}`,
      description: `Need bulk quantities or custom orders? Request a quote for wholesale pricing on cases and pallets. Fast turnaround for business customers.`,
    },
    title: 'Request Wholesale Quote',
    description: `Planning a large order or need custom quantities? Our wholesale team will provide competitive pricing within 24 hours. Perfect for restaurants, caterers, and grocery stores.`,
    benefits: {
      title: 'Why Choose Wholesale?',
      items: [
        {
          title: 'Bulk & Pallet Discounts',
          description: 'Significant savings on case and pallet quantities.',
        },
        {
          title: 'Custom Sourcing',
          description: 'Need specific products? We can source and supply based on your requirements.',
        },
        {
          title: 'Flexible Logistics',
          description: 'Own delivery, ex-warehouse pickup, or arrange your own freight.',
        },
      ],
    },
    howToBook: {
      title: 'How to Order:',
      steps: [
        'Fill out the form below with your requirements.',
        'Specify the products and quantities you need.',
        'Add any special requests or delivery instructions.',
        'Submit and we will contact you with a quote!',
      ],
    },
    walkIns: {
      title: 'In-Store Pickup Available!',
      description: 'Prefer to pick up your order? We can prepare bulk orders for in-store pickup as well.',
    },
    policy: {
      title: 'Bulk Order Policy',
      points: [
        '• Minimum order quantity may apply for bulk pricing',
        '• Orders should be placed at least 48 hours in advance',
        '• Custom quotes provided within 24 hours',
        '• Delivery fees may vary based on quantity and location',
        '• Payment terms available for business accounts',
      ],
    },
    largeGroups: {
      description: 'For large bulk orders, special requests, or any questions, feel free to call us at',
    },
  },

  // Privacy Policy Content
  privacy: {
    metadata: {
      title: `Privacy Policy - ${brandConfig.businessName}`,
      description: 'Our privacy policy and data protection practices',
    },
    title: 'Privacy Policy',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.privacyEmail || brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
  },

  // Terms & Conditions Content
  terms: {
    metadata: {
      title: `Terms & Conditions - ${brandConfig.businessName}`,
      description: 'Terms and conditions for using our website and services',
    },
    title: 'Terms & Conditions',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
    location: 'Spånga, Stockholm',
    country: 'Sweden',
  },

  // Common Phrases (used across multiple pages)
  common: {
    orderNow: 'Shop Now',
    viewMenu: 'Browse Products',
    makeReservation: 'Request Bulk Order',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    readMore: 'Read More',
    viewAll: 'View All',
    backToHome: 'Back to Home',

    // Image placeholders
    imagePlaceholders: {
      hero: 'Feature Your Hero Image Here',
      heroSubtext: 'Add an image of your store or featured products',
      restaurant: 'Add Store Image',
      restaurantSubtext: 'Showcase your store interior or team',
    },
  },
} as const;

// Type export
export type ContentConfig = typeof contentConfig;
