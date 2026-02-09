import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from '../helpers';

/**
 * Cart Functionality Tests
 * 
 * Critical user flows:
 * - Add products to cart
 * - Update quantities
 * - Remove items
 * - Cart persistence
 * - Cart drawer/page display
 */

test.describe('Cart Operations', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
        await helpers.goto('/');
    });

    test('should add product to cart from product page', async ({ page }) => {
        // Navigate to shop
        await helpers.goto('/shop');

        // Click first product
        await page.locator('.product-card, [data-testid="product-card"]').first().click();
        await helpers.waitForPageLoad();

        // Add to cart
        await page.getByRole('button', { name: /add to cart/i }).click();

        // Verify cart updated (check for cart count badge or toast)
        await expect(
            page.locator('[data-testid="cart-count"], .cart-count, [aria-label*="cart"]')
        ).toContainText(/1/);
    });

    test('should update product quantity in cart', async ({ page }) => {
        // Add product to cart first
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Find quantity input and increase
        const quantityInput = page.locator('input[type="number"]').first();
        await quantityInput.fill('2');

        // Wait for cart to update
        await page.waitForTimeout(1000);

        // Verify quantity updated
        await expect(quantityInput).toHaveValue('2');
    });

    test('should remove product from cart', async ({ page }) => {
        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Remove item
        await page.getByRole('button', { name: /remove/i }).first().click();
        await page.waitForTimeout(1000);

        // Verify cart is empty
        await expect(page.getByText(/cart is empty/i)).toBeVisible();
    });

    test('should display correct cart total', async ({ page }) => {
        // Add product to cart
        await helpers.goto('/shop');

        // Get first product price
        const firstProduct = page.locator('.product-card').first();
        const priceText = await firstProduct.locator('[data-testid="product-price"], .price').textContent();

        // Click product and add to cart
        await firstProduct.click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Verify total is displayed
        const total = page.locator('[data-testid="cart-total"], .cart-total');
        await expect(total).toBeVisible();
    });

    test('should add multiple different products to cart', async ({ page }) => {
        // Add first product
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Go back to shop
        await helpers.goto('/shop');

        // Add second product
        await page.locator('.product-card').nth(1).click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Verify 2 items in cart
        const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
        await expect(cartItems).toHaveCount(2);
    });

    test('should persist cart after page reload', async ({ page }) => {
        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Reload page
        await page.reload();
        await helpers.waitForPageLoad();

        // Verify cart still has item
        await expect(
            page.locator('[data-testid="cart-count"], .cart-count')
        ).toContainText(/1/);
    });

    test('should show empty cart message when cart is empty', async ({ page }) => {
        // Open cart when empty
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Verify empty message
        await expect(page.getByText(/cart is empty|no items/i)).toBeVisible();
    });

    test('should navigate to checkout from cart', async ({ page }) => {
        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Click checkout button
        await page.getByRole('button', { name: /checkout|proceed/i }).click();
        await helpers.waitForPageLoad();

        // Verify on checkout page
        await expect(page).toHaveURL(/checkout/);
    });

    test('should update cart total when quantity changes', async ({ page }) => {
        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Get initial total
        const totalElement = page.locator('[data-testid="cart-total"], .cart-total');
        const initialTotal = await totalElement.textContent();

        // Increase quantity
        const quantityInput = page.locator('input[type="number"]').first();
        await quantityInput.fill('2');
        await page.waitForTimeout(1000);

        // Get new total
        const newTotal = await totalElement.textContent();

        // Verify total changed
        expect(newTotal).not.toBe(initialTotal);
    });

    test('should handle out of stock products gracefully', async ({ page }) => {
        // This test assumes you have an out-of-stock product
        // Navigate to a product page
        await helpers.goto('/shop');

        // Try to find out of stock badge
        const outOfStock = page.getByText(/out of stock|sold out/i);

        if (await outOfStock.isVisible()) {
            // Verify Add to Cart button is disabled
            const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
            await expect(addToCartBtn).toBeDisabled();
        }
    });
});

test.describe('Cart - Mobile View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
        await helpers.goto('/');
    });

    test('should open cart drawer on mobile', async ({ page }) => {
        // Add product
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Open cart
        await page.getByRole('button', { name: /cart/i }).click();
        await page.waitForTimeout(500);

        // Verify cart drawer/modal is visible
        await expect(page.locator('[role="dialog"], .cart-drawer')).toBeVisible();
    });
});
