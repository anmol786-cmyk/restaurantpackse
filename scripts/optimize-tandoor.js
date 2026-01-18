const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const productId = 161;
const productData = {
    description: `
<h2>The Professional Mini Electric Tandoor: High-Performance Gastronomy from Stockholm</h2>

<p>When it comes to authentic South Asian and Middle Eastern cuisine, the Tandoor oven is the beating heart of the kitchen. At <strong>Anmol Wholesale</strong>, we don't just sell kitchen equipment—we manufacture it. Drawing from over 5 years of real-world experience running our successful sister establishment, <strong>Anmol Sweets & Restaurant</strong> in Stockholm, we have engineered the perfect <strong>Mini Electric Tandoor</strong> designed specifically for the rigors of professional restaurant, café, and bakery environments.</p>

<h3>Why Every Professional Kitchen Needs an Anmol Mini Tandoor</h3>
<p>In a modern commercial kitchen, space and efficiency are just as important as flavor. Traditional clay tandoors are magnificent but often require significant space, specialized ventilation, and hours of pre-heating. Our Mini Electric Tandoor solves these logistical challenges without sacrificing the iconic quality of the bread or meat dishes your customers love. It is the ultimate tool for restaurants looking to add high-margin items like fresh Naan, Roti, and Tandoori appetizers to their menu with minimal footprint.</p>

<h3>Direct from the Manufacturer: Our Stockholm USP</h3>
<p>Unlike other wholesale suppliers who simply import and flip generic products, we are the direct manufacturers of this specific unit. Based in our Spånga warehouse (Fagerstagatan 13), we maintain total control over the build quality, safety standards, and spare parts availability. Because we use these exact units in our own restaurant operations, we have optimized the heating elements and insulation to withstand continuous use in high-volume settings. When you buy from us, you are buying a product tested by chefs, for chefs.</p>

<h3>Unbeatable Wholesale Value: 15% Lower Than Market Average</h3>
<p>Because we eliminate the middleman and manufacture our own equipment, we are able to offer this Mini Electric Tandoor at prices typically <strong>15% lower</strong> than the equivalent wholesale market. For a small to medium-sized business, this cost saving translates directly into a faster return on investment (ROI). Whether you are a new start-up bakery in Stockholm or an established catering business in Oslo, our competitive B2B pricing ensures your kitchen is equipped with professional-grade gear without breaking the budget.</p>

<h3>Logistics and Delivery: Our Owned Scandinavian Service</h3>
<p>Logistics can be a major headache for wholesale buyers. That is why Anmol Wholesale maintains its own dedicated delivery network. We don't just hand your expensive equipment over to a random courier; we manage the distribution across <strong>Sweden, Norway, Finland, and Denmark</strong> to ensure it arrives in perfect condition.
<ul>
  <li><strong>Local Pickup:</strong> Visit our warehouse in Spånga to inspect the unit and collect it personally.</li>
  <li><strong>Managed Delivery:</strong> Use our fleet for safe, timely "white-glove" delivery to your restaurant door.</li>
  <li><strong>Flexible Freight:</strong> If you have a preferred logistics partner like DHL, PostNord, or DB Schenker, we can arrange ex-warehouse shipping using your account or ours.</li>
</ul>
</p>

<h3>Technical Excellence & Safety</h3>
<p>The Anmol Mini Electric Tandoor is built with high-grade stainless steel for easy cleaning and hygiene compliance. The internal heating system is designed for rapid heat recovery, meaning you can serve batches of fresh naan every minute during your peak rush hour. The exterior remains safe to touch compared to traditional charcoal ovens, improving the working conditions for your staff. Its compact size makes it perfect for food trucks, market stalls, and smaller café kitchens that previously thought tandoori cooking was out of reach.</p>

<h3>Join the Anmol Wholesale Partner Network</h3>
<p>By choosing Anmol Wholesale, you are choosing more than a supplier; you are choosing a partner who understands the DNA of a successful restaurant. From the authentic recipes developed at Anmol Sweets to the equipment that brings them to life, we are here to support your growth. Our Mini Electric Tandoor is the cornerstone of that commitment—a locally manufactured, expertly designed solution that delivers the taste of the East with the efficiency of the West.</p>

<p><strong>Order your Mini Electric Tandoor today and experience the Anmol difference. From our kitchen to yours, we bring you the ultimate in professional restaurant supply.</strong></p>
  `,
    meta_data: [
        {
            key: 'rank_math_title',
            value: 'Mini Electric Tandoor Oven for Restaurants | Anmol Wholesale'
        },
        {
            key: 'rank_math_description',
            value: 'Professional Mini Electric Tandoor manufactured by Anmol Wholesale. 15% lower prices, Stockholm-based stock, and dedicated own delivery across Scandinavia.'
        },
        {
            key: 'rank_math_focus_keyword',
            value: 'Mini Electric Tandoor, Restaurant Kitchen Equipment, Tandoor Oven Wholesale, Anmol Wholesale'
        }
    ]
};

const options = {
    hostname: 'crm.restaurantpack.se',
    port: 443,
    path: `/wp-json/wc/v3/products/${productId}`,
    method: 'PUT',
    headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('UPDATE STATUS:', res.statusCode);
        if (res.statusCode === 200) {
            console.log('✅ Product updated successfully with Authority Content and RankMath SEO!');
        } else {
            console.log('❌ Update failed:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

req.write(JSON.stringify(productData));
req.end();
