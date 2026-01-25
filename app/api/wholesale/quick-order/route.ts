import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface QuickOrderRequest {
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  items: OrderItem[];
  total: number;
}

// Generate unique quick order ID
function generateQuickOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QO-${timestamp}-${random}`;
}

// Get customer ID from auth cookie if logged in
async function getCustomerIdFromAuth(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');

    if (!authCookie?.value) return null;

    const authData = JSON.parse(authCookie.value);
    const token = authData?.state?.token;

    if (!token) return null;

    // Decode JWT to get email
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const email = payload.data?.user?.user_email || payload.email;

    if (!email) return null;

    // Look up customer by email
    const response = await fetch(
      getWooCommerceUrl(`/customers?email=${encodeURIComponent(email)}`),
      {
        headers: {
          'Authorization': getWooCommerceAuthHeader(),
        },
      }
    );

    if (response.ok) {
      const customers = await response.json();
      if (customers.length > 0) {
        return customers[0].id;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting customer ID:', error);
    return null;
  }
}

// Create WooCommerce order for quick order
async function createQuickOrderInWooCommerce(data: {
  quickOrderId: string;
  customer: QuickOrderRequest['customer'];
  items: OrderItem[];
  total: number;
  customerId?: number | null;
}): Promise<{ orderId: number; orderNumber: string } | null> {
  try {
    // Prepare line items
    const lineItems = data.items
      .filter(item => item.product_id)
      .map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

    // Parse customer name
    const nameParts = data.customer.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build customer note
    const customerNote = `
QUICK ORDER - ${data.quickOrderId}
================================
Contact: ${data.customer.name}
Email: ${data.customer.email}
Phone: ${data.customer.phone}
${data.customer.company ? `Company: ${data.customer.company}` : ''}

Order Items:
${data.items.map((item, i) => `${i + 1}. ${item.product_name} - Qty: ${item.quantity} × ${item.price} kr = ${item.total} kr`).join('\n')}

Total: ${data.total} kr
    `.trim();

    const orderData: any = {
      status: 'pending',
      billing: {
        first_name: firstName,
        last_name: lastName,
        company: data.customer.company || '',
        email: data.customer.email,
        phone: data.customer.phone,
        country: 'SE',
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        company: data.customer.company || '',
        country: 'SE',
      },
      line_items: lineItems.length > 0 ? lineItems : undefined,
      customer_note: customerNote,
      meta_data: [
        { key: '_quick_order_id', value: data.quickOrderId },
        { key: '_quick_order_request', value: 'yes' },
        { key: '_order_source', value: 'quick_order_form' },
        { key: '_customer_phone', value: data.customer.phone },
      ],
    };

    // Link to customer if logged in
    if (data.customerId) {
      orderData.customer_id = data.customerId;
    }

    const response = await fetch(getWooCommerceUrl('/orders'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getWooCommerceAuthHeader(),
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce order creation failed:', errorText);
      return null;
    }

    const order = await response.json();
    return {
      orderId: order.id,
      orderNumber: order.number || order.id.toString(),
    };
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    return null;
  }
}

/**
 * Quick Order Submission API
 * Receives bulk order form data, creates WooCommerce order, and sends emails
 */
export async function POST(request: NextRequest) {
  try {
    const body: QuickOrderRequest = await request.json();

    // Validate request
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      );
    }

    const { customer, items, total } = body;

    // Generate unique quick order ID
    const quickOrderId = generateQuickOrderId();

    // Get customer ID if logged in
    const customerId = await getCustomerIdFromAuth();

    // Log the quick order
    console.log('═══════════════════════════════════════════════');
    console.log('⚡ NEW QUICK ORDER');
    console.log(`📋 Quick Order ID: ${quickOrderId}`);
    console.log('═══════════════════════════════════════════════');
    console.log(`👤 Customer: ${customer.name}`);
    console.log(`📧 Email: ${customer.email}`);
    console.log(`📱 Phone: ${customer.phone}`);
    console.log(`📦 Items: ${items.length} products`);
    console.log(`💰 Total: ${total} kr`);
    console.log(`🔗 Customer ID: ${customerId || 'Guest'}`);
    console.log('═══════════════════════════════════════════════');

    // Create WooCommerce order
    let wcOrderId: number | undefined;
    let wcOrderNumber: string | undefined;

    const orderResult = await createQuickOrderInWooCommerce({
      quickOrderId,
      customer,
      items,
      total,
      customerId,
    });

    if (orderResult) {
      wcOrderId = orderResult.orderId;
      wcOrderNumber = orderResult.orderNumber;
      console.log(`✅ WooCommerce order created: #${wcOrderId}`);
    } else {
      console.warn('⚠️ Failed to create WooCommerce order, continuing with email only');
    }

    // Build email HTML
    const emailHTML = generateOrderEmailHTML(quickOrderId, customer, items, total, wcOrderId);

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@restaurantpack.se';

    try {
      // Send to admin
      await sendEmail({
        to: adminEmail,
        subject: `⚡ Quick Order ${quickOrderId} from ${customer.name}${wcOrderId ? ` (Order #${wcOrderId})` : ''}`,
        html: emailHTML,
      });

      // Send confirmation to customer
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmation ${quickOrderId} - Anmol Wholesale`,
        html: generateCustomerConfirmationHTML(quickOrderId, customer, items, total, wcOrderId),
      });

      console.log('✅ Quick order emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending error:', emailError);
      // Continue even if email fails - order is still created
    }

    return NextResponse.json({
      success: true,
      quickOrderId,
      orderId: wcOrderId,
      orderNumber: wcOrderNumber,
      message: wcOrderId
        ? `Your order has been received. Reference: ${quickOrderId}. We will contact you within 24 hours.`
        : 'Order received successfully. You will receive a confirmation email shortly.',
    });
  } catch (error: any) {
    console.error('Quick order API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

function generateOrderEmailHTML(
  orderId: string,
  customer: QuickOrderRequest['customer'],
  items: OrderItem[],
  total: number,
  wcOrderId?: number
): string {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} kr</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.total.toFixed(2)} kr</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Quick Order ${orderId}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A80E13 0%, #7A0A0E 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⚡ New Quick Order</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Quick Order ID: ${orderId}</p>
          ${wcOrderId ? `<p style="margin: 4px 0 0 0; opacity: 0.7; font-size: 14px;">WooCommerce Order #${wcOrderId}</p>` : ''}
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #A80E13; margin-top: 0;">Customer Information</h2>
          <table style="width: 100%; margin-bottom: 30px;">
            <tr>
              <td style="padding: 8px 0; width: 120px; font-weight: 600;">Name:</td>
              <td style="padding: 8px 0;">${customer.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${customer.email}" style="color: #A80E13;">${customer.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Phone:</td>
              <td style="padding: 8px 0;"><a href="tel:${customer.phone}" style="color: #A80E13;">${customer.phone}</a></td>
            </tr>
          </table>

          <h2 style="color: #A80E13; margin-top: 30px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #A80E13;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #A80E13;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #A80E13;">Unit Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #A80E13;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; border-top: 2px solid #A80E13;">Order Total:</td>
                <td style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #A80E13; border-top: 2px solid #A80E13;">${total.toFixed(2)} kr</td>
              </tr>
            </tfoot>
          </table>

          ${wcOrderId ? `
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${wcOrderId}&action=edit"
               style="display: inline-block; background: #A80E13; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Order #${wcOrderId} in WooCommerce
            </a>
          </div>
          ` : ''}

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 30px; border-radius: 4px;">
            <p style="margin: 0; font-weight: 600; color: #92400e;">⚠️ Action Required</p>
            <p style="margin: 8px 0 0 0; color: #92400e;">Please review this order and contact the customer to confirm pricing, availability, and delivery details.</p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>Anmol Wholesale - Restaurant Supply & Foodservice Distribution</p>
          <p>Fagerstagatan 13, 163 53 Spånga, Sweden | +46769178456</p>
        </div>
      </body>
    </html>
  `;
}

function generateCustomerConfirmationHTML(
  orderId: string,
  customer: QuickOrderRequest['customer'],
  items: OrderItem[],
  total: number,
  wcOrderId?: number
): string {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.total.toFixed(2)} kr</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation ${orderId}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A80E13 0%, #7A0A0E 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Reference: ${orderId}</p>
          ${wcOrderId ? `<p style="margin: 4px 0 0 0; opacity: 0.7; font-size: 14px;">Order #${wcOrderId}</p>` : ''}
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-top: 0;">Hi ${customer.name},</p>
          <p style="font-size: 16px;">We've received your order and our team will review it shortly. We'll contact you within 24 hours to confirm pricing, availability, and delivery details.</p>

          <h2 style="color: #A80E13; margin-top: 30px;">Your Order</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #A80E13;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #A80E13;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #A80E13;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; border-top: 2px solid #A80E13;">Estimated Total:</td>
                <td style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #A80E13; border-top: 2px solid #A80E13;">${total.toFixed(2)} kr</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin-top: 30px; border-radius: 4px;">
            <p style="margin: 0; font-weight: 600; color: #1e40af;">📋 Next Steps</p>
            <p style="margin: 8px 0 0 0; color: #1e3a8a;">
              1. Our team will verify product availability<br>
              2. We'll confirm final pricing and delivery options<br>
              3. You'll receive a formal quote within 24 hours<br>
              4. Upon approval, we'll process your order
            </p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #A80E13;">Need Help?</h3>
            <p style="margin: 0;">Contact us at <a href="tel:+46769178456" style="color: #A80E13;">+46769178456</a> or <a href="mailto:info@restaurantpack.se" style="color: #A80E13;">info@restaurantpack.se</a></p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>Anmol Wholesale - From Our Restaurant Kitchen to Yours</p>
          <p>Fagerstagatan 13, 163 53 Spånga, Sweden</p>
        </div>
      </body>
    </html>
  `;
}
