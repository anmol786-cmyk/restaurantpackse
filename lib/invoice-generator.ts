import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, addDays } from 'date-fns';
import type { Order } from '@/types/woocommerce';

/**
 * Invoice PDF Generator for Anmol Wholesale
 * 
 * Generates professional B2B invoices with:
 * - Company branding (Royal Heritage theme)
 * - VAT compliance
 * - Payment terms
 * - Bank details
 */

// Company Information
const COMPANY_INFO = {
    name: 'Anmol Wholesale',
    address: 'Fagerstagatan 13',
    city: '163 53 Spånga',
    country: 'Sweden',
    vat: 'SE559253806901',
    phone: '+46 76 917 84 56',
    email: 'info@restaurantpack.se',
    website: 'www.restaurantpack.se',
};

// Bank Details
const BANK_INFO = {
    bank: 'Swedbank',
    iban: 'SE## #### #### #### #### ####', // Replace with actual IBAN
    bic: 'SWEDSESS',
};

// Theme Colors (Anmol Red) as fixed-length tuples
const COLORS: Record<string, [number, number, number]> = {
    primary: [176, 17, 22], // Anmol Red #b01116
    accent: [234, 179, 8], // Gold #eab308
    text: [28, 25, 23], // Dark gray #1c1917
    lightGray: [243, 244, 246], // #f3f4f6
    white: [255, 255, 255],
};

interface InvoiceData {
    order: Order;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    paymentTerms: 'immediate' | 'net_28' | 'net_60';
}

/**
 * Generate Invoice PDF
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
    const { order, invoiceNumber, invoiceDate, dueDate, paymentTerms } = data;

    // Create PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Add Header
    addHeader(doc, pageWidth, margin);

    // Add Invoice Details
    let yPos = addInvoiceDetails(doc, invoiceNumber, invoiceDate, dueDate, margin);

    // Add Billing & Shipping Addresses
    yPos = addAddresses(doc, order, yPos, margin, pageWidth);

    // Add Line Items Table
    yPos = addLineItems(doc, order, yPos, margin, pageWidth);

    // Add Totals
    yPos = addTotals(doc, order, yPos, pageWidth, margin);

    // Add Payment Information
    yPos = addPaymentInfo(doc, paymentTerms, dueDate, yPos, margin, pageWidth);

    // Add Footer
    addFooter(doc, pageWidth, pageHeight, margin);

    // Return as Blob
    return doc.output('blob');
}

/**
 * Add Header with Company Branding
 */
function addHeader(doc: jsPDF, pageWidth: number, margin: number) {
    // Company Name (Large, Burgundy)
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name.toUpperCase(), margin, margin + 10);

    // Company Details (Small, Gray)
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY_INFO.address, margin, margin + 17);
    doc.text(`${COMPANY_INFO.city}, ${COMPANY_INFO.country}`, margin, margin + 22);
    doc.text(`VAT: ${COMPANY_INFO.vat}`, margin, margin + 27);
    doc.text(`Phone: ${COMPANY_INFO.phone}`, margin, margin + 32);
    doc.text(`Email: ${COMPANY_INFO.email}`, margin, margin + 37);

    // Horizontal line
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 42, pageWidth - margin, margin + 42);
}

/**
 * Add Invoice Number and Dates
 */
function addInvoiceDetails(
    doc: jsPDF,
    invoiceNumber: string,
    invoiceDate: Date,
    dueDate: Date,
    margin: number
): number {
    const yStart = margin + 50;

    // Invoice Title
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', margin, yStart);

    // Invoice Number
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNumber}`, margin, yStart + 8);
    doc.text(`Date: ${format(invoiceDate, 'yyyy-MM-dd')}`, margin, yStart + 14);
    doc.text(`Due Date: ${format(dueDate, 'yyyy-MM-dd')}`, margin, yStart + 20);

    return yStart + 30;
}

/**
 * Add Billing and Shipping Addresses
 */
function addAddresses(
    doc: jsPDF,
    order: Order,
    yPos: number,
    margin: number,
    pageWidth: number
): number {
    const colWidth = (pageWidth - 2 * margin) / 2;

    // Bill To
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('BILL TO:', margin, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    const billTo = [
        order.billing.company || `${order.billing.first_name} ${order.billing.last_name}`,
        order.billing.address_1,
        order.billing.address_2,
        `${order.billing.postcode} ${order.billing.city}`,
        order.billing.country,
        `Email: ${order.billing.email}`,
        `Phone: ${order.billing.phone}`,
    ].filter(Boolean);

    (billTo as string[]).forEach((line, index) => {
        doc.text(line, margin, yPos + 7 + index * 5);
    });

    // Ship To
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('SHIP TO:', margin + colWidth, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    const shipTo = [
        order.shipping.company || `${order.shipping.first_name} ${order.shipping.last_name}`,
        order.shipping.address_1,
        order.shipping.address_2,
        `${order.shipping.postcode} ${order.shipping.city}`,
        order.shipping.country,
    ].filter(Boolean);

    (shipTo as string[]).forEach((line, index) => {
        doc.text(line, margin + colWidth, yPos + 7 + index * 5);
    });

    return yPos + Math.max(billTo.length, shipTo.length) * 5 + 15;
}

/**
 * Add Line Items Table
 */
function addLineItems(
    doc: jsPDF,
    order: Order,
    yPos: number,
    margin: number,
    pageWidth: number
): number {
    const tableData = order.line_items.map((item) => {
        const quantity = item.quantity;
        const unitPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const vatRate = parseFloat(item.total_tax) / parseFloat(item.total);
        const lineTotal = parseFloat(item.total) + parseFloat(item.total_tax);

        return [
            item.sku || 'N/A',
            item.name,
            quantity.toString(),
            `${unitPrice.toFixed(2)} ${order.currency}`,
            `${(vatRate * 100).toFixed(0)}%`,
            `${lineTotal.toFixed(2)} ${order.currency}`,
        ];
    });

    autoTable(doc, {
        startY: yPos,
        head: [['SKU', 'Product', 'Qty', 'Unit Price', 'VAT', 'Total']],
        body: tableData,
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

    return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add Totals Section
 */
function addTotals(
    doc: jsPDF,
    order: Order,
    yPos: number,
    pageWidth: number,
    margin: number
): number {
    const rightAlign = pageWidth - margin;
    const labelX = rightAlign - 60;
    const valueX = rightAlign;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Subtotal
    doc.text('Subtotal:', labelX, yPos, { align: 'right' });
    doc.text(`${parseFloat(order.total).toFixed(2)} ${order.currency}`, valueX, yPos, {
        align: 'right',
    });

    // VAT
    yPos += 6;
    doc.text(`VAT (${order.total_tax ? '25' : '0'}%):`, labelX, yPos, { align: 'right' });
    doc.text(`${parseFloat(order.total_tax || '0').toFixed(2)} ${order.currency}`, valueX, yPos, {
        align: 'right',
    });

    // Shipping
    yPos += 6;
    doc.text('Shipping:', labelX, yPos, { align: 'right' });
    doc.text(`${parseFloat(order.shipping_total || '0').toFixed(2)} ${order.currency}`, valueX, yPos, {
        align: 'right',
    });

    // Line
    yPos += 3;
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.3);
    doc.line(labelX - 5, yPos, valueX, yPos);

    // Total
    yPos += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('TOTAL:', labelX, yPos, { align: 'right' });
    doc.text(`${parseFloat(order.total).toFixed(2)} ${order.currency}`, valueX, yPos, {
        align: 'right',
    });

    return yPos + 15;
}

/**
 * Add Payment Information
 */
function addPaymentInfo(
    doc: jsPDF,
    paymentTerms: string,
    dueDate: Date,
    yPos: number,
    margin: number,
    pageWidth: number
): number {
    // Payment Terms Box
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('PAYMENT INFORMATION', margin + 5, yPos + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const paymentTermsText = {
        immediate: 'Payment Due: Immediate',
        net_28: 'Payment Terms: Net 28 Days',
        net_60: 'Payment Terms: Net 60 Days',
    }[paymentTerms] || 'Payment Terms: As Agreed';

    doc.text(paymentTermsText, margin + 5, yPos + 14);
    doc.text(`Due Date: ${format(dueDate, 'yyyy-MM-dd')}`, margin + 5, yPos + 20);

    doc.setFont('helvetica', 'bold');
    doc.text('Bank Details:', margin + 5, yPos + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bank: ${BANK_INFO.bank}`, margin + 5, yPos + 33);
    doc.text(`IBAN: ${BANK_INFO.iban}`, margin + 70, yPos + 33);
    doc.text(`BIC: ${BANK_INFO.bic}`, margin + 140, yPos + 33);

    return yPos + 45;
}

/**
 * Generate Packing Slip PDF
 */
export async function generatePackingSlipPDF(order: Order, filename?: string): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Add Header
    addPackingSlipHeader(doc, pageWidth, margin);

    // Add Order Details
    let yPos = addOrderDetails(doc, order, margin);

    // Add Shipping Address
    yPos = addShippingAddress(doc, order, yPos, margin, pageWidth);

    // Add Line Items (Quantity focused)
    yPos = addPackingTable(doc, order, yPos, margin, pageWidth);

    // Add Footer
    addFooter(doc, pageWidth, pageHeight, margin);

    return doc.output('blob');
}

/**
 * Add Header for Packing Slip
 */
function addPackingSlipHeader(doc: jsPDF, pageWidth: number, margin: number) {
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKING SLIP', margin, margin + 10);

    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY_INFO.name, pageWidth - margin, margin + 7, { align: 'right' });
    doc.text(COMPANY_INFO.address, pageWidth - margin, margin + 12, { align: 'right' });
    doc.text(`${COMPANY_INFO.city}, ${COMPANY_INFO.country}`, pageWidth - margin, margin + 17, { align: 'right' });

    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
}

/**
 * Add Order Details to Packing Slip
 */
function addOrderDetails(doc: jsPDF, order: Order, margin: number): number {
    const yStart = margin + 35;
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order #: ${order.number || order.id}`, margin, yStart);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(order.date_created), 'yyyy-MM-dd')}`, margin, yStart + 6);
    return yStart + 15;
}

/**
 * Add Shipping address to Packing Slip
 */
function addShippingAddress(doc: jsPDF, order: Order, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('SHIP TO:', margin, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    const shipTo = [
        order.shipping.company || `${order.shipping.first_name} ${order.shipping.last_name}`,
        order.shipping.address_1,
        order.shipping.address_2,
        `${order.shipping.postcode} ${order.shipping.city}`,
        order.shipping.country,
        `Phone: ${order.shipping.phone || order.billing.phone}`,
    ].filter(Boolean);

    (shipTo as string[]).forEach((line, index) => {
        doc.text(line, margin, yPos + 7 + index * 5);
    });

    return yPos + shipTo.length * 5 + 15;
}

/**
 * Add Table focusing on Quantities and Product Names
 */
function addPackingTable(doc: jsPDF, order: Order, yPos: number, margin: number, pageWidth: number): number {
    const tableData = order.line_items.map((item) => [
        item.sku || 'N/A',
        item.name,
        item.quantity.toString(),
        '[  ]', // Checkbox for picker
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['SKU', 'Product Name', 'Qty', 'Packed']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: COLORS.white,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
        },
        margin: { left: margin, right: margin },
    });

    return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Quote Information Interface
 */
interface QuoteInfo {
    order: Order;
    quoteNumber: string;
    date: Date;
    validUntil: Date;
}

/**
 * Generate Quote PDF
 */
export async function generateQuotePDF(data: QuoteInfo): Promise<Blob> {
    const { order, quoteNumber, date, validUntil } = data;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Add Header
    addBrandedHeader(doc, pageWidth, margin, 'QUOTE');

    // Add Quote Details
    let yPos = addDetailSection(doc, 'Quote Details', [
        { label: 'Quote #:', value: quoteNumber },
        { label: 'Date:', value: format(date, 'yyyy-MM-dd') },
        { label: 'Valid Until:', value: format(validUntil, 'yyyy-MM-dd') },
    ], margin);

    // Add Customer Details
    yPos = addAddresses(doc, order, yPos, margin, pageWidth);

    // Add Items Table
    yPos = addLineItems(doc, order, yPos, margin, pageWidth);

    // Add Totals
    yPos = addTotals(doc, order, yPos, pageWidth, margin);

    // Add Notes and Terms
    yPos = addQuoteTerms(doc, yPos, margin, pageWidth);

    // Add Footer
    addFooter(doc, pageWidth, pageHeight, margin);

    return doc.output('blob');
}

/**
 * Enhanced Header with Title
 */
function addBrandedHeader(doc: jsPDF, pageWidth: number, margin: number, title: string) {
    addHeader(doc, pageWidth, margin);

    doc.setFontSize(22);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth - margin, margin + 10, { align: 'right' });
}

/**
 * Generic Detail Section Helper
 */
function addDetailSection(
    doc: jsPDF,
    title: string,
    details: { label: string; value: string }[],
    margin: number
): number {
    const yStart = margin + 50;
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);

    details.forEach((detail, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(detail.label, margin, yStart + (index * 6));
        doc.setFont('helvetica', 'normal');
        doc.text(detail.value, margin + 25, yStart + (index * 6));
    });

    return yStart + (details.length * 6) + 10;
}

/**
 * Add Quote Specific Terms
 */
function addQuoteTerms(doc: jsPDF, yPos: number, margin: number, pageWidth: number): number {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('TERMS AND CONDITIONS', margin, yPos);

    const terms = [
        '• Pricing is valid until the specified expiry date.',
        '• Delivery times are estimated and strictly subject to stock availability.',
        '• Payment must be confirmed before dispatch unless credit terms are approved.',
        '• Quotes are based on current volume; changes in quantity may affect unit pricing.',
    ];

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    terms.forEach((term, index) => {
        doc.text(term, margin, yPos + 7 + (index * 5));
    });

    return yPos + (terms.length * 5) + 15;
}

/**
 * Download Quote PDF
 */
export async function downloadQuotePDF(data: QuoteInfo, filename?: string) {
    const blob = await generateQuotePDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `quote-${data.quoteNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download Packing Slip
 */
export async function downloadPackingSlipPDF(order: Order, filename?: string) {
    const blob = await generatePackingSlipPDF(order);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `packing-slip-${order.number || order.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Add Footer
 */
function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number) {
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'italic');

    const footerText = 'Thank you for your business!';
    const footerY = pageHeight - margin;

    doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });

    // Page number
    doc.setFont('helvetica', 'normal');
    doc.text(`Page 1`, pageWidth - margin, footerY, { align: 'right' });
}

/**
 * Download Invoice PDF
 */
export async function downloadInvoicePDF(data: InvoiceData, filename?: string) {
    const blob = await generateInvoicePDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `invoice-${data.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Get Payment Terms Due Date
 */
export function getPaymentDueDate(orderDate: Date, paymentTerms: string): Date {
    switch (paymentTerms) {
        case 'net_28':
            return addDays(orderDate, 28);
        case 'net_60':
            return addDays(orderDate, 60);
        case 'immediate':
        default:
            return orderDate;
    }
}

/**
 * Quote Request Data Interface
 */
export interface QuoteRequestData {
    quoteId: string;
    date: Date;
    validUntil: Date;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        companyName: string;
        vatNumber?: string;
        businessType: string;
        deliveryAddress?: string;
    };
    items: Array<{
        name: string;
        sku?: string;
        quantity: number;
        unitPrice?: number;
    }>;
    totalEstimate?: number;
    message?: string;
    preferredDeliveryDate?: string;
}

/**
 * Generate Quote Request PDF
 * Creates a professional quote request document for B2B customers
 */
export async function generateQuoteRequestPDF(data: QuoteRequestData): Promise<Blob> {
    const { quoteId, date, validUntil, customer, items, totalEstimate, message, preferredDeliveryDate } = data;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Add Company Header
    addHeader(doc, pageWidth, margin);

    // Quote Request Title
    let yPos = margin + 50;
    doc.setFontSize(22);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTE REQUEST', pageWidth - margin, yPos, { align: 'right' });

    // Quote Details
    yPos += 15;
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text('Reference:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(quoteId, margin + 25, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(format(date, 'yyyy-MM-dd'), margin + 25, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Valid Until:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(format(validUntil, 'yyyy-MM-dd'), margin + 25, yPos);

    // Customer Information Section
    yPos += 15;
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 45, 'F');

    yPos += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('BUSINESS INFORMATION', margin + 5, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);

    const leftCol = margin + 5;
    const rightCol = margin + (pageWidth - 2 * margin) / 2;

    // Left column
    doc.setFont('helvetica', 'bold');
    doc.text('Company:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.companyName, leftCol + 22, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Contact:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${customer.firstName} ${customer.lastName}`, leftCol + 22, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.email, leftCol + 22, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.phone || 'N/A', leftCol + 22, yPos);

    // Right column (reset yPos to match left column start)
    let rightYPos = yPos - 18;
    doc.setFont('helvetica', 'bold');
    doc.text('VAT/Org Nr:', rightCol, rightYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.vatNumber || 'N/A', rightCol + 25, rightYPos);

    rightYPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Business Type:', rightCol, rightYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.businessType || 'N/A', rightCol + 25, rightYPos);

    if (preferredDeliveryDate) {
        rightYPos += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Pref. Delivery:', rightCol, rightYPos);
        doc.setFont('helvetica', 'normal');
        doc.text(preferredDeliveryDate, rightCol + 25, rightYPos);
    }

    if (customer.deliveryAddress) {
        rightYPos += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Delivery Addr:', rightCol, rightYPos);
        doc.setFont('helvetica', 'normal');
        const addrLines = doc.splitTextToSize(customer.deliveryAddress, 60);
        doc.text(addrLines, rightCol + 25, rightYPos);
    }

    // Requested Items Table
    yPos += 20;
    const tableData = items.map((item, index) => [
        (index + 1).toString(),
        item.sku || 'N/A',
        item.name,
        item.quantity.toString(),
        item.unitPrice ? `${item.unitPrice.toFixed(2)} SEK` : 'TBD',
        item.unitPrice ? `${(item.unitPrice * item.quantity).toFixed(2)} SEK` : 'TBD',
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['#', 'SKU', 'Product', 'Qty', 'Unit Price', 'Subtotal']],
        body: tableData,
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
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 25 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 30, halign: 'right' },
        },
        margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Totals Section
    const rightAlign = pageWidth - margin;
    const labelX = rightAlign - 50;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Items:', labelX, yPos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(items.length.toString(), rightAlign, yPos, { align: 'right' });

    yPos += 6;
    doc.text('Total Quantity:', labelX, yPos, { align: 'right' });
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    doc.text(totalQty.toString(), rightAlign, yPos, { align: 'right' });

    // Estimated Total
    yPos += 3;
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.3);
    doc.line(labelX - 5, yPos, rightAlign, yPos);

    yPos += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('ESTIMATED TOTAL:', labelX, yPos, { align: 'right' });
    doc.text(
        totalEstimate ? `${totalEstimate.toFixed(2)} SEK` : 'Price on Request',
        rightAlign,
        yPos,
        { align: 'right' }
    );

    // Customer Notes
    if (message) {
        yPos += 15;
        doc.setFillColor(255, 249, 230); // Light yellow
        doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
        doc.setDrawColor(234, 179, 8); // Gold border
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, margin, yPos + 25);

        yPos += 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(153, 102, 0); // Dark gold
        doc.text('Customer Notes:', margin + 5, yPos);

        yPos += 6;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.text);
        const noteLines = doc.splitTextToSize(message, pageWidth - 2 * margin - 10);
        doc.text(noteLines, margin + 5, yPos);
        yPos += noteLines.length * 4 + 10;
    }

    // Next Steps Section
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('WHAT HAPPENS NEXT?', margin, yPos);

    const steps = [
        '1. Our B2B team will review your request within 24 hours.',
        '2. You will receive a detailed quote with final pricing via email.',
        '3. Accept the quote to proceed with your wholesale order.',
    ];

    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    steps.forEach((step) => {
        doc.text(step, margin, yPos);
        yPos += 5;
    });

    // Footer
    addFooter(doc, pageWidth, pageHeight, margin);

    return doc.output('blob');
}

/**
 * Download Quote Request PDF
 */
export async function downloadQuoteRequestPDF(data: QuoteRequestData, filename?: string) {
    const blob = await generateQuoteRequestPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `quote-request-${data.quoteId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
