/**
 * Remove Sale Prices from All Products
 * Uses environment variables from .env.local or Vercel
 * Run: node scripts/remove-sale-prices.js
 */

// Load environment variables from .env.local if available
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('\n❌ Error: Missing API credentials!');
    console.error('Please set WORDPRESS_CONSUMER_KEY and WORDPRESS_CONSUMER_SECRET in .env.local\n');
    console.error('Or run: WORDPRESS_CONSUMER_KEY=ck_xxx WORDPRESS_CONSUMER_SECRET=cs_xxx node scripts/remove-sale-prices.js\n');
    process.exit(1);
}

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function removeSalePrices() {
    try {
        console.log('\n🔍 Fetching products with sale prices...\n');

        let page = 1;
        let allProducts = [];
        let hasMore = true;

        while (hasMore) {
            const products = await wcApi(`products?per_page=100&page=${page}&status=publish`);

            if (products.length > 0) {
                allProducts = [...allProducts, ...products];
                page++;
                console.log(`   Fetched page ${page - 1}: ${products.length} products`);
            } else {
                hasMore = false;
            }
        }

        console.log(`\n✅ Total products found: ${allProducts.length}\n`);

        const productsWithSales = allProducts.filter(
            (product) => product.sale_price && product.sale_price !== ''
        );

        console.log(`📊 Products with sale prices: ${productsWithSales.length}\n`);

        if (productsWithSales.length === 0) {
            console.log('✅ No products have sale prices. Nothing to update.\n');
            return 0;
        }

        console.log('Products to update:');
        console.log('─'.repeat(80));
        productsWithSales.forEach((product, index) => {
            if (index < 20) { // Show first 20
                console.log(
                    `ID: ${String(product.id).padEnd(6)} | ${product.name.substring(0, 40).padEnd(42)} | Regular: ${String(product.regular_price).padEnd(8)} | Sale: ${product.sale_price}`
                );
            }
        });
        if (productsWithSales.length > 20) {
            console.log(`   ... and ${productsWithSales.length - 20} more`);
        }
        console.log('─'.repeat(80));
        console.log('');

        console.log('🔄 Updating products...\n');

        let updated = 0;
        let failed = 0;

        for (const product of productsWithSales) {
            try {
                await wcApi(`products/${product.id}`, 'PUT', { sale_price: '' });
                console.log(`   ✓ Updated: ${product.name.substring(0, 50)} (ID: ${product.id})`);
                updated++;
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`   ✗ Failed: ${product.name} (ID: ${product.id})`);
                failed++;
            }
        }

        console.log('\n' + '═'.repeat(80));
        console.log('📊 Products Summary:');
        console.log(`   ✅ Successfully updated: ${updated} products`);
        if (failed > 0) {
            console.log(`   ❌ Failed: ${failed} products`);
        }
        console.log('═'.repeat(80));

        return updated;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return 0;
    }
}

async function removeSalePricesFromVariations() {
    try {
        console.log('\n🔍 Checking variable products...\n');

        let page = 1;
        let allVariableProducts = [];
        let hasMore = true;

        while (hasMore) {
            const products = await wcApi(`products?per_page=100&page=${page}&type=variable&status=publish`);

            if (products.length > 0) {
                allVariableProducts = [...allVariableProducts, ...products];
                page++;
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ Found ${allVariableProducts.length} variable products\n`);

        let totalVariationsUpdated = 0;

        for (const product of allVariableProducts) {
            try {
                const variations = await wcApi(`products/${product.id}/variations?per_page=100`);

                const variationsWithSales = variations.filter(v => v.sale_price && v.sale_price !== '');

                if (variationsWithSales.length > 0) {
                    console.log(`📦 ${product.name.substring(0, 50)} - ${variationsWithSales.length} variations`);

                    for (const variation of variationsWithSales) {
                        await wcApi(`products/${product.id}/variations/${variation.id}`, 'PUT', { sale_price: '' });
                        totalVariationsUpdated++;
                        console.log(`   ✓ Cleared variation ID: ${variation.id}`);
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            } catch (error) {
                console.error(`   ✗ Error: ${product.name}`);
            }
        }

        console.log('\n' + '═'.repeat(80));
        console.log('📊 Variations Summary:');
        console.log(`   ✅ Total variations updated: ${totalVariationsUpdated}`);
        console.log('═'.repeat(80));

        return totalVariationsUpdated;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return 0;
    }
}

async function main() {
    console.log('\n🚀 WooCommerce Sale Price Remover\n');
    console.log('═'.repeat(80));
    console.log(`Connected to: ${WORDPRESS_URL}`);
    console.log('═'.repeat(80));

    const productsUpdated = await removeSalePrices();
    const variationsUpdated = await removeSalePricesFromVariations();

    console.log('\n✅ All Done!\n');
    console.log('Total Updated:');
    console.log(`   • Products: ${productsUpdated}`);
    console.log(`   • Variations: ${variationsUpdated}`);
    console.log(`   • Grand Total: ${productsUpdated + variationsUpdated}\n`);
}

main().catch(console.error);
