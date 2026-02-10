/**
 * Update MOQ (Minimum Order Quantity) for specific products
 * Run with: node scripts/update-moq.js
 */

const https = require('https');

// WooCommerce API credentials
const WC_URL = 'https://crm.restaurantpack.se';
const CONSUMER_KEY = 'ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f';
const CONSUMER_SECRET = 'cs_cc8b959ab1b48a49778127dc13ae660b82b021a7';

// Helper function to make API requests
function wcRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const url = new URL(`${WC_URL}/wp-json/wc/v3${endpoint}`);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject({ statusCode: res.statusCode, body: parsed });
                    }
                } catch (e) {
                    reject({ error: 'Parse error', body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

// Product search patterns and their MOQ values
const moqUpdates = [
    // MOQ = 1
    { searchTerm: 'rooh afza', moq: 1, description: 'Rooh Afza' },
    { searchTerm: 'milk powder', moq: 1, description: 'Both Milk Powder products' },
    { searchTerm: 'sugar', moq: 1, description: 'Sugar' },
    { searchTerm: 'frying oil', moq: 1, description: 'Frying Oil' },
    { searchTerm: 'cooking oil', moq: 1, description: 'Cooking Oil' },
    { searchTerm: 'wheat flour', moq: 1, description: 'Wheat Flour' },
    { searchTerm: 'glucose', moq: 1, description: 'Glucose' },
    { searchTerm: 'gram flour', moq: 1, description: 'Gram Flour (Besan)' },
    { searchTerm: 'ammonia', moq: 1, description: 'Baker\'s Ammonia' },
    { searchTerm: 'rangkat', moq: 1, description: 'Rangkat Food Colour' },

    // MOQ = 3
    { searchTerm: 'KOPE Olive Pomace', moq: 3, description: 'KOPE Olive Pomace Oil 5L' },

    // MOQ = 4
    { searchTerm: 'ocean pearl', moq: 4, description: 'Ocean Pearl Rice' },
];

async function searchAndUpdateProduct(searchTerm, moq, description) {
    try {
        console.log(`\n🔍 Searching for: ${description} (${searchTerm})`);

        // Search for products
        const products = await wcRequest('GET', `/products?search=${encodeURIComponent(searchTerm)}&per_page=100`);

        if (products.length === 0) {
            console.log(`   ⚠️  No products found for "${searchTerm}"`);
            return { success: 0, failed: 0, skipped: 1 };
        }

        console.log(`   📦 Found ${products.length} product(s)`);

        let successCount = 0;
        let failedCount = 0;

        for (const product of products) {
            try {
                console.log(`   → Updating: ${product.name} (ID: ${product.id})`);

                // Update product with MOQ in meta_data
                const updateData = {
                    meta_data: [
                        { key: '_minimum_order_quantity', value: moq.toString() },
                        { key: 'minimum_order_quantity', value: moq.toString() }
                    ]
                };

                await wcRequest('PUT', `/products/${product.id}`, updateData);
                console.log(`     ✅ MOQ set to ${moq}`);
                successCount++;

            } catch (error) {
                console.log(`     ❌ Failed: ${error.body?.message || error.message || JSON.stringify(error)}`);
                failedCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return { success: successCount, failed: failedCount, skipped: 0 };

    } catch (error) {
        console.log(`   ❌ Search failed: ${error.body?.message || error.message || JSON.stringify(error)}`);
        return { success: 0, failed: 0, skipped: 1 };
    }
}

async function main() {
    console.log('🚀 Starting MOQ updates for products...\n');
    console.log('='.repeat(60));

    let totalSuccess = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const update of moqUpdates) {
        const result = await searchAndUpdateProduct(update.searchTerm, update.moq, update.description);
        totalSuccess += result.success;
        totalFailed += result.failed;
        totalSkipped += result.skipped;

        // Delay between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 MOQ Update Complete!`);
    console.log(`   ✅ Successfully updated: ${totalSuccess} products`);
    console.log(`   ❌ Failed: ${totalFailed} products`);
    console.log(`   ⚠️  Skipped (not found): ${totalSkipped} searches`);
}

main().catch(console.error);
