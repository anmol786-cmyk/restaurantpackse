/**
 * Add Sale Prices to Promotional Products
 * Updates specific products with sale prices
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

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

// Products to update with sale prices
const productsToUpdate = [
    { id: 215, salePrice: '99', name: 'India Gate Sona Masoori Rice 5kg' },
    { id: 204, salePrice: '99', name: 'India Gate Idli Rice 5kg' },
    { id: 75, salePrice: '99', name: 'Aashirvaad Chakki Atta 5kg' },
    { id: 73, salePrice: '99', name: 'Pillsbury Chakki Atta 5kg' },
    { id: 4943, salePrice: '69', name: 'Annam Peanut Oil 1 Liter' },
    { id: 80, salePrice: '240', name: 'Elephant Atta Medium 25kg' },
];

async function addSalePrices() {
    console.log('\n🎉 Adding Sale Prices to Promotional Products\n');
    console.log('═'.repeat(100));

    let updated = 0;
    let failed = 0;
    const results = [];

    for (const product of productsToUpdate) {
        try {
            // First, get current product details
            const currentProduct = await wcApi(`products/${product.id}`);

            console.log(`\n📦 ${product.name}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   Regular Price: ${currentProduct.regular_price} kr`);
            console.log(`   New Sale Price: ${product.salePrice} kr`);
            console.log(`   Discount: ${Math.round(((currentProduct.regular_price - product.salePrice) / currentProduct.regular_price) * 100)}%`);

            // Update with sale price
            await wcApi(`products/${product.id}`, 'PUT', {
                sale_price: product.salePrice,
            });

            console.log(`   ✅ Updated successfully!`);
            updated++;

            results.push({
                id: product.id,
                name: product.name,
                regularPrice: currentProduct.regular_price,
                salePrice: product.salePrice,
                success: true,
            });

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            failed++;

            results.push({
                id: product.id,
                name: product.name,
                success: false,
                error: error.message,
            });
        }
    }

    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully updated: ${updated} products`);
    if (failed > 0) {
        console.log(`   ❌ Failed: ${failed} products`);
    }
    console.log('');

    if (updated > 0) {
        console.log('🎉 Promotion is now LIVE! Products updated:\n');
        results.filter(r => r.success).forEach((r, i) => {
            console.log(`   ${i + 1}. ${r.name}`);
            console.log(`      Regular: ${r.regularPrice} kr → Sale: ${r.salePrice} kr`);
        });
        console.log('');
    }

    if (failed > 0) {
        console.log('❌ Failed products:\n');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.name} (ID: ${r.id}): ${r.error}`);
        });
        console.log('');
    }

    console.log('═'.repeat(100));
    console.log('✅ Done!\n');
}

addSalePrices().catch(console.error);
