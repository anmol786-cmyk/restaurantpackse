import { NextRequest, NextResponse } from 'next/server';
import { brandConfig } from '@/config/brand.config';
import nodemailer from 'nodemailer';

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
            source = 'wholesale-quote-form'
        } = body;

        // Validate required fields
        if (!firstName || !email || !companyName || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Log quote request
        console.log('═══════════════════════════════════════════════');
        console.log('📄 NEW WHOLESALE QUOTE REQUEST');
        console.log('═══════════════════════════════════════════════');
        console.log(`👤 Name: ${firstName} ${lastName}`);
        console.log(`🏢 Company: ${companyName} (${vatNumber || 'No VAT'})`);
        console.log(`📧 Email: ${email}`);
        console.log(`📱 Phone: ${phone || 'Not provided'}`);
        console.log(`💼 Type: ${businessType || 'Not specified'}`);
        console.log(`📦 Items: ${items.length} products`);
        console.log(`💰 Total Est: ${totalEstimate || 'Ask for pricing'}`);
        console.log('═══════════════════════════════════════════════');

        // Email Sending Logic
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
                const smtpPort = Number(process.env.SMTP_PORT || 587);
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: smtpPort,
                    secure: smtpPort === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                const adminEmail = process.env.ADMIN_EMAIL || 'info@restaurantpack.se';
                const fromEmail = process.env.SMTP_USER;

                const itemsHtml = items.map((item: any) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.sku || 'N/A'}</td>
          </tr>
        `).join('');

                await transporter.sendMail({
                    from: `"Anmol Wholesale Quotes" <${fromEmail}>`,
                    to: adminEmail,
                    replyTo: email,
                    subject: `New Wholesale Quote Request: ${companyName}`,
                    html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                  <h1 style="color: #000; border-bottom: 2px solid #primary; padding-bottom: 10px;">New Quote Request</h1>
                  
                  <h3>Business Information</h3>
                  <p><strong>Company:</strong> ${companyName}</p>
                  <p><strong>VAT Number:</strong> ${vatNumber || 'N/A'}</p>
                  <p><strong>Contact:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                  <p><strong>Business Type:</strong> ${businessType || 'N/A'}</p>
                  
                  <h3>Requested Items</h3>
                  <table width="100%" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; text-align: left;">Product</th>
                        <th style="padding: 8px; text-align: left;">Quantity</th>
                        <th style="padding: 8px; text-align: left;">SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                  
                  ${message ? `<h3>Additional Notes</h3><p>${message}</p>` : ''}
                  
                  <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
                    Sent from ${brandConfig.businessName} Quote System • ${new Date().toLocaleString()}
                  </div>
                </div>
              </body>
            </html>
          `,
                });

                console.log('✅ Quote request email sent successfully');
            }
        } catch (emailError) {
            console.error('⚠️  Email sending failed for quote request:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Your quote request has been received. We will contact you with pricing soon!',
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
