import type { Product } from '@/types/woocommerce';

/**
 * Custom Product Sorting Utility
 * 
 * Defines the strategic product display order for homepage and shop page
 * 
 * Priority Order:
 * 1. Tandoor (highest priority - featured product)
 * 2. Rooh Afza
 * 3. Rice products
 * 4. Dry Milk
 * 5. Sugar
 * 6. Dates
 * 7. Similar products grouped together (milk products, oils, etc.)
 * 8. Packing products (lowest priority)
 */

// Product name patterns for priority matching
const PRODUCT_PRIORITIES = {
    // Tier 1: Featured product
    tandoor: {
        priority: 1,
        patterns: ['tandoor', 'electric tandoor', 'mini tandoor', 'anmol tandoor']
    },

    // Tier 2: Strategic products in specific order
    roohAfza: {
        priority: 2,
        patterns: ['rooh afza', 'rooh-afza', 'roohafza']
    },
    rice: {
        priority: 3,
        patterns: ['rice', 'basmati', 'sella', 'biryani rice', 'idli rice']
    },
    dryMilk: {
        priority: 4,
        patterns: ['dry milk', 'milk powder', 'powdered milk', 'nido']
    },
    sugar: {
        priority: 5,
        patterns: ['sugar', 'shakkar', 'gur', 'jaggery']
    },
    dates: {
        priority: 6,
        patterns: ['dates', 'khajoor', 'ajwa', 'medjool']
    },

    // Tier 3: Grouped similar products
    milkProducts: {
        priority: 7,
        patterns: ['milk', 'dahi', 'yogurt', 'paneer', 'cheese', 'butter', 'ghee', 'cream']
    },
    oils: {
        priority: 8,
        patterns: ['oil', 'tel', 'cooking oil', 'mustard oil', 'olive oil', 'sunflower']
    },
    spices: {
        priority: 9,
        patterns: ['masala', 'spice', 'mirch', 'haldi', 'jeera', 'dhania', 'garam masala']
    },
    flours: {
        priority: 10,
        patterns: ['flour', 'atta', 'maida', 'besan', 'sooji', 'rava']
    },
    snacks: {
        priority: 11,
        patterns: ['haldiram', 'namkeen', 'chips', 'mixture', 'bhujia', 'sev']
    },
    beverages: {
        priority: 12,
        patterns: ['tea', 'chai', 'coffee', 'drink', 'juice', 'lassi']
    },
    frozen: {
        priority: 13,
        patterns: ['frozen', 'ice cream', 'kulfi']
    },

    // Tier 4: Lowest priority
    packing: {
        priority: 99,
        patterns: ['box', 'container', 'bag', 'packaging', 'wrap', 'foil', 'paper', 'disposable']
    }
};

/**
 * Get priority score for a product based on its name and category
 */
function getProductPriority(product: Product): number {
    const searchText = `${product.name} ${product.categories?.map(c => c.name).join(' ')}`.toLowerCase();

    // Check each priority tier
    for (const [key, config] of Object.entries(PRODUCT_PRIORITIES)) {
        for (const pattern of config.patterns) {
            if (searchText.includes(pattern.toLowerCase())) {
                return config.priority;
            }
        }
    }

    // Default priority for unmatched products
    return 50;
}

/**
 * Sort products according to strategic display order
 * 
 * @param products - Array of products to sort
 * @returns Sorted array of products
 */
export function sortProductsStrategically(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
        const priorityA = getProductPriority(a);
        const priorityB = getProductPriority(b);

        // Sort by priority (lower number = higher priority)
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // If same priority, sort by popularity (if available)
        const popularityA = a.total_sales || 0;
        const popularityB = b.total_sales || 0;
        if (popularityA !== popularityB) {
            return popularityB - popularityA; // Higher sales first
        }

        // Finally, sort alphabetically
        return a.name.localeCompare(b.name);
    });
}

/**
 * Get featured products for homepage in strategic order
 * 
 * @param products - All available products
 * @param limit - Maximum number of products to return
 * @returns Strategically sorted and limited products
 */
export function getFeaturedProductsInOrder(products: Product[], limit: number = 8): Product[] {
    const sorted = sortProductsStrategically(products);
    return sorted.slice(0, limit);
}

/**
 * Debug helper to see product priorities
 */
export function debugProductPriorities(products: Product[]): void {
    if (process.env.NODE_ENV === 'development') {
        console.log('Product Priorities:');
        products.forEach(product => {
            const priority = getProductPriority(product);
            console.log(`[${priority}] ${product.name}`);
        });
    }
}
