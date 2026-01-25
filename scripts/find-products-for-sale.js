/**
 * Find Products for Sale Price Update
 * Searches for specific products and shows their current pricing
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.restaurantpack.se';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Basic ${auth}` },
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
}

// Products to find with their target sale prices
const targetProducts = [
    { search: 'India Gate Sona Masori Rice 5', salePrice: '99' },
    { search: 'India Gate Idly Rice 5', salePrice: '99' },
    { search: 'Aashirvaad Chakki Atta 5', salePrice: '99' },
    { search: 'Pillsbury Chakki Atta 5', salePrice: '99' },
    { search: 'Swetha Telugu Matta Rice 5', salePrice: '99' },
    { search: 'Annam Peanut Oil 1', salePrice: '69' },
    { search: 'Elephant Atta 25', salePrice: '240' },
];

async function findProducts() {
    console.log('\n🔍 Searching for products...\n');
    console.log('═'.repeat(100));

    const results = [];

    for (const target of targetProducts) {
        try {
            // Search by name
            const products = await wcApi(`products?search=${encodeURIComponent(target.search)}&per_page=10`);

            if (products.length === 0) {
                console.log(`❌ NOT FOUND: "${target.search}"`);
                results.push({ ...target, found: false });
            } else if (products.length === 1) {
                const product = products[0];
                console.log(`✅ FOUND: ${product.name}`);
                console.log(`   ID: ${product.id}`);
                console.log(`   Regular Price: ${product.regular_price} kr`);
                console.log(`   Current Sale Price: ${product.sale_price || 'None'}`);
                console.log(`   Target Sale Price: ${target.salePrice} kr`);
                console.log('');

                results.push({
                    ...target,
                    found: true,
                    id: product.id,
                    name: product.name,
                    regularPrice: product.regular_price,
                    currentSalePrice: product.sale_price,
                });
            } else {
                console.log(`⚠️  MULTIPLE MATCHES for "${target.search}":`);
                products.forEach((p, i) => {
                    console.log(`   ${i + 1}. ${p.name} (ID: ${p.id}) - ${p.regular_price} kr`);
                });
                console.log('');

                results.push({
                    ...target,
                    found: 'multiple',
                    matches: products.map(p => ({ id: p.id, name: p.name, regularPrice: p.regular_price })),
                });
            }
        } catch (error) {
            console.log(`❌ ERROR searching "${target.search}": ${error.message}`);
            results.push({ ...target, found: false, error: error.message });
        }
    }

    console.log('═'.repeat(100));

    // Summary
    const found = results.filter(r => r.found === true);
    const notFound = results.filter(r => r.found === false);
    const multiple = results.filter(r => r.found === 'multiple');

    console.log('\n📊 Summary:');
    console.log(`   ✅ Found: ${found.length}`);
    console.log(`   ⚠️  Multiple matches: ${multiple.length}`);
    console.log(`   ❌ Not found: ${notFound.length}`);

    if (notFound.length > 0) {
        console.log('\n❌ Products not found:');
        notFound.forEach(p => console.log(`   - ${p.search}`));
    }

    if (multiple.length > 0) {
        console.log('\n⚠️  Products with multiple matches (need manual selection):');
        multiple.forEach(p => {
            console.log(`\n   "${p.search}":`);
            p.matches.forEach((m, i) => {
                console.log(`      ${i + 1}. ${m.name} (ID: ${m.id})`);
            });
        });
    }

    if (found.length > 0) {
        console.log('\n✅ Ready to update (found products):');
        console.log('\n   Copy this array to use in the update script:\n');
        console.log('const productsToUpdate = [');
        found.forEach(p => {
            console.log(`  { id: ${p.id}, salePrice: '${p.salePrice}', name: '${p.name}' }, `);
        });
        console.log('];\n');
    }

    return results;
}

findProducts().catch(console.error);
