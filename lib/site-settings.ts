import { WC_API_CONFIG } from './woocommerce/config';

export interface SiteSettings {
    site: {
        name: string;
        description: string;
        url: string;
        logo?: {
            url: string;
            width: number;
            height: number;
            id: number;
        };
        icon?: {
            url: string;
            id: number;
        };
    };
    woocommerce?: {
        store_address?: {
            address_1: string;
            city: string;
            postcode: string;
            country: string;
        };
        currency_symbol: string;
    };
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_WORDPRESS_URL is not defined');
            return null;
        }

        const response = await fetch(`${baseUrl}/wp-json/fourlines-mcp/v1/settings`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error('Failed to fetch site settings');
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
}
