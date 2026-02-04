import { NextRequest, NextResponse } from 'next/server';
import { generateWholesaleAgreementPDF, generateAgreementId, type WholesaleAgreementData } from '@/lib/agreement-generator';
import { CREDIT_TERMS } from '@/config/commerce-rules';
import { addMonths } from 'date-fns';

/**
 * Generate Wholesale Agreement PDF
 *
 * GET /api/documents/wholesale-agreement?companyName=...&contactName=...
 * POST /api/documents/wholesale-agreement (with customer data in body)
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            companyName,
            vatNumber,
            orgNumber,
            businessType = 'Wholesale',
            address,
            city,
            postcode,
            country = 'Sweden',
            contactName,
            contactEmail,
            contactPhone,
            pricingTier = 'standard',
            includeCredit = false,
            creditLimit,
            paymentDays,
            agreementId,
            effectiveDate,
            expiryDate,
        } = body;

        // Validate required fields
        if (!companyName || !contactName || !contactEmail) {
            return NextResponse.json(
                { error: 'Missing required fields: companyName, contactName, contactEmail' },
                { status: 400 }
            );
        }

        const startDate = effectiveDate ? new Date(effectiveDate) : new Date();

        const wholesaleAgreementData: WholesaleAgreementData = {
            agreementId: agreementId || generateAgreementId('WA'),
            effectiveDate: startDate,
            expiryDate: expiryDate ? new Date(expiryDate) : addMonths(startDate, 12),
            customer: {
                companyName,
                vatNumber: vatNumber || '',
                orgNumber,
                businessType,
                address: address || '',
                city: city || '',
                postcode: postcode || '',
                country,
                contactName,
                contactEmail,
                contactPhone: contactPhone || '',
            },
            pricingTier,
            includeCredit,
            creditLimit: includeCredit ? (creditLimit || CREDIT_TERMS.defaultCreditLimit) : undefined,
            paymentDays: includeCredit ? (paymentDays || CREDIT_TERMS.defaultCreditDays) : undefined,
        };

        const pdfBlob = await generateWholesaleAgreementPDF(wholesaleAgreementData);
        const arrayBuffer = await pdfBlob.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Wholesale-Agreement-${wholesaleAgreementData.agreementId}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating wholesale agreement PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate wholesale agreement PDF' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Get parameters from URL
        const companyName = searchParams.get('companyName');
        const vatNumber = searchParams.get('vatNumber');
        const businessType = searchParams.get('businessType') || 'Wholesale';
        const contactName = searchParams.get('contactName');
        const contactEmail = searchParams.get('contactEmail');
        const contactPhone = searchParams.get('contactPhone');
        const address = searchParams.get('address');
        const city = searchParams.get('city');
        const postcode = searchParams.get('postcode');
        const includeCredit = searchParams.get('includeCredit') === 'true';

        // Validate required fields
        if (!companyName || !contactName || !contactEmail) {
            return NextResponse.json(
                { error: 'Missing required query params: companyName, contactName, contactEmail' },
                { status: 400 }
            );
        }

        const startDate = new Date();

        const wholesaleAgreementData: WholesaleAgreementData = {
            agreementId: generateAgreementId('WA'),
            effectiveDate: startDate,
            expiryDate: addMonths(startDate, 12),
            customer: {
                companyName,
                vatNumber: vatNumber || '',
                businessType,
                address: address || '',
                city: city || '',
                postcode: postcode || '',
                country: 'Sweden',
                contactName,
                contactEmail,
                contactPhone: contactPhone || '',
            },
            pricingTier: 'standard',
            includeCredit,
            creditLimit: includeCredit ? CREDIT_TERMS.defaultCreditLimit : undefined,
            paymentDays: includeCredit ? CREDIT_TERMS.defaultCreditDays : undefined,
        };

        const pdfBlob = await generateWholesaleAgreementPDF(wholesaleAgreementData);
        const arrayBuffer = await pdfBlob.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Wholesale-Agreement-${wholesaleAgreementData.agreementId}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating wholesale agreement PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate wholesale agreement PDF' },
            { status: 500 }
        );
    }
}
