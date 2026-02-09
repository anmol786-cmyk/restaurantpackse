# Automated Testing for Restaurant Pack

## Overview

This directory contains end-to-end (E2E) tests for the Restaurant Pack B2B e-commerce platform using Playwright.

## Test Coverage

### ✅ Critical Path Tests (Revenue Protection)

1. **Checkout Flow** (`e2e/checkout.spec.ts`)
   - Guest checkout with card payment
   - Registered user checkout
   - Shipping address validation
   - Shipping method selection
   - Payment processing
   - B2B payment terms (Net 28, Net 60)
   - Order confirmation
   - Mobile checkout experience

2. **Cart Operations** (`e2e/cart.spec.ts`)
   - Add/remove products
   - Update quantities
   - Cart total calculation
   - Cart persistence
   - Multiple products
   - Empty cart handling

3. **Authentication** (`e2e/authentication.spec.ts`)
   - User registration
   - Login/logout
   - Password reset
   - Business account registration
   - Session management
   - Protected routes

## Quick Start

### Install Dependencies

```bash
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# View test report
npm run test:report
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/checkout.spec.ts
npx playwright test tests/e2e/cart.spec.ts
npx playwright test tests/e2e/authentication.spec.ts
```

### Run Specific Test

```bash
npx playwright test -g "should complete guest checkout"
```

## Test Structure

```
tests/
├── helpers.ts              # Reusable test utilities
├── e2e/
│   ├── checkout.spec.ts    # Checkout flow tests (CRITICAL)
│   ├── cart.spec.ts        # Cart functionality tests
│   └── authentication.spec.ts  # Auth tests
└── README.md
```

## Test Helpers

The `helpers.ts` file provides reusable utilities:

- `TestHelpers` class with common operations
- `TestData` for test data generation
- `Assertions` for common checks

### Example Usage

```typescript
import { TestHelpers, TestData } from '../helpers';

test('example test', async ({ page }) => {
  const helpers = new TestHelpers(page);
  
  // Navigate and wait for page load
  await helpers.goto('/shop');
  
  // Fill form fields
  await helpers.fillField('Email', TestData.randomEmail());
  
  // Click buttons
  await helpers.clickButton('Submit');
  
  // Verify text visible
  await helpers.expectTextVisible('Success');
});
```

## Configuration

Test configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (or from `NEXT_PUBLIC_SITE_URL`)
- **Timeout**: 60 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12

## Test Data

### Test Users

Update `tests/helpers.ts` with your test user credentials:

```typescript
users: {
  customer: {
    email: 'test-customer@example.com',
    password: 'TestPassword123!',
  },
  business: {
    email: 'test-business@example.com',
    password: 'TestPassword123!',
  },
}
```

### Test Products

Update product slugs in `tests/helpers.ts`:

```typescript
products: {
  simple: 'your-product-slug',
  variable: 'your-variable-product-slug',
}
```

## Best Practices

### 1. Wait for Page Load

Always wait for network idle after navigation:

```typescript
await helpers.goto('/page');
// or
await page.goto('/page');
await helpers.waitForPageLoad();
```

### 2. Use Descriptive Selectors

Prefer role-based and text-based selectors:

```typescript
// Good
await page.getByRole('button', { name: 'Add to Cart' }).click();
await page.getByLabel('Email').fill('test@example.com');

// Avoid
await page.locator('.btn-123').click();
```

### 3. Add Appropriate Waits

```typescript
// Wait for element
await helpers.waitForElement('[data-testid="cart-total"]');

// Wait for timeout (use sparingly)
await page.waitForTimeout(1000);
```

### 4. Take Screenshots on Failure

Screenshots are automatically captured on failure. Manual screenshots:

```typescript
await helpers.screenshot('checkout-step-2');
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging

### Debug Mode

Run tests in debug mode to step through:

```bash
npm run test:debug
```

### UI Mode

Interactive mode with time-travel debugging:

```bash
npm run test:ui
```

### Console Logs

View browser console logs:

```typescript
page.on('console', msg => console.log(msg.text()));
```

### Network Requests

Monitor network requests:

```typescript
page.on('request', request => console.log(request.url()));
page.on('response', response => console.log(response.status()));
```

## Common Issues

### Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Add more specific waits
- Check if server is running

### Element Not Found

- Wait for page load: `await helpers.waitForPageLoad()`
- Check selector accuracy
- Verify element is visible: `await expect(element).toBeVisible()`

### Flaky Tests

- Add proper waits instead of `waitForTimeout`
- Use `networkidle` state
- Check for race conditions

## Test Maintenance

### When to Update Tests

1. **UI Changes**: Update selectors when UI elements change
2. **New Features**: Add tests for new functionality
3. **Bug Fixes**: Add regression tests
4. **API Changes**: Update test data and expectations

### Regular Checks

- Run tests before deploying
- Review failed tests in CI
- Update test data periodically
- Keep Playwright updated

## Performance

### Parallel Execution

Tests run in parallel by default. Disable for debugging:

```typescript
// playwright.config.ts
fullyParallel: false,
```

### Test Isolation

Each test runs in isolation with:
- Fresh browser context
- Clean storage state
- Independent cookies/sessions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)

## Support

For issues or questions:
1. Check test output and screenshots
2. Review Playwright documentation
3. Run in debug mode
4. Check browser console logs

---

**Last Updated**: January 30, 2026
**Test Framework**: Playwright v1.48
**Coverage**: Checkout, Cart, Authentication
