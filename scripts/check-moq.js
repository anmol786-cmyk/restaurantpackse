const https = require('https');

const WC_URL = 'https://crm.restaurantpack.se';
const CONSUMER_KEY = 'ck_110ab15b0734aa79faa2aa1b331caace0c11ea3f';
const CONSUMER_SECRET = 'cs_cc8b959ab1b48a49778127dc13ae660b82b021a7';

function wcRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const url = new URL(`${WC_URL}/wp-json/wc/v3${endpoint}`);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
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
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function checkMOQ() {
    try {
        const product = await wcRequest('/products/257');
        console.log('\n📦 Product:', product.name);
        console.log('🆔 ID:', product.id);

        const moqMeta = product.meta_data.filter(m =>
            m.key === '_minimum_order_quantity' ||
            m.key === 'minimum_order_quantity'
        );

        console.log('\n📊 MOQ Metadata:');
        moqMeta.forEach(m => {
            console.log(`   ${m.key}: ${m.value}`);
        });

        if (moqMeta.length === 0) {
            console.log('   ⚠️  No MOQ metadata found');
        }
    } catch (error) {
        console.error('❌ Error:', error.message || error);
    }
}

checkMOQ();
