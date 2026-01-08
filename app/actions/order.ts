'use server';

import { createOrder, type CreateOrderData } from '@/lib/woocommerce/orders';

export async function createOrderAction(orderData: CreateOrderData) {
    try {
        const order = await createOrder(orderData);
        return { success: true, data: order };
    } catch (error: any) {
        console.error('Order creation error:', error);
        return { success: false, error: error.message || 'Failed to create order' };
    }
}
