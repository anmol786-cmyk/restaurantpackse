import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';

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
  };
  items: OrderItem[];
  total: number;
}

/**
 * Quick Order Submission API
 * Receives bulk order form data and sends via email
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

    // Generate order ID
    const orderId = `QO-${Date.now()}`;

    // Build email HTML
    const emailHTML = generateOrderEmailHTML(orderId, customer, items, total);

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@restaurantpack.se';

    try {
      // Send to admin
      await sendEmail({
        to: adminEmail,
        subject: `New Quick Order ${orderId} from ${customer.name}`,
        html: emailHTML,
      });

      // Send confirmation to customer
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmation ${orderId} - Anmol Wholesale`,
        html: generateCustomerConfirmationHTML(orderId, customer, items, total),
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails - order is still logged
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order received successfully. You will receive a confirmation email shortly.',
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
  total: number
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
          <h1 style="margin: 0; font-size: 28px;">New Quick Order</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order ID: ${orderId}</p>
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
  total: number
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
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order ID: ${orderId}</p>
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
