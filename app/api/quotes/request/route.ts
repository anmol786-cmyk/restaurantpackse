import { NextRequest, NextResponse } from 'next/server';
import { brandConfig } from '@/config/brand.config';
import nodemailer from 'nodemailer';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { generateQuoteRequestPDF, type QuoteRequestData } from '@/lib/invoice-generator';
import { addDays } from 'date-fns';

// Generate unique quote ID
function generateQuoteId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QR-${timestamp}-${random}`;
}

// Create WooCommerce order with quote status
async function createQuoteOrder(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber?: string;
  businessType: string;
  items: Array<{ productId?: number; name: string; quantity: number; unitPrice?: number; sku?: string }>;
  message?: string;
  preferredDeliveryDate?: string;
  deliveryAddress?: string;
  totalEstimate?: number;
  quoteId: string;
}): Promise<{ orderId: number; orderNumber: string } | null> {
  try {
    // Prepare line items - only include items with valid productId
    const lineItems = data.items
      .filter(item => item.productId)
      .map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

    // If no valid product IDs, create order with fee lines for custom items
    const feeLines = data.items
      .filter(item => !item.productId)
      .map(item => ({
        name: `Quote Item: ${item.name}`,
        total: item.unitPrice ? (item.unitPrice * item.quantity).toString() : '0',
        tax_status: 'none',
      }));

    // Build customer note with full quote details
    const customerNote = `
QUOTE REQUEST - ${data.quoteId}
================================
Business: ${data.companyName}
VAT/Org: ${data.vatNumber || 'N/A'}
Type: ${data.businessType}
Contact: ${data.firstName} ${data.lastName}
Phone: ${data.phone}

Requested Items:
${data.items.map((item, i) => `${i + 1}. ${item.name} - Qty: ${item.quantity}${item.sku ? ` (SKU: ${item.sku})` : ''}`).join('\n')}

${data.preferredDeliveryDate ? `Preferred Delivery: ${data.preferredDeliveryDate}` : ''}
${data.deliveryAddress ? `Delivery Address: ${data.deliveryAddress}` : ''}
${data.message ? `\nNotes: ${data.message}` : ''}

Estimated Total: ${data.totalEstimate ? `${data.totalEstimate} SEK` : 'Price on request'}
    `.trim();

    const orderData = {
      status: 'pending', // Quote pending status
      billing: {
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.companyName,
        email: data.email,
        phone: data.phone,
        address_1: data.deliveryAddress || '',
        city: '',
        postcode: '',
        country: 'SE',
      },
      shipping: {
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.companyName,
        address_1: data.deliveryAddress || '',
        city: '',
        postcode: '',
        country: 'SE',
      },
      line_items: lineItems.length > 0 ? lineItems : undefined,
      fee_lines: feeLines.length > 0 ? feeLines : undefined,
      customer_note: customerNote,
      meta_data: [
        { key: '_quote_id', value: data.quoteId },
        { key: '_quote_request', value: 'yes' },
        { key: '_business_type', value: data.businessType },
        { key: '_vat_number', value: data.vatNumber || '' },
        { key: '_preferred_delivery', value: data.preferredDeliveryDate || '' },
        { key: '_quote_message', value: data.message || '' },
        { key: '_quote_source', value: 'website' },
      ],
    };

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      vatNumber,
      businessType,
      items,
      totalEstimate,
      message,
      preferredDeliveryDate,
      deliveryAddress,
      source = 'wholesale-quote-form',
      createOrder = true, // Default to creating order
    } = body;

    // Validate required fields
    if (!firstName || !email || !companyName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique quote ID
    const quoteId = generateQuoteId();

    // Log quote request
    console.log('═══════════════════════════════════════════════');
    console.log('📄 NEW WHOLESALE QUOTE REQUEST');
    console.log(`📋 Quote ID: ${quoteId}`);
    console.log('═══════════════════════════════════════════════');
    console.log(`👤 Name: ${firstName} ${lastName}`);
    console.log(`🏢 Company: ${companyName} (${vatNumber || 'No VAT'})`);
    console.log(`📧 Email: ${email}`);
    console.log(`📱 Phone: ${phone || 'Not provided'}`);
    console.log(`💼 Type: ${businessType || 'Not specified'}`);
    console.log(`📦 Items: ${items.length} products`);
    console.log(`💰 Total Est: ${totalEstimate || 'Ask for pricing'}`);
    console.log(`🔗 Source: ${source}`);
    console.log('═══════════════════════════════════════════════');

    // Create WooCommerce order if requested
    let orderId: number | undefined;
    let orderNumber: string | undefined;

    if (createOrder) {
      const orderResult = await createQuoteOrder({
        firstName,
        lastName,
        email,
        phone,
        companyName,
        vatNumber,
        businessType,
        items,
        message,
        preferredDeliveryDate,
        deliveryAddress,
        totalEstimate,
        quoteId,
      });

      if (orderResult) {
        orderId = orderResult.orderId;
        orderNumber = orderResult.orderNumber;
        console.log(`✅ WooCommerce order created: #${orderId}`);
      } else {
        console.warn('⚠️ Failed to create WooCommerce order, continuing with email only');
      }
    }

    // Email Sending Logic
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        const smtpPort = Number(process.env.SMTP_PORT || 587);
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
          ...(smtpPort !== 465 && { requireTLS: true }),
        });

        const adminEmail = process.env.WHOLESALE_EMAIL || process.env.ADMIN_EMAIL || 'info@restaurantpack.se';
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
        const fromName = process.env.SMTP_FROM_NAME || 'Anmol Wholesale';

        // Generate Quote Request PDF
        const quoteDate = new Date();
        const quoteValidUntil = addDays(quoteDate, 14); // Quote valid for 14 days

        const quoteRequestData: QuoteRequestData = {
          quoteId,
          date: quoteDate,
          validUntil: quoteValidUntil,
          customer: {
            firstName,
            lastName,
            email,
            phone,
            companyName,
            vatNumber,
            businessType,
            deliveryAddress,
          },
          items: items.map((item: any) => ({
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          totalEstimate,
          message,
          preferredDeliveryDate,
        };

        let pdfBuffer: Buffer | null = null;
        try {
          const pdfBlob = await generateQuoteRequestPDF(quoteRequestData);
          const arrayBuffer = await pdfBlob.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
          console.log(`✅ Quote Request PDF generated: ${quoteId}`);
        } catch (pdfError) {
          console.error('⚠️ Failed to generate Quote Request PDF:', pdfError);
          // Continue without PDF attachment
        }

        const itemsHtml = items.map((item: any) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.sku || 'N/A'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
              ${item.unitPrice ? `${(item.unitPrice * item.quantity).toFixed(2)} SEK` : 'TBD'}
            </td>
          </tr>
        `).join('');

        // Send admin notification email with PDF attachment
        await transporter.sendMail({
          from: `"${fromName} - Quote Request" <${fromEmail}>`,
          to: adminEmail,
          replyTo: email,
          subject: `🆕 Quote Request ${quoteId} from ${companyName}${orderId ? ` (Order #${orderId})` : ''}`,
          attachments: pdfBuffer ? [
            {
              filename: `Quote-Request-${quoteId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ] : [],
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">New Quote Request</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">${quoteId}</p>
                    ${orderId ? `<p style="margin: 4px 0 0; opacity: 0.7; font-size: 14px;">WooCommerce Order #${orderId}</p>` : ''}
                    ${pdfBuffer ? `<p style="margin: 8px 0 0; opacity: 0.8; font-size: 12px;">📎 PDF Quote Request Attached</p>` : ''}
                  </div>

                  <div style="padding: 24px;">
                    <!-- Business Info -->
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Business Information</h3>
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Company:</td>
                          <td style="padding: 4px 0; font-weight: 600;">${companyName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">VAT Number:</td>
                          <td style="padding: 4px 0;">${vatNumber || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Business Type:</td>
                          <td style="padding: 4px 0;">${businessType || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Contact:</td>
                          <td style="padding: 4px 0; font-weight: 600;">${firstName} ${lastName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Email:</td>
                          <td style="padding: 4px 0;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Phone:</td>
                          <td style="padding: 4px 0;"><a href="tel:${phone}" style="color: #0066cc;">${phone || 'N/A'}</a></td>
                        </tr>
                      </table>
                    </div>

                    <!-- Requested Items -->
                    <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Requested Items</h3>
                    <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                      <thead>
                        <tr style="background: #1a1a2e; color: white;">
                          <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                          <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                          <th style="padding: 12px; text-align: left; font-weight: 600;">SKU</th>
                          <th style="padding: 12px; text-align: right; font-weight: 600;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                      <tfoot>
                        <tr style="background: #f0f7ff;">
                          <td colspan="3" style="padding: 12px; font-weight: 600;">Estimated Total</td>
                          <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: #0066cc;">
                            ${totalEstimate ? `${totalEstimate.toFixed(2)} SEK` : 'Price on Request'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    ${preferredDeliveryDate ? `
                      <p style="margin: 0 0 8px;"><strong>Preferred Delivery:</strong> ${preferredDeliveryDate}</p>
                    ` : ''}

                    ${deliveryAddress ? `
                      <p style="margin: 0 0 8px;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                    ` : ''}

                    ${message ? `
                      <div style="background: #fff9e6; border-left: 4px solid #ffb800; padding: 12px; margin-top: 16px;">
                        <h4 style="margin: 0 0 8px; color: #996600;">Customer Notes</h4>
                        <p style="margin: 0; color: #666;">${message}</p>
                      </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div style="margin-top: 24px; text-align: center;">
                      ${orderId ? `
                        <a href="${process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${orderId}&action=edit"
                           style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 8px;">
                          View Order in WooCommerce
                        </a>
                      ` : ''}
                      <a href="mailto:${email}?subject=Re: Quote Request ${quoteId}"
                         style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 8px;">
                        Reply to Customer
                      </a>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
                    Quote received via ${source} • ${new Date().toLocaleString('sv-SE')}
                    <br>
                    ${brandConfig.businessName} Quote Management System
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // Send customer confirmation email with PDF attachment
        await transporter.sendMail({
          from: `"${brandConfig.businessName}" <${fromEmail}>`,
          to: email,
          subject: `Your Quote Request ${quoteId} - ${brandConfig.businessName}`,
          attachments: pdfBuffer ? [
            {
              filename: `Quote-Request-${quoteId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ] : [],
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 32px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
                    <p style="margin: 12px 0 0; opacity: 0.9; font-size: 16px;">We've received your quote request</p>
                  </div>

                  <div style="padding: 32px;">
                    <p style="font-size: 16px;">Dear ${firstName},</p>

                    <p>Thank you for your interest in ${brandConfig.businessName}. We have received your quote request and our B2B team is reviewing it.</p>

                    ${pdfBuffer ? `
                    <div style="background: #e8f5e9; border-radius: 8px; padding: 12px; margin: 16px 0; border-left: 4px solid #4caf50;">
                      <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                        📎 <strong>Your quote request PDF is attached to this email</strong> for your records.
                      </p>
                    </div>
                    ` : ''}

                    <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                      <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Your Quote Reference</p>
                      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0066cc; font-family: monospace;">${quoteId}</p>
                      ${orderId ? `<p style="margin: 8px 0 0; font-size: 12px; color: #666;">Order #${orderId}</p>` : ''}
                    </div>

                    <h3 style="color: #1a1a2e; margin-top: 32px;">What happens next?</h3>
                    <ol style="padding-left: 20px; color: #555;">
                      <li style="margin-bottom: 12px;"><strong>Review</strong> - Our team reviews your request (within 24 hours)</li>
                      <li style="margin-bottom: 12px;"><strong>Quote</strong> - You'll receive a detailed quote via email</li>
                      <li style="margin-bottom: 12px;"><strong>Order</strong> - Accept the quote to proceed with your order</li>
                    </ol>

                    <h3 style="color: #1a1a2e; margin-top: 32px;">Your Request Summary</h3>
                    <table width="100%" style="border-collapse: collapse; margin: 16px 0;">
                      <thead>
                        <tr style="background: #f8f9fa;">
                          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e0e0e0;">Product</th>
                          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e0e0e0;">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${items.map((item: any) => `
                          <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>

                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <h4 style="margin: 0 0 12px; color: #1a1a2e;">Need to reach us sooner?</h4>
                      <p style="margin: 0; color: #666;">
                        📧 Email: <a href="mailto:info@restaurantpack.se" style="color: #0066cc;">info@restaurantpack.se</a><br>
                        📱 WhatsApp: <a href="https://wa.me/46735000000" style="color: #25D366;">+46 73 500 00 00</a>
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background: #1a1a2e; color: white; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-weight: 600;">${brandConfig.businessName}</p>
                    <p style="margin: 0; opacity: 0.7; font-size: 12px;">
                      Sweden's Leading Restaurant Wholesale Partner
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log('✅ Quote request emails sent successfully');
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed for quote request:', emailError);
    }

    return NextResponse.json({
      success: true,
      quoteId,
      orderId,
      message: orderId
        ? `Your quote request has been received. Reference: ${quoteId}. We will contact you within 24 hours.`
        : 'Your quote request has been received. We will contact you with pricing soon!',
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process quote request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
