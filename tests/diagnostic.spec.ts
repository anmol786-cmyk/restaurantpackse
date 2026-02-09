import { test } from '@playwright/test';

/**
 * Diagnostic Test - Explore the actual site structure
 * This will help us understand what selectors to use
 */

test('Diagnostic: Homepage exploration', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });

    // Log page title
    console.log('Page Title:', await page.title());

    // Log all links
    const links = await page.locator('a').all();
    console.log(`\nFound ${links.length} links`);
    for (let i = 0; i < Math.min(10, links.length); i++) {
        const text = await links[i].textContent();
        const href = await links[i].getAttribute('href');
        console.log(`  - "${text?.trim()}" -> ${href}`);
    }

    // Log all buttons
    const buttons = await page.locator('button').all();
    console.log(`\nFound ${buttons.length} buttons`);
    for (let i = 0; i < Math.min(10, buttons.length); i++) {
        const text = await buttons[i].textContent();
        console.log(`  - "${text?.trim()}"`);
    }
});

test('Diagnostic: Shop page exploration', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'screenshots/shop.png', fullPage: true });

    console.log('Shop Page Title:', await page.title());

    // Look for product cards
    const products = await page.locator('[class*="product"]').all();
    console.log(`\nFound ${products.length} elements with 'product' in class`);

    // Look for common e-commerce selectors
    const addToCartButtons = await page.locator('button:has-text("Add"), button:has-text("Cart")').all();
    console.log(`Found ${addToCartButtons.length} potential "Add to Cart" buttons`);
});

test('Diagnostic: Login/Register pages', async ({ page }) => {
    // Check login page
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/login.png', fullPage: true });

    console.log('Login Page Title:', await page.title());

    // Look for form inputs
    const inputs = await page.locator('input').all();
    console.log(`\nFound ${inputs.length} input fields`);
    for (const input of inputs) {
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const label = await input.getAttribute('aria-label');
        console.log(`  - Type: ${type}, Name: ${name}, Placeholder: ${placeholder}, Label: ${label}`);
    }

    // Check register page
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/register.png', fullPage: true });

    console.log('\nRegister Page Title:', await page.title());
});

test('Diagnostic: Checkout page', async ({ page }) => {
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'screenshots/checkout.png', fullPage: true });

    console.log('Checkout Page Title:', await page.title());
    console.log('Checkout URL:', page.url());

    // Check if redirected
    if (page.url().includes('login')) {
        console.log('⚠️  Redirected to login - checkout requires authentication');
    } else if (page.url().includes('cart') || page.url().includes('empty')) {
        console.log('⚠️  Redirected to cart - probably empty cart');
    }
});
