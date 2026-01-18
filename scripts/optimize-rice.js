const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const productId = 176;
const productData = {
    description: `
<h2>Ocean Pearl Basmati Rice: The Gold Standard for Professional Kitchens</h2>

<p>In the world of high-volume restaurant catering, the quality of your rice can make or break your reputation. At <strong>Anmol Wholesale</strong>, we understand that a Biryani is only as good as the grain it is built upon. That is why we are proud to offer <strong>Ocean Pearl Basmati Rice in our 5kg Wholesale Pack</strong>—a premium, long-grain basmati specifically selected for its aromatic profile and superior cooking performance in commercial environments.</p>

<h3>The Chef’s Choice: Aroma, Length, and Fluffiness</h3>
<p>What sets Ocean Pearl apart from generic supermarket brands is its consistency. As experienced restaurateurs running <strong>Anmol Sweets & Restaurant</strong> in Stockholm for over 5 years, we have tested countless varieties of basmati in our own high-pressure kitchen. Ocean Pearl consistently delivers the three "holy grails" of professional rice cooking:
<ul>
  <li><strong>Exceptional Elongation:</strong> The grains double in length upon cooking without breaking, providing that elegant, professional look on the plate.</li>
  <li><strong>Distinct Separation:</strong> Each grain remain separate and non-sticky, essential for authentic Biryani and Pulao.</li>
  <li><strong>Intoxicating Aroma:</strong> The natural, aged fragrance of authentic Himalayan basmati that fills the dining room the moment the pot is opened.</li>
</ul>
</p>

<h3>Wholesale Advantage: 15% Lower Prices for Stockholm Businesses</h3>
<p>Operating a profitable restaurant in Scandinavia requires a sharp eye on food costs. Because we are a direct B2B wholesaler, we can provide Ocean Pearl Basmati at prices that are typically <strong>15% lower</strong> than traditional grocery distributors. We cut out the excessive retail markups so that small to medium-sized cafés, bakeries, and restaurants can maximize their margins while serving a premium product. Our warehouse in Spånga (Fagerstagatan 13) is stocked with both locally sourced staples and high-quality imports, ensuring we can meet pallet-level demand at a moment's notice.</p>

<h3>Topical Authority: Why Grain-Aging Matters</h3>
<p>Many "budget" rice brands sell new-crop rice which is high in moisture and starch, leading to a sticky, clumpy texture that is unacceptable in a professional setting. Ocean Pearl is aged to perfection, allowing the moisture to evaporate naturally and the starches to stabilize. This aging process is what gives the rice its characteristic firm-yet-tender bite. In our role as your wholesale partner, we ensure that every 5kg bag you receive has been stored in optimal conditions in our temperature-controlled facility in Stockholm.</p>

<h3>Flexible Logistics across Sweden and Scandinavia</h3>
<p>Whether you need a single 5kg pack for a small café or a full pallet for a catering chain, <strong>Anmol Wholesale</strong> has the logistics infrastructure to deliver. We are unique in the Stockholm market because we operate our <strong>own delivery system</strong>. We don't just rely on third-party couriers who might mishandle your stock. Our drivers know the city and the surrounding Scandinavian regions, providing a reliable, specialized service.
<ul>
  <li><strong>Ex-Warehouse Pickup:</strong> Visit us at Fagerstagatan 13 for immediate collection.</li>
  <li><strong>Scandinavia-Wide Shipping:</strong> Efficient delivery to Norway, Finland, and Denmark.</li>
  <li><strong>Your Choice of Freight:</strong> We are happy to coordinate with your preferred shipping partner, including DHL, PostNord, or DB Schenker.</li>
</ul>
</p>

<h3>A Partnership Rooted in Experience</h3>
<p>Anmol Wholesale was born from the success of a real restaurant. We know the stress of a Saturday night rush and the frustration of a delivery that doesn't show up. Our mission is to be the reliable foundation for your kitchen. By supplying you with <strong>Ocean Pearl Basmati</strong>, we are sharing the ingredients that helped make Anmol Sweets & Restaurant a Stockholm landmark. We are not just your supplier; we are your fellow industry professionals.</p>

<h3>Sustainability and Quality Assurance</h3>
<p>We take pride in our "Locally Stocked + Imported" model. By importing in bulk to our Swedish hub, we reduce the carbon footprint of individual small shipments and pass those savings directly to you. Every bag of Ocean Pearl undergoes strict quality checks before it leaves our Spånga warehouse. We check for grain purity, moisture content, and packaging integrity so that you can focus on what you do best: cooking incredible food.</p>

<p><strong>Upgrade your rice supply today. Choose Ocean Pearl from Anmol Wholesale and bring the authentic taste of premium basmati to your restaurant. Competitive prices, reliable delivery, and professional expertise—all just a phone call away in Stockholm.</strong></p>
  `,
    meta_data: [
        {
            key: 'rank_math_title',
            value: 'Ocean Pearl Basmati Rice 5kg Wholesale | Anmol Wholesale'
        },
        {
            key: 'rank_math_description',
            value: 'Premium Ocean Pearl Basmati Rice in 5kg packs. Ideal for restaurants & catering. 15% lower wholesale prices. Stockholm-based stock with own delivery.'
        },
        {
            key: 'rank_math_focus_keyword',
            value: 'Ocean Pearl Basmati Rice, Wholesale Rice Stockholm, Professional Restaurant Rice, 5kg Basmati Pack'
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
            console.log('✅ Ocean Pearl Rice updated successfully with Authority Content and RankMath SEO!');
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
