const https = require('https');

const username = 'ck_dd63149d47a97ca80e3fcb136cf156542689e583';
const password = 'cs_a31a6366c6a5ea5e89d8357bb7a2821352b71e83';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const options = {
    hostname: 'crm.restaurantpack.se',
    port: 443,
    path: '/wp-json/wc/v3/products?per_page=1',
    method: 'GET',
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
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json[0], null, 2));
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data:', data.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

req.end();
