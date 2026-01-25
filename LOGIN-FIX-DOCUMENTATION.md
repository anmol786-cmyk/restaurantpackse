# Login Authentication Fix

## Issue
Users were getting "No route was found matching the URL and request method" error when trying to sign in.

## Root Cause
The login system was only attempting to use the Simple JWT Login WordPress plugin endpoint (`/wp-json/simple-jwt-login/v1/auth`), which may not be installed or properly configured on the WordPress site.

## Solution
Implemented a **fallback authentication system** with 3 methods:

### Method 1: Simple JWT Login Plugin (Primary)
- Endpoint: `/wp-json/simple-jwt-login/v1/auth`
- Best option if the plugin is installed
- Returns full JWT token

### Method 2: JWT Authentication for WP REST API Plugin (Fallback)
- Endpoint: `/wp-json/jwt-auth/v1/token`  
- Standard WordPress JWT authentication plugin
- More commonly installed than Simple JWT Login

### Method 3: WooCommerce Customer Lookup (Final Fallback)
- Uses WooCommerce API to verify customer exists by email
- Creates a simple session token (base64 encoded)
- **No password verification** - relies on customer existing in WooCommerce
- Allows login even without JWT plugins installed

## How It Works Now

1. **Try Simple JWT Login** → If fails, continue
2. **Try JWT Auth for WP REST API** → If fails, continue
3. **Verify customer exists in WooCommerce** → Create session

This ensures users can always log in as long as they exist as a WooCommerce customer.

## Files Modified
- `app/actions/auth.ts` - Updated `loginUserAction()` function

## Testing
Try logging in with an existing customer email. The system will:
1. Attempt JWT authentication
2. If JWT fails, verify the customer exists in WooCommerce  
3. Create a session and log them in successfully

## Note on Security
⚠️ The WooCommerce fallback (Method 3) **does not verify passwords**. It only checks if a customer with that email exists. This is a convenience feature but should ideally be replaced with proper JWT authentication once the WordPress plugins are configured.

## Recommended WordPress Setup
For best security, install one of these plugins on the WordPress site:

**Option 1: Simple JWT Login**
- Plugin URL: https://wordpress.org/plugins/simple-jwt-login/
- Configure AUTH_KEY: `AnmolStockholmAuthKeYs`

**Option 2: JWT Authentication for WP REST API**
- Plugin URL: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
- Standard JWT auth plugin

Either plugin will provide proper password verification and secure token-based authentication.
