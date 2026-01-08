import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const FEEDBACK_LABELS: Record<string, string> = {
  high_prices: 'Prices are too high',
  high_shipping: 'Shipping cost is too high',
  website_issues: 'Website not working properly',
  payment_issues: 'Payment options limited',
  slow_delivery: 'Delivery time too long',
  just_browsing: 'Just browsing',
  better_price: 'Found better price elsewhere',
  unclear_info: 'Product info unclear',
  complicated_checkout: 'Checkout too complicated',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reasons = [], otherFeedback = '', url = '', timestamp = '', userAgent = '' } = body;

    // Format the feedback for console logging
    const reasonsList = reasons
      .map((id: string) => `• ${FEEDBACK_LABELS[id] || id}`)
      .join('\n');

    // Log to console
    console.log('═══════════════════════════════════════════════');
    console.log('🚨 EXIT SURVEY FEEDBACK RECEIVED');
    console.log('═══════════════════════════════════════════════');
    console.log('REASONS SELECTED:');
    console.log(reasonsList || 'None selected');
    console.log('\nADDITIONAL FEEDBACK:');
    console.log(otherFeedback || 'None provided');
    console.log('\nDETAILS:');
    console.log(`📍 Page URL: ${url}`);
    console.log(`⏰ Timestamp: ${new Date(timestamp).toLocaleString('en-US', { timeZone: 'Europe/Stockholm' })}`);
    console.log('═══════════════════════════════════════════════');

    // Send email using Hostinger SMTP (same as contact form)
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
          ...(smtpPort !== 465 && { requireTLS: true }),
        });

        const adminEmail = process.env.ADMIN_EMAIL || 'info@ideallivs.com';
        const secondaryEmail = process.env.SECONDARY_ADMIN_EMAIL;
        const recipients = secondaryEmail ? [adminEmail, secondaryEmail] : [adminEmail];
        const fromEmail = process.env.SMTP_USER;

        // Format reasons as HTML list
        const reasonsHtml = reasons.length > 0
          ? reasons.map((id: string) => `<li style="padding: 5px 0; color: #333333;">${FEEDBACK_LABELS[id] || id}</li>`).join('')
          : '<li style="padding: 5px 0; color: #999999;">None selected</li>';

        // Send email
        await transporter.sendMail({
          from: `"Ideal Livs Exit Survey" <${fromEmail}>`,
          to: recipients,
          subject: `🚨 Exit Survey Feedback - ${new Date(timestamp).toLocaleDateString()}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Exit Survey Feedback</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🚨 Exit Survey Feedback</h1>
                      <p style="color: #FEE2E2; margin: 10px 0 0 0; font-size: 14px;">Customer left without completing order</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 30px;">
                            <h2 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #FEE2E2; padding-bottom: 10px;">Reasons Selected</h2>
                            <ul style="margin: 15px 0; padding-left: 20px; list-style-type: disc;">
                              ${reasonsHtml}
                            </ul>
                          </td>
                        </tr>
                        ${otherFeedback ? `
                        <tr>
                          <td style="padding-bottom: 30px;">
                            <h2 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #FEE2E2; padding-bottom: 10px;">Additional Feedback</h2>
                            <div style="background-color: #FEF2F2; border-left: 4px solid #FCA5A5; padding: 15px; margin-top: 15px;">
                              <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${otherFeedback}</p>
                            </div>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding-bottom: 30px;">
                            <h2 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #FEE2E2; padding-bottom: 10px;">Exit Details</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #666666; width: 120px; font-weight: 600;">Page URL:</td>
                                <td style="padding: 8px 0; font-size: 14px;"><a href="${url}" style="color: #DC2626; text-decoration: none;">${url}</a></td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #666666; font-weight: 600;">Timestamp:</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #333333;">${new Date(timestamp).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZone: 'Europe/Stockholm'
                                })} (Stockholm time)</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                              This feedback was collected via exit-intent survey at <a href="https://ideallivs.com" style="color: #DC2626; text-decoration: none;">ideallivs.com</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #DC2626; padding: 20px 30px; text-align: center;">
                      <p style="margin: 0; color: #FEE2E2; font-size: 12px;">
                        © ${new Date().getFullYear()} Ideal Indiska Livs. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        });

        console.log('✅ Exit survey email sent successfully to:', recipients.join(', '));
      }
    } catch (emailError) {
      console.error('⚠️  Email sending failed (feedback still recorded):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully'
    });

  } catch (error) {
    console.error('Error processing exit survey feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
