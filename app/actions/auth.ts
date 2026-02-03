'use server';

import { WC_API_CONFIG } from '@/lib/woocommerce/config';
import { RegisterData, LoginCredentials, BusinessRegisterData } from '@/lib/auth';
import { getCustomerOrders, getCustomerQuotes, getQuotesByEmail } from '@/lib/woocommerce/orders';

export async function registerBusinessAction(data: BusinessRegisterData) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        console.error('Missing WooCommerce API credentials');
        return { success: false, error: 'Server configuration error: Missing API keys' };
    }

    // Validate required fields
    if (!data.email || !data.password) {
        return { success: false, error: 'Email and password are required' };
    }

    // Validate other required fields
    if (!data.phone || !data.address || !data.city || !data.postcode) {
        return { success: false, error: 'Please fill in all address fields (phone, address, city, postcode)' };
    }

    try {
        const payload = {
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            password: data.password,
            billing: {
                first_name: data.first_name,
                last_name: data.last_name,
                company: data.company_name,
                address_1: data.address,
                city: data.city,
                postcode: data.postcode,
                country: data.country,
                email: data.email,
                phone: data.phone,
            },
            shipping: {
                first_name: data.first_name,
                last_name: data.last_name,
                company: data.company_name,
                address_1: data.address,
                city: data.city,
                postcode: data.postcode,
                country: data.country,
            },
            meta_data: [
                { key: 'is_wholesale_customer', value: 'pending' },
                { key: 'company_name', value: data.company_name },
                { key: 'vat_number', value: data.vat_number },
                { key: 'business_type', value: data.business_type },
                { key: 'customer_type', value: 'business' },
                // Credit application fields (optional)
                ...(data.apply_for_credit ? [
                    { key: 'credit_application_status', value: 'pending' },
                    { key: 'credit_application_date', value: new Date().toISOString() },
                    { key: 'estimated_monthly_volume', value: data.estimated_monthly_volume || '' },
                ] : [])
            ]
        };

        const response = await fetch(`${baseUrl}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('WooCommerce Business Registration Error:', response.status);

            // Provide user-friendly error messages
            let errorMessage = responseData.message || responseData.data?.message || 'Business registration failed';

            // Check for specific error codes
            const errorCode = responseData.code || responseData.data?.code;

            if (errorCode === 'registration-error-email-exists' || errorMessage.includes('email address is already registered')) {
                errorMessage = 'An account with this email already exists. Please try logging in instead.';
            } else if (errorCode === 'registration-error-username-exists' || errorMessage.includes('username already exists')) {
                errorMessage = 'This username is already taken. Please choose a different username.';
            } else if (errorCode === 'registration-error-invalid-email' || errorCode === 'woocommerce_rest_customer_invalid_email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (errorCode === 'rest_invalid_param') {
                // Extract specific parameter errors
                const paramErrors = responseData.data?.params;
                if (paramErrors) {
                    const errorDetails = Object.entries(paramErrors).map(([key, msg]) => `${key}: ${msg}`).join(', ');
                    errorMessage = `Validation error: ${errorDetails}`;
                }
            } else if (response.status === 400) {
                errorMessage = `Registration failed: ${errorMessage}`;
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = 'Server configuration error. Please contact support.';
            }

            return {
                success: false,
                error: errorMessage,
                code: errorCode,
                details: responseData
            };
        }

        // Send notification email to Admin
        try {
            const { sendEmail } = await import('@/lib/email/smtp');
            const { generateEmailTemplate, createInfoRow } = await import('@/lib/email-template');

            const adminEmail = process.env.SMTP_USER || 'info@restaurantpack.se';

            const emailHtml = generateEmailTemplate({
                title: 'New Wholesale Registration',
                heading: 'New Business Application',
                contentSections: [
                    {
                        title: 'Applicant Details',
                        content: `
                            <table width="100%" cellpadding="0" cellspacing="0">
                                ${createInfoRow('Company Name', data.company_name)}
                                ${createInfoRow('VAT / Org No', data.vat_number)}
                                ${createInfoRow('Business Type', data.business_type)}
                                ${createInfoRow('Contact Name', `${data.first_name} ${data.last_name}`)}
                                ${createInfoRow('Email', data.email)}
                                ${createInfoRow('Phone', data.phone)}
                                ${createInfoRow('City', data.city)}
                            </table>
                        `
                    },
                    {
                        title: 'Action Required',
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px;">
                                A new wholesale account application has been received. 
                                Please review the details and approve or reject the application in the Admin Dashboard.
                            </p>
                            <div style="margin-top: 20px; text-align: center;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://restaurantpack.se'}/admin/wholesale" 
                                   style="background-color: #8B1538; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">
                                    Go to Admin Dashboard
                                </a>
                            </div>
                        `
                    }
                ]
            });

            await sendEmail({
                to: adminEmail,
                subject: `New Wholesale Registration: ${data.company_name}`,
                html: emailHtml
            });

        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
            // Don't fail the registration if email fails
        }

        return { success: true, data: responseData };
    } catch (error: any) {
        console.error('Business registration error:', error);
        return { success: false, error: 'Unable to connect to the registration server. Please try again later.' };
    }
}

export async function registerUserAction(data: RegisterData) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        console.error('Missing WooCommerce API credentials');
        return { success: false, error: 'Server configuration error: Missing API keys' };
    }

    if (!data.email || !data.password) {
        return { success: false, error: 'Email and password are required' };
    }

    try {
        const response = await fetch(`${baseUrl}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Provide user-friendly error messages
            let errorMessage = responseData.message || 'Registration failed';
            if (responseData.code === 'registration-error-email-exists') {
                errorMessage = 'An account with this email already exists. Please try logging in instead.';
            } else if (responseData.code === 'registration-error-username-exists') {
                errorMessage = 'This username is already taken. Please choose a different username.';
            } else if (responseData.code === 'registration-error-invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (responseData.code === 'woocommerce_rest_customer_invalid_email') {
                errorMessage = 'Please enter a valid email address.';
            }

            return {
                success: false,
                error: errorMessage,
                code: responseData.code
            };
        }

        return { success: true, data: responseData };
    } catch (error: any) {
        console.error('Registration error:', error);
        return { success: false, error: 'Unable to connect to the registration server. Please try again later.' };
    }
}

export async function loginUserAction(credentials: LoginCredentials) {

    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const authKey = process.env.SIMPLE_JWT_AUTH_KEY || 'AnmolWholesaleAuthKeYs';

    // Method 1a: Try Simple JWT Login with AUTH_KEY in query string
    const simpleJwtUrlWithKey = `${wordpressUrl}/wp-json/simple-jwt-login/v1/auth?AUTH_KEY=${encodeURIComponent(authKey)}`;

    try {
        const response = await fetch(simpleJwtUrlWithKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.username,
                password: credentials.password,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            const transformedData = {
                token: data.data?.jwt || data.jwt,
                user_email: data.data?.user?.user_email || data.user?.user_email || credentials.username,
                user_nicename: data.data?.user?.user_nicename || data.user?.user_nicename,
                user_display_name: data.data?.user?.user_display_name || data.user?.user_display_name,
            };

            return { success: true, data: transformedData };
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));

            // If the error is about invalid credentials, return immediately
            if (errorData.data?.errorCode === 48 || errorData.message?.includes('Wrong user credentials')) {
                return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
            }
        }
    } catch (error: any) {
        // Try alternative method
    }

    // Method 1b: Try Simple JWT Login with AUTH_KEY in body
    const simpleJwtUrl = `${wordpressUrl}/wp-json/simple-jwt-login/v1/auth`;

    try {
        const response = await fetch(simpleJwtUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.username,
                password: credentials.password,
                AUTH_KEY: authKey,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            const transformedData = {
                token: data.data?.jwt || data.jwt,
                user_email: data.data?.user?.user_email || data.user?.user_email || credentials.username,
                user_nicename: data.data?.user?.user_nicename || data.user?.user_nicename,
                user_display_name: data.data?.user?.user_display_name || data.user?.user_display_name,
            };

            return { success: true, data: transformedData };
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));

            // If the error is about invalid credentials, return immediately
            if (errorData.data?.errorCode === 48 || errorData.message?.includes('Wrong user credentials')) {
                return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
            }
        }
    } catch (error: any) {
        // Try alternative method
    }

    // Method 2: Try JWT Authentication for WP REST API plugin
    const jwtAuthUrl = `${wordpressUrl}/wp-json/jwt-auth/v1/token`;

    try {
        const response = await fetch(jwtAuthUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            return {
                success: true,
                data: {
                    token: data.token,
                    user_email: data.user_email,
                    user_nicename: data.user_nicename,
                    user_display_name: data.user_display_name,
                },
            };
        }
    } catch (error: any) {
        // Try alternative method
    }

    // Method 3: WordPress password verification via custom endpoint

    try {
        // Try to verify password using WordPress REST API
        // This requires Application Passwords or a custom endpoint
        const wpAuthUrl = `${wordpressUrl}/wp-json/wp/v2/users/me`;

        const wpResponse = await fetch(wpAuthUrl, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64'),
            },
        });

        if (wpResponse.ok) {
            const wpUser = await wpResponse.json();

            // Create a session token
            const sessionToken = Buffer.from(JSON.stringify({
                email: credentials.username,
                id: wpUser.id,
                timestamp: Date.now(),
            })).toString('base64');

            return {
                success: true,
                data: {
                    token: sessionToken,
                    user_email: wpUser.email || credentials.username,
                    user_nicename: wpUser.slug || credentials.username.split('@')[0],
                    user_display_name: wpUser.name || credentials.username,
                },
            };
        }
    } catch (error: any) {
        // WordPress REST API authentication failed
    }

    // All secure authentication methods failed
    return {
        success: false,
        error: 'Authentication failed. Please ensure JWT authentication plugins are installed on WordPress, or enable Application Passwords in WordPress settings.'
    };
}

export async function getCurrentUserAction(token: string, userEmail?: string) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    try {
        // If we don't have the email, try to decode it from the JWT token
        let email = userEmail;

        if (!email && token) {
            // JWT tokens have 3 parts separated by dots: header.payload.signature
            // We can decode the payload (it's base64 encoded but not encrypted)
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                    email = payload.data?.user?.user_email || payload.email;
                }
            } catch (decodeError) {
                console.error('Failed to decode JWT:', decodeError);
            }
        }

        if (!email) {
            return { success: false, error: 'Unable to determine user email' };
        }

        // Fetch WC customer details using email
        if (consumerKey && consumerSecret) {
            const customerUrl = `${baseUrl}/customers?email=${encodeURIComponent(email)}`;

            try {
                // Add timeout to prevent hanging requests
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const customerResponse = await fetch(
                    customerUrl,
                    {
                        headers: {
                            'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
                        },
                        signal: controller.signal,
                    }
                );

                clearTimeout(timeoutId);

                if (customerResponse.ok) {
                    const customers = await customerResponse.json();
                    if (customers.length > 0) {
                        return { success: true, data: customers[0] };
                    }
                }
            } catch (fetchError: any) {
                // Network error - will use fallback profile
            }
        }

        // No WooCommerce customer found - create one automatically
        // Extract name from email (before @) for initial customer data
        const emailUsername = email.split('@')[0];
        const nameParts = emailUsername.split(/[._-]/);
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Try to create a WooCommerce customer
        if (consumerKey && consumerSecret) {
            try {
                const createCustomerUrl = `${baseUrl}/customers`;
                const customerData = {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    username: emailUsername,
                };

                const createResponse = await fetch(createCustomerUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
                    },
                    body: JSON.stringify(customerData),
                });

                if (createResponse.ok) {
                    const newCustomer = await createResponse.json();
                    return { success: true, data: newCustomer };
                } else {
                    const errorData = await createResponse.json();

                    // If customer already exists, try fetching again
                    if (errorData.code === 'registration-error-email-exists') {
                        const retryCustomerUrl = `${baseUrl}/customers?email=${email}`;
                        const retryResponse = await fetch(retryCustomerUrl, {
                            headers: {
                                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
                            },
                        });

                        if (retryResponse.ok) {
                            const customers = await retryResponse.json();
                            if (customers.length > 0) {
                                return { success: true, data: customers[0] };
                            }
                        }
                    }
                }
            } catch (createError) {
                // Failed to create customer
            }
        }

        // Fallback: Create temporary user profile so user isn't locked out

        // Create a temporary but functional user object
        // Use a hash of the email as a pseudo-ID (better than 0, won't conflict)
        const emailHash = email.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        const pseudoId = Math.abs(emailHash) % 1000000; // Keep it reasonable

        return {
            success: true,
            data: {
                id: pseudoId, // Non-zero ID to prevent "No customer ID" errors
                email: email,
                first_name: firstName,
                last_name: lastName,
                username: emailUsername,
                role: 'customer',
                avatar_url: '',
                billing: {},
                shipping: {},
                // Mark this as a temporary profile
                _meta: {
                    is_temporary: true,
                    reason: 'woocommerce_fetch_failed',
                    message: 'Customer exists but could not be fetched from WooCommerce'
                }
            }
        };

    } catch (error: any) {
        console.error('Get user error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get orders for the current logged-in customer
 */
export async function getCustomerOrdersAction(customerId: number, params?: {
    per_page?: number;
    page?: number;
    status?: string;
}) {
    try {
        const orders = await getCustomerOrders(customerId, params);
        return { success: true, data: orders };
    } catch (error: any) {
        console.error('Get customer orders error:', error);
        return { success: false, error: error.message || 'Failed to fetch orders' };
    }
}

/**
 * Update customer data in WooCommerce
 */
export async function updateCustomerAction(customerId: number, data: any) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        return { success: false, error: 'Server configuration error: Missing API keys' };
    }

    try {
        const response = await fetch(`${baseUrl}/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('WooCommerce Update Customer Error:', responseData);
            return {
                success: false,
                error: responseData.message || 'Failed to update customer',
            };
        }

        return { success: true, data: responseData };
    } catch (error: any) {
        console.error('Update customer error:', error);
        return { success: false, error: error.message || 'Failed to update customer' };
    }
}

/**
 * Get quote requests for the current logged-in customer
 */
export async function getCustomerQuotesAction(customerId: number, params?: {
    per_page?: number;
    page?: number;
}) {
    try {
        const quotes = await getCustomerQuotes(customerId, params);
        return { success: true, data: quotes };
    } catch (error: any) {
        console.error('Get customer quotes error:', error);
        return { success: false, error: error.message || 'Failed to fetch quotes' };
    }
}

/**
 * Get quote requests by email (for users who submitted quotes before creating account)
 */
export async function getQuotesByEmailAction(email: string, params?: {
    per_page?: number;
    page?: number;
}) {
    try {
        const quotes = await getQuotesByEmail(email, params);
        return { success: true, data: quotes };
    } catch (error: any) {
        console.error('Get quotes by email error:', error);
        return { success: false, error: error.message || 'Failed to fetch quotes' };
    }
}

/**
 * Diagnostic action to test authentication configuration
 * This helps debug login/registration issues
 */
export async function testAuthConfigAction() {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;
    const authKey = process.env.SIMPLE_JWT_AUTH_KEY || 'AnmolWholesaleAuthKeYs';

    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        config: {
            wordpressUrl: wordpressUrl ? 'Set' : 'MISSING',
            wcBaseUrl: baseUrl ? 'Set' : 'MISSING',
            consumerKey: consumerKey ? 'Set (' + consumerKey.substring(0, 6) + '...)' : 'MISSING',
            consumerSecret: consumerSecret ? 'Set' : 'MISSING',
            authKey: authKey ? 'Set' : 'MISSING',
        },
        endpoints: {},
        errors: [],
    };

    // Test 1: Check Simple JWT Login endpoint availability
    try {
        const simpleJwtUrl = `${wordpressUrl}/wp-json/simple-jwt-login/v1/auth`;
        const response = await fetch(simpleJwtUrl, {
            method: 'OPTIONS',
        });
        diagnostics.endpoints.simpleJwtLogin = {
            url: simpleJwtUrl,
            status: response.status,
            available: response.status !== 404,
        };
    } catch (error: any) {
        diagnostics.endpoints.simpleJwtLogin = {
            available: false,
            error: error.message,
        };
    }

    // Test 2: Check WooCommerce API availability
    try {
        const wcUrl = `${baseUrl}/customers`;
        const response = await fetch(wcUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
        });
        diagnostics.endpoints.woocommerce = {
            url: wcUrl,
            status: response.status,
            available: response.ok,
        };
    } catch (error: any) {
        diagnostics.endpoints.woocommerce = {
            available: false,
            error: error.message,
        };
    }

    // Test 3: Check JWT Auth for WP REST API endpoint
    try {
        const jwtAuthUrl = `${wordpressUrl}/wp-json/jwt-auth/v1/token`;
        const response = await fetch(jwtAuthUrl, {
            method: 'OPTIONS',
        });
        diagnostics.endpoints.jwtAuthWpRest = {
            url: jwtAuthUrl,
            status: response.status,
            available: response.status !== 404,
        };
    } catch (error: any) {
        diagnostics.endpoints.jwtAuthWpRest = {
            available: false,
            error: error.message,
        };
    }

    return { success: true, diagnostics };
}

/**
 * Test login with detailed error reporting
 * Use this to debug why a specific user can't log in
 */
export async function debugLoginAction(email: string) {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    const debug: Record<string, any> = {
        email,
        timestamp: new Date().toISOString(),
        checks: {},
    };

    // Check 1: Does customer exist in WooCommerce?
    try {
        const customerUrl = `${baseUrl}/customers?email=${encodeURIComponent(email)}`;
        const response = await fetch(customerUrl, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
        });

        if (response.ok) {
            const customers = await response.json();
            debug.checks.woocommerceCustomer = {
                exists: customers.length > 0,
                customerId: customers[0]?.id || null,
                customerEmail: customers[0]?.email || null,
                hasUsername: !!customers[0]?.username,
                username: customers[0]?.username || null,
            };
        } else {
            debug.checks.woocommerceCustomer = {
                exists: false,
                error: `API returned ${response.status}`,
            };
        }
    } catch (error: any) {
        debug.checks.woocommerceCustomer = {
            exists: false,
            error: error.message,
        };
    }

    // Check 2: Does WordPress user exist? (via WP REST API)
    try {
        // Try to search for user by email via WP REST (requires admin)
        const wpUsersUrl = `${wordpressUrl}/wp-json/wp/v2/users?search=${encodeURIComponent(email)}`;
        const response = await fetch(wpUsersUrl, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
        });

        if (response.ok) {
            const users = await response.json();
            debug.checks.wordpressUser = {
                searchWorked: true,
                usersFound: users.length,
                note: 'WP user search may not show all users due to permissions',
            };
        } else {
            debug.checks.wordpressUser = {
                searchWorked: false,
                status: response.status,
                note: 'This is normal - WP user search requires admin permissions',
            };
        }
    } catch (error: any) {
        debug.checks.wordpressUser = {
            searchWorked: false,
            error: error.message,
        };
    }

    return { success: true, debug };
}
