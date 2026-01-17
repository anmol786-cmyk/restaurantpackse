#!/usr/bin/env node

/**
 * Hostinger VPS Deployment Diagnostic Script
 * 
 * This script checks if all required environment variables are set
 * and tests connectivity to the WooCommerce backend.
 * 
 * Run this on your Hostinger VPS to diagnose deployment issues.
 */

console.log('🔍 Hostinger VPS Deployment Diagnostic\n');
console.log('='.repeat(60));

// Check Node.js version
console.log('\n📦 Node.js Version:');
console.log(`   ${process.version}`);
console.log(`   Recommended: v20.x or v22.x`);

// Check environment variables
console.log('\n🔐 Environment Variables Check:');

const requiredEnvVars = [
    'NEXT_PUBLIC_WORDPRESS_URL',
    'WORDPRESS_API_URL',
    'WORDPRESS_CONSUMER_KEY',
    'WORDPRESS_CONSUMER_SECRET',
    'NEXT_PUBLIC_SITE_URL',
    'NODE_ENV',
];

const optionalEnvVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_WHATSAPP_PHONE',
    'SMTP_HOST',
    'SMTP_USER',
];

let missingRequired = [];
let missingOptional = [];

requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
        console.log(`   ❌ ${varName}: NOT SET`);
        missingRequired.push(varName);
    } else {
        // Mask sensitive values
        const displayValue = varName.includes('SECRET') || varName.includes('KEY')
            ? value.substring(0, 10) + '...'
            : value;
        console.log(`   ✅ ${varName}: ${displayValue}`);
    }
});

console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
        console.log(`   ⚠️  ${varName}: NOT SET`);
        missingOptional.push(varName);
    } else {
        const displayValue = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('PASSWORD')
            ? value.substring(0, 10) + '...'
            : value;
        console.log(`   ✅ ${varName}: ${displayValue}`);
    }
});

// Test WooCommerce API connectivity
console.log('\n🌐 WooCommerce API Connectivity Test:');

async function testWooCommerceAPI() {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
        console.log('   ❌ Cannot test - missing credentials');
        return false;
    }

    try {
        console.log(`   Testing: ${wpUrl}/wp-json/wc/v3/products?per_page=1`);

        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const response = await fetch(`${wpUrl}/wp-json/wc/v3/products?per_page=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ WooCommerce API: Connected successfully`);
            console.log(`   📦 Sample product count: ${data.length}`);
            return true;
        } else {
            console.log(`   ❌ WooCommerce API: Failed (Status: ${response.status})`);
            const errorText = await response.text();
            console.log(`   Error: ${errorText.substring(0, 200)}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ WooCommerce API: Connection failed`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Test WordPress REST API
async function testWordPressAPI() {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    if (!wpUrl) {
        console.log('   ❌ Cannot test - NEXT_PUBLIC_WORDPRESS_URL not set');
        return false;
    }

    try {
        console.log(`   Testing: ${wpUrl}/wp-json/wp/v2/posts?per_page=1`);

        const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log(`   ✅ WordPress REST API: Connected successfully`);
            return true;
        } else {
            console.log(`   ❌ WordPress REST API: Failed (Status: ${response.status})`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ WordPress REST API: Connection failed`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Run tests
(async () => {
    console.log('\n🧪 Running API Tests...\n');

    const wpTest = await testWordPressAPI();
    const wcTest = await testWooCommerceAPI();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC SUMMARY\n');

    if (missingRequired.length > 0) {
        console.log('❌ CRITICAL: Missing required environment variables:');
        missingRequired.forEach(v => console.log(`   - ${v}`));
        console.log('\n   Action: Add these variables to your Hostinger environment');
    } else {
        console.log('✅ All required environment variables are set');
    }

    if (missingOptional.length > 0) {
        console.log('\n⚠️  WARNING: Missing optional environment variables:');
        missingOptional.forEach(v => console.log(`   - ${v}`));
    }

    console.log('\n🌐 API Connectivity:');
    console.log(`   WordPress: ${wpTest ? '✅ Working' : '❌ Failed'}`);
    console.log(`   WooCommerce: ${wcTest ? '✅ Working' : '❌ Failed'}`);

    if (!wpTest || !wcTest) {
        console.log('\n❌ DEPLOYMENT ISSUE DETECTED');
        console.log('\n📝 Troubleshooting Steps:');
        console.log('   1. Verify all environment variables are set in Hostinger');
        console.log('   2. Check if WooCommerce backend is accessible');
        console.log('   3. Verify consumer key and secret are correct');
        console.log('   4. Check firewall/network settings on VPS');
        console.log('   5. Ensure SSL certificates are valid');
    } else {
        console.log('\n✅ DEPLOYMENT LOOKS GOOD!');
        console.log('   All systems operational');
    }

    console.log('\n' + '='.repeat(60));
})();
