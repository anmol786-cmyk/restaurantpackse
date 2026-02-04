import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, addDays, addMonths } from 'date-fns';

/**
 * Agreement PDF Generator for Anmol Wholesale
 *
 * Generates professional B2B agreements:
 * - Credit Agreement (for approved credit customers)
 * - Wholesale Agreement (for wholesale partnership)
 */

// Company Information
const COMPANY_INFO = {
    name: 'Anmol Wholesale',
    legalName: 'Anmol Wholesale AB',
    address: 'Fagerstagatan 13',
    city: '163 53 Spånga',
    country: 'Sweden',
    vat: 'SE559253806901',
    orgNumber: '559253-8069',
    phone: '+46 76 917 84 56',
    email: 'info@restaurantpack.se',
    website: 'www.restaurantpack.se',
};

// Bank Details
const BANK_INFO = {
    bank: 'Swedbank',
    iban: 'SE## #### #### #### #### ####', // Replace with actual IBAN
    bic: 'SWEDSESS',
    accountNumber: '####-####',
    clearingNumber: '####',
};

// Theme Colors (Anmol Red) as fixed-length tuples
const COLORS: Record<string, [number, number, number]> = {
    primary: [176, 17, 22],      // Anmol Red #b01116
    accent: [234, 179, 8],       // Gold #eab308
    text: [28, 25, 23],          // Dark gray #1c1917
    lightGray: [243, 244, 246],  // #f3f4f6
    white: [255, 255, 255],
    success: [34, 197, 94],      // Green
    warning: [234, 179, 8],      // Gold/Yellow
};

// =============================================================================
// CREDIT AGREEMENT PDF
// =============================================================================

export interface CreditAgreementData {
    agreementId: string;
    effectiveDate: Date;
    customer: {
        companyName: string;
        vatNumber: string;
        orgNumber?: string;
        address: string;
        city: string;
        postcode: string;
        country: string;
        contactName: string;
        contactEmail: string;
        contactPhone: string;
    };
    creditTerms: {
        creditLimit: number;
        paymentDays: number;
        currency: string;
        minOrderValue: number;
    };
    invoiceContact?: {
        name: string;
        email: string;
        phone: string;
    };
    expectedMonthlyVolume?: string;
}

/**
 * Generate Credit Agreement PDF
 */
export async function generateCreditAgreementPDF(data: CreditAgreementData): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Page 1: Agreement Header and Terms
    addCreditAgreementHeader(doc, data, pageWidth, margin);
    let yPos = addCreditParties(doc, data, margin, pageWidth);
    yPos = addCreditTermsSection(doc, data, yPos, margin, pageWidth);
    yPos = addCreditConditions(doc, yPos, margin, pageWidth);
    addPageFooter(doc, pageWidth, pageHeight, margin, 1, 2);

    // Page 2: Payment Terms and Signatures
    doc.addPage();
    yPos = addPaymentTermsSection(doc, data, margin, pageWidth);
    yPos = addDefaultAndTermination(doc, yPos, margin, pageWidth);
    yPos = addSignatureSection(doc, data, yPos, margin, pageWidth);
    addPageFooter(doc, pageWidth, pageHeight, margin, 2, 2);

    return doc.output('blob');
}

function addCreditAgreementHeader(doc: jsPDF, data: CreditAgreementData, pageWidth: number, margin: number) {
    // Company Logo Area
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name.toUpperCase(), margin, margin + 10);

    // Document Title
    doc.setFontSize(16);
    doc.text('CREDIT AGREEMENT', pageWidth - margin, margin + 10, { align: 'right' });

    // Agreement Reference
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`Agreement No: ${data.agreementId}`, pageWidth - margin, margin + 17, { align: 'right' });
    doc.text(`Date: ${format(data.effectiveDate, 'yyyy-MM-dd')}`, pageWidth - margin, margin + 22, { align: 'right' });

    // Decorative line
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(1);
    doc.line(margin, margin + 28, pageWidth - margin, margin + 28);
}

function addCreditParties(doc: jsPDF, data: CreditAgreementData, margin: number, pageWidth: number): number {
    let yPos = margin + 40;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('PARTIES TO THIS AGREEMENT', margin, yPos);

    yPos += 10;
    const colWidth = (pageWidth - 2 * margin) / 2 - 5;

    // Creditor (Anmol Wholesale)
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, colWidth, 45, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('CREDITOR (Seller)', margin + 5, yPos + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text(COMPANY_INFO.legalName, margin + 5, yPos + 14);
    doc.text(COMPANY_INFO.address, margin + 5, yPos + 20);
    doc.text(`${COMPANY_INFO.city}, ${COMPANY_INFO.country}`, margin + 5, yPos + 26);
    doc.text(`Org.Nr: ${COMPANY_INFO.orgNumber}`, margin + 5, yPos + 32);
    doc.text(`VAT: ${COMPANY_INFO.vat}`, margin + 5, yPos + 38);

    // Debtor (Customer)
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin + colWidth + 10, yPos, colWidth, 45, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('DEBTOR (Buyer)', margin + colWidth + 15, yPos + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text(data.customer.companyName, margin + colWidth + 15, yPos + 14);
    doc.text(data.customer.address, margin + colWidth + 15, yPos + 20);
    doc.text(`${data.customer.postcode} ${data.customer.city}`, margin + colWidth + 15, yPos + 26);
    doc.text(`VAT: ${data.customer.vatNumber || 'N/A'}`, margin + colWidth + 15, yPos + 32);
    doc.text(`Contact: ${data.customer.contactName}`, margin + colWidth + 15, yPos + 38);

    return yPos + 55;
}

function addCreditTermsSection(doc: jsPDF, data: CreditAgreementData, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('1. CREDIT TERMS', margin, yPos);

    yPos += 8;

    // Credit Terms Table
    const termsData = [
        ['Credit Limit', `${data.creditTerms.creditLimit.toLocaleString()} ${data.creditTerms.currency}`],
        ['Payment Terms', `Net ${data.creditTerms.paymentDays} Days`],
        ['Minimum Order Value', `${data.creditTerms.minOrderValue.toLocaleString()} ${data.creditTerms.currency}`],
        ['Currency', data.creditTerms.currency],
        ['Agreement Duration', '12 months (auto-renewal)'],
        ['Effective From', format(data.effectiveDate, 'yyyy-MM-dd')],
    ];

    autoTable(doc, {
        startY: yPos,
        body: termsData,
        theme: 'plain',
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 'auto' },
        },
        margin: { left: margin, right: margin },
    });

    return (doc as any).lastAutoTable.finalY + 10;
}

function addCreditConditions(doc: jsPDF, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('2. TERMS AND CONDITIONS', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const conditions = [
        '2.1 The Debtor agrees to pay all invoices within the agreed payment terms.',
        '2.2 Credit is extended based on the Debtor\'s creditworthiness and payment history.',
        '2.3 The Creditor reserves the right to modify credit terms with 30 days written notice.',
        '2.4 All purchases are subject to the Creditor\'s standard Terms & Conditions.',
        '2.5 The Debtor must notify the Creditor of any changes to business registration or VAT status.',
        '2.6 Credit facility may be suspended if payment is overdue by more than 14 days.',
    ];

    conditions.forEach((condition) => {
        const lines = doc.splitTextToSize(condition, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    return yPos + 5;
}

function addPaymentTermsSection(doc: jsPDF, data: CreditAgreementData, margin: number, pageWidth: number): number {
    let yPos = margin + 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('3. PAYMENT INSTRUCTIONS', margin, yPos);

    yPos += 10;
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');

    yPos += 7;
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);

    doc.setFont('helvetica', 'bold');
    doc.text('Bank Details for Payment:', margin + 5, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Bank: ${BANK_INFO.bank}`, margin + 5, yPos);
    doc.text(`IBAN: ${BANK_INFO.iban}`, margin + 80, yPos);

    yPos += 5;
    doc.text(`BIC/SWIFT: ${BANK_INFO.bic}`, margin + 5, yPos);

    yPos += 5;
    doc.text('Reference: Always include Invoice Number as payment reference', margin + 5, yPos);

    yPos += 20;

    // Invoice Contact
    if (data.invoiceContact) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.primary);
        doc.text('4. INVOICE CONTACT', margin, yPos);

        yPos += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.text);
        doc.text(`Name: ${data.invoiceContact.name}`, margin, yPos);
        yPos += 5;
        doc.text(`Email: ${data.invoiceContact.email}`, margin, yPos);
        yPos += 5;
        doc.text(`Phone: ${data.invoiceContact.phone}`, margin, yPos);
        yPos += 10;
    }

    return yPos + 5;
}

function addDefaultAndTermination(doc: jsPDF, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('5. DEFAULT AND LATE PAYMENT', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const defaultTerms = [
        '5.1 Late payments will incur interest at 8% per annum above the Swedish reference rate.',
        '5.2 A reminder fee of 60 SEK will be charged for each payment reminder sent.',
        '5.3 Persistent late payments may result in credit facility suspension or termination.',
        '5.4 Outstanding balances may be referred to debt collection agencies.',
    ];

    defaultTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    yPos += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('6. TERMINATION', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const terminationTerms = [
        '6.1 Either party may terminate this agreement with 30 days written notice.',
        '6.2 All outstanding balances become immediately due upon termination.',
        '6.3 The Creditor may terminate immediately if the Debtor breaches any terms.',
    ];

    terminationTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    return yPos + 10;
}

function addSignatureSection(doc: jsPDF, data: CreditAgreementData, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('7. ACCEPTANCE AND SIGNATURES', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const acceptance = 'By signing below, both parties agree to the terms and conditions set forth in this Credit Agreement.';
    doc.text(acceptance, margin, yPos);

    yPos += 15;
    const colWidth = (pageWidth - 2 * margin) / 2 - 10;

    // Creditor Signature Box
    doc.setDrawColor(...COLORS.text);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos, colWidth, 40);

    doc.setFont('helvetica', 'bold');
    doc.text('For and on behalf of Creditor:', margin + 5, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY_INFO.legalName, margin + 5, yPos + 13);

    doc.text('Signature: _______________________', margin + 5, yPos + 25);
    doc.text(`Date: ${format(new Date(), 'yyyy-MM-dd')}`, margin + 5, yPos + 33);

    // Debtor Signature Box
    doc.rect(margin + colWidth + 20, yPos, colWidth, 40);

    doc.setFont('helvetica', 'bold');
    doc.text('For and on behalf of Debtor:', margin + colWidth + 25, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(data.customer.companyName, margin + colWidth + 25, yPos + 13);

    doc.text('Signature: _______________________', margin + colWidth + 25, yPos + 25);
    doc.text('Date: _________________________', margin + colWidth + 25, yPos + 33);

    return yPos + 50;
}

// =============================================================================
// WHOLESALE AGREEMENT PDF
// =============================================================================

export interface WholesaleAgreementData {
    agreementId: string;
    effectiveDate: Date;
    expiryDate?: Date;
    customer: {
        companyName: string;
        vatNumber: string;
        orgNumber?: string;
        businessType: string;
        address: string;
        city: string;
        postcode: string;
        country: string;
        contactName: string;
        contactEmail: string;
        contactPhone: string;
    };
    pricingTier?: 'standard' | 'silver' | 'gold';
    includeCredit?: boolean;
    creditLimit?: number;
    paymentDays?: number;
}

/**
 * Generate Wholesale Agreement PDF
 */
export async function generateWholesaleAgreementPDF(data: WholesaleAgreementData): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const expiryDate = data.expiryDate || addMonths(data.effectiveDate, 12);

    // Page 1: Agreement Header and Parties
    addWholesaleHeader(doc, data, pageWidth, margin);
    let yPos = addWholesaleParties(doc, data, margin, pageWidth);
    yPos = addWholesaleScope(doc, yPos, margin, pageWidth);
    yPos = addPricingTerms(doc, data, yPos, margin, pageWidth);
    addPageFooter(doc, pageWidth, pageHeight, margin, 1, 3);

    // Page 2: Ordering and Delivery
    doc.addPage();
    yPos = addOrderingTerms(doc, margin, pageWidth);
    yPos = addDeliveryTerms(doc, yPos, margin, pageWidth);
    yPos = addPaymentAndCredit(doc, data, yPos, margin, pageWidth);
    addPageFooter(doc, pageWidth, pageHeight, margin, 2, 3);

    // Page 3: Legal Terms and Signatures
    doc.addPage();
    yPos = addLegalTerms(doc, margin, pageWidth);
    yPos = addWholesaleSignatures(doc, data, yPos, margin, pageWidth, expiryDate);
    addPageFooter(doc, pageWidth, pageHeight, margin, 3, 3);

    return doc.output('blob');
}

function addWholesaleHeader(doc: jsPDF, data: WholesaleAgreementData, pageWidth: number, margin: number) {
    // Company Name
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name.toUpperCase(), margin, margin + 10);

    // Document Title
    doc.setFontSize(16);
    doc.text('WHOLESALE PARTNERSHIP', pageWidth - margin, margin + 10, { align: 'right' });
    doc.setFontSize(14);
    doc.text('AGREEMENT', pageWidth - margin, margin + 17, { align: 'right' });

    // Agreement Reference
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`Agreement No: ${data.agreementId}`, pageWidth - margin, margin + 24, { align: 'right' });

    // Decorative line
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(1);
    doc.line(margin, margin + 30, pageWidth - margin, margin + 30);
}

function addWholesaleParties(doc: jsPDF, data: WholesaleAgreementData, margin: number, pageWidth: number): number {
    let yPos = margin + 42;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('1. PARTIES', margin, yPos);

    yPos += 10;
    const colWidth = (pageWidth - 2 * margin) / 2 - 5;

    // Supplier Box
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, colWidth, 50, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('SUPPLIER', margin + 5, yPos + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text(COMPANY_INFO.legalName, margin + 5, yPos + 14);
    doc.text(COMPANY_INFO.address, margin + 5, yPos + 20);
    doc.text(`${COMPANY_INFO.city}, ${COMPANY_INFO.country}`, margin + 5, yPos + 26);
    doc.text(`Org.Nr: ${COMPANY_INFO.orgNumber}`, margin + 5, yPos + 32);
    doc.text(`VAT: ${COMPANY_INFO.vat}`, margin + 5, yPos + 38);
    doc.text(`Tel: ${COMPANY_INFO.phone}`, margin + 5, yPos + 44);

    // Buyer Box
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin + colWidth + 10, yPos, colWidth, 50, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('BUYER', margin + colWidth + 15, yPos + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text(data.customer.companyName, margin + colWidth + 15, yPos + 14);
    doc.text(data.customer.address, margin + colWidth + 15, yPos + 20);
    doc.text(`${data.customer.postcode} ${data.customer.city}`, margin + colWidth + 15, yPos + 26);
    doc.text(`VAT: ${data.customer.vatNumber || 'N/A'}`, margin + colWidth + 15, yPos + 32);
    doc.text(`Type: ${data.customer.businessType}`, margin + colWidth + 15, yPos + 38);
    doc.text(`Contact: ${data.customer.contactName}`, margin + colWidth + 15, yPos + 44);

    return yPos + 60;
}

function addWholesaleScope(doc: jsPDF, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('2. SCOPE OF AGREEMENT', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const scopeText = [
        '2.1 This Agreement establishes a wholesale trading relationship between the Supplier and the Buyer.',
        '2.2 The Supplier agrees to supply products from its wholesale catalogue at agreed wholesale prices.',
        '2.3 The Buyer agrees to purchase products for commercial resale or business use only.',
        '2.4 Products covered: All items listed in the Supplier\'s wholesale product catalogue.',
        '2.5 The Buyer confirms they are a registered business entity with valid VAT registration.',
    ];

    scopeText.forEach((text) => {
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    return yPos + 5;
}

function addPricingTerms(doc: jsPDF, data: WholesaleAgreementData, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('3. PRICING AND DISCOUNTS', margin, yPos);

    yPos += 8;

    // Pricing Tiers Table
    const pricingData = [
        ['Tier', 'Minimum Quantity', 'Discount', 'Description'],
        ['Bulk', '10+ units', '10%', 'Standard wholesale discount'],
        ['Wholesale', '50+ units', '16%', 'Volume discount for larger orders'],
        ['Commercial', '100+ units', '20%', 'Maximum discount for bulk purchases'],
    ];

    autoTable(doc, {
        startY: yPos,
        head: [pricingData[0]],
        body: pricingData.slice(1),
        theme: 'striped',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: COLORS.text,
        },
        alternateRowStyles: {
            fillColor: COLORS.lightGray,
        },
        margin: { left: margin, right: margin },
        tableWidth: pageWidth - 2 * margin,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const pricingNotes = [
        '3.4 Prices are exclusive of VAT (25% moms) unless otherwise stated.',
        '3.5 Prices may be updated with 14 days written notice to the Buyer.',
        '3.6 Special pricing for specific products may be agreed separately.',
    ];

    pricingNotes.forEach((note) => {
        doc.text(note, margin, yPos);
        yPos += 5;
    });

    return yPos + 5;
}

function addOrderingTerms(doc: jsPDF, margin: number, pageWidth: number): number {
    let yPos = margin + 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('4. ORDERING', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const orderingTerms = [
        '4.1 Minimum Order Quantity (MOQ): 6 units per product (unless exempt).',
        '4.2 Orders can be placed via: Website (restaurantpack.se), Email, or Phone.',
        '4.3 Order confirmation will be sent within 24 hours of receipt.',
        '4.4 The Supplier reserves the right to decline orders if stock is unavailable.',
        '4.5 Large orders (>100,000 SEK) may require advance payment or credit approval.',
    ];

    orderingTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    return yPos + 5;
}

function addDeliveryTerms(doc: jsPDF, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('5. DELIVERY', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const deliveryTerms = [
        '5.1 Delivery is available throughout Sweden and select European destinations.',
        '5.2 Free delivery for orders over 5,000 SEK within Stockholm metropolitan area.',
        '5.3 Standard delivery time: 2-5 business days (subject to stock availability).',
        '5.4 Perishable items (fresh produce, sweets) have restricted delivery zones.',
        '5.5 Risk of loss passes to Buyer upon delivery confirmation.',
        '5.6 The Buyer must inspect goods within 48 hours and report any discrepancies.',
    ];

    deliveryTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    return yPos + 5;
}

function addPaymentAndCredit(doc: jsPDF, data: WholesaleAgreementData, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('6. PAYMENT TERMS', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const paymentTerms = [
        '6.1 Payment Methods: Bank Transfer, Credit Card (Visa/Mastercard), Invoice (if approved).',
        '6.2 Standard payment: Due upon delivery unless credit terms are agreed.',
        data.includeCredit
            ? `6.3 Credit Terms: Net ${data.paymentDays || 28} days with credit limit of ${(data.creditLimit || 50000).toLocaleString()} SEK.`
            : '6.3 Credit Terms: Subject to separate Credit Agreement and approval.',
        '6.4 Late payment interest: 8% per annum above Swedish reference rate.',
        '6.5 Reminder fee: 60 SEK per payment reminder.',
    ];

    paymentTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    // Bank Details Box
    yPos += 5;
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'F');

    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Bank Details:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${BANK_INFO.bank} | IBAN: ${BANK_INFO.iban} | BIC: ${BANK_INFO.bic}`, margin + 35, yPos);

    return yPos + 20;
}

function addLegalTerms(doc: jsPDF, margin: number, pageWidth: number): number {
    let yPos = margin + 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('7. WARRANTIES AND LIABILITY', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const warrantyTerms = [
        '7.1 The Supplier warrants that products conform to descriptions and are fit for purpose.',
        '7.2 Claims for defective products must be made within 7 days of delivery.',
        '7.3 Liability is limited to replacement of goods or refund of purchase price.',
        '7.4 Neither party is liable for indirect, consequential, or special damages.',
    ];

    warrantyTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    yPos += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('8. TERM AND TERMINATION', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const terminationTerms = [
        '8.1 This Agreement is valid for 12 months and auto-renews unless terminated.',
        '8.2 Either party may terminate with 30 days written notice.',
        '8.3 Immediate termination is permitted for material breach.',
        '8.4 Outstanding orders and payments remain due upon termination.',
    ];

    terminationTerms.forEach((term) => {
        const lines = doc.splitTextToSize(term, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 2;
    });

    yPos += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('9. GOVERNING LAW', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text('9.1 This Agreement is governed by the laws of Sweden.', margin, yPos);
    yPos += 5;
    doc.text('9.2 Disputes shall be resolved by Swedish courts with jurisdiction in Stockholm.', margin, yPos);

    return yPos + 15;
}

function addWholesaleSignatures(doc: jsPDF, data: WholesaleAgreementData, yPos: number, margin: number, pageWidth: number, expiryDate: Date): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('10. AGREEMENT ACCEPTANCE', margin, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const acceptanceText = `By signing below, both parties agree to be bound by the terms and conditions of this Wholesale Partnership Agreement. This agreement is effective from ${format(data.effectiveDate, 'yyyy-MM-dd')} until ${format(expiryDate, 'yyyy-MM-dd')}, subject to auto-renewal.`;
    const lines = doc.splitTextToSize(acceptanceText, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);

    yPos += lines.length * 5 + 10;
    const colWidth = (pageWidth - 2 * margin) / 2 - 10;

    // Supplier Signature
    doc.setDrawColor(...COLORS.text);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos, colWidth, 45);

    doc.setFont('helvetica', 'bold');
    doc.text('For SUPPLIER:', margin + 5, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY_INFO.legalName, margin + 5, yPos + 13);

    doc.text('Name: _________________________', margin + 5, yPos + 22);
    doc.text('Title: _________________________', margin + 5, yPos + 29);
    doc.text('Signature: _____________________', margin + 5, yPos + 36);

    // Buyer Signature
    doc.rect(margin + colWidth + 20, yPos, colWidth, 45);

    doc.setFont('helvetica', 'bold');
    doc.text('For BUYER:', margin + colWidth + 25, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(data.customer.companyName, margin + colWidth + 25, yPos + 13);

    doc.text('Name: _________________________', margin + colWidth + 25, yPos + 22);
    doc.text('Title: _________________________', margin + colWidth + 25, yPos + 29);
    doc.text('Signature: _____________________', margin + colWidth + 25, yPos + 36);

    return yPos + 55;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function addPageFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, currentPage: number, totalPages: number) {
    const footerY = pageHeight - 10;

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');

    // Company info
    doc.text(`${COMPANY_INFO.name} | ${COMPANY_INFO.website} | ${COMPANY_INFO.email}`, margin, footerY);

    // Page number
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
}

/**
 * Generate unique Agreement ID
 */
export function generateAgreementId(prefix: 'CA' | 'WA'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

/**
 * Download Credit Agreement PDF
 */
export async function downloadCreditAgreementPDF(data: CreditAgreementData, filename?: string) {
    const blob = await generateCreditAgreementPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `credit-agreement-${data.agreementId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download Wholesale Agreement PDF
 */
export async function downloadWholesaleAgreementPDF(data: WholesaleAgreementData, filename?: string) {
    const blob = await generateWholesaleAgreementPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `wholesale-agreement-${data.agreementId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
