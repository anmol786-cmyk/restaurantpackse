'use server';

import { WC_API_CONFIG } from '@/lib/woocommerce/config';

// Helper to get auth header
function getAuthHeader() {
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;
    return 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
}

// Define the shape of a wholesale request
export interface WholesaleRequest {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    date_created: string;
    company_name: string;
    vat_number: string;
    business_type: string;
    status: 'pending' | 'approved' | 'rejected';
    credit_applied: boolean;
    estimated_volume?: string;
}

/**
 * Fetch all pending wholesale customer requests
 */
export async function getPendingWholesaleRequests(): Promise<{ success: boolean; data?: WholesaleRequest[]; error?: string }> {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        return { success: false, error: 'Server configuration error' };
    }

    try {
        // Fetch customers with the specific meta key
        // WooCommerce API doesn't always support filtering by meta_key/meta_value efficiently in one go for all endpoints,
        // but let's try to fetch recent users and filter, or use a custom endpoint if available.
        // For standard WC Rest API, we often have to fetch customers and filter array if the list isn't huge,
        // OR rely on a custom WP endpoint.
        //
        // However, standard WC API allows 'role=customer'. 
        // We will fetch the latest 50 customers and filter for performance for now.
        // A robust solution would need a custom WC endpoint or specific query params if supported.

        const response = await fetch(`${baseUrl}/customers?role=all&per_page=50&orderby=registered_date&order=desc`, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            next: { revalidate: 0 } // No cache
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.status}`);
        }

        const customers = await response.json();

        // Filter for pending wholesale requests
        const pendingRequests: WholesaleRequest[] = customers
            .filter((c: any) => {
                const meta = c.meta_data || [];
                // Look for is_wholesale_customer = 'pending'
                return meta.some((m: any) => m.key === 'is_wholesale_customer' && m.value === 'pending');
            })
            .map((c: any) => {
                const meta = c.meta_data || [];
                const getMeta = (key: string) => meta.find((m: any) => m.key === key)?.value || '';

                return {
                    id: c.id,
                    email: c.email,
                    first_name: c.first_name,
                    last_name: c.last_name,
                    date_created: c.date_created,
                    company_name: getMeta('company_name'),
                    vat_number: getMeta('vat_number'),
                    business_type: getMeta('business_type'),
                    status: 'pending',
                    credit_applied: getMeta('credit_application_status') === 'pending',
                    estimated_volume: getMeta('estimated_monthly_volume')
                };
            });

        return { success: true, data: pendingRequests };

    } catch (error: any) {
        console.error('Error fetching wholesale requests:', error);
        return { success: false, error: 'Failed to fetch requests' };
    }
}

/**
 * Approve a wholesale request
 */
export async function approveWholesaleRequest(userId: number) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    try {
        // 1. First fetch the customer to get email and name
        const userResponse = await fetch(`${baseUrl}/customers/${userId}`, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch customer details');
        }

        const user = await userResponse.json();
        const userEmail = user.email;
        const userName = user.first_name || 'Customer';

        // 2. Update user meta variables
        const payload = {
            meta_data: [
                { key: 'is_wholesale_customer', value: 'approved' },
                { key: 'wholesale_approval_date', value: new Date().toISOString() },
                // Reset rejection reason if any
                { key: 'wholesale_rejection_reason', value: '' }
            ]
        };

        const updateResponse = await fetch(`${baseUrl}/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            body: JSON.stringify(payload)
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update customer in WooCommerce');
        }

        // 3. Send approval email
        try {
            const { sendEmail } = await import('@/lib/email/smtp');
            const { generateEmailTemplate, createInfoBox } = await import('@/lib/email-template');

            const emailHtml = generateEmailTemplate({
                title: 'Wholesale Account Approved',
                heading: 'Welcome to Anmol Wholesale!',
                contentSections: [
                    {
                        title: 'Application Approved',
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                                Dear ${userName},
                            </p>
                            <p style="margin: 10px 0; color: #333; font-size: 14px; line-height: 1.6;">
                                We are pleased to inform you that your business account application has been approved. 
                                You now have access to our exclusive wholesale pricing and business terms.
                            </p>
                            ${createInfoBox('You can now log in to your account to see wholesale prices on all products.')}
                        `
                    },
                    {
                        title: 'Next Steps',
                        content: `
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://restaurantpack.se'}/login" 
                                   style="background-color: #8B1538; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">
                                    Login to Your Account
                                </a>
                            </div>
                            <p style="margin: 0; color: #666; font-size: 13px; text-align: center;">
                                If you have any questions about your account or our products, please don't hesitate to contact us.
                            </p>
                        `
                    }
                ]
            });

            await sendEmail({
                to: userEmail,
                subject: 'Your Wholesale Account is Approved - Anmol Wholesale',
                html: emailHtml
            });

        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
            // Non-blocking
        }

        return { success: true };

    } catch (error: any) {
        console.error('Error approving wholesale request:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Reject a wholesale request
 */
export async function rejectWholesaleRequest(userId: number, reason?: string) {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    try {
        // 1. First fetch the customer to get email
        const userResponse = await fetch(`${baseUrl}/customers/${userId}`, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch customer details');
        }

        const user = await userResponse.json();
        const userEmail = user.email;
        const userName = user.first_name || 'Customer';

        // 2. Update user meta
        const payload = {
            meta_data: [
                { key: 'is_wholesale_customer', value: 'rejected' },
                { key: 'wholesale_rejection_reason', value: reason || 'Application criteria not met' },
                { key: 'wholesale_rejection_date', value: new Date().toISOString() }
            ]
        };

        const updateResponse = await fetch(`${baseUrl}/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
            },
            body: JSON.stringify(payload)
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update customer in WooCommerce');
        }

        // 3. Send rejection email (Optional - sometimes better not to automate bad news without personal touch)
        // But for a system like this, automation is usually preferred.
        try {
            const { sendEmail } = await import('@/lib/email/smtp');
            const { generateEmailTemplate } = await import('@/lib/email-template');

            const emailHtml = generateEmailTemplate({
                title: 'Wholesale Application Update',
                heading: 'Application Status Update',
                contentSections: [
                    {
                        title: 'Application Status',
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                                Dear ${userName},
                            </p>
                            <p style="margin: 10px 0; color: #333; font-size: 14px; line-height: 1.6;">
                                Thank you for your interest in a wholesale account with Anmol Wholesale. 
                                After reviewing your application, we are unable to approve your request at this time.
                            </p>
                            ${reason ? `
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; border-left: 4px solid #666;">
                                <p style="margin: 0; font-size: 13px; color: #555;"><strong>Reason:</strong> ${reason}</p>
                            </div>
                            ` : ''}
                        `
                    },
                    {
                        title: 'Contact Us',
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                                If you believe this decision was made in error or if you have additional information to provide, 
                                please reply to this email or contact our support team.
                            </p>
                        `
                    }
                ]
            });

            await sendEmail({
                to: userEmail,
                subject: 'Update regarding your Wholesale Application - Anmol Wholesale',
                html: emailHtml
            });

        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }

        return { success: true };

    } catch (error: any) {
        console.error('Error rejecting wholesale request:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// CUSTOMER DIRECTORY
// ============================================

export interface WholesaleCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    date_created: string;
    company_name: string;
    vat_number: string;
    business_type: string;
    phone: string;
    city: string;
    country: string;
    status: 'pending' | 'approved' | 'rejected' | 'none';
    credit_limit: number;
    credit_status: string;
    total_spent: string;
    orders_count: number;
}

/**
 * Fetch all wholesale customers for directory export
 */
export async function getAllWholesaleCustomers(filter?: 'all' | 'approved' | 'pending'): Promise<{ success: boolean; data?: WholesaleCustomer[]; error?: string }> {
    const baseUrl = WC_API_CONFIG.baseUrl;

    try {
        const response = await fetch(`${baseUrl}/customers?role=all&per_page=100&orderby=registered_date&order=desc`, {
            headers: { 'Authorization': getAuthHeader() },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.status}`);
        }

        const customers = await response.json();

        const wholesaleCustomers: WholesaleCustomer[] = customers
            .filter((c: any) => {
                const meta = c.meta_data || [];
                const wholesaleStatus = meta.find((m: any) => m.key === 'is_wholesale_customer')?.value;

                // Filter based on parameter
                if (filter === 'approved') return wholesaleStatus === 'approved' || wholesaleStatus === 'yes';
                if (filter === 'pending') return wholesaleStatus === 'pending';
                // 'all' - return any customer with wholesale meta
                return wholesaleStatus && wholesaleStatus !== 'none';
            })
            .map((c: any) => {
                const meta = c.meta_data || [];
                const getMeta = (key: string) => meta.find((m: any) => m.key === key)?.value || '';
                const wholesaleStatus = getMeta('is_wholesale_customer');

                return {
                    id: c.id,
                    email: c.email,
                    first_name: c.first_name,
                    last_name: c.last_name,
                    date_created: c.date_created,
                    company_name: getMeta('company_name') || c.billing?.company || '',
                    vat_number: getMeta('vat_number'),
                    business_type: getMeta('business_type'),
                    phone: c.billing?.phone || '',
                    city: c.billing?.city || '',
                    country: c.billing?.country || '',
                    status: wholesaleStatus === 'yes' ? 'approved' : (wholesaleStatus as any) || 'none',
                    credit_limit: parseInt(getMeta('credit_limit')) || 0,
                    credit_status: getMeta('credit_application_status') || '',
                    total_spent: c.total_spent || '0',
                    orders_count: c.orders_count || 0
                };
            });

        return { success: true, data: wholesaleCustomers };

    } catch (error: any) {
        console.error('Error fetching wholesale customers:', error);
        return { success: false, error: 'Failed to fetch customers' };
    }
}

// ============================================
// ORDER REPORTS
// ============================================

export interface AdminOrder {
    id: number;
    number: string;
    date_created: string;
    status: string;
    customer_id: number;
    customer_email: string;
    customer_name: string;
    company_name: string;
    total: string;
    currency: string;
    payment_method: string;
    payment_terms: string;
    items_count: number;
    line_items: { name: string; quantity: number; total: string }[];
}

/**
 * Fetch orders for admin reporting
 */
export async function getAdminOrders(params?: {
    status?: string;
    per_page?: number;
    page?: number;
    after?: string;
    before?: string;
}): Promise<{ success: boolean; data?: AdminOrder[]; total?: number; error?: string }> {
    const baseUrl = WC_API_CONFIG.baseUrl;

    try {
        const queryParams = new URLSearchParams();
        queryParams.set('per_page', String(params?.per_page || 50));
        queryParams.set('page', String(params?.page || 1));
        queryParams.set('orderby', 'date');
        queryParams.set('order', 'desc');

        if (params?.status) queryParams.set('status', params.status);
        if (params?.after) queryParams.set('after', params.after);
        if (params?.before) queryParams.set('before', params.before);

        const response = await fetch(`${baseUrl}/orders?${queryParams.toString()}`, {
            headers: { 'Authorization': getAuthHeader() },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.status}`);
        }

        const totalHeader = response.headers.get('X-WP-Total');
        const orders = await response.json();

        const adminOrders: AdminOrder[] = orders.map((o: any) => {
            const meta = o.meta_data || [];
            const getMeta = (key: string) => meta.find((m: any) => m.key === key)?.value || '';

            return {
                id: o.id,
                number: o.number || o.id.toString(),
                date_created: o.date_created,
                status: o.status,
                customer_id: o.customer_id,
                customer_email: o.billing?.email || '',
                customer_name: `${o.billing?.first_name || ''} ${o.billing?.last_name || ''}`.trim(),
                company_name: o.billing?.company || getMeta('company_name') || '',
                total: o.total,
                currency: o.currency || 'SEK',
                payment_method: o.payment_method_title || o.payment_method || '',
                payment_terms: getMeta('payment_terms') || 'immediate',
                items_count: o.line_items?.length || 0,
                line_items: (o.line_items || []).map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    total: item.total
                }))
            };
        });

        return {
            success: true,
            data: adminOrders,
            total: totalHeader ? parseInt(totalHeader) : adminOrders.length
        };

    } catch (error: any) {
        console.error('Error fetching admin orders:', error);
        return { success: false, error: 'Failed to fetch orders' };
    }
}

/**
 * Get order statistics for dashboard
 */
export async function getOrderStats(): Promise<{
    success: boolean;
    data?: {
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        processingOrders: number;
        completedOrders: number;
    };
    error?: string
}> {
    const baseUrl = WC_API_CONFIG.baseUrl;

    try {
        // Fetch recent orders to calculate stats
        const response = await fetch(`${baseUrl}/orders?per_page=100&orderby=date&order=desc`, {
            headers: { 'Authorization': getAuthHeader() },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.status}`);
        }

        const orders = await response.json();

        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum: number, o: any) => sum + parseFloat(o.total || '0'), 0),
            pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
            processingOrders: orders.filter((o: any) => o.status === 'processing').length,
            completedOrders: orders.filter((o: any) => o.status === 'completed').length,
        };

        return { success: true, data: stats };

    } catch (error: any) {
        console.error('Error fetching order stats:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}
