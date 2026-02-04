/**
 * Brand Profile Configuration
 * Central source of truth for all brand-related information
 *
 * @template Anmol Wholesale - Restaurant Pack
 * @company Anmol Wholesale
 * @website https://restaurantpack.se
 *
 * Update this file to automatically update brand information throughout the entire template
 */

export const brandProfile = {
    // Basic Information
    name: "Anmol Wholesale",
    tagline: "Kitchen to Kitchen",
    taglineFull: "From Our Restaurant Kitchen to Yours",
    description: "Sweden's trusted B2B wholesale supplier for restaurants, grocery stores, and caterers. Backed by Anmol Sweets & Restaurant's culinary expertise. Authentic Indo-Pak products, bulk ingredients, and manufacturer of the Anmol Electric Tandoor.",

    // Contact Information
    contact: {
        phone: "+46 76 917 84 56",
        phoneFormatted: "+46 76 917 84 56",
        whatsapp: "+46769178456",
        email: "info@restaurantpack.se",
        supportEmail: "wholesale@restaurantpack.se",
    },

    // Physical Warehouse Address
    address: {
        street: "Fagerstagatan 13",
        area: "Spånga",
        postalCode: "163 53",
        city: "Stockholm",
        country: "Sweden",
        formatted: "Fagerstagatan 13, 163 53 Spånga, Stockholm, Sweden",
    },

    // Business Hours
    hours: {
        monday: { open: "10:00", close: "20:00", display: "10 AM - 8 PM" },
        tuesday: { open: "10:00", close: "20:00", display: "10 AM - 8 PM" },
        wednesday: { open: "10:00", close: "20:00", display: "10 AM - 8 PM" },
        thursday: { open: "10:00", close: "20:00", display: "10 AM - 8 PM" },
        friday: { open: "10:00", close: "20:00", display: "10 AM - 8 PM" },
        saturday: { open: "11:00", close: "19:00", display: "11 AM - 7 PM" },
        sunday: { open: "11:00", close: "19:00", display: "11 AM - 7 PM" },
    },

    // Website & Online Presence
    website: {
        url: "https://restaurantpack.se",
        domain: "restaurantpack.se",
    },

    // Social Media (Update with actual Anmol Wholesale social media when available)
    social: {
        facebook: "https://www.facebook.com/AnmolWholesale",
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
        linkedin: "",
    },

    // Delivery Information
    delivery: {
        local: {
            freeThreshold: 5000, // SEK
            minimumOrder: 0, // SEK (no minimum for retail, wholesale has MOQs per product)
            standardFee: 0, // Own delivery fleet for Stockholm area
            sameDayAreas: [
                "Stockholm City",
                "Spånga",
                "Kista",
                "Sundbyberg",
                "Solna",
            ],
            sameDayCutoffTime: "14:00",
            sameDayWindow: "Next business day",
            coverageAreas: [
                "Stockholm County",
                "Uppsala",
                "Södertälje",
                "Västerås",
                "Greater Stockholm Area",
            ],
        },
        national: {
            carrier: "DHL, PostNord, DB Schenker",
            noMinimum: false,
            minimumOrder: 2000, // SEK for national shipping
        },
        international: {
            available: true,
            carrier: "DHL, PostNord, DB Schenker",
            noMinimum: false,
            minimumOrder: 5000, // SEK for international orders
            targetMarkets: ["Germany", "Norway", "Finland", "Denmark", "EU"],
        },
        exWarehouse: {
            available: true,
            location: "Fagerstagatan 13, 163 53 Spånga",
            instructions: "Customers can arrange their own logistics and pickup at warehouse",
        },
    },

    // Product Categories
    productCategories: [
        "Anmol Electric Tandoor",
        "Basmati Rice (Bulk)",
        "Ghee & Cooking Oils",
        "Spices & Masalas",
        "Flours & Grains",
        "Frozen Foods",
        "Dairy Products",
        "Pantry Staples",
        "Restaurant Equipment",
    ],

    // Services & Features
    features: [
        "Wholesale B2B pricing with bulk discounts",
        "Manufacturer of Anmol Electric Tandoor",
        "Own delivery fleet for Stockholm area",
        "European shipping via DHL, PostNord, DB Schenker",
        "Ex-warehouse pickup available",
        "Case and pallet quantities",
        "Business account management",
        "Custom sourcing available",
        "Backed by Anmol Sweets & Restaurant expertise",
    ],

    // SEO & Marketing
    seo: {
        keywords: [
            "wholesale food supplier Sweden",
            "restaurant supplies Stockholm",
            "bulk Indo-Pak products",
            "Anmol Electric Tandoor",
            "B2B foodservice distributor",
            "wholesale grocery Sweden",
            "catering supplies Nordic",
            "bulk basmati rice",
            "restaurant wholesale Europe",
            "ethnic food wholesale",
        ],
        localAreas: [
            "Stockholm",
            "Spånga",
            "Uppsala",
            "Göteborg",
            "Malmö",
            "Germany",
            "Norway",
            "Finland",
        ],
    },

    // Business Information
    business: {
        founded: "2010", // Based on Anmol Sweets & Restaurant
        type: "B2B Wholesale & Distribution",
        specialization: "Restaurant Supply & Indo-Pak Wholesale",
        certifications: ["Halal Certified", "Food Safety Certified"],
        paymentMethods: [
            "Credit Card",
            "Debit Card",
            "Invoice (Net 30/60 for verified businesses)",
            "Stripe",
            "Bank Transfer",
        ],
        affiliatedBrands: [
            "Anmol Sweets & Restaurant (anmolsweets.se)",
        ],
    },
};

export default brandProfile;
