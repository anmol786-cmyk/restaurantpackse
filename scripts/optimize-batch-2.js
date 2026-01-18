const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const products = [
    {
        id: 187,
        name: "Dried Whole Milk Powder 26% Fat - 25kg Bag",
        description: `
<h2>Premium Dried Whole Milk Powder: Professional Grade for the Food Industry</h2>
<p>Consistency and fat content are the two pillars of high-quality dairy ingredients. At <strong>Anmol Wholesale</strong>, we supply professional kitchens with <strong>25kg Dried Whole Milk Powder (26% Fat)</strong>. Designed for the rigors of commercial food production, our milk powder is the preferred choice for bakeries, chocolate manufacturers, and large-scale caterers across Scandinavia who require a rich, stable dairy base without the storage challenges of fresh liquid milk.</p>

<h3>Chef’s Choice: The Anmol Sweets & Restaurant Standard</h3>
<p>We are restaurateurs before we are wholesalers. At <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we have used this exact 26% fat whole milk powder for over 5 years. In traditional South Asian sweets and professional pastry, the fat content is non-negotiable for achieving that smooth, creamy mouthfeel. We have tested this powder across hundreds of batches to ensure it dissolves perfectly and maintains its rich profile under heat. When you buy from Anmol Wholesale, you are buying a product we trust in our own restaurant every single day.</p>

<h3>Unbeatable Wholesale Pricing: 15% Lower Than Market</h3>
<p>Operating a profitable food business in Sweden requires securing your base ingredients at the best possible price. Anmol Wholesale offers this 25kg bulk bag at <strong>15% lower</strong> prices than standard wholesale distributors. By operating out of our specialized hub in Spånga (Fagerstagatan 13), we eliminate high retail markups and pass those savings directly to our B2B partners. It is the quality you need at a price that respects your budget.</p>

<h3>Dedicated Logistics: Own Delivery Fleet Across Scandinavia</h3>
<p>Large 25kg bags of milk powder require dry, stable, and timely transport. Anmol Wholesale manages its <strong>own delivery network</strong>, providing a more reliable service than third-party couriers. We deliver to <strong>Sweden, Norway, Finland, and Denmark</strong>, ensuring your bulk dairy supply is managed by professionals who understand the food industry.
<ul>
  <li><strong>Local Pickup:</strong> Available directly from our Fagerstagatan 13 warehouse in Spånga.</li>
  <li><strong>Freight Flexibility:</strong> Use our fleet or specify your own shipping partner (DB Schenker, PostNord, DHL).</li>
</ul>
</p>

<h3>Why Our 26% Fat Milk Powder is Superior</h3>
<p>Our whole milk powder is processed using advanced spray-drying technology, preserving the nutritional integrity and flavor of fresh milk. The 26% fat content provides a richness that lower-fat "dairy creamers" cannot match, making it essential for high-quality sauces, batters, and milky beverages. The heavy-duty 25kg bags are moisture-shielded, ensuring a long shelf life in a busy professional pantry and reducing the risk of spoilage common with fresh dairy.</p>

<h3>Topical Authority in Stockholm's Food Scene</h3>
<p>Based in Stockholm, Anmol Wholesale is the authority on high-volume specialty and staple ingredients. We understand the specific needs of the Northern European restaurant market, combining local reliability with international product expertise. We don't just supply ingredients; we provide solutions for your kitchen's growth. Join the network of chefs and bakers who trust Anmol Wholesale for their bulk dairy needs.</p>
    `,
        seo: {
            title: "Dried Whole Milk Powder 25kg Wholesale Sweden | Anmol Wholesale",
            description: "Professional 26% fat Whole Milk Powder in bulk 25kg bags. 15% lower prices, Stockholm-based stock, own Scandinavian delivery fleet. Restaurant grade.",
            keyword: "Whole Milk Powder Wholesale, Bulk Milk Powder 25kg, Restaurant Dairy Supplier Stockholm, Anmol Wholesale"
        }
    },
    {
        id: 186,
        name: "Wheat Flour Type 550 - 25kg Bulk Bag",
        description: `
<h2>Professional Wheat Flour Type 550: The High-Protein Choice for Bakeries</h2>
<p>The secret to every great loaf of bread or pizza crust lies in the strength of the flour. At <strong>Anmol Wholesale</strong>, we provide professional artisans with our <strong>25kg Wheat Flour Type 550</strong>. This premium-grade white flour is characterized by its high protein content and excellent water absorption, making it the versatile "workhorse" ingredient for restaurants, pizzerias, and traditional bakeries throughout Scandinavia.</p>

<h3>Experienced Baking: The Anmol Sweets & Restaurant Connection</h3>
<p>We know flour because we use it every day. At <strong>Anmol Sweets & Restaurant</strong> in Stockholm, our flatbreads and pastries are world-renowned, and we have perfected our recipes using this exact Type 550 flour for over 5 years. We understand the critical importance of gluten development and consistent behavior under heat. Based at Fagerstagatan 13, our team is not just selling bags; we are sharing the same high-performance ingredient that we use in our own commercial ovens.</p>

<h3>B2B Wholesale Advantage: 15% Below the Competition</h3>
<p>Grain staples shouldn't break your budget. Anmol Wholesale offers Type 550 flour at <strong>15% lower</strong> prices than standard grocery wholesalers. We achieve this through our direct "Locally Stocked + Imported" model, operating from our efficient warehouse in Spånga. By bypassing multi-level distribution chains, we ensure that your Stockholm-based bakery or restaurant gets the best possible margins on its highest-volume ingredient.</p>

<h3>Logistics You Can Depend On: Owned Scandinavian Network</h3>
<p>Pallet-level flour orders require heavy-duty, reliable transport. Anmol Wholesale manages its <strong>own logistics network</strong>, delivering across <strong>Sweden, Norway, Finland, and Denmark</strong>. We pride ourselves on the integrity of our delivery, ensuring bags arrive dry and free from damage.
<ul>
  <li><strong>Local Pickup:</strong> Collect your order directly from Fagerstagatan 13, Spånga, for immediate ex-warehouse rates.</li>
  <li><strong>Flexible Sourcing:</strong> Use our dedicated fleet or coordinate with your own logistics partner (DHL, PostNord, DB Schenker).</li>
</ul>
</p>

<h3>The Technical Edge of Type 550</h3>
<p>Type 550 (similar to "Strong" or "Bread" flour) is specifically milled to retain more of the grain's protein, providing the elasticity needed for doughs that need to rise high and provide a chewy texture. It is ideal for pizzas, baguettes, and hearty buns. Our flour is stored in a temperature-controlled environment in Stockholm, preventing the moisture fluctuation that can plague lower-quality wholesale stocks. In an Anmol 25kg bag, you get pure, consistent performance from the first tablespoon to the last.</p>

<h3>Your Professional Partner in Stockholm</h3>
<p>Anmol Wholesale is the bridge between traditional expertise and modern wholesale efficiency. From the tandoors of Stockholm to the bakeries of Malmö, we serve the food industry with the ingredients that power growth. Trust the brand that knows exactly what a professional kitchen needs because we are chefs ourselves. From our kitchen to yours, we bring you the ultimate in wholesale grain supply.</p>
    `,
        seo: {
            title: "Wheat Flour Type 550 25kg Wholesale Stockholm | Anmol Wholesale",
            description: "Strong Type 550 Wheat Flour for bread & pizza (25kg bulk). 15% lower prices, Stockholm stock, own Scanidnavian delivery. Professional bakery grade.",
            keyword: "Wheat Flour Wholesale, Bulk Flour 25kg, Bakery Supplies Stockholm, Anmol Wholesale Sweden"
        }
    },
    {
        id: 185,
        name: "TRS Gram Flour (Besan) - Wholesale Case (6 x 2kg)",
        description: `
<h2>TRS Gram Flour (Besan): The Authentic Foundation of South Asian Gastronomy</h2>
<p>For the professional chef, there is no substitute for authentic Besan. At <strong>Anmol Wholesale</strong>, we supply the industry-leading <strong>TRS Gram Flour in 6 x 2kg Wholesale Cases</strong>. Milled from 100% pure Chana Dal, this flour is essential for creating the perfect pakoras, bhajis, and traditional desserts that demand a nutty flavor and gluten-free binding properties. It is the gold standard for many ethnic restaurants and health-conscious bakeries throughout Scandinavia.</p>

<h3>Proven Culinary Heritage: Anmol Sweets & Restaurant</h3>
<p>We are the experts in Besan because it is at the heart of our own heritage. At <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we have used TRS products for over 5 years. We chose this specific wholesale case format because it offers the perfect balance of volume and freshness for a busy commercial station. Whether you are tempering spices or building a batter, our Besan provides the consistent result that our own customers have loved at our Stockholm establishment for years.</p>

<h3>Wholesale Value: 15% Lower Prices for B2B Clients</h3>
<p>Specialty ingredients often carry a high markup at local retailers. Anmol Wholesale breaks that cycle by offering TRS Gram Flour cases at <strong>15% lower</strong> prices than typical wholesale competitors. By stocking our Spånga warehouse (Fagerstagatan 13) with direct imports, we provide your restaurant or catering business with superior margins, allowing you to serve top-tier authentic dishes at a more profitable price point.</p>

<h3>Reliable Logistics: Own Delivery across Scandinavia</h3>
<p>Maintaining a steady supply of specialty flours is critical for menu consistency. We operate our <strong>own delivery fleet</strong> across Sweden and have a dedicated network covering <strong>Norway, Finland, and Denmark</strong>. We treat every wholesale case with the care it deserves, ensuring your Besan arrives dry and ready for use.
<ul>
  <li><strong>Local Pickup:</strong> Visit us in Spånga for ex-warehouse rates and immediate collection.</li>
  <li><strong>Choice of Freight:</strong> We coordinate with your favorite logistics partners including PostNord, DHL, and DB Schenker.</li>
</ul>
</p>

<h3>Why Professionals Choose the 6 x 2kg Case</h3>
<p>In a commercial kitchen, managing the shelf life of opened dry goods is a constant challenge. By choosing the 6 x 2kg case over a single massive bag, you can open only what you need, keeping the rest of your stock airtight and fresh. TRS Gram Flour is naturally high in protein and fiber, making it a popular choice for modern "health-forward" cafés as well as traditional pizzerias looking for high-quality gluten-free alternatives. It yields a light, golden results that cheaper blends simply cannot match.</p>

<h3>Stockholm’s Authority in Ethnic Wholesale</h3>
<p>Anmol Wholesale is the bridge between the authentic markets of the East and the professional kitchens of Scandinavia. We don't just move boxes; we understand the culinary soul of every product we sell. Based in Stockholm, we are your local partner for global ingredients. Join the growing list of chefs who trust the "Anmol Standard" for their authentic restaurant supplies.</p>
    `,
        seo: {
            title: "TRS Gram Flour (Besan) Wholesale Case 6x2kg | Anmol Wholesale",
            description: "Authentic TRS Gram Flour for pakoras & sweets (12kg case). 15% lower prices, Stockholm-based stock, own Scandinavian delivery fleet. Professional grade.",
            keyword: "Gram Flour Wholesale, TRS Besan Cases, Restaurant Supplies Stockholm, Anmol Wholesale Sweden"
        }
    },
    {
        id: 184,
        name: "Kesar Mango Pulp - Wholesale Case (6 x 850g)",
        description: `
<h2>Premium Kesar Mango Pulp: The Essence of the King of Fruits for Professionals</h2>
<p>Capture the sun-drenched sweetness of authentic Indian mangoes year-round. At <strong>Anmol Wholesale</strong>, we supply professional kitchens and bakeries with our <strong>Kesar Mango Pulp Wholesale Case (6 x 850g)</strong>. Renowned for its intense aroma, bright saffron hue, and velvety texture, Kesar mango pulp is the essential ingredient for high-end desserts, lassis, and signature sauces in the best restaurants across Scandinavia.</p>

<h3>Culinary Expertise from Anmol Sweets & Restaurant</h3>
<p>Mango lassis and traditional sweets are a cornerstone of our success at <strong>Anmol Sweets & Restaurant</strong> in Stockholm. We have tested numerous brands over the last 5 years and have selected this Kesar pulp for its purity and lack of artificial fillers. It tastes like a fresh mango picked at the peak of ripeness. When you buy from us, you aren't just getting a canned product; you are getting a chef-approved ingredient that we use ourselves to delight our Stockholm customers every day.</p>

<h3>B2B Wholesale Value: 15% Lower Prices</h3>
<p>Specialty fruit pulps can be a high-cost overhead. Anmol Wholesale helps you keep your dessert and beverage menus profitable by offering our Kesar pulp at <strong>15% lower</strong> prices than standard wholesale market rates. By stocking our hub in Spånga (Fagerstagatan 13) with high-volume imports, we pass the "direct-to-chef" savings on to you, allowing your café or catering business to serve premium quality without premium costs.</p>

<h3>Owned Logistics: Safe Delivery Across Scandinavia</h3>
<p>Canned goods are heavy and sensitive to rough handling. We manage our <strong>own delivery fleet</strong> to ensure your wholesale cases arrive in perfect condition. We deliver throughout <strong>Sweden, Norway, Finland, and Denmark</strong>, giving you the reliability of a local Stockholm partner with international reach.
<ul>
  <li><strong>Ex-Warehouse Pickup:</strong> Visit our Spånga location for immediate collection and better rates.</li>
  <li><strong>Freight Options:</strong> We work with our own drivers or your preferred carriers like PostNord, DHL, or DB Schenker.</li>
</ul>
</p>

<h3>Why Kesar Pulp is the Professional Choice</h3>
<p>While Alphonso is better known, many professional chefs prefer Kesar for its more balanced sugar-to-acid ratio and its legendary aromatic depth. The 850g can size is optimized for commercial use, reducing waste and allowing for easy inventory management. This pulp is 100% natural, providing the intense "mango flavor" needed for ice creams, cheesecakes, and cocktails without the labor-intensive peeling and pitting of fresh fruit. It is the ultimate shortcut to authentic flavor.</p>

<h3>Your Specialty Partner in Stockholm</h3>
<p>Anmol Wholesale is the leading authority on authentic specialty ingredients for the European food industry. We bridge the gap between traditional food culture and modern supply chain efficiency. Based in Stockholm, we are here to support your creative vision with the best ingredients in the world. Trust the brand that knows exactly what a restaurant needs because we are chefs before we are suppliers.</p>
    `,
        seo: {
            title: "Kesar Mango Pulp Wholesale Case 6x850g | Anmol Wholesale Stockholm",
            description: "Authentic Kesar Mango Pulp for desserts & lassis (case of 6). 15% lower prices, Stockholm stock, own Scanidnavian delivery. Chef approved quality.",
            keyword: "Kesar Mango Pulp Wholesale, Bulk Mango Pulp Cases, Restaurant Supplies Stockholm, Anmol Wholesale"
        }
    },
    {
        id: 166,
        name: "Nordic Sugar 25kg - Bulk Granulated Sugar for Restaurants & Bakeries",
        description: `
<h2>Nordic Sugar 25kg: The Pure Foundation for Scandinavian Baking and Cooking</h2>
<p>In the world of professional baking and gastronomy, sugar is more than just sweetness—it’s about texture, coloration, and structural integrity. At <strong>Anmol Wholesale</strong>, we supply the industry-standard <strong>Nordic Sugar 25kg Bulk Bag</strong> to bakeries, restaurants, and confectioners throughout Scandinavia. This high-purity, even-grained granulated sugar is the essential building block for everything from artisanal breads and pizzerias to traditional Swedish pastries.</p>

<h3>The Professional Standard: Anmol Sweets & Restaurant Verified</h3>
<p>At <strong>Anmol Sweets & Restaurant</strong> in Stockholm, sugar is the lifeblood of our confectionery production. For over 5 years, we have relied on Nordic Sugar for our most delicate recipes because of its consistent dissolve rate and neutral profile. Based at Fagerstagatan 13, our team understands that in a professional kitchen, you cannot afford "surprise" results from your base ingredients. We sell what we use, ensuring your Stockholm-based business gets a product we trust in our own ovens every day.</p>

<h3>Unbeatable B2B Value: 15% Below Retail Wholesalers</h3>
<p>For high-volume producers, the cost of sugar is a major budget driver. Anmol Wholesale offers Nordic Sugar at <strong>15% lower</strong> prices than standard wholesale competitors. Our "Locally Stocked + Imported" model, operating out of our specialized Spånga warehouse, allows us to cut through the multi-layered distribution chains common in Sweden. We pass those savings directly to our B2B partners, keeping your café or restaurant profitable.</p>

<h3>Owned Logistics: Reliable Delivery Across Scandinavia</h3>
<p>Large 25kg bags require sturdy, timely, and professional transport. Anmol Wholesale manages its <strong>own delivery network</strong>, providing a much higher level of service than generic couriers. We serve <strong>Sweden, Norway, Finland, and Denmark</strong>, ensuring your bulk sugar supply is managed by professionals who understand the urgency of commercial food production.
<ul>
  <li><strong>Local Pickup:</strong> Visit us at Fagerstagatan 13 in Spånga for ex-warehouse rates and immediate collection.</li>
  <li><strong>Flexible Sourcing:</strong> Use our dedicated delivery fleet or specify your own freight partner (DHL, PostNord, DB Schenker).</li>
</ul>
</p>

<h3>Why Choose Nordic Sugar 25kg?</h3>
<p>Nordic Sugar is renowned for its consistent crystal size, which is critical for the even "creaming" of butter in baking and the smooth reduction of sauces and glazes. The heavy-duty 25kg paper bag is designed for easy stacking and environmental sustainability, while providing a barrier against moisture in the pantry. From the morning donuts in a café to the savory marinades in a kebab house, this sugar provides a reliable sweetness that enhances your dishes without overwhelming them.</p>

<h3>Your Partnership Hub in Stockholm</h3>
<p>Anmol Wholesale is the leading authority on staple ingredients for the European food scene. We bridge traditional culinary background with modern business efficiency. Based in Stockholm, we are more than just a wholesaler; we are your neighbor and your partner in growth. Trust the brand that knows exactly what a restaurant needs because we share the same professional kitchen goals.</p>
    `,
        seo: {
            title: "Nordic Sugar 25kg Bulk Wholesale Stockholm | Anmol Wholesale",
            description: "Standard 25kg Nordic Sugar for bakeries & restaurants. 15% lower prices, locally stocked in Spånga, own Scandinavian delivery fleet. Professional grade.",
            keyword: "Nordic Sugar Wholesale, Bulk Sugar 25kg, Bakery Ingredients Stockholm, Anmol Wholesale Sweden"
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
    console.log('🚀 Starting SEO Optimization Batch 2...');
    for (const product of products) {
        const success = await updateProduct(product);
        if (success) {
            console.log(`✅ Success: ${product.name}`);
        } else {
            console.log(`❌ Failed: ${product.name}`);
        }
    }
    console.log('🎉 Batch 2 Complete!');
}

runUpdates();
