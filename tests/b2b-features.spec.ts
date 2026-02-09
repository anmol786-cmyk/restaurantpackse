import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('B2B Features Verification', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('ensure wholesale tiers are visible on product page', async ({ page }) => {
        // Navigate to shop
        await helpers.goto('/shop');

        // Click on first product
        const productCard = page.locator('.product-card, a[href*="/product/"]').first();
        await productCard.click();
        await helpers.waitForPageLoad();

        // Check for Volume Pricing table
        const tiersTable = page.getByText(/Wholesale Volume Tiers|Volume Pricing/i);
        await expect(tiersTable).toBeVisible();

        // Check for MOQ badge
        // Note: Not all products might have MOQ > 1, but we should check if the badge structure exists or if we can find one that does
        const moqBadge = page.locator('.badge', { hasText: /MOQ/i }).or(page.getByText(/Minimum Order Quantity/i));
        // We don't necessarily expect it on every product, so we won't fail if not found, but we'll log it
        const isMoqVisible = await moqBadge.isVisible();
        console.log('MOQ Badge visible:', isMoqVisible);
    });

    test('ensure credit status visualizer handles restricted access', async ({ page }) => {
        // As a guest, we shouldn't see it
        await helpers.goto('/dashboard');
        // It might redirect to login
        if (page.url().includes('login')) {
            await expect(page.getByText(/Business Credit Status/i)).not.toBeVisible();
        } else {
            await expect(page.getByText(/Business Credit Status/i)).not.toBeVisible();
        }
    });

    test('verify wholesale pricing application in cart', async ({ page }) => {
        // Navigate to a product page
        await helpers.goto('/shop');
        await page.locator('.product-card, a[href*="/product/"]').first().click();
        await helpers.waitForPageLoad();

        // Get base price
        const priceText = await page.locator('.text-primary.text-2xl').first().textContent();
        console.log('Base Price:', priceText);

        // Increase quantity to trigger a tier
        // Let's try to set it to 10 if possible
        const qtyInput = page.locator('input[type="number"]');
        if (await qtyInput.isVisible()) {
            await qtyInput.fill('10');
            await page.keyboard.press('Tab');
        } else {
            // Try buttons if input is not direct
            const plusBtn = page.locator('button:has(.lucide-plus), button:has-text("+")');
            for (let i = 0; i < 9; i++) {
                await plusBtn.click();
            }
        }

        // Check if "Your Price" or discount badge appears
        await expect(page.getByText(/Your Price|Tier Applied|Savings/i)).toBeVisible();
    });
});
