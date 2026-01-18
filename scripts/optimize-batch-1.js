const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const products = [
    {
        id: 192,
        name: "Rangkat Food Colour Powder - 1kg Tub",
        description: `
<h2>Rangkat Food Colour: The Secret to Authentic Restaurant Presentation</h2>
<p>In the competitive world of South Asian gastronomy, visual appeal is the first impression your dish makes. At <strong>Anmol Wholesale</strong>, we know that the perfect Tandoori Chicken or a festive Biryani needs that iconic, vibrant glow to truly delight customers. Our 1kg <strong>Rangkat Food Colour Powder</strong> is a professional-grade concentrate designed to deliver consistent, stable, and vivid results in high-pressure commercial kitchens.</p>

<h3>Chef-Tested Quality from Anmol Sweets & Restaurant</h3>
<p>We are not just wholesalers; we are restaurateurs. Having operated <strong>Anmol Sweets & Restaurant</strong> in Stockholm for over 5 years, we have first-hand experience with how food colours behave under high heat (like in our own manufactured Electric Tandoors). We selected this Rangkat formula because it maintains its brilliance without becoming bitter or fading during the cooking process. When you use our Rangkat, you are using the same secret ingredient that makes our Stockholm restaurant's dishes visually stunning.</p>

<h3>Stockholm’s Wholesale Advantage: 15% Lower Prices</h3>
<p>As a B2B partner based in Spånga (Fagerstagatan 13), we are committed to helping Swedish restaurants maximize their ROI. By sourcing in bulk and leveraging our direct distribution model, we offer our Rangkat powder at prices that are <strong>15% lower</strong> than traditional grocery distributors. For a high-volume restaurant, these savings on pantry staples add up significantly over the year, allowing you to reinvest in your kitchen and staff.</p>

<h3>Logistics Excellence: Own Delivery across Scandinavia</h3>
<p>When you order from Anmol Wholesale, you aren't just getting a product; you're getting a reliable supply chain. We operate our <strong>own delivery fleet</strong> across Sweden and have a robust network covering <strong>Norway, Finland, and Denmark</strong>. Unlike generic couriers, our drivers understand the importance of careful handling for wholesale tubs.
<ul>
  <li><strong>Local Spånga Pickup:</strong> Visit us at Fagerstagatan 13 for immediate ex-warehouse collection.</li>
  <li><strong>Custom Freight Options:</strong> Choose from our own delivery service or your preferred third-party provider like DHL, PostNord, or DB Schenker.</li>
</ul>
</p>

<h3>Versatility for the Professional Kitchen</h3>
<p>This 1kg concentrated tub is designed for longevity and versatility. While primarily used for Tandoori meats and Biryanis, it is also essential for traditional South Asian sweets like Jalebis and Ladoos. The concentrated powder form allows for precise dosing, ensuring you get the exact shade every time—from a subtle warm yellow to a fiery deep orange. Its airtight 1kg tub ensures the powder remains dry and clump-free even in the humid environment of a busy pastry station or tandoor area.</p>

<h3>Building Topical Authority in Sweden</h3>
<p>Anmol Wholesale is becoming the trusted name for authentic Indo-Pak restaurant supplies in Northern Europe. We bridge the gap between imported traditional knowledge and local Swedish reliability. Every tub of Rangkat at our Fagerstagatan warehouse is quality-checked to ensure it meets both culinary and safety standards. Choose the supplier that knows what a restaurant truly needs to succeed in the Scandinavian market.</p>
    `,
        seo: {
            title: "Rangkat Food Colour Powder 1kg Wholesale Stockholm | Anmol Wholesale",
            description: "Professional Rangkat food colour concentrate for Tandoori & Biryani. 15% lower prices, Stockholm stock, own Scandinavian delivery fleet. Restaurant tested.",
            keyword: "Rangkat Food Colour, Food Coloring Wholesale, Restaurant Supplies Stockholm, Anmol Wholesale"
        }
    },
    {
        id: 191,
        name: "All-Purpose Cooking Oil (Matolja) - 10 Litre",
        description: `
<h2>Premium All-Purpose Matolja: The Foundation of Every Professional Kitchen</h2>
<p>Cooking oil is the silent partner in every successful dish. At <strong>Anmol Wholesale</strong>, we recognize that small to medium-sized restaurants, cafés, and bakeries in Sweden need an oil that is as versatile as their menu. Our <strong>10 Litre All-Purpose Cooking Oil (Matolja)</strong> is refined to provide a neutral taste profile and high smoke point, making it the perfect choice for everything from sautéing and dressing to baking and light frying.</p>

<h3>Proven Performance in Stockholm's Professional Kitchens</h3>
<p>Drawing from our own journey at <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we understand that oil consistency is vital for flavor integrity. We have personally tested this Matolja in our Spånga-based operations to ensure it doesn't impart unwanted flavors or break down under prolonged heat. Whether you are preparing traditional Swedish dishes or authentic South Asian cuisine, our oil provides the clean foundation your recipes deserve.</p>

<h3>Wholesale Pricing: 15% Below Market Rate</h3>
<p>In the current economic climate, food cost management is critical. Anmol Wholesale offers this 10L bulk Matolja at <strong>15% lower</strong> prices than standard wholesale competitors. We achieve this by sourcing direct and operating out of our specialized warehouse at Fagerstagatan 13. By reducing intermediary costs, we pass the savings directly to you, helping your restaurant maintain profitability without compromising on the quality of your base ingredients.</p>

<h3>Reliable Logistics: Serving Sweden and Beyond</h3>
<p>Running out of oil during a busy service is a nightmare. That is why we provide a reliable, <strong>owned delivery system</strong> that covers the Stockholm region and extends throughout <strong>Scandinavia (Sweden, Norway, Finland, Denmark)</strong>. We treat every delivery with the professionalism you expect from a partner who has been in the restaurant business for over 5 years.
<ul>
  <li><strong>Flexible Delivery:</strong> Choose our in-house fleet or specify your own freight method (DHL, PostNord, etc.).</li>
  <li><strong>Warehouse Access:</strong> Our Spånga location is open for pickups, offering ex-warehouse rates for businesses arranging their own transport.</li>
</ul>
</p>

<h3>Sustainability and Bulk Efficiency</h3>
<p>Our 10L containers are designed for easy handling and efficient storage in crowded professional kitchens. By choosing bulk Matolja over smaller retail sizes, you reduce packaging waste and lower your cost-per-liter. At Anmol Wholesale, we maintain high stock levels of both locally produced and imported oils, ensuring we are always ready to fulfill your most demanding orders.</p>

<h3>Your Partner in Gastronomy</h3>
<p>Anmol Wholesale isn't just a supplier; we are your neighbor in Stockholm. Our brand context is built on a "From Our Kitchen to Yours" philosophy. We know the challenges of the Swedish food industry because we live it every day. When you source your Matolja from us, you're gaining the support of a team that understands exactly what it takes to run a high-volume kitchen successfully in Europe.</p>
    `,
        seo: {
            title: "All-Purpose Cooking Oil 10L Wholesale Sweden | Anmol Wholesale",
            description: "Neutral, high-smoke point Matolja (bulk 10L) for restaurants & bakeries. 15% lower prices, Stockholm-based stock, own Scandinavian delivery system.",
            keyword: "Cooking Oil Wholesale Stockholm, Bulk Matolja 10L, Restaurant Oil Supplier Sweden, Anmol Wholesale"
        }
    },
    {
        id: 190,
        name: "Professional Frying Oil (Frityrolja) - 10 Litre",
        description: `
<h2>High-Performance Frityrolja: Engineered for the Busiest Fryers</h2>
<p>Crispy, golden, and perfectly textured—that is the standard for high-quality fried food. At <strong>Anmol Wholesale</strong>, we provide professionals with the <strong>10 Litre Professional Frying Oil (Frityrolja)</strong> necessary to achieve these results consistently. Specially formulated for a longer fry life and a higher smoke point, our oil is designed to withstand the intense, continuous heat of industrial deep fryers in busy Swedish restaurants and takeaway outlets.</p>

<h3>Chef-Approved: The Anmol Sweets Experience</h3>
<p>Fried specialties are a cornerstone of our heritage at <strong>Anmol Sweets & Restaurant</strong> in Stockholm. We have spent over 5 years perfecting the art of the samosa and pakora, and we know that the secret lies in the oil. We developed this Frityrolja profile to ensure zero flavor transfer and minimal absorption, so your food stays light and crispy. Our Spånga warehouse (Fagerstagatan 13) carries only the oils that pass our own "Kitchen Integrity Test."</p>

<h3>Exceptional B2B Savings: 15% Lower Wholesale Prices</h3>
<p>For restaurants where frying is a primary cooking method, oil is one of the largest recurring expenses. At Anmol Wholesale, we help you slash that cost by providing Frityrolja at <strong>15% lower</strong> prices than the market average. By buying in bulk from our Stockholm hub, you benefit from our direct-to-business model that eliminates retail markups, allowing your café or pizzeria to operate more efficiently.</p>

<h3>Logistics You Can Trust: Owned Scandinavian Delivery</h3>
<p>Timely delivery of bulk liquids is a specialized task. Anmol Wholesale manages its <strong>own logistics network</strong>, ensuring your oil arrives sealed and ready for use. We deliver across <strong>Sweden, Norway, Finland, and Denmark</strong>, giving you the peace of mind that your supply chain is managed by professionals who understand the industry.
<ul>
  <li><strong>Local Pickup:</strong> Available directly from our Fagerstagatan 13 warehouse in Spånga.</li>
  <li><strong>Flexible Sourcing:</strong> Use our delivery fleet or your own preferred freight partner (DB Schenker, PostNord, DHL).</li>
</ul>
</p>

<h3>Why Our Frityrolja Rules the Market</h3>
<p>Stability is everything. Cheap oils break down quickly, leading to bad smells and soggy food. Our professional Frityrolja is enriched with anti-foaming agents and maintains its chemical stability for significantly longer periods, meaning you spend less time and money on oil changes. It is the smart choice for cost-conscious Swedish kitchens that refuse to compromise on the quality of their fried chicken, fries, or specialty appetizers.</p>

<h3>Authority in Restaurant Supply</h3>
<p>Based in Stockholm, Anmol Wholesale is the leading authority for specialty and staple ingredients for the European restaurant market. We combined our deep understanding of authentic flavors with the efficiency required by the modern professional kitchen. Trust the brand that knows exactly what a restaurant needs because we run one ourselves. From our kitchen to yours, we bring the best products at the best prices.</p>
    `,
        seo: {
            title: "Professional Frying Oil 10L Wholesale | Anmol Wholesale Stockholm",
            description: "High-stability 10L Frityrolja for deep fryers. Longer fry life, high smoke point. 15% lower wholesale prices. Stockholm stock, own Scanidnavian delivery.",
            keyword: "Frying Oil Wholesale, Bulk Frityrolja 10L, Restaurant Deep Fryer Oil, Anmol Wholesale Stockholm"
        }
    },
    {
        id: 189,
        name: "Baker's Ammonia (Hjorthornsalt) - 2kg Tub",
        description: `
<h2>Hjorthornsalt: The Secret to Traditional Scandinavian and Ethnic Baking</h2>
<p>Achieving the perfect, airy crunch in traditional cookies and crackers requires a specific leavening agent. At <strong>Anmol Wholesale</strong>, we supply professional bakeries and specialty restaurants with <strong>2kg Hjorthornsalt (Baker's Ammonia)</strong>. Essential for iconic recipes like Swedish *drömmar* or specialty South Asian flatbreads, this high-purity leavening agent is the key to creating textures that modern baking powder simply cannot replicate.</p>

<h3>Authentic Heritage from Anmol Sweets & Restaurant</h3>
<p>At our sister establishment, <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we have used Hjorthornsalt for over 5 years to perfect our traditional bakery items. We know that in a commercial setting, you need a product that is concentrated and reliable. Our 2kg tub is designed for the European bakery market, providing the high-heat reaction necessary for the crispest possible results. Our Spånga-based expert team ensures every batch meets the exacting standards required by professional pastry chefs.</p>

<h3>Direct B2B Pricing: 15% Below the Competition</h3>
<p>Professional baking ingredients shouldn't come with a retail premium. Anmol Wholesale provides Hjorthornsalt at <strong>15% lower</strong> prices than standard wholesale suppliers. By operating our own import and distribution hub at Fagerstagatan 13, we minimize overhead and pass those savings directly to our restaurant and bakery partners in Sweden. It is professional-grade quality at ex-warehouse prices.</p>

<h3>Exclusive Logistics: Serving All of Scandinavia</h3>
<p>We understand that specialty ingredients like Hjorthornsalt are the "missing link" in many kitchen inventories. We ensure your pantry is never empty through our <strong>own delivery system</strong>, covering <strong>Sweden, Norway, Finland, and Denmark</strong>. We provide the reliability of a local partner with the reach of a major distributor.
<ul>
  <li><strong>Local Spånga Pickup:</strong> Collect your order directly from our Fagerstagatan 13 warehouse.</li>
  <li><strong>Choice of Freight:</strong> We coordinate with major logistics partners like DHL, PostNord, and DB Schenker for your convenience.</li>
</ul>
</p>

<h3>Why Choose 2kg Hjorthornsalt Tubs?</h3>
<p>Hjorthornsalt is highly sensitive to moisture. Our 2kg airtight tubs are specifically designed to protect the chemical integrity of the ammonia, ensuring it doesn't lose its potency over time. For a busy commercial bakery, this size offers the perfect balance between high-volume utility and manageable storage. When you use Hjorthornsalt, you are opting for a traditional leavening method that allows moisture to evaporate completely, creating the "hollow" and extraordinarily light crumb that customers crave.</p>

<h3>Stockholm’s Expert in Specialty Ingredients</h3>
<p>Anmol Wholesale is more than just a warehouse; we are a culinary resource. Based in Stockholm, we bridge the gap between traditional techniques and modern wholesale efficiency. We prioritize our USP of "Locally Stocked + Imported," ensuring that even the most niche ingredients are ready for immediate dispatch across Europe. Build your bakery's reputation on the foundations of quality, tradition, and Anmol Wholesale expertise.</p>
    `,
        seo: {
            title: "Hjorthornsalt (Baker's Ammonia) 2kg Wholesale | Anmol Wholesale",
            description: "Traditional 2kg Hjorthornsalt for crispy baking & drömmar. 15% lower prices, Stockholm-based stock, own Scandinavian delivery fleet. Professional grade.",
            keyword: "Hjorthornsalt Wholesale, Baker's Ammonia 2kg, Bakery Ingredients Stockholm, Anmol Wholesale"
        }
    },
    {
        id: 188,
        name: "Glucose Syrup (Glykos) - 12.5kg Tub",
        description: `
<h2>Professional Glykos: The Essential Tool for Confectionery and Food Texture</h2>
<p>Controlling texture, sweetness, and shelf-life is the hallmark of professional food production. At <strong>Anmol Wholesale</strong>, we provide our <strong>12.5kg Glucose Syrup (Glykos)</strong> to restaurants, bakeries, and food manufacturers throughout Scandinavia. Whether you are tempering chocolate, baking moist cakes, or preventing crystallization in artisanal ice creams, our high-purity Glykos is the industry-standard choice for demanding professional applications.</p>

<h3>Real-World Expertise from Anmol Sweets & Restaurant</h3>
<p>Confectionery is in our DNA. At <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we have spent 5 years perfecting traditional South Asian sweets where glucose control is critical for the perfect glaze and bite. We carry this 12.5kg tub because it is the exact size and quality we use in our own commercial production. Based at Fagerstagatan 13, we are uniquely positioned to offer advice on how to integrate Glykos into your existing recipes to improve consistency and quality.</p>

<h3>Wholesale Value: 15% Lower Prices for B2B Partners</h3>
<p>As a specialized wholesaler, we cut out the middlemen to offer Glykos at <strong>15% lower</strong> prices than the competition. We understand that in high-volume food production, ingredient costs are a major factor in your bottom line. By sourcing your glucose directly from our Stockholm hub, you benefit from our collective buying power and efficient "Locally Stocked + Imported" model, keeping your café or bakery profitable.</p>

<h3>Delivery You Can Depend On: Owned Scandinavian Network</h3>
<p>Heavy pails of syrup require specialized care during shipping. Anmol Wholesale manages its <strong>own logistics fleet</strong> to ensure your 12.5kg tubs arrive intact and on time. We serve <strong>Sweden, Norway, Finland, and Denmark</strong> with a commitment to reliability that generic couriers simply can't match.
<ul>
  <li><strong>Ex-Warehouse Pickup:</strong> Collect directly from our Spånga location for the best possible rates.</li>
  <li><strong>Flexible Shipping:</strong> Use our fleet or arrange your own pickup via DHL, PostNord, or DB Schenker.</li>
</ul>
</p>

<h3>Why Our 12.5kg Glykos is Superior</h3>
<p>Our glucose syrup is optimized for its "humectant" properties, meaning it attracts and retains moisture, keeping your baked goods fresher for longer. It provides a clean, neutral sweetness that doesn't overpower other flavors, and its precise DE (Dextrose Equivalent) value ensures consistent viscosity across every batch. The durable 12.5kg pail is equipped with a secure lid, moisture-protected and easy to pour, essential for the fast-paced environment of a professional pastry station.</p>

<h3>The Stockholm Specialist in Wholesale Food Tech</h3>
<p>Anmol Wholesale is the bridge between traditional culinary art and modern food technology. We serve small to medium-scale food businesses throughout Europe with the products and insights they need to grow. Trust the brand that knows exactly what a restaurant needs because we use these products ourselves every single day in Stockholm. From our kitchen to yours, we provide the tools for your success.</p>
    `,
        seo: {
            title: "Glucose Syrup (Glykos) 12.5kg Wholesale | Anmol Wholesale Stockholm",
            description: "Professional high-purity Glykos (12.5kgpail) for baking & confectionery. 15% lower prices, Stockholm stock, own Scandinavian delivery fleet.",
            keyword: "Glucose Syrup Wholesale, Bulk Glykos 12.5kg, Bakery Supplies Stockholm, Anmol Wholesale"
        }
    }
];

const updateProduct = (product) => {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            description: product.description,
            meta_data: [
                { key: 'rank_math_title', value: product.seo.title },
                { key: 'rank_math_description', value: product.seo.description },
                { key: 'rank_math_focus_keyword', value: product.seo.keyword }
            ]
        });

        const options = {
            hostname: 'crm.restaurantpack.se',
            port: 443,
            path: `/wp-json/wc/v3/products/${product.id}`,
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
                console.log(`Product ${product.id} (${product.name}): STATUS ${res.statusCode}`);
                resolve(res.statusCode === 200);
            });
        });

        req.on('error', (e) => {
            console.error(`Error updating ${product.id}:`, e.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
};

async function runUpdates() {
    console.log('🚀 Starting SEO Optimization Batch 1...');
    for (const product of products) {
        const success = await updateProduct(product);
        if (success) {
            console.log(`✅ Success: ${product.name}`);
        } else {
            console.log(`❌ Failed: ${product.name}`);
        }
    }
    console.log('🎉 Batch 1 Complete!');
}

runUpdates();
