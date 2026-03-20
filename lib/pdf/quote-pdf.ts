/**
 * PDF Generation for Quote Request Confirmations
 * Using jsPDF for client-side PDF generation
 *
 * Brand: Anmol Wholesale — restaurantpack.se
 * Design: Professional red/white/gold corporate theme
 *
 * NOTE: This is a "Quote Request Confirmation" — NOT a binding quote.
 * It confirms receipt of the request; pricing is subject to team confirmation.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { brandProfile } from '@/config/brand-profile';

// Extend jsPDF type for autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Ensure autoTable is available
if (typeof jsPDF !== 'undefined' && !jsPDF.prototype.autoTable) {
  console.error('jsPDF autoTable plugin not loaded properly');
}

// Brand colors — identical to order-pdf.ts
const BRAND = {
  red:       [176, 17, 22]  as [number, number, number],
  gold:      [234, 179, 8]  as [number, number, number],
  dark:      [28, 25, 23]   as [number, number, number],
  lightGray: [250, 250, 249] as [number, number, number],
  midGray:   [87, 83, 78]   as [number, number, number],
  white:     [255, 255, 255] as [number, number, number],
};

// Company info from brand profile
const COMPANY = {
  name:    brandProfile.name,
  website: brandProfile.website.domain,
  email:   brandProfile.contact.email,
  phone:   brandProfile.contact.phone,
  address: brandProfile.address.formatted,
};

export interface QuotePDFData {
  quoteId: string;           // e.g. "QT-ABC123"
  quoteDate: string;         // ISO date
  validUntil: string;        // ISO date (30 days from quoteDate)
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    vatNumber?: string;
    businessType?: string;
    deliveryAddress?: string;
  };
  items: Array<{
    product_name: string;
    sku?: string;
    quantity: number;
    estimatedPrice?: number; // may not be known yet
    notes?: string;
  }>;
  message?: string;          // customer notes/special requests
  preferredDeliveryDate?: string;
  currency: string;
}

// ─── Helper: set fill/text/draw color from tuple ─────────────────────────────
function setFill(doc: jsPDF, rgb: [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setTxt(doc: jsPDF, rgb: [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}
function setDraw(doc: jsPDF, rgb: [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateQuotePDF(data: QuotePDFData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ── 1. HEADER BAND ──────────────────────────────────────────────────────────
  const headerH = 45;
  setFill(doc, BRAND.red);
  doc.rect(0, 0, pageWidth, headerH, 'F');

  // Left: Company name + website
  setTxt(doc, BRAND.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ANMOL WHOLESALE', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(COMPANY.website, margin, 25);

  // Right: "QUOTE REQUEST" large + quote ID below
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('QUOTE REQUEST', pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(data.quoteId, pageWidth - margin, 26, { align: 'right' });

  // Tagline at bottom of header
  doc.setFontSize(8);
  setTxt(doc, [255, 200, 200]);
  doc.text('From Our Restaurant Kitchen to Yours', margin, 38);

  // ── 2. GOLD ACCENT LINE ──────────────────────────────────────────────────────
  setFill(doc, BRAND.gold);
  doc.rect(0, headerH, pageWidth, 2, 'F');

  // ── 3. "AWAITING CONFIRMATION" NOTICE BAND ───────────────────────────────────
  const noticeBandY = headerH + 2;
  const noticeBandH = 12;
  setFill(doc, BRAND.gold);
  doc.rect(0, noticeBandY, pageWidth, noticeBandH, 'F');

  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    'Your quote request has been received. Our team will contact you within 24 hours with pricing confirmation.',
    pageWidth / 2,
    noticeBandY + 7.5,
    { align: 'center' },
  );

  // ── 4. META INFO ROW (3 columns, light-gray band) ───────────────────────────
  const metaBandY = noticeBandY + noticeBandH;
  const metaBandH = 14;
  setFill(doc, BRAND.lightGray);
  doc.rect(0, metaBandY, pageWidth, metaBandH, 'F');

  const metaColW = (pageWidth - 2 * margin) / 3;
  const metaY = metaBandY + 9;

  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  // Col 1: Quote #
  doc.text(`Quote #: ${data.quoteId}`, margin, metaY);

  // Col 2: Date (centered)
  doc.text(`Date: ${formatDate(data.quoteDate)}`, margin + metaColW + metaColW / 2, metaY, { align: 'center' });

  // Col 3: Valid Until (right-aligned)
  doc.text(`Valid Until: ${formatDate(data.validUntil)}`, pageWidth - margin, metaY, { align: 'right' });

  // ── 5. TWO-COLUMN INFO SECTION ───────────────────────────────────────────────
  let yPos = metaBandY + metaBandH + 8;

  const colW  = (pageWidth - 2 * margin - 10) / 2;
  const colX1 = margin;
  const colX2 = margin + colW + 10;

  // Helper: draw a section header (red band + white label)
  const drawSectionHeader = (label: string, x: number, y: number, w: number) => {
    setFill(doc, BRAND.red);
    doc.rect(x, y - 5, w, 8, 'F');
    setTxt(doc, BRAND.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x + 3, y);
  };

  // Panel backgrounds (estimate height; we'll clip-guard text)
  const panelH = 50;
  setFill(doc, BRAND.lightGray);
  doc.rect(colX1, yPos - 5, colW, panelH, 'F');
  doc.rect(colX2, yPos - 5, colW, panelH, 'F');

  // ── Left panel: REQUESTED BY ─────────────────────────────────────────────────
  drawSectionHeader('REQUESTED BY', colX1, yPos, colW);
  let leftY = yPos + 7;
  setTxt(doc, BRAND.dark);

  if (data.customer.company) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(data.customer.company, colX1 + 3, leftY);
    leftY += 5;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(data.customer.name, colX1 + 3, leftY);
  leftY += 5;

  if (data.customer.vatNumber) {
    setTxt(doc, BRAND.midGray);
    doc.text(`VAT/Org: ${data.customer.vatNumber}`, colX1 + 3, leftY);
    leftY += 5;
    setTxt(doc, BRAND.dark);
  }

  if (data.customer.businessType) {
    setTxt(doc, BRAND.midGray);
    doc.text(`Type: ${data.customer.businessType}`, colX1 + 3, leftY);
    leftY += 5;
    setTxt(doc, BRAND.dark);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(data.customer.email, colX1 + 3, leftY);
  leftY += 5;

  if (data.customer.phone) {
    doc.text(data.customer.phone, colX1 + 3, leftY);
    leftY += 5;
  }

  if (data.customer.deliveryAddress) {
    const addrLines = doc.splitTextToSize(data.customer.deliveryAddress, colW - 6);
    doc.text(addrLines, colX1 + 3, leftY);
  }

  // ── Right panel: CONTACT US ──────────────────────────────────────────────────
  drawSectionHeader('CONTACT US', colX2, yPos, colW);
  let rightY = yPos + 7;

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('For questions about this quote:', colX2 + 3, rightY);
  rightY += 6;

  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(COMPANY.name, colX2 + 3, rightY);
  rightY += 5;

  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY.phone, colX2 + 3, rightY);
  rightY += 5;
  doc.text(COMPANY.email, colX2 + 3, rightY);
  rightY += 5;

  setTxt(doc, BRAND.midGray);
  doc.setFontSize(8);
  doc.text('Mon-Fri  08:00 - 17:00', colX2 + 3, rightY);

  // ── 6. REQUESTED PRODUCTS TABLE ──────────────────────────────────────────────
  yPos = yPos + panelH + 6;

  // Section label
  setTxt(doc, BRAND.red);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('REQUESTED PRODUCTS', margin, yPos);

  setFill(doc, BRAND.gold);
  doc.rect(margin, yPos + 2, 52, 1, 'F');

  yPos += 6;

  const tableData = data.items.map((item) => [
    item.product_name,
    item.sku || '—',
    item.quantity.toString(),
    item.estimatedPrice != null
      ? `${item.estimatedPrice.toFixed(2)} ${data.currency}`
      : 'TBC',
    item.notes || '—',
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Product Name', 'SKU', 'Qty', 'Est. Unit Price', 'Notes']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: BRAND.red,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: BRAND.dark,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    alternateRowStyles: {
      fillColor: BRAND.lightGray,
    },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 25 },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 38, halign: 'right' },
      4: { cellWidth: 36 },
    },
    margin: { left: margin, right: margin },
    tableLineColor: [220, 218, 215],
    tableLineWidth: 0.1,
  });

  let afterTableY = doc.lastAutoTable.finalY + 8;

  // ── 7. SPECIAL REQUIREMENTS BOX (if message) ─────────────────────────────────
  if (data.message && data.message.trim().length > 0) {
    const msgLines = doc.splitTextToSize(data.message.trim(), pageWidth - 2 * margin - 14);
    const msgBoxH = 10 + msgLines.length * 5;

    setFill(doc, BRAND.lightGray);
    doc.rect(margin, afterTableY, pageWidth - 2 * margin, msgBoxH, 'F');

    // Gold left stripe
    setFill(doc, BRAND.gold);
    doc.rect(margin, afterTableY, 3, msgBoxH, 'F');

    setTxt(doc, BRAND.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Special Requirements / Notes:', margin + 7, afterTableY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setTxt(doc, BRAND.midGray);
    doc.text(msgLines, margin + 7, afterTableY + 12);

    afterTableY += msgBoxH + 6;
  }

  // ── 8. PREFERRED DELIVERY DATE ───────────────────────────────────────────────
  if (data.preferredDeliveryDate && data.preferredDeliveryDate.trim().length > 0) {
    setTxt(doc, BRAND.midGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      `Preferred Delivery Date:  ${data.preferredDeliveryDate}`,
      margin,
      afterTableY,
    );
    afterTableY += 8;
  }

  // ── 9. "WHAT HAPPENS NEXT" BOX ───────────────────────────────────────────────
  const stepsBoxH = 36;
  setFill(doc, BRAND.lightGray);
  doc.rect(margin, afterTableY, pageWidth - 2 * margin, stepsBoxH, 'F');

  // Gold left stripe
  setFill(doc, BRAND.gold);
  doc.rect(margin, afterTableY, 3, stepsBoxH, 'F');

  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('What Happens Next', margin + 7, afterTableY + 7);

  const stepsInnerX = margin + 7;
  let stepsY = afterTableY + 14;

  const steps = [
    { num: '1', title: 'Price Confirmation (within 24h)', desc: 'Our team reviews your request and confirms pricing.' },
    { num: '2', title: 'Quote Document Sent',             desc: 'A formal quote is emailed to you.' },
    { num: '3', title: 'Order Confirmation',              desc: 'You approve the quote and we process your order.' },
  ];

  doc.setFontSize(8.5);
  for (const step of steps) {
    // Step number circle (simulated with bold text)
    setTxt(doc, BRAND.red);
    doc.setFont('helvetica', 'bold');
    doc.text(`${step.num}.`, stepsInnerX, stepsY);

    setTxt(doc, BRAND.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(step.title, stepsInnerX + 7, stepsY);

    setTxt(doc, BRAND.midGray);
    doc.setFont('helvetica', 'normal');
    doc.text(step.desc, stepsInnerX + 7, stepsY + 4);

    stepsY += 10;
  }

  afterTableY += stepsBoxH + 6;

  // ── 10. FOOTER ───────────────────────────────────────────────────────────────
  const footerY = pageHeight - 18;

  // Thin red line
  setFill(doc, BRAND.red);
  doc.rect(0, footerY - 4, pageWidth, 1, 'F');

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const footerText = `${COMPANY.name}  |  ${COMPANY.website}  |  ${COMPANY.email}  |  ${COMPANY.phone}`;
  doc.text(footerText, pageWidth / 2, footerY + 2, { align: 'center' });

  doc.setFontSize(7.5);
  setTxt(doc, [180, 175, 170]);
  doc.text(COMPANY.address, pageWidth / 2, footerY + 8, { align: 'center' });

  // ── 11. DISCLAIMER ───────────────────────────────────────────────────────────
  const disclaimerY = footerY - 10;
  setTxt(doc, [180, 175, 170]);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.text(
    'This document confirms receipt of your quote request only. Prices and availability are subject to confirmation. This is not a binding agreement.',
    pageWidth / 2,
    disclaimerY,
    { align: 'center' },
  );

  return doc;
}

/**
 * Download PDF to user's device
 */
export function downloadQuotePDF(data: QuotePDFData): void {
  const doc = generateQuotePDF(data);
  const filename = `Anmol_Quote_Request_${data.quoteId}.pdf`;
  doc.save(filename);
}

/**
 * Generate PDF as Blob (useful for email attachments or previews)
 */
export function generateQuotePDFBlob(data: QuotePDFData): Blob {
  const doc = generateQuotePDF(data);
  return doc.output('blob');
}

/**
 * Calculate a valid-until date by adding `days` to a given ISO date string.
 * Defaults to 30 days.
 */
export function calculateValidUntil(quoteDate: string, days: number = 30): string {
  const d = new Date(quoteDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
