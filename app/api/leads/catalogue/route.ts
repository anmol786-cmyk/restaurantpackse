import { NextRequest, NextResponse } from 'next/server';
import { brandConfig } from '@/config/brand.config';
import { sendEmail } from '@/lib/email/smtp';
import { generateEmailTemplate, createInfoRow, createInfoBox } from '@/lib/email-template';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://restaurantpack.se';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name || '').trim();
    const company = (body.company || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();

    if (!name || !company || !email) {
      return NextResponse.json({ error: 'Name, company and email are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    console.log('═══════════════════════════════════════════════');
    console.log('📥 NEW CATALOGUE LEAD');
    console.log(`👤 ${name}  🏢 ${company}`);
    console.log(`📧 ${email}  📱 ${phone || 'n/a'}`);
    console.log('═══════════════════════════════════════════════');

    const catalogueUrl = `${SITE_URL}/api/catalog/pdf?lang=sv`;

    // Notify the admin of the new lead.
    try {
      const adminEmail =
        process.env.WHOLESALE_EMAIL || process.env.ADMIN_EMAIL || brandConfig.contact.email;

      const adminHtml = generateEmailTemplate({
        title: 'New Catalogue Lead',
        heading: '📥 New Catalogue Lead',
        contentSections: [
          {
            title: 'Lead Details',
            content: `
              <table width="100%" cellpadding="0" cellspacing="0">
                ${createInfoRow('Name', name)}
                ${createInfoRow('Company', company)}
                ${createInfoRow('Email', `<a href="mailto:${email}" style="color:#8B1538;text-decoration:none;">${email}</a>`)}
                ${createInfoRow('Phone', phone || 'Not provided')}
              </table>
            `,
          },
          {
            title: 'Follow Up',
            content: createInfoBox(
              'This restaurant/business just downloaded the wholesale catalogue. Reach out within 24 hours to open a wholesale account.'
            ),
          },
        ],
      });

      await sendEmail({
        to: adminEmail,
        subject: `New Catalogue Lead: ${company}`,
        html: adminHtml,
      });
    } catch (adminErr) {
      console.error('Catalogue lead: admin email failed:', adminErr);
    }

    // Send the lead a branded thank-you with the catalogue link.
    try {
      const leadHtml = generateEmailTemplate({
        title: 'Your Wholesale Catalogue',
        heading: '📦 Your Wholesale Catalogue is Ready',
        contentSections: [
          {
            title: `Thank You, ${name.split(/\s+/)[0]}!`,
            content: `
              <p style="margin:0 0 15px 0;color:#333333;font-size:14px;line-height:1.6;">
                Thanks for your interest in ${brandConfig.businessName}. Your wholesale catalogue is ready to download.
              </p>
              <div style="margin:20px 0;text-align:center;">
                <a href="${catalogueUrl}" style="background-color:#8B1538;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block;">
                  Download Catalogue (PDF)
                </a>
              </div>
            `,
          },
          {
            title: 'Open a Wholesale Account',
            content: createInfoBox(
              'Register a free business account to unlock trade pricing, volume discounts and our Stockholm delivery fleet. Our team will get you set up within 24 hours.'
            ),
          },
        ],
      });

      await sendEmail({
        to: email,
        subject: `Your Wholesale Catalogue - ${brandConfig.businessName}`,
        html: leadHtml,
      });
    } catch (leadErr) {
      console.error('Catalogue lead: customer email failed:', leadErr);
    }

    return NextResponse.json({ success: true, catalogueUrl });
  } catch (error) {
    console.error('Catalogue lead error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
