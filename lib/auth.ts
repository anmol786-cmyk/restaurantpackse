import { WC_API_CONFIG } from './woocommerce/config';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
}

export interface BusinessRegisterData extends RegisterData {
    company_name: string;
    vat_number: string;
    business_type: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    // Credit application (optional)
    apply_for_credit?: boolean;
    estimated_monthly_volume?: string;
}

export interface AuthResponse {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
}

/**
 * Login user using JWT Authentication
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const baseUrl = WC_API_CONFIG.baseUrl;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Register a new customer
 */
export async function registerUser(data: RegisterData) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    try {
        const response = await fetch(`${baseUrl}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Use basic auth for registration as it's a protected endpoint usually
                'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`),
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
        }

        return responseData;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

/**
 * Wholesale Customer Status Types
 */
export type WholesaleStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface BusinessInfo {
  isBusinessCustomer: boolean;
  wholesaleStatus: WholesaleStatus;
  companyName: string | null;
  vatNumber: string | null;
  businessType: string | null;
}

/**
 * Get wholesale customer status from user metadata
 */
export function getWholesaleStatus(user: any): WholesaleStatus {
  if (!user?.meta_data) return 'none';

  const wholesaleMeta = user.meta_data.find((m: any) => m.key === 'is_wholesale_customer');
  const customerTypeMeta = user.meta_data.find((m: any) => m.key === 'customer_type');

  // Check if they're a business customer type
  const isBusinessType = customerTypeMeta?.value === 'business';

  if (!wholesaleMeta && !isBusinessType) return 'none';

  const status = wholesaleMeta?.value;

  if (status === 'pending') return 'pending';
  if (status === 'yes' || status === '1' || status === 'approved') return 'approved';
  if (status === 'no' || status === '0' || status === 'rejected') return 'rejected';

  // If they're a business type but no explicit status, treat as pending
  if (isBusinessType) return 'pending';

  return 'none';
}

/**
 * Check if user is an approved wholesale customer
 */
export function isApprovedWholesaleCustomer(user: any): boolean {
  return getWholesaleStatus(user) === 'approved';
}

/**
 * Check if user is a business customer (regardless of approval status)
 */
export function isBusinessCustomer(user: any): boolean {
  const status = getWholesaleStatus(user);
  return status !== 'none';
}

/**
 * Get business info from user metadata
 */
export function getBusinessInfo(user: any): BusinessInfo {
  const status = getWholesaleStatus(user);

  if (status === 'none') {
    return {
      isBusinessCustomer: false,
      wholesaleStatus: 'none',
      companyName: null,
      vatNumber: null,
      businessType: null,
    };
  }

  const getMeta = (key: string) => {
    const meta = user?.meta_data?.find((m: any) => m.key === key);
    return meta?.value || null;
  };

  return {
    isBusinessCustomer: true,
    wholesaleStatus: status,
    companyName: getMeta('company_name'),
    vatNumber: getMeta('vat_number'),
    businessType: getMeta('business_type'),
  };
}

/**
 * Credit Status Types
 */
export type CreditStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * Get credit application status from user metadata
 */
export function getCreditStatus(user: any): CreditStatus {
  if (!user?.meta_data) return 'none';

  const creditMeta = user.meta_data.find((m: any) => m.key === 'credit_application_status');

  if (!creditMeta) return 'none';

  const status = creditMeta.value;

  if (status === 'pending') return 'pending';
  if (status === 'approved' || status === 'yes' || status === '1') return 'approved';
  if (status === 'rejected' || status === 'no' || status === '0') return 'rejected';

  return 'none';
}

/**
 * Get credit limit from user metadata
 * Returns 0 if user doesn't have approved credit
 */
export function getCreditLimit(user: any): number {
  if (!user?.meta_data) return 0;

  const creditStatus = getCreditStatus(user);
  if (creditStatus !== 'approved') return 0;

  const limitMeta = user.meta_data.find((m: any) => m.key === 'credit_limit');

  if (limitMeta && limitMeta.value) {
    const limit = Number(limitMeta.value);
    return isNaN(limit) ? 50000 : limit; // Default to 50000 SEK if not set
  }

  return 50000; // Default credit limit
}

/**
 * Check if user has available credit for a given order total
 */
export function hasAvailableCredit(user: any, orderTotal: number): boolean {
  const creditStatus = getCreditStatus(user);
  if (creditStatus !== 'approved') return false;

  const creditLimit = getCreditLimit(user);
  const creditUsed = Number(user?.meta_data?.find((m: any) => m.key === 'credit_used')?.value || 0);
  const availableCredit = creditLimit - creditUsed;

  return availableCredit >= orderTotal;
}

/**
 * Get credit terms days from user metadata (or default)
 */
export function getCreditTermsDays(user: any): number {
  if (!user?.meta_data) return 28;

  const termsMeta = user.meta_data.find((m: any) => m.key === 'credit_terms_days');

  if (termsMeta && termsMeta.value) {
    const days = Number(termsMeta.value);
    return isNaN(days) ? 28 : days;
  }

  return 28; // Default 28 days
}

/**
 * Format business type for display
 */
export function formatBusinessType(type: string | null): string {
  if (!type) return 'Business';

  const types: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Café',
    catering: 'Catering Service',
    hotel: 'Hotel / Hospitality',
    pizzeria: 'Pizzeria',
    grocery: 'Grocery Store',
    other: 'Other Business',
  };

  return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Get current user details
 */
export async function getCurrentUser(token: string) {
    const baseUrl = WC_API_CONFIG.baseUrl;

    try {
        // First try to get WP user to get ID/Email
        const wpUserResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!wpUserResponse.ok) {
            throw new Error('Failed to fetch user');
        }

        const wpUser = await wpUserResponse.json();

        // Then try to get WC customer details using email
        // Note: This requires the consumer keys as customers endpoint is protected
        const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
        const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

        const customerResponse = await fetch(
            `${baseUrl}/customers?email=${wpUser.email}`,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`),
                },
            }
        );

        if (customerResponse.ok) {
            const customers = await customerResponse.json();
            if (customers.length > 0) {
                return customers[0];
            }
        }

        // Fallback if WC customer fetch fails or returns empty
        return {
            id: wpUser.id,
            email: wpUser.email,
            first_name: wpUser.name.split(' ')[0],
            last_name: wpUser.name.split(' ').slice(1).join(' '),
            username: wpUser.slug,
            role: 'customer',
            avatar_url: wpUser.avatar_urls?.['96'],
            billing: {},
            shipping: {},
        };

    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}
