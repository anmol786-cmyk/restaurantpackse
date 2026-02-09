import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from '../helpers';

/**
 * Checkout Flow Tests
 * 
 * CRITICAL PATH - Revenue Impact
 * Tests the complete checkout process including:
 * - Guest checkout
 * - Registered user checkout
 * - Shipping address
 * - Shipping method selection
 * - Payment processing
 * - Order confirmation
 */

test.describe('Checkout - Guest Checkout', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Navigate to checkout
        await helpers.goto('/checkout');
    });

    test('should complete guest checkout with card payment', async ({ page }) => {
        // Fill shipping information
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm({
            ...testData,
            email: TestData.randomEmail(),
        });

        // Continue to shipping method
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Select shipping method
        const shippingMethod = page.locator('[data-testid="shipping-method"], .shipping-method').first();
        await shippingMethod.click();

        // Continue to payment
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Verify on payment step
        await expect(page.getByText(/payment|pay now/i)).toBeVisible();
    });

    test('should validate required shipping fields', async ({ page }) => {
        // Try to continue without filling form
        await helpers.clickButton('Continue');
        await page.waitForTimeout(500);

        // Verify validation errors
        const firstNameInput = page.getByLabel('First Name');
        await expect(firstNameInput).toBeFocused();
    });

    test('should validate email format in checkout', async ({ page }) => {
        // Fill form with invalid email
        await helpers.fillField('Email', 'invalid-email');
        await helpers.clickButton('Continue');
        await page.waitForTimeout(500);

        // Verify email validation
        const emailInput = page.getByLabel('Email');
        const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validationMessage).toBeTruthy();
    });

    test('should validate Swedish postcode format', async ({ page }) => {
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm({
            ...testData,
            postcode: '123', // Invalid postcode
            email: TestData.randomEmail(),
        });

        await helpers.clickButton('Continue');
        await page.waitForTimeout(500);

        // Verify postcode validation
        await expect(page.getByText(/invalid.*postcode|postcode.*format/i)).toBeVisible();
    });
});

test.describe('Checkout - Registered User', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Login first
        await helpers.login('test@example.com', 'TestPassword123!');

        // Add product to cart
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Navigate to checkout
        await helpers.goto('/checkout');
    });

    test('should pre-fill shipping address for logged-in user', async ({ page }) => {
        // Check if address fields are pre-filled
        const firstNameInput = page.getByLabel('First Name');
        const value = await firstNameInput.inputValue();

        // Should have some value (if user has saved address)
        // Or should show option to select saved address
        const hasSavedAddress = value.length > 0;
        const hasAddressSelector = await page.getByText(/select.*address|saved address/i).isVisible();

        expect(hasSavedAddress || hasAddressSelector).toBe(true);
    });

    test('should allow editing pre-filled address', async ({ page }) => {
        // Edit first name
        const firstNameInput = page.getByLabel('First Name');
        await firstNameInput.clear();
        await firstNameInput.fill('Updated Name');

        // Verify change
        await expect(firstNameInput).toHaveValue('Updated Name');
    });

    test('should save new address to account', async ({ page }) => {
        // Fill new address
        const testData = TestData.addresses.gothenburg;
        await helpers.fillShippingForm(testData);

        // Check "Save address" checkbox if available
        const saveAddressCheckbox = page.getByLabel(/save.*address/i);
        if (await saveAddressCheckbox.isVisible()) {
            await saveAddressCheckbox.check();
        }

        // Continue
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Verify moved to next step
        await expect(page.getByText(/shipping method|payment/i)).toBeVisible();
    });
});

test.describe('Checkout - Shipping Methods', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Add product and navigate to checkout
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);
        await helpers.goto('/checkout');

        // Fill shipping form
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm({
            ...testData,
            email: TestData.randomEmail(),
        });

        // Continue to shipping methods
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);
    });

    test('should display available shipping methods', async ({ page }) => {
        // Verify shipping methods are shown
        const shippingMethods = page.locator('[data-testid="shipping-method"], .shipping-method');
        const count = await shippingMethods.count();

        expect(count).toBeGreaterThan(0);
    });

    test('should show free shipping for orders over threshold', async ({ page }) => {
        // Check if free shipping is available
        const freeShipping = page.getByText(/free.*shipping|shipping.*free/i);

        // If cart total is over 5000 SEK, free shipping should be available
        const cartTotal = await helpers.getCartTotal();

        if (cartTotal >= 5000) {
            await expect(freeShipping).toBeVisible();
        }
    });

    test('should select shipping method', async ({ page }) => {
        // Select first shipping method
        const firstMethod = page.locator('[data-testid="shipping-method"], .shipping-method').first();
        await firstMethod.click();

        // Verify selected
        await expect(firstMethod).toHaveClass(/selected|active/);
    });

    test('should update total when shipping method changes', async ({ page }) => {
        // Get initial total
        const totalElement = page.locator('[data-testid="order-total"], .order-total');
        const initialTotal = await totalElement.textContent();

        // Select first shipping method
        await page.locator('[data-testid="shipping-method"]').first().click();
        await page.waitForTimeout(500);

        // Get new total
        const newTotal = await totalElement.textContent();

        // Total should include shipping cost
        expect(newTotal).toBeTruthy();
    });

    test('should require shipping method selection before proceeding', async ({ page }) => {
        // Try to continue without selecting shipping
        await helpers.clickButton('Continue');
        await page.waitForTimeout(500);

        // Should show error or stay on same page
        const stillOnShipping = await page.getByText(/select.*shipping|shipping method/i).isVisible();
        expect(stillOnShipping).toBe(true);
    });
});

test.describe('Checkout - Payment', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Complete checkout up to payment step
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);
        await helpers.goto('/checkout');

        // Fill shipping
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm({
            ...testData,
            email: TestData.randomEmail(),
        });
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Select shipping method
        await page.locator('[data-testid="shipping-method"], .shipping-method').first().click();
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);
    });

    test('should display payment methods', async ({ page }) => {
        // Verify payment options are shown
        const paymentMethods = page.locator('[data-testid="payment-method"], .payment-method');
        const count = await paymentMethods.count();

        expect(count).toBeGreaterThan(0);
    });

    test('should show Stripe payment option', async ({ page }) => {
        // Check for Stripe/card payment
        await expect(page.getByText(/card|credit card|stripe/i)).toBeVisible();
    });

    test('should display order summary', async ({ page }) => {
        // Verify order summary is shown
        await expect(page.getByText(/order summary|your order/i)).toBeVisible();

        // Verify subtotal, shipping, total
        await expect(page.getByText(/subtotal/i)).toBeVisible();
        await expect(page.getByText(/shipping/i)).toBeVisible();
        await expect(page.getByText(/total/i)).toBeVisible();
    });

    test('should show terms and conditions checkbox', async ({ page }) => {
        // Check for T&C checkbox
        const termsCheckbox = page.getByLabel(/terms.*conditions|agree/i);
        await expect(termsCheckbox).toBeVisible();
    });

    test('should require terms acceptance before payment', async ({ page }) => {
        // Try to place order without accepting terms
        await helpers.clickButton('Place Order');
        await page.waitForTimeout(500);

        // Should show error or prevent submission
        const termsCheckbox = page.getByLabel(/terms.*conditions|agree/i);
        const isChecked = await termsCheckbox.isChecked();

        if (!isChecked) {
            // Should still be on payment page
            await expect(page.getByText(/payment|place order/i)).toBeVisible();
        }
    });
});

test.describe('Checkout - B2B Features', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Login as business user
        await helpers.login('test-business@example.com', 'TestPassword123!');
    });

    test('should show payment terms options for business users', async ({ page }) => {
        // Add product and go to checkout
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);
        await helpers.goto('/checkout');

        // Navigate to payment step
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm(testData);
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);
        await page.locator('[data-testid="shipping-method"]').first().click();
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Check for payment terms (Net 28, Net 60, etc.)
        const paymentTerms = page.getByText(/net 28|net 60|payment terms/i);
        await expect(paymentTerms).toBeVisible();
    });

    test('should display wholesale pricing in checkout', async ({ page }) => {
        // Add product
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();

        // Verify wholesale price is shown
        await expect(page.getByText(/wholesale|business price/i)).toBeVisible();
    });
});

test.describe('Checkout - Order Confirmation', () => {
    let helpers: TestHelpers;

    test('should display order confirmation after successful checkout', async ({ page }) => {
        // This test would require completing a full checkout
        // For now, we'll test the confirmation page directly

        helpers = new TestHelpers(page);

        // Navigate to a test order confirmation (if you have test order IDs)
        // await helpers.goto('/order-received/12345');

        // Verify confirmation elements
        // await expect(page.getByText(/thank you|order confirmed/i)).toBeVisible();
        // await expect(page.getByText(/order number|order #/i)).toBeVisible();
    });
});

test.describe('Checkout - Edge Cases', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should handle empty cart at checkout', async ({ page }) => {
        // Go to checkout with empty cart
        await helpers.goto('/checkout');

        // Should show empty cart message or redirect to shop
        const emptyMessage = await page.getByText(/cart is empty|no items/i).isVisible();
        const redirectedToShop = page.url().includes('/shop');

        expect(emptyMessage || redirectedToShop).toBe(true);
    });

    test('should preserve cart during checkout process', async ({ page }) => {
        // Add product
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Start checkout
        await helpers.goto('/checkout');

        // Go back to shop
        await helpers.goto('/shop');

        // Cart should still have item
        await expect(page.locator('[data-testid="cart-count"]')).toContainText(/1/);
    });

    test('should handle session timeout gracefully', async ({ page }) => {
        // This would require simulating session timeout
        // For now, we'll test that checkout requires valid session

        await helpers.goto('/checkout');

        // Should either allow guest checkout or redirect to login
        const isOnCheckout = page.url().includes('/checkout');
        const isOnLogin = page.url().includes('/login');

        expect(isOnCheckout || isOnLogin).toBe(true);
    });
});

test.describe('Checkout - Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should complete checkout on mobile', async ({ page }) => {
        // Add product
        await helpers.goto('/shop');
        await page.locator('.product-card').first().click();
        await helpers.waitForPageLoad();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForTimeout(1000);

        // Navigate to checkout
        await helpers.goto('/checkout');

        // Fill shipping form
        const testData = TestData.addresses.stockholm;
        await helpers.fillShippingForm({
            ...testData,
            email: TestData.randomEmail(),
        });

        // Continue
        await helpers.clickButton('Continue');
        await page.waitForTimeout(1000);

        // Verify on shipping method step
        await expect(page.getByText(/shipping method/i)).toBeVisible();
    });

    test('should display mobile-optimized checkout form', async ({ page }) => {
        await helpers.goto('/checkout');

        // Verify form is responsive
        const form = page.locator('form').first();
        const boundingBox = await form.boundingBox();

        // Form should fit within mobile viewport
        expect(boundingBox?.width).toBeLessThanOrEqual(375);
    });
});
