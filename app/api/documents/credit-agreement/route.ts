import { NextRequest, NextResponse } from 'next/server';
import { generateCreditAgreementPDF, generateAgreementId, type CreditAgreementData } from '@/lib/agreement-generator';
import { CREDIT_TERMS } from '@/config/commerce-rules';

/**
 * Generate Credit Agreement PDF
 *
 * GET /api/documents/credit-agreement?customerId=123
 * POST /api/documents/credit-agreement (with customer data in body)
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            companyName,
            vatNumber,
            orgNumber,
            address,
            city,
            postcode,
            country = 'Sweden',
            contactName,
            contactEmail,
            contactPhone,
            invoiceContactName,
            invoiceContactEmail,
            invoiceContactPhone,
            creditLimit = CREDIT_TERMS.defaultCreditLimit,
            paymentDays = CREDIT_TERMS.defaultCreditDays,
            minOrderValue = CREDIT_TERMS.minOrderForCredit,
            expectedMonthlyVolume,
            agreementId,
        } = body;

        // Validate required fields
        if (!companyName || !contactName || !contactEmail) {
            return NextResponse.json(
                { error: 'Missing required fields: companyName, contactName, contactEmail' },
                { status: 400 }
            );
        }

        const creditAgreementData: CreditAgreementData = {
            agreementId: agreementId || generateAgreementId('CA'),
            effectiveDate: new Date(),
            customer: {
                companyName,
                vatNumber: vatNumber || '',
                orgNumber,
                address: address || '',
                city: city || '',
                postcode: postcode || '',
                country,
                contactName,
                contactEmail,
                contactPhone: contactPhone || '',
            },
            creditTerms: {
                creditLimit,
                paymentDays,
                currency: 'SEK',
                minOrderValue,
            },
            invoiceContact: invoiceContactName ? {
                name: invoiceContactName,
                email: invoiceContactEmail || contactEmail,
                phone: invoiceContactPhone || contactPhone || '',
            } : undefined,
            expectedMonthlyVolume,
        };

        const pdfBlob = await generateCreditAgreementPDF(creditAgreementData);
        const arrayBuffer = await pdfBlob.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Credit-Agreement-${creditAgreementData.agreementId}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating credit agreement PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate credit agreement PDF' },
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
        const contactName = searchParams.get('contactName');
        const contactEmail = searchParams.get('contactEmail');
        const contactPhone = searchParams.get('contactPhone');
        const address = searchParams.get('address');
        const city = searchParams.get('city');
        const postcode = searchParams.get('postcode');

        // Validate required fields
        if (!companyName || !contactName || !contactEmail) {
            return NextResponse.json(
                { error: 'Missing required query params: companyName, contactName, contactEmail' },
                { status: 400 }
            );
        }

        const creditAgreementData: CreditAgreementData = {
            agreementId: generateAgreementId('CA'),
            effectiveDate: new Date(),
            customer: {
                companyName,
                vatNumber: vatNumber || '',
                address: address || '',
                city: city || '',
                postcode: postcode || '',
                country: 'Sweden',
                contactName,
                contactEmail,
                contactPhone: contactPhone || '',
            },
            creditTerms: {
                creditLimit: CREDIT_TERMS.defaultCreditLimit,
                paymentDays: CREDIT_TERMS.defaultCreditDays,
                currency: 'SEK',
                minOrderValue: CREDIT_TERMS.minOrderForCredit,
            },
        };

        const pdfBlob = await generateCreditAgreementPDF(creditAgreementData);
        const arrayBuffer = await pdfBlob.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Credit-Agreement-${creditAgreementData.agreementId}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating credit agreement PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate credit agreement PDF' },
            { status: 500 }
        );
    }
}
