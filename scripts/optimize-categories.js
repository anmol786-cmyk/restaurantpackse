const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const categories = [
    {
        id: 25, // Rice
        description: `
<h2>Wholesale Rice Supply for the Professional Scandinavian Kitchen</h2>
<p>At <strong>Anmol Wholesale</strong>, we provide the foundational grain for your restaurant's success. Based in Stockholm, we specialize in high-quality, professional-grade rice varieties, including our premium aroma-aged <strong>Basmati Rice</strong>. We understand that in a high-volume kitchen, you need rice that remains separate, fluffy, and aromatic across every service. Our "Locally Stocked + Imported" model ensures that restaurants in Sweden, Norway, and Finland have access to the same elite grains used in our own <strong>Anmol Sweets & Restaurant</strong>.</p>
<h3>The Anmol Advantage: 15% Lower Prices, Own Delivery</h3>
<p>By bypassing traditional retail markups and operating directly from our Spånga warehouse at Fagerstagatan 13, we offer wholesale rice at prices typically <strong>15% lower</strong> than standard market rates. We manage our <strong>own delivery fleet</strong> to ensure your pallet-level stock arrives in perfect condition. Whether you need 5kg packs or 20kg bulk bags, our logistics network provides the reliability your business depends on.</p>
    `
    },
    {
        id: 34, // Oils & Fats
        description: `
<h2>Professional Grade Oils & Fats: High Stability for Commercial Gastronomy</h2>
<p>From the high-heat demands of deep frying to the delicate balance of a salad dressing, the right oil is essential. <strong>Anmol Wholesale</strong> supplies Stockholm's busiest kitchens with <strong>10L bulk Matolja and Frityrolja</strong>. Our oils are selected for their high smoke points and neutral flavor profiles, ensuring zero flavor transfer and a long fry life. As restaurateurs ourselves, we only stock oils that meet the rigorous standards of our own Stockholm-based commercial kitchen.</p>
<h3>Stockholm-Based B2B Supply with Competitive Margins</h3>
<p>Located in Spånga, we are the primary hub for restaurants, pizzerias, and catering businesses looking for <strong>15% lower</strong> prices on high-volume pantry staples. Our <strong>dedicated Scandinavian delivery system</strong> ensures that your oil stock is replenished on time, every time. Experience the difference of sourcing from a partner who knows exactly what a professional kitchen requires to maintain quality and profitability.</p>
    `
    },
    {
        id: 28, // Flour & Grains
        description: `
<h2>Bulk Flour & Grains: The Strength Behind Your Bakery and Bread</h2>
<p>Success in baking begins with the protein and purity of your grain. At <strong>Anmol Wholesale</strong>, we supply professional bakeries, pizzerias, and ethnic restaurants throughout Northern Europe with <strong>25kg bulk Wheat Flour (Type 550)</strong> and authentic <strong>TRS Gram Flour (Besan)</strong>. Our flours are stored in a temperature-controlled Stockholm warehouse (Fagerstagatan 13) to ensure consistent behavior in your commercial ovens. We sell the same high-performance ingredients we use at <strong>Anmol Sweets & Restaurant</strong>.</p>
<h3>Direct Wholesaling: 15% Savings on Professional Staples</h3>
<p>Stop paying retail markups for your most used ingredients. Anmol Wholesale provides B2B partners in Sweden with prices that are <strong>15% lower</strong> than traditional distributors. We leverage our own <strong>Scandinavian distribution network</strong> to provide safe, timely delivery of heavy 25kg bags directly to your door. Join the growing list of Nordic bakers who trust Anmol for their foundation ingredients.</p>
    `
    },
    {
        id: 22, // Dry Goods
        description: `
<h2>Essential Dry Goods & Pantry Staples: Reliable Bulk Supply for B2B</h2>
<p>A well-stocked pantry is the heart of an efficient kitchen. <strong>Anmol Wholesale</strong> is Stockholm’s authority on bulk specialty ingredients, including <strong>Dried Whole Milk Powder (26% Fat)</strong> and traditional South Asian staples. Based in Spånga at Fagerstagatan 13, we bridge the gap between imported traditional knowledge and Swedish logistical reliability. We provide the "Locally Stocked + Imported" advantage that gives your restaurant a competitive edge.</p>
<h3>Expert Sourcing from Stockholm's Culinary Leaders</h3>
<p>Our product selection is informed by 5 years of success running our own <strong>Anmol Sweets & Restaurant</strong>. We offer our pantry staples at <strong>15% lower</strong> prices, backed by our <strong>own delivery fleet</strong> serving Sweden, Norway, Finland, and Denmark. Whether you need bulk milk powder, spices, or specialty grains, Anmol Wholesale is your partner for professional kitchen consistency and cost-effective B2B sourcing.</p>
    `
    }
];

const updateCategory = (cat) => {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            description: cat.description
        });

        const options = {
            hostname: 'crm.restaurantpack.se',
            port: 443,
            path: `/wp-json/wc/v3/products/categories/${cat.id}`,
            method: 'PUT',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`Category ${cat.id}: STATUS ${res.statusCode}`);
                resolve(res.statusCode === 200);
            });
        });

        req.on('error', (e) => {
            console.error(`Error updating category ${cat.id}:`, e.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
};

async function runUpdates() {
    console.log('🚀 Starting Category Optimization...');
    for (const cat of categories) {
        const success = await updateCategory(cat);
        if (success) {
            console.log(`✅ Success Category ID: ${cat.id}`);
        } else {
            console.log(`❌ Failed Category ID: ${cat.id}`);
        }
    }
    console.log('🎉 Category Optimization Complete!');
}

runUpdates();
