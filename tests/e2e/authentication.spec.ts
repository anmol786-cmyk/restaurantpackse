import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from '../helpers';

/**
 * Authentication Tests
 * 
 * Critical security and user flows:
 * - User registration
 * - Login/logout
 * - Password reset
 * - Session persistence
 * - Protected routes
 */

test.describe('Authentication - Registration', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should register new customer account', async ({ page }) => {
        await helpers.goto('/register');

        // Fill registration form
        const email = TestData.randomEmail();
        await helpers.fillField('First Name', 'Test');
        await helpers.fillField('Last Name', 'User');
        await helpers.fillField('Email', email);
        await helpers.fillField('Password', 'TestPassword123!');

        // Submit form
        await helpers.clickButton('Create Account');
        await helpers.waitForPageLoad();

        // Verify registration success (redirected to account or success message)
        await expect(page).toHaveURL(/my-account|dashboard|success/);
    });

    test('should show error for existing email', async ({ page }) => {
        await helpers.goto('/register');

        // Try to register with existing email
        await helpers.fillField('First Name', 'Test');
        await helpers.fillField('Last Name', 'User');
        await helpers.fillField('Email', 'existing@example.com');
        await helpers.fillField('Password', 'TestPassword123!');

        await helpers.clickButton('Create Account');
        await page.waitForTimeout(1000);

        // Verify error message
        await expect(page.getByText(/already exists|already registered/i)).toBeVisible();
    });

    test('should validate password requirements', async ({ page }) => {
        await helpers.goto('/register');

        // Fill form with weak password
        await helpers.fillField('First Name', 'Test');
        await helpers.fillField('Last Name', 'User');
        await helpers.fillField('Email', TestData.randomEmail());
        await helpers.fillField('Password', '123'); // Weak password

        await helpers.clickButton('Create Account');
        await page.waitForTimeout(500);

        // Verify validation error
        await expect(page.getByText(/password.*strong|password.*requirements/i)).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        await helpers.goto('/register');

        // Fill form with invalid email
        await helpers.fillField('Email', 'invalid-email');
        await helpers.fillField('Password', 'TestPassword123!');

        await helpers.clickButton('Create Account');
        await page.waitForTimeout(500);

        // Verify validation error
        const emailInput = page.getByLabel('Email');
        await expect(emailInput).toHaveAttribute('type', 'email');
    });
});

test.describe('Authentication - Login', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should login with valid credentials', async ({ page }) => {
        await helpers.goto('/login');

        // Fill login form
        await helpers.fillField('Email', 'test@example.com');
        await helpers.fillField('Password', 'TestPassword123!');

        // Submit
        await helpers.clickButton('Sign In');
        await helpers.waitForPageLoad();

        // Verify logged in (redirected to account or dashboard)
        await expect(page).toHaveURL(/my-account|dashboard|shop/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await helpers.goto('/login');

        // Fill with wrong credentials
        await helpers.fillField('Email', 'wrong@example.com');
        await helpers.fillField('Password', 'WrongPassword123!');

        await helpers.clickButton('Sign In');
        await page.waitForTimeout(1000);

        // Verify error message
        await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible();
    });

    test('should redirect to intended page after login', async ({ page }) => {
        // Try to access protected page
        await helpers.goto('/my-account');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);

        // Login
        await helpers.fillField('Email', 'test@example.com');
        await helpers.fillField('Password', 'TestPassword123!');
        await helpers.clickButton('Sign In');
        await helpers.waitForPageLoad();

        // Should redirect back to my-account
        await expect(page).toHaveURL(/my-account/);
    });

    test('should persist session after page reload', async ({ page }) => {
        // Login
        await helpers.login('test@example.com', 'TestPassword123!');

        // Reload page
        await page.reload();
        await helpers.waitForPageLoad();

        // Verify still logged in
        const isLoggedIn = await helpers.isLoggedIn();
        expect(isLoggedIn).toBe(true);
    });

    test('should show remember me option', async ({ page }) => {
        await helpers.goto('/login');

        // Check for remember me checkbox
        const rememberMe = page.getByLabel(/remember me/i);
        await expect(rememberMe).toBeVisible();
    });
});

test.describe('Authentication - Logout', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
        // Login before each test
        await helpers.login('test@example.com', 'TestPassword123!');
    });

    test('should logout successfully', async ({ page }) => {
        // Click user menu
        await page.getByRole('button', { name: /account|profile/i }).click();

        // Click logout
        await page.getByRole('menuitem', { name: /logout|sign out/i }).click();
        await helpers.waitForPageLoad();

        // Verify logged out
        await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible();
    });

    test('should clear session on logout', async ({ page }) => {
        // Logout
        await helpers.logout();

        // Try to access protected page
        await helpers.goto('/my-account');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });
});

test.describe('Authentication - Password Reset', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should navigate to password reset page', async ({ page }) => {
        await helpers.goto('/login');

        // Click forgot password link
        await page.getByRole('link', { name: /forgot password/i }).click();
        await helpers.waitForPageLoad();

        // Verify on reset page
        await expect(page).toHaveURL(/reset-password|forgot-password/);
    });

    test('should submit password reset request', async ({ page }) => {
        await helpers.goto('/reset-password');

        // Fill email
        await helpers.fillField('Email', 'test@example.com');

        // Submit
        await helpers.clickButton('Reset Password');
        await page.waitForTimeout(1000);

        // Verify success message
        await expect(page.getByText(/check your email|reset link sent/i)).toBeVisible();
    });

    test('should validate email on password reset', async ({ page }) => {
        await helpers.goto('/reset-password');

        // Submit without email
        await helpers.clickButton('Reset Password');
        await page.waitForTimeout(500);

        // Verify validation error
        const emailInput = page.getByLabel('Email');
        await expect(emailInput).toBeFocused();
    });
});

test.describe('Authentication - Business Registration', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should navigate to business registration', async ({ page }) => {
        await helpers.goto('/wholesale/register');

        // Verify on business registration page
        await expect(page.getByText(/business|wholesale|b2b/i)).toBeVisible();
    });

    test('should show business-specific fields', async ({ page }) => {
        await helpers.goto('/wholesale/register');

        // Check for business fields
        await expect(page.getByLabel(/company name|business name/i)).toBeVisible();
        await expect(page.getByLabel(/vat|org.*number/i)).toBeVisible();
    });

    test('should register business account', async ({ page }) => {
        await helpers.goto('/wholesale/register');

        // Fill business registration form
        const email = TestData.randomEmail();
        await helpers.fillField('First Name', 'Business');
        await helpers.fillField('Last Name', 'Owner');
        await helpers.fillField('Email', email);
        await helpers.fillField('Password', 'TestPassword123!');
        await helpers.fillField('Company Name', 'Test Business AB');
        await helpers.fillField(/vat|org/i, 'SE123456789001');

        // Submit
        await helpers.clickButton('Register');
        await helpers.waitForPageLoad();

        // Verify success (may show pending verification message)
        await expect(page.getByText(/success|pending|verification/i)).toBeVisible();
    });
});

test.describe('Authentication - Protected Routes', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should redirect to login for protected pages when not authenticated', async ({ page }) => {
        const protectedPages = [
            '/my-account',
            '/my-account/orders',
            '/my-account/addresses',
            '/wholesale/quote',
        ];

        for (const pagePath of protectedPages) {
            await helpers.goto(pagePath);

            // Should redirect to login
            await expect(page).toHaveURL(/login/);
        }
    });

    test('should allow access to protected pages when authenticated', async ({ page }) => {
        // Login first
        await helpers.login('test@example.com', 'TestPassword123!');

        // Access protected page
        await helpers.goto('/my-account');

        // Should stay on my-account page
        await expect(page).toHaveURL(/my-account/);
    });
});

test.describe('Authentication - Session Management', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
    });

    test('should maintain session across tabs', async ({ browser }) => {
        const context = await browser.newContext();
        const page1 = await context.newPage();
        const helpers1 = new TestHelpers(page1);

        // Login in first tab
        await helpers1.login('test@example.com', 'TestPassword123!');

        // Open second tab
        const page2 = await context.newPage();
        const helpers2 = new TestHelpers(page2);
        await helpers2.goto('/');

        // Should be logged in in second tab
        const isLoggedIn = await helpers2.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        await context.close();
    });
});
