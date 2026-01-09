/**
 * Add Products to WooCommerce via REST API
 * Run with: node scripts/add-products.js
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

// Products to add
const products = [
    {
        name: "Kesar Mango Pulp - Wholesale Case (6 x 850g)",
        slug: "kesar-mango-pulp-wholesale-6x850g",
        type: "simple",
        status: "publish",
        sku: "MANGO-KESAR-6X850G",
        regular_price: "133.33",
        description: `<h2>Premium Kesar Mango Pulp for Professional Kitchens</h2>
<p>Sourced from the finest Kesar mangoes, renowned for their exceptional sweetness and rich golden colour, this wholesale case delivers restaurant-quality mango pulp ready for immediate use.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Variety:</strong> Kesar Mango</li>
  <li><strong>Format:</strong> Sweetened Pulp</li>
  <li><strong>Unit Size:</strong> 850g Tin</li>
  <li><strong>Case Size:</strong> 6 Tins</li>
  <li><strong>Total Weight:</strong> 5.1kg per case</li>
</ul>

<h3>Ideal Applications</h3>
<ul>
  <li>Mango Lassi & Smoothies</li>
  <li>Indian Desserts (Kulfi, Shrikhand, Aamras)</li>
  <li>Cocktails & Mocktails</li>
  <li>Ice Cream Base</li>
  <li>Pastry Fillings & Toppings</li>
</ul>`,
        short_description: "Deliver the authentic, vibrant taste of Indian summer with premium Kesar Mango Pulp. This wholesale case of six 850g tins provides the perfect, ready-to-use base for creating luscious mango lassis, rich desserts, and signature cocktails.",
        categories: [{ name: "Branded & Specialty Grocery" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Kesar Mango Pulp Wholesale | 6x850g Case | Restaurant Supply Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Buy premium Kesar Mango Pulp in bulk. Wholesale case of 6x850g tins perfect for lassi, desserts & cocktails. Fast delivery across Sweden & Europe." }
        ]
    },
    {
        name: "TRS Gram Flour (Besan) - Wholesale Case (6 x 2kg)",
        slug: "trs-gram-flour-besan-wholesale-6x2kg",
        type: "simple",
        status: "publish",
        sku: "TRS-BESAN-6X2KG",
        description: `<h2>TRS Gram Flour - The Professional Chef's Choice</h2>
<p>TRS is one of the most trusted names in South Asian ingredients, and their Gram Flour (Besan) delivers the consistent quality that professional kitchens demand.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Brand:</strong> TRS</li>
  <li><strong>Ingredient:</strong> 100% Ground Chickpeas (Chana Dal)</li>
  <li><strong>Unit Size:</strong> 2kg Bag</li>
  <li><strong>Case Size:</strong> 6 Bags</li>
  <li><strong>Total Weight:</strong> 12kg per case</li>
</ul>

<h3>Culinary Applications</h3>
<ul>
  <li><strong>Batters:</strong> Pakoras, Bhajis, Onion Rings</li>
  <li><strong>Sweets:</strong> Besan Ladoo, Mysore Pak, Soan Papdi</li>
  <li><strong>Savoury:</strong> Kadhi, Dhokla, Cheela</li>
  <li><strong>Thickening:</strong> Curries and Gravies</li>
</ul>`,
        short_description: "A vital staple for any authentic Indo-Pak kitchen, TRS Gram Flour is the trusted choice for chefs. This case of six 2kg bags is perfect for creating crispy batters for pakoras and bhajis, thickening sauces, and preparing traditional sweets.",
        categories: [{ name: "Branded & Specialty Grocery" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "TRS Gram Flour Besan Wholesale | 6x2kg Case | Bulk Chickpea Flour Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Wholesale TRS Gram Flour (Besan) - 6x2kg case. Perfect for pakoras, bhajis & Indian sweets. Trusted quality for professional kitchens. Contact for B2B pricing." }
        ]
    },
    {
        name: "Wheat Flour Type 550 - 25kg Bulk Bag",
        slug: "wheat-flour-type-550-25kg-bulk-professional",
        type: "simple",
        status: "publish",
        sku: "FLOUR-WHEAT-550-25KG",
        regular_price: "165.00",
        description: `<h2>Professional Grade Wheat Flour Type 550</h2>
<p>Vetemjöl Type 550 is the backbone of European baking. This all-purpose flour offers the perfect protein content for versatile use across breads, pastries, and everyday cooking.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Flour Type:</strong> Type 550 (All-Purpose / Strong Bread Flour)</li>
  <li><strong>Ingredient:</strong> 100% Wheat</li>
  <li><strong>Unit Size:</strong> 25kg Bulk Bag</li>
  <li><strong>Format:</strong> Professional Use</li>
</ul>

<h3>Baking Applications</h3>
<ul>
  <li>Artisan Breads & Baguettes</li>
  <li>Pizza Dough</li>
  <li>Naan & Flatbreads</li>
  <li>Cakes & Muffins</li>
  <li>Pastries & Pies</li>
</ul>`,
        short_description: "The essential workhorse for any professional bakery or restaurant kitchen. This Type 550 Wheat Flour provides the ideal balance of protein and strength for breads, pizza dough, cakes and pastries.",
        categories: [{ name: "Bakery & Confectionery Ingredients" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Wheat Flour Type 550 Bulk 25kg | Professional Bakery Flour Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Buy Wheat Flour Type 550 in 25kg bulk bags. Perfect for bread, pizza & pastries. Professional bakery grade flour with fast delivery across Scandinavia." }
        ]
    },
    {
        name: "Dried Whole Milk Powder 26% Fat - 25kg Bag",
        slug: "whole-milk-powder-26-percent-25kg-khoya-sweets",
        type: "simple",
        status: "publish",
        sku: "DAIRY-MILKPOW-26-25KG",
        description: `<h2>Full-Fat Milk Powder for Indian Sweets & Confectionery</h2>
<p>Create authentic mithai with this premium 26% fat whole milk powder. The high fat content is essential for rich, creamy textures in traditional South Asian desserts.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Fat Content:</strong> 26%</li>
  <li><strong>Format:</strong> Spray-Dried Powder</li>
  <li><strong>Unit Size:</strong> 25kg Bag</li>
  <li><strong>Primary Use:</strong> Khoya/Mawa Production, Indian Sweets</li>
</ul>

<h3>Perfect For Making</h3>
<ul>
  <li><strong>Khoya/Mawa:</strong> The base for most Indian sweets</li>
  <li><strong>Barfi:</strong> All varieties including Kaju, Pista, Coconut</li>
  <li><strong>Gulab Jamun:</strong> Soft, melt-in-mouth texture</li>
  <li><strong>Peda & Ladoo:</strong> Traditional festival favourites</li>
</ul>`,
        short_description: "The secret ingredient for rich, authentic Indian sweets and desserts. This 25kg bag of full-fat milk powder is the perfect base for creating dense khoya (mawa), creamy barfis, and decadent gulab jamuns.",
        categories: [{ name: "Bakery & Confectionery Ingredients" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Whole Milk Powder 26% Fat 25kg | Khoya & Indian Sweets Wholesale" },
            { key: "_yoast_wpseo_metadesc", value: "Premium 26% fat whole milk powder in 25kg bags. Ideal for making khoya, barfi, gulab jamun & Indian mithai. Bulk wholesale for confectioners." }
        ]
    },
    {
        name: "Glucose Syrup (Glykos) - 12.5kg Tub",
        slug: "glucose-syrup-glykos-12-5kg-confectionery",
        type: "simple",
        status: "publish",
        sku: "SWEET-GLUCOSE-12.5KG",
        description: `<h2>Professional Glucose Syrup for Confectionery & Baking</h2>
<p>Glykos glucose syrup is a must-have for pastry chefs and confectioners. It provides the smooth, glossy finish that distinguishes professional-quality sweets.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Format:</strong> Clear Liquid Syrup</li>
  <li><strong>Unit Size:</strong> 12.5kg Pail/Tub</li>
  <li><strong>Function:</strong> Anti-crystallization, Texturizer, Humectant</li>
</ul>

<h3>Ideal Applications</h3>
<ul>
  <li><strong>Candies & Toffees:</strong> Prevents sugar crystallization</li>
  <li><strong>Ice Cream & Sorbet:</strong> Improves scoopability, prevents ice crystals</li>
  <li><strong>Glazes & Sauces:</strong> Adds shine and viscosity</li>
  <li><strong>Baked Goods:</strong> Retains moisture, extends freshness</li>
</ul>`,
        short_description: "Achieve a professional finish in your desserts and confectionery. This large 12.5kg tub of glucose syrup is essential for preventing crystallization, ensuring perfectly smooth texture in sauces, ice creams, and candies.",
        categories: [{ name: "Bakery & Confectionery Ingredients" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Glucose Syrup 12.5kg Bulk | Confectionery & Ice Cream Wholesale Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Buy Glykos glucose syrup in 12.5kg tubs. Essential for candy making, ice cream & baking. Prevents crystallization. Wholesale for professionals." }
        ]
    },
    {
        name: "Baker's Ammonia (Hjorthornsalt) - 2kg Tub",
        slug: "bakers-ammonia-hjorthornsalt-2kg-leavening",
        type: "simple",
        status: "publish",
        sku: "BAKE-AMMONIA-2KG",
        description: `<h2>Traditional Baker's Ammonia for Crispy Baked Goods</h2>
<p>Hjorthornsalt (Ammonium Bicarbonate) has been used for centuries in Scandinavian baking. It produces an exceptionally light, crispy texture impossible to achieve with baking soda or powder alone.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Chemical Name:</strong> Ammonium Bicarbonate</li>
  <li><strong>Format:</strong> White Powder/Crystals</li>
  <li><strong>Unit Size:</strong> 2kg Tub</li>
  <li><strong>Function:</strong> Leavening Agent</li>
</ul>

<h3>Best For</h3>
<ul>
  <li><strong>Scandinavian Classics:</strong> Pepparkakor, Drömmar, Brysselkex</li>
  <li><strong>German Baking:</strong> Lebkuchen, Springerle</li>
  <li><strong>Crackers & Flatbreads:</strong> Extra-crispy texture</li>
</ul>`,
        short_description: "The traditional leavening agent for creating exceptionally light and crispy results. Baker's Ammonia is the key to perfecting classic Scandinavian and European cookies, crackers, and flatbreads.",
        categories: [{ name: "Bakery & Confectionery Ingredients" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Baker's Ammonia Hjorthornsalt 2kg | Traditional Leavening Agent Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Hjorthornsalt (Baker's Ammonia) 2kg tub for professional baking. Creates extra-crispy Scandinavian cookies & crackers. Wholesale for bakeries." }
        ]
    },
    {
        name: "Professional Frying Oil (Frityrolja) - 10 Litre",
        slug: "professional-frying-oil-frityrolja-10-litre-commercial",
        type: "simple",
        status: "publish",
        sku: "OIL-FRY-PRO-10L",
        description: `<h2>High-Performance Frying Oil for Commercial Kitchens</h2>
<p>Designed specifically for professional deep fryers, this Frityrolja delivers consistent results batch after batch. Its high smoke point and oxidation stability mean longer oil life and better food quality.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Format:</strong> Refined Liquid Oil</li>
  <li><strong>Unit Size:</strong> 10 Litre Container</li>
  <li><strong>Key Feature:</strong> High Smoke Point, High Stability</li>
  <li><strong>Best Use:</strong> Commercial Deep Fryers</li>
</ul>

<h3>Ideal For Frying</h3>
<ul>
  <li>Samosas & Spring Rolls</li>
  <li>Pakoras & Bhajis</li>
  <li>Chips & French Fries</li>
  <li>Doughnuts & Churros</li>
</ul>`,
        short_description: "Engineered for the demands of the professional kitchen. Our Frying Oil has a high smoke point and excellent stability, ensuring your fried items cook to a perfect golden-brown without becoming greasy.",
        categories: [{ name: "Cooking & Flavouring Essentials" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Professional Frying Oil 10L | Commercial Deep Fryer Oil Wholesale Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "High smoke point frying oil for commercial kitchens. 10 litre Frityrolja for samosas, pakoras & chips. Stable, long-lasting. Bulk wholesale pricing." }
        ]
    },
    {
        name: "All-Purpose Cooking Oil (Matolja) - 10 Litre",
        slug: "all-purpose-cooking-oil-matolja-10-litre-bulk",
        type: "simple",
        status: "publish",
        sku: "OIL-COOK-GEN-10L",
        description: `<h2>Versatile All-Purpose Cooking Oil for Every Kitchen</h2>
<p>Matolja is the everyday workhorse oil that every professional kitchen needs. Its neutral flavour profile won't compete with your recipes, while its excellent heat tolerance covers most cooking applications.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Format:</strong> Refined Liquid Oil</li>
  <li><strong>Unit Size:</strong> 10 Litre Container</li>
  <li><strong>Key Feature:</strong> Neutral Flavour Profile</li>
  <li><strong>Best Use:</strong> Sautéing, Grilling, General Cooking</li>
</ul>

<h3>Versatile Applications</h3>
<ul>
  <li>Sautéing & Stir-Frying</li>
  <li>Curry Bases & Gravies</li>
  <li>Grilling & Pan-Frying</li>
  <li>Marinades & Dressings</li>
</ul>`,
        short_description: "A fundamental staple for every food service operation. This 10-litre container of all-purpose cooking oil is a versatile, cost-effective solution for your daily cooking needs with a neutral flavour profile.",
        categories: [{ name: "Cooking & Flavouring Essentials" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "All-Purpose Cooking Oil 10L Bulk | Matolja Wholesale Sweden" },
            { key: "_yoast_wpseo_metadesc", value: "Neutral cooking oil in 10 litre bulk containers. Perfect for sautéing, curries & everyday restaurant use. Cost-effective wholesale pricing." }
        ]
    },
    {
        name: "Rangkat Food Colour Powder - 1kg Tub",
        slug: "rangkat-food-colour-powder-1kg-tandoori-biryani",
        type: "simple",
        status: "publish",
        sku: "SPICE-RANGKAT-1KG",
        description: `<h2>Rangkat - Traditional Food Colour for Authentic Presentation</h2>
<p>In South Asian cuisine, visual appeal is as important as taste. Rangkat food colour powder delivers the vibrant, appetizing hues that customers expect from authentic tandoori and biryani dishes.</p>

<h3>Product Specifications</h3>
<ul>
  <li><strong>Format:</strong> Highly Concentrated Powder</li>
  <li><strong>Unit Size:</strong> 1kg Tub</li>
  <li><strong>Colour:</strong> Bright Yellow / Orange</li>
  <li><strong>Usage Rate:</strong> Very small amount needed</li>
</ul>

<h3>Traditional Uses</h3>
<ul>
  <li><strong>Tandoori Dishes:</strong> Chicken, Paneer, Seekh Kebabs</li>
  <li><strong>Biryanis:</strong> Layered rice colour</li>
  <li><strong>Indian Sweets:</strong> Jalebis, Ladoos</li>
  <li><strong>Rice Dishes:</strong> Pulao, Kheer</li>
</ul>`,
        short_description: "Achieve the authentic and vibrant colour that makes traditional dishes visually stunning. Rangkat is a highly concentrated food colouring powder for tandoori, biryani, and Indian sweets.",
        categories: [{ name: "Cooking & Flavouring Essentials" }],
        meta_data: [
            { key: "_yoast_wpseo_title", value: "Rangkat Food Colour Powder 1kg | Tandoori & Biryani Colour Wholesale" },
            { key: "_yoast_wpseo_metadesc", value: "Authentic Rangkat food colour powder for tandoori, biryani & Indian sweets. Concentrated 1kg tub for professional kitchens. Vibrant yellow-orange hue." }
        ]
    }
];

async function main() {
    console.log('🚀 Starting product import to WooCommerce...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
        try {
            console.log(`📦 Adding: ${product.name}`);
            const result = await wcRequest('POST', '/products', product);
            console.log(`   ✅ Created with ID: ${result.id}`);
            successCount++;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.body?.message || error.message || JSON.stringify(error)}`);
            errorCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 Import Complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
}

main().catch(console.error);
