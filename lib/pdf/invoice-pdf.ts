/**
 * Invoice PDF Generation for Anmol Wholesale
 * Using jsPDF for server-compatible PDF generation
 *
 * Brand: Anmol Wholesale — restaurantpack.se
 * Design: Professional red/white/gold corporate theme
 *
 * An invoice is a legal document — distinct from a quote/order summary.
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

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface InvoicePDFData {
  invoiceNumber: string;      // e.g. "INV-2024-00123"
  orderId: string;            // WooCommerce order ID
  invoiceDate: string;        // ISO date string
  dueDate: string;            // ISO date string (payment terms)
  paymentTerms: string;       // e.g. "Net 28 days"
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    vatNumber?: string;
    billingAddress: string;
    deliveryAddress?: string;
  };
  items: Array<{
    product_name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;        // excl. VAT
    vatRate: number;          // 0.25 for 25%
    total: number;            // excl. VAT
  }>;
  subtotal: number;           // excl. VAT
  vatAmount: number;          // total VAT
  grandTotal: number;         // incl. VAT
  currency: string;           // "SEK"
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

// ─── Helper: set fill / text / draw colors from tuple ────────────────────────

function setFill(doc: jsPDF, rgb: [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setTxt(doc: jsPDF, rgb: [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}
function setDraw(doc: jsPDF, rgb: [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

// ─── Helper: format date from ISO string to Swedish locale ───────────────────

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

// ─── Core PDF generator ───────────────────────────────────────────────────────

export function generateInvoicePDF(data: InvoicePDFData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ── 1. HEADER BAND (red, ~45mm) ───────────────────────────────────────────
  const headerH = 45;
  setFill(doc, BRAND.red);
  doc.rect(0, 0, pageWidth, headerH, 'F');

  // Left: Company name + website
  setTxt(doc, BRAND.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ANMOL WHOLESALE', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(COMPANY.website, margin, 26);

  // Right: "INVOICE" large, then invoice number below
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('INVOICE', pageWidth - margin, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setTxt(doc, [255, 210, 210]);
  doc.text(data.invoiceNumber, pageWidth - margin, 29, { align: 'right' });

  // Tagline bottom-left of header
  doc.setFontSize(8);
  setTxt(doc, [255, 200, 200]);
  doc.text('From Our Restaurant Kitchen to Yours', margin, 39);

  // ── 2. GOLD ACCENT LINE ───────────────────────────────────────────────────
  setFill(doc, BRAND.gold);
  doc.rect(0, headerH, pageWidth, 2, 'F');

  // ── 3. INVOICE META ROW (light-gray band) ─────────────────────────────────
  const metaY = headerH + 2;
  const metaBandH = 14;
  setFill(doc, BRAND.lightGray);
  doc.rect(0, metaY, pageWidth, metaBandH, 'F');

  const metaColW = (pageWidth - 2 * margin) / 3;
  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', margin, metaY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.invoiceDate), margin + 24, metaY + 5.5);

  const col2X = margin + metaColW;
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', col2X, metaY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.dueDate), col2X + 20, metaY + 5.5);

  const col3X = margin + metaColW * 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Terms:', col3X, metaY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentTerms, col3X + 31, metaY + 5.5);

  // Second row: Order reference
  doc.setFont('helvetica', 'bold');
  doc.text('Order Ref:', margin, metaY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${data.orderId}`, margin + 20, metaY + 11);

  // ── 4. STATUS BADGE (top-right corner, below header) ─────────────────────
  if (data.status !== 'draft') {
    const badgeLabels: Record<string, string> = {
      paid:    'PAID',
      overdue: 'OVERDUE',
      sent:    'PENDING',
    };
    const badgeColors: Record<string, [number, number, number]> = {
      paid:    [22, 163, 74],   // green
      overdue: [176, 17, 22],   // red
      sent:    [161, 117, 5],   // gold-dark
    };

    const label      = badgeLabels[data.status] ?? data.status.toUpperCase();
    const badgeColor = badgeColors[data.status] ?? BRAND.midGray;
    const badgeW     = 28;
    const badgeH     = 8;
    const badgeX     = pageWidth - margin - badgeW;
    const badgeTop   = metaY + metaBandH + 3;

    setFill(doc, badgeColor);
    doc.roundedRect(badgeX, badgeTop, badgeW, badgeH, 2, 2, 'F');
    setTxt(doc, BRAND.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label, badgeX + badgeW / 2, badgeTop + 5.5, { align: 'center' });
  }

  // ── 5. TWO-COLUMN INFO SECTION (Billed To / From) ─────────────────────────
  let yPos = metaY + metaBandH + 6;
  if (data.status !== 'draft') {
    yPos += 12; // make room for badge
  }

  const colW  = (pageWidth - 2 * margin - 10) / 2;
  const colX1 = margin;
  const colX2 = margin + colW + 10;
  const infoPanelH = 50;

  // Panel backgrounds
  setFill(doc, BRAND.lightGray);
  doc.rect(colX1, yPos, colW, infoPanelH, 'F');
  doc.rect(colX2, yPos, colW, infoPanelH, 'F');

  // Section header helper
  const drawPanelHeader = (label: string, x: number, y: number, w: number) => {
    setFill(doc, BRAND.red);
    doc.rect(x, y, w, 8, 'F');
    setTxt(doc, BRAND.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(label, x + 3, y + 5.5);
  };

  // — Left panel: BILLED TO —
  drawPanelHeader('BILLED TO', colX1, yPos, colW);
  let billY = yPos + 12;

  setTxt(doc, BRAND.dark);
  if (data.customer.company) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(data.customer.company, colX1 + 3, billY);
    billY += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(data.customer.name, colX1 + 3, billY);
  billY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  if (data.customer.vatNumber) {
    setTxt(doc, BRAND.midGray);
    doc.text(`VAT: ${data.customer.vatNumber}`, colX1 + 3, billY);
    billY += 5;
  }

  setTxt(doc, BRAND.dark);
  const addrLines = doc.splitTextToSize(data.customer.billingAddress, colW - 6);
  doc.text(addrLines, colX1 + 3, billY);
  billY += addrLines.length * 4.5 + 1;

  setTxt(doc, BRAND.midGray);
  doc.text(data.customer.email, colX1 + 3, billY);
  billY += 4.5;
  if (data.customer.phone) {
    doc.text(data.customer.phone, colX1 + 3, billY);
  }

  // — Right panel: FROM —
  drawPanelHeader('FROM', colX2, yPos, colW);
  let fromY = yPos + 12;

  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(COMPANY.name, colX2 + 3, fromY);
  fromY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const fromAddrLines = doc.splitTextToSize(COMPANY.address, colW - 6);
  doc.text(fromAddrLines, colX2 + 3, fromY);
  fromY += fromAddrLines.length * 4.5 + 1;

  setTxt(doc, BRAND.midGray);
  doc.text(COMPANY.email, colX2 + 3, fromY);
  fromY += 4.5;
  doc.text(COMPANY.phone, colX2 + 3, fromY);
  fromY += 4.5;
  doc.text(COMPANY.website, colX2 + 3, fromY);

  // ── 6. ITEMS TABLE ────────────────────────────────────────────────────────
  yPos += infoPanelH + 10;

  // Section label above table
  setTxt(doc, BRAND.red);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('INVOICE ITEMS', margin, yPos);

  // Gold underline
  setFill(doc, BRAND.gold);
  doc.rect(margin, yPos + 2, 40, 1, 'F');

  yPos += 6;

  const tableData = data.items.map((item) => [
    item.product_name,
    item.sku || '—',
    item.quantity.toString(),
    `${item.unitPrice.toFixed(2)} ${data.currency}`,
    `${(item.vatRate * 100).toFixed(0)}%`,
    `${item.total.toFixed(2)} ${data.currency}`,
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Product', 'SKU', 'Qty', 'Unit Price (excl. VAT)', 'VAT %', 'Line Total (excl. VAT)']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: BRAND.red,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: BRAND.dark,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    alternateRowStyles: {
      fillColor: BRAND.lightGray,
    },
    columnStyles: {
      0: { cellWidth: 58 },  // Product
      1: { cellWidth: 24 },  // SKU
      2: { cellWidth: 12, halign: 'center' },  // Qty
      3: { cellWidth: 36, halign: 'right' },   // Unit Price
      4: { cellWidth: 14, halign: 'center' },  // VAT %
      5: { cellWidth: 36, halign: 'right' },   // Line Total
    },
    margin: { left: margin, right: margin },
    tableLineColor: [220, 218, 215],
    tableLineWidth: 0.1,
  });

  // ── 7. TOTALS BOX (right-aligned) ─────────────────────────────────────────
  const tableEndY  = doc.lastAutoTable.finalY;
  const totalsBoxW = 85;
  const totalsBoxX = pageWidth - margin - totalsBoxW;
  let totalsY      = tableEndY + 8;
  const totalsBoxH = 32;

  // Box background
  setFill(doc, BRAND.lightGray);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, totalsBoxH, 'F');

  // Light border
  setDraw(doc, [220, 218, 215]);
  doc.setLineWidth(0.2);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, totalsBoxH, 'S');

  const pad = 5;
  totalsY += 7;

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Subtotal (excl. VAT)', totalsBoxX + pad, totalsY);
  doc.text(
    `${data.subtotal.toFixed(2)} ${data.currency}`,
    totalsBoxX + totalsBoxW - pad,
    totalsY,
    { align: 'right' }
  );

  totalsY += 6;
  doc.text('VAT (25%)', totalsBoxX + pad, totalsY);
  doc.text(
    `${data.vatAmount.toFixed(2)} ${data.currency}`,
    totalsBoxX + totalsBoxW - pad,
    totalsY,
    { align: 'right' }
  );

  // Thick red divider
  totalsY += 3;
  setDraw(doc, BRAND.red);
  doc.setLineWidth(0.8);
  doc.line(totalsBoxX + pad, totalsY, totalsBoxX + totalsBoxW - pad, totalsY);

  // Grand total — large, red, bold
  totalsY += 8;
  setTxt(doc, BRAND.red);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL (incl. VAT)', totalsBoxX + pad, totalsY);
  doc.text(
    `${data.grandTotal.toFixed(2)} ${data.currency}`,
    totalsBoxX + totalsBoxW - pad,
    totalsY,
    { align: 'right' }
  );

  // ── 8. PAYMENT INSTRUCTIONS BOX (gold left-stripe panel) ──────────────────
  const payY      = tableEndY + 50;
  const payBoxH   = 34;
  const payBoxW   = pageWidth - 2 * margin;

  setFill(doc, BRAND.lightGray);
  doc.rect(margin, payY, payBoxW, payBoxH, 'F');

  // Gold left-stripe accent
  setFill(doc, BRAND.gold);
  doc.rect(margin, payY, 3, payBoxH, 'F');

  // Header
  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Payment Instructions', margin + 7, payY + 7);

  // Bank details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setTxt(doc, BRAND.midGray);

  const bankDetails = [
    'Bank: Swedbank',
    'Account: XXXX-XXXX',
    'IBAN: SE00 0000 0000 0000 0000 0000',
    'BIC/SWIFT: SWEDSESS',
  ];

  const halfW     = (payBoxW - 10) / 2;
  const col1PayX  = margin + 7;
  const col2PayX  = margin + 7 + halfW;

  bankDetails.forEach((line, i) => {
    const x = i < 2 ? col1PayX : col2PayX;
    const y = payY + 14 + (i % 2) * 5;
    doc.text(line, x, y);
  });

  // Reference line
  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(
    `Please reference invoice number ${data.invoiceNumber} in your payment`,
    margin + 7,
    payY + payBoxH - 5
  );

  // ── 9. NOTES SECTION ──────────────────────────────────────────────────────
  let sectionY = payY + payBoxH + 8;

  if (data.notes) {
    const notesBoxH = 16;
    setFill(doc, BRAND.lightGray);
    doc.rect(margin, sectionY, pageWidth - 2 * margin, notesBoxH, 'F');

    setTxt(doc, BRAND.midGray);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Notes', margin + 4, sectionY + 6);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - 2 * margin - 8);
    doc.text(noteLines, margin + 4, sectionY + 12);

    sectionY += notesBoxH + 6;
  }

  // ── 10. FOOTER ────────────────────────────────────────────────────────────
  const footerY = pageHeight - 20;

  // Red accent line
  setFill(doc, BRAND.red);
  doc.rect(0, footerY - 4, pageWidth, 1, 'F');

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const footerText = `${COMPANY.website}  |  ${COMPANY.email}  |  ${COMPANY.phone}  |  ${COMPANY.address}`;
  doc.text(footerText, pageWidth / 2, footerY + 2, { align: 'center' });

  // ── 11. LEGAL TEXT (very small, gray) ────────────────────────────────────
  doc.setFontSize(6.5);
  setTxt(doc, [180, 175, 170]);
  doc.text(
    'This invoice is legally binding. Payment is due by the date specified above. Late payments may incur interest charges per Swedish law.',
    pageWidth / 2,
    footerY + 8,
    { align: 'center' }
  );

  return doc;
}

// ─── Utility exports ─────────────────────────────────────────────────────────

/**
 * Build a standardised invoice number from a WooCommerce order ID.
 * Format: INV-{YEAR}-{orderId padded to 5 digits}
 */
export function buildInvoiceNumber(orderId: string | number): string {
  const year    = new Date().getFullYear();
  const padded  = String(orderId).padStart(5, '0');
  return `INV-${year}-${padded}`;
}

/**
 * Add termsDays days to an ISO date string and return the resulting ISO string.
 */
export function calculateDueDate(invoiceDate: string, termsDays: number): string {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + termsDays);
  return date.toISOString();
}

/**
 * Download the invoice PDF directly in the user's browser.
 */
export function downloadInvoicePDF(data: InvoicePDFData): void {
  const doc      = generateInvoicePDF(data);
  const filename = `Invoice-${data.invoiceNumber}.pdf`;
  doc.save(filename);
}

/**
 * Generate invoice PDF as a Blob (useful for API responses / email attachments).
 */
export function generateInvoicePDFBlob(data: InvoicePDFData): Blob {
  const doc = generateInvoicePDF(data);
  return doc.output('blob');
}
