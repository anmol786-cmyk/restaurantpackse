/**
 * Remove Sale Prices - Interactive Version
 * Run: node scripts/remove-sale-prices-interactive.js
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function getCredentials() {
    console.log('\n🔐 WooCommerce API Credentials Required\n');
    console.log('Find these at: crm.restaurantpack.se/wp-admin → WooCommerce → Settings → Advanced → REST API\n');

    const consumerKey = await question('Consumer Key (ck_...): ');
    const consumerSecret = await question('Consumer Secret (cs_...): ');

    return { consumerKey, consumerSecret };
}

async function wcApi(endpoint, method = 'GET', data = null, credentials) {
    const url = new URL(`https://crm.restaurantpack.se/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${credentials.consumerKey}:${credentials.consumerSecret}`).toString('base64');

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
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
}

async function removeSalePrices(credentials) {
    try {
        console.log('\n🔍 Fetching products with sale prices...\n');

        let page = 1;
        let allProducts = [];
        let hasMore = true;

        while (hasMore) {
            const products = await wcApi(`products?per_page=100&page=${page}&status=publish`, 'GET', null, credentials);

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
        productsWithSales.forEach((product) => {
            console.log(
                `ID: ${String(product.id).padEnd(6)} | ${product.name.substring(0, 40).padEnd(42)} | Regular: ${String(product.regular_price).padEnd(8)} | Sale: ${product.sale_price}`
            );
        });
        console.log('─'.repeat(80));
        console.log('');

        const confirm = await question(`⚠️  Remove sale prices from ${productsWithSales.length} products? (yes/no): `);

        if (confirm.toLowerCase() !== 'yes') {
            console.log('\n❌ Cancelled by user.\n');
            return 0;
        }

        console.log('\n🔄 Updating products...\n');

        let updated = 0;
        let failed = 0;

        for (const product of productsWithSales) {
            try {
                await wcApi(`products/${product.id}`, 'PUT', { sale_price: '' }, credentials);
                console.log(`   ✓ Updated: ${product.name} (ID: ${product.id})`);
                updated++;
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`   ✗ Failed: ${product.name} (ID: ${product.id})`, error.message);
                failed++;
            }
        }

        console.log('\n' + '═'.repeat(80));
        console.log('📊 Summary:');
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

async function removeSalePricesFromVariations(credentials) {
    try {
        console.log('\n🔍 Checking variable products...\n');

        let page = 1;
        let allVariableProducts = [];
        let hasMore = true;

        while (hasMore) {
            const products = await wcApi(`products?per_page=100&page=${page}&type=variable&status=publish`, 'GET', null, credentials);

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
                const variations = await wcApi(`products/${product.id}/variations?per_page=100`, 'GET', null, credentials);

                const variationsWithSales = variations.filter(v => v.sale_price && v.sale_price !== '');

                if (variationsWithSales.length > 0) {
                    console.log(`📦 ${product.name} - ${variationsWithSales.length} variations`);

                    for (const variation of variationsWithSales) {
                        await wcApi(`products/${product.id}/variations/${variation.id}`, 'PUT', { sale_price: '' }, credentials);
                        totalVariationsUpdated++;
                        console.log(`   ✓ Cleared variation ID: ${variation.id}`);
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            } catch (error) {
                console.error(`   ✗ Error: ${product.name}`, error.message);
            }
        }

        console.log(`\n✅ Total variations updated: ${totalVariationsUpdated}\n`);
        return totalVariationsUpdated;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return 0;
    }
}

async function main() {
    console.log('\n🚀 WooCommerce Sale Price Remover\n');
    console.log('═'.repeat(80));

    const credentials = await getCredentials();

    const productsUpdated = await removeSalePrices(credentials);
    const variationsUpdated = await removeSalePricesFromVariations(credentials);

    console.log('\n✅ All done!');
    console.log(`   Products: ${productsUpdated}`);
    console.log(`   Variations: ${variationsUpdated}\n`);

    rl.close();
}

main();
