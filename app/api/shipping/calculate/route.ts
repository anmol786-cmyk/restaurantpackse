import { NextRequest, NextResponse } from 'next/server';
import { validateShippingPostcode } from '@/lib/woocommerce/orders';
import { getShippingMethodsForZone } from '@/app/actions/woocommerce-settings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, postcode, city, country = 'SE' } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('📍 [API Route] Shipping calculation request:', {
        items,
        postcode,
        city,
        country,
      });
    }

    // Validate postcode and find matching zone
    const postcodeValidation = await validateShippingPostcode(postcode, country);

    if (process.env.NODE_ENV === 'development') {
      console.log('📍 [API Route] Postcode validation result:', postcodeValidation);
    }

    if (!postcodeValidation.valid) {
      return NextResponse.json({
        success: false,
        available_methods: [],
        restricted_products: [],
        error: postcodeValidation.error || 'Invalid postcode for shipping',
      });
    }

    // Get shipping methods for the matched zone
    const zoneId = postcodeValidation.zoneId ?? 0;
    const methodsResult = await getShippingMethodsForZone(zoneId);

    if (process.env.NODE_ENV === 'development') {
      console.log('📍 [API Route] Zone methods result:', methodsResult);
    }

    if (!methodsResult.success || !methodsResult.data) {
      return NextResponse.json({
        success: false,
        available_methods: [],
        restricted_products: [],
        error: 'Failed to fetch shipping methods',
      });
    }

    // Calculate cart total from items (for free shipping threshold check)
    // Note: This is a simplified calculation - items come with quantity but not price
    // The cart total should ideally be passed from the client
    const cartTotal = body.cartTotal || 0;

    // Transform WooCommerce methods to our format
    const availableMethods = methodsResult.data
      .filter((method: any) => method.enabled)
      .map((method: any) => {
        let cost = 0;
        let isFree = false;

        // Calculate cost based on method type
        if (method.method_id === 'free_shipping') {
          // Check if cart meets free shipping minimum
          const minAmount = parseFloat(method.settings?.min_amount?.value || '0');
          if (minAmount === 0 || cartTotal >= minAmount) {
            isFree = true;
            cost = 0;
          } else {
            // Free shipping not met, skip this method
            return null;
          }
        } else if (method.method_id === 'flat_rate') {
          cost = parseFloat(method.settings?.cost?.value || '0');
        } else if (method.method_id === 'local_pickup') {
          cost = 0;
        }

        // Calculate tax (25% Swedish VAT)
        const taxRate = 0.25;
        const tax = cost * taxRate;
        const totalCost = cost + tax;

        return {
          id: `${method.method_id}:${method.instance_id}`,
          method_id: method.method_id,
          instance_id: method.instance_id,
          label: method.title || method.method_title,
          cost: cost,
          tax: tax,
          total_cost: totalCost,
          meta_data: {
            zone_id: zoneId,
            zone_name: postcodeValidation.zoneName,
          },
        };
      })
      .filter(Boolean); // Remove null entries

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [API Route] Available methods:', availableMethods);
    }

    return NextResponse.json({
      success: true,
      available_methods: availableMethods,
      restricted_products: [],
      cart_subtotal: cartTotal,
      zone_id: zoneId,
      zone_name: postcodeValidation.zoneName,
      minimum_order: 0,
      minimum_order_met: true,
    });
  } catch (error) {
    console.error('❌ [API Route] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        available_methods: [],
        restricted_products: [],
      },
      { status: 500 }
    );
  }
}
