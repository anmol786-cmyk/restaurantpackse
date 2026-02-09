import { Page, expect } from '@playwright/test';

/**
 * Test Helpers for Restaurant Pack E-commerce Testing
 * Reusable functions for common test operations
 */

export class TestHelpers {
    constructor(private page: Page) { }

    /**
     * Wait for page to be fully loaded including network requests
     * Updated to use domcontentloaded instead of networkidle for Next.js compatibility
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        // Wait for React hydration
        await this.page.waitForTimeout(500);
    }

    /**
     * Navigate to a page and wait for it to load
     */
    async goto(path: string) {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(500);
    }

    /**
     * Fill form field with label
     */
    async fillField(label: string, value: string) {
        await this.page.getByLabel(label, { exact: false }).fill(value);
    }

    /**
     * Click button by text
     */
    async clickButton(text: string) {
        await this.page.getByRole('button', { name: text, exact: false }).click();
    }

    /**
     * Check if element with text is visible
     */
    async expectTextVisible(text: string) {
        await expect(this.page.getByText(text, { exact: false })).toBeVisible();
    }

    /**
     * Wait for toast notification
     */
    async waitForToast(message?: string) {
        if (message) {
            await expect(this.page.getByText(message, { exact: false })).toBeVisible();
        } else {
            // Wait for any toast
            await this.page.waitForSelector('[role="status"], [data-sonner-toast]', { timeout: 5000 });
        }
    }

    /**
     * Add product to cart by navigating to product page
     */
    async addProductToCart(productSlug: string, quantity: number = 1) {
        await this.goto(`/product/${productSlug}`);

        // Set quantity if not 1
        if (quantity > 1) {
            const quantityInput = this.page.locator('input[type="number"]').first();
            await quantityInput.fill(quantity.toString());
        }

        // Click Add to Cart button
        await this.page.getByRole('button', { name: /add to cart/i }).click();

        // Wait for cart update
        await this.page.waitForTimeout(1000);
    }

    /**
     * Login as a user
     */
    async login(email: string, password: string) {
        await this.goto('/login');
        await this.fillField('Email', email);
        await this.fillField('Password', password);
        await this.clickButton('Sign In');
        await this.waitForPageLoad();
    }

    /**
     * Logout current user
     */
    async logout() {
        // Click user menu
        await this.page.getByRole('button', { name: /account|profile/i }).click();
        await this.page.getByRole('menuitem', { name: /logout|sign out/i }).click();
        await this.waitForPageLoad();
    }

    /**
     * Fill checkout shipping form
     */
    async fillShippingForm(data: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postcode: string;
        phone: string;
        email?: string;
    }) {
        await this.fillField('First Name', data.firstName);
        await this.fillField('Last Name', data.lastName);
        await this.fillField('Address', data.address);
        await this.fillField('City', data.city);
        await this.fillField('Postcode', data.postcode);
        await this.fillField('Phone', data.phone);

        if (data.email) {
            await this.fillField('Email', data.email);
        }
    }

    /**
     * Select shipping method
     */
    async selectShippingMethod(methodName: string) {
        await this.page.getByText(methodName, { exact: false }).click();
    }

    /**
     * Get cart total from page
     */
    async getCartTotal(): Promise<number> {
        const totalText = await this.page.locator('[data-testid="cart-total"], .cart-total').textContent();
        if (!totalText) return 0;

        // Extract number from text like "1,234 kr" or "1234.56 SEK"
        const match = totalText.match(/[\d,]+\.?\d*/);
        if (!match) return 0;

        return parseFloat(match[0].replace(',', ''));
    }

    /**
     * Take screenshot with descriptive name
     */
    async screenshot(name: string) {
        await this.page.screenshot({
            path: `screenshots/${name}-${Date.now()}.png`,
            fullPage: true
        });
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        // Check for user menu or account link
        const accountButton = this.page.getByRole('button', { name: /account|profile/i });
        return await accountButton.isVisible();
    }

    /**
     * Clear cart
     */
    async clearCart() {
        // Open cart drawer/page
        await this.page.getByRole('button', { name: /cart/i }).click();

        // Remove all items
        const removeButtons = this.page.getByRole('button', { name: /remove/i });
        const count = await removeButtons.count();

        for (let i = 0; i < count; i++) {
            await removeButtons.first().click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Wait for element to be visible
     */
    async waitForElement(selector: string, timeout: number = 5000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }

    /**
     * Check if element exists
     */
    async elementExists(selector: string): Promise<boolean> {
        return await this.page.locator(selector).count() > 0;
    }

    /**
     * Get element text content
     */
    async getTextContent(selector: string): Promise<string> {
        return await this.page.locator(selector).textContent() || '';
    }

    /**
     * Fill Stripe test card
     */
    async fillStripeTestCard() {
        // Wait for Stripe iframe to load
        const stripeFrame = this.page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

        // Fill card number
        await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242');

        // Fill expiry
        await stripeFrame.locator('[name="exp-date"]').fill('12/34');

        // Fill CVC
        await stripeFrame.locator('[name="cvc"]').fill('123');
    }
}

/**
 * Test data generators
 */
export const TestData = {
    /**
     * Generate random email
     */
    randomEmail: () => `test-${Date.now()}@example.com`,

    /**
     * Generate random phone
     */
    randomPhone: () => `070${Math.floor(Math.random() * 10000000)}`,

    /**
     * Swedish test addresses
     */
    addresses: {
        stockholm: {
            firstName: 'Test',
            lastName: 'User',
            address: 'Testgatan 123',
            city: 'Stockholm',
            postcode: '11122',
            phone: '0701234567',
        },
        gothenburg: {
            firstName: 'Test',
            lastName: 'User',
            address: 'Testvägen 456',
            city: 'Göteborg',
            postcode: '41234',
            phone: '0701234568',
        },
    },

    /**
     * Test user credentials
     */
    users: {
        customer: {
            email: 'test-customer@example.com',
            password: 'TestPassword123!',
        },
        business: {
            email: 'test-business@example.com',
            password: 'TestPassword123!',
        },
    },

    /**
     * Test product slugs (update with actual products)
     */
    products: {
        simple: 'test-product',
        variable: 'test-variable-product',
    },
};

/**
 * Common assertions
 */
export const Assertions = {
    /**
     * Assert page title contains text
     */
    async pageTitle(page: Page, text: string) {
        await expect(page).toHaveTitle(new RegExp(text, 'i'));
    },

    /**
     * Assert URL contains path
     */
    async urlContains(page: Page, path: string) {
        await expect(page).toHaveURL(new RegExp(path));
    },

    /**
     * Assert element is visible
     */
    async isVisible(page: Page, selector: string) {
        await expect(page.locator(selector)).toBeVisible();
    },

    /**
     * Assert text is present on page
     */
    async hasText(page: Page, text: string) {
        await expect(page.getByText(text, { exact: false })).toBeVisible();
    },
};
