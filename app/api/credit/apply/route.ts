import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { brandConfig } from '@/config/brand.config';
import { CREDIT_TERMS } from '@/config/commerce-rules';
import nodemailer from 'nodemailer';
import { generateCreditAgreementPDF, type CreditAgreementData } from '@/lib/agreement-generator';

interface CreditApplicationData {
  expected_monthly_volume: string;
  invoice_contact_name: string;
  invoice_contact_email: string;
  invoice_contact_phone: string;
  company_name: string;
  vat_number: string;
}

// Generate unique application ID
function generateApplicationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CA-${timestamp}-${random}`;
}

// Update WooCommerce customer meta data
async function updateCustomerMeta(
  customerId: number,
  metaData: Array<{ key: string; value: string }>
): Promise<boolean> {
  try {
    const response = await fetch(getWooCommerceUrl(`/customers/${customerId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getWooCommerceAuthHeader(),
      },
      body: JSON.stringify({ meta_data: metaData }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating customer meta:', error);
    return false;
  }
}

// Get customer by token/email
async function getCustomerFromAuth(token: string): Promise<any> {
  try {
    // First, validate token and get WP user
    const wpUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!wpUserResponse.ok) return null;

    const wpUser = await wpUserResponse.json();

    // Then get WooCommerce customer by email
    const customerResponse = await fetch(
      getWooCommerceUrl(`/customers?email=${wpUser.email}`),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getWooCommerceAuthHeader(),
        },
      }
    );

    if (!customerResponse.ok) return null;

    const customers = await customerResponse.json();
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');

    if (!authCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse auth data
    let token: string | null = null;
    try {
      const authData = JSON.parse(authCookie.value);
      token = authData?.state?.token;
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get customer data
    const customer = await getCustomerFromAuth(token);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer is a verified business
    const isVerified = customer.meta_data?.some(
      (m: any) =>
        (m.key === 'business_verified' && (m.value === '1' || m.value === 'yes' || m.value === true)) ||
        (m.key === 'is_wholesale_customer' && (m.value === 'approved' || m.value === 'yes' || m.value === '1'))
    );

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Business verification required before applying for credit' },
        { status: 403 }
      );
    }

    // Check if already has pending or approved credit
    const existingCreditStatus = customer.meta_data?.find(
      (m: any) => m.key === 'credit_application_status'
    )?.value;

    if (existingCreditStatus === 'approved') {
      return NextResponse.json(
        { error: 'You already have approved credit terms' },
        { status: 400 }
      );
    }

    if (existingCreditStatus === 'pending') {
      return NextResponse.json(
        { error: 'You already have a pending credit application' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: CreditApplicationData = await request.json();
    const {
      expected_monthly_volume,
      invoice_contact_name,
      invoice_contact_email,
      invoice_contact_phone,
      company_name,
      vat_number,
    } = body;

    // Validate required fields
    if (!expected_monthly_volume || !invoice_contact_name || !invoice_contact_email || !invoice_contact_phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = generateApplicationId();
    const applicationDate = new Date().toISOString();

    // Log the application
    console.log('═══════════════════════════════════════════════');
    console.log('💳 NEW CREDIT APPLICATION');
    console.log(`📋 Application ID: ${applicationId}`);
    console.log('═══════════════════════════════════════════════');
    console.log(`🏢 Company: ${company_name}`);
    console.log(`📄 VAT: ${vat_number}`);
    console.log(`👤 Contact: ${invoice_contact_name}`);
    console.log(`📧 Email: ${invoice_contact_email}`);
    console.log(`📱 Phone: ${invoice_contact_phone}`);
    console.log(`💰 Expected Volume: ${expected_monthly_volume}`);
    console.log(`📅 Date: ${applicationDate}`);
    console.log('═══════════════════════════════════════════════');

    // Update customer meta data with application info
    const metaUpdates = [
      { key: 'credit_application_status', value: 'pending' },
      { key: 'credit_application_id', value: applicationId },
      { key: 'credit_application_date', value: applicationDate },
      { key: 'credit_expected_volume', value: expected_monthly_volume },
      { key: 'credit_invoice_contact_name', value: invoice_contact_name },
      { key: 'credit_invoice_contact_email', value: invoice_contact_email },
      { key: 'credit_invoice_contact_phone', value: invoice_contact_phone },
    ];

    const metaUpdateSuccess = await updateCustomerMeta(customer.id, metaUpdates);

    if (!metaUpdateSuccess) {
      console.error('Failed to update customer meta data');
    }

    // Send emails
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

        const adminEmail = process.env.ADMIN_EMAIL || 'info@restaurantpack.se';
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
        const fromName = process.env.SMTP_FROM_NAME || 'Anmol Wholesale';

        // Generate Credit Agreement PDF
        let pdfBuffer: Buffer | null = null;
        try {
          const creditAgreementData: CreditAgreementData = {
            agreementId: applicationId,
            effectiveDate: new Date(),
            customer: {
              companyName: company_name,
              vatNumber: vat_number || '',
              address: customer.billing?.address_1 || '',
              city: customer.billing?.city || '',
              postcode: customer.billing?.postcode || '',
              country: customer.billing?.country || 'Sweden',
              contactName: invoice_contact_name,
              contactEmail: invoice_contact_email,
              contactPhone: invoice_contact_phone,
            },
            creditTerms: {
              creditLimit: CREDIT_TERMS.defaultCreditLimit,
              paymentDays: CREDIT_TERMS.defaultCreditDays,
              currency: 'SEK',
              minOrderValue: CREDIT_TERMS.minOrderForCredit,
            },
            invoiceContact: {
              name: invoice_contact_name,
              email: invoice_contact_email,
              phone: invoice_contact_phone,
            },
            expectedMonthlyVolume: expected_monthly_volume,
          };

          const pdfBlob = await generateCreditAgreementPDF(creditAgreementData);
          const arrayBuffer = await pdfBlob.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
          console.log(`✅ Credit Agreement PDF generated: ${applicationId}`);
        } catch (pdfError) {
          console.error('⚠️ Failed to generate Credit Agreement PDF:', pdfError);
          // Continue without PDF attachment
        }

        // Send admin notification with PDF attachment
        await transporter.sendMail({
          from: `"${fromName} - Credit Application" <${fromEmail}>`,
          to: adminEmail,
          replyTo: invoice_contact_email,
          subject: `💳 Credit Application ${applicationId} - ${company_name}`,
          attachments: pdfBuffer ? [
            {
              filename: `Credit-Agreement-${applicationId}.pdf`,
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
                    <h1 style="margin: 0; font-size: 24px;">New Credit Application</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">${applicationId}</p>
                  </div>

                  <div style="padding: 24px;">
                    <!-- Business Info -->
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Business Information</h3>
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Company:</td>
                          <td style="padding: 4px 0; font-weight: 600;">${company_name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">VAT Number:</td>
                          <td style="padding: 4px 0;">${vat_number || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Customer ID:</td>
                          <td style="padding: 4px 0;">#${customer.id}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Account Email:</td>
                          <td style="padding: 4px 0;">${customer.email}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Credit Request Details -->
                    <div style="background: #e7f3ff; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <h3 style="margin: 0 0 12px; color: #0066cc; font-size: 16px;">Credit Request Details</h3>
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Expected Monthly Volume:</td>
                          <td style="padding: 4px 0; font-weight: 600;">${expected_monthly_volume} SEK</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Requested Terms:</td>
                          <td style="padding: 4px 0;">Net ${CREDIT_TERMS.defaultCreditDays} days</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Default Limit:</td>
                          <td style="padding: 4px 0;">${CREDIT_TERMS.defaultCreditLimit.toLocaleString()} SEK</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Invoice Contact -->
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Invoice Contact</h3>
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Name:</td>
                          <td style="padding: 4px 0; font-weight: 600;">${invoice_contact_name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Email:</td>
                          <td style="padding: 4px 0;"><a href="mailto:${invoice_contact_email}" style="color: #0066cc;">${invoice_contact_email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #666;">Phone:</td>
                          <td style="padding: 4px 0;"><a href="tel:${invoice_contact_phone}" style="color: #0066cc;">${invoice_contact_phone}</a></td>
                        </tr>
                      </table>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align: center; margin-top: 24px;">
                      <a href="${process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/user-edit.php?user_id=${customer.id}"
                         style="display: inline-block; background: #0066cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        Review Customer in WooCommerce
                      </a>
                    </div>

                    <div style="margin-top: 24px; padding: 16px; background: #fff9e6; border-radius: 8px; border-left: 4px solid #ffb800;">
                      <p style="margin: 0; font-size: 14px; color: #996600;">
                        <strong>To approve this application:</strong><br>
                        1. Review the customer's order history and payment record<br>
                        2. Update customer meta: <code>credit_application_status</code> = "approved"<br>
                        3. Set <code>credit_limit</code> and <code>credit_terms_days</code>
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
                    Application submitted ${new Date().toLocaleString('sv-SE')}
                    <br>
                    ${brandConfig.businessName} Credit Management
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // Send customer confirmation with PDF attachment
        await transporter.sendMail({
          from: `"${brandConfig.businessName}" <${fromEmail}>`,
          to: invoice_contact_email,
          subject: `Credit Application Received - ${brandConfig.businessName}`,
          attachments: pdfBuffer ? [
            {
              filename: `Credit-Agreement-${applicationId}.pdf`,
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
                    <h1 style="margin: 0; font-size: 28px;">Application Received</h1>
                    <p style="margin: 12px 0 0; opacity: 0.9; font-size: 16px;">Credit Terms Application</p>
                  </div>

                  <div style="padding: 32px;">
                    <p style="font-size: 16px;">Dear ${invoice_contact_name},</p>

                    <p>Thank you for applying for credit payment terms with ${brandConfig.businessName}. We have received your application and our finance team is reviewing it.</p>

                    ${pdfBuffer ? `
                    <div style="background: #e8f5e9; border-radius: 8px; padding: 12px; margin: 16px 0; border-left: 4px solid #4caf50;">
                      <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                        📎 <strong>Your Credit Agreement is attached to this email</strong> for your records and review.
                      </p>
                    </div>
                    ` : ''}

                    <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                      <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Application Reference</p>
                      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0066cc; font-family: monospace;">${applicationId}</p>
                    </div>

                    <h3 style="color: #1a1a2e; margin-top: 32px;">Application Details</h3>
                    <table style="width: 100%; margin: 16px 0;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Company:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">${company_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Payment Terms:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Net ${CREDIT_TERMS.defaultCreditDays} days</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Expected Volume:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${expected_monthly_volume} SEK/month</td>
                      </tr>
                    </table>

                    <h3 style="color: #1a1a2e; margin-top: 32px;">What happens next?</h3>
                    <ol style="padding-left: 20px; color: #555;">
                      <li style="margin-bottom: 12px;"><strong>Review</strong> - Our finance team reviews your application (2-3 business days)</li>
                      <li style="margin-bottom: 12px;"><strong>Decision</strong> - You'll receive an email with the outcome</li>
                      <li style="margin-bottom: 12px;"><strong>Activation</strong> - If approved, credit terms are immediately available at checkout</li>
                    </ol>

                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <h4 style="margin: 0 0 12px; color: #1a1a2e;">Questions?</h4>
                      <p style="margin: 0; color: #666;">
                        Contact us at <a href="mailto:info@restaurantpack.se" style="color: #0066cc;">info@restaurantpack.se</a>
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

        console.log('✅ Credit application emails sent successfully');
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError);
      // Don't fail the request if emails fail
    }

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Credit application submitted successfully. We will review your application within 2-3 business days.',
    });
  } catch (error) {
    console.error('Error processing credit application:', error);
    return NextResponse.json(
      {
        error: 'Failed to process credit application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
