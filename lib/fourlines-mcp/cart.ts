import { fetchFourlinesMCP } from './api';

export interface CartItem {
    product_id: number;
    quantity: number;
    variation_id?: number;
    // Add other item metadata if needed (e.g. addons, notes)
}

export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    created_at: string;
    updated_at: string;
}

export interface CartUpdateResponse {
    updated: boolean;
}

export interface CartDeleteResponse {
    deleted: boolean;
}

/**
 * Create a new cart for the authenticated user.
 */
export async function createCart(): Promise<Cart> {
    // The backend returns { id: number }, but we might want to fetch the full cart immediately
    // or just return the partial object. For now, let's assume the backend returns { id }
    // and we might need to fetch the full cart if we want the full object, 
    // but the backend implementation I wrote returns just { id }.
    // Let's adjust the return type or fetch the cart after creation if needed.
    // Actually, the backend returns { id: cart_id }.

    const response = await fetchFourlinesMCP<{ id: number }>('/carts', {
        method: 'POST',
    });

    // Return a partial cart or fetch the full one?
    // Let's just return the id for now, or we could fetch the full cart.
    // To keep it simple and efficient, let's just return the ID wrapped in a partial Cart
    // or change the return type. Let's stick to the backend response for now.
    // But to be more useful, let's fetch the full cart.
    return getCart(response.id);
}

/**
 * Get a cart by ID.
 */
export async function getCart(cartId: number): Promise<Cart> {
    return fetchFourlinesMCP<Cart>(`/carts/${cartId}`);
}

/**
 * Update the items in a cart.
 * Replaces the entire items array.
 */
export async function updateCartItems(cartId: number, items: CartItem[]): Promise<CartUpdateResponse> {
    return fetchFourlinesMCP<CartUpdateResponse>(`/carts/${cartId}/items`, {
        method: 'PUT',
        body: JSON.stringify({ items }),
    });
}

/**
 * Delete a cart.
 */
export async function deleteCart(cartId: number): Promise<CartDeleteResponse> {
    return fetchFourlinesMCP<CartDeleteResponse>(`/carts/${cartId}`, {
        method: 'DELETE',
    });
}
