/**
 * PDF Generation for Quick Orders
 * Using jsPDF for client-side PDF generation
 *
 * Brand: Anmol Wholesale — restaurantpack.se
 * Design: Professional red/white/gold corporate theme
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

// Brand colors
const BRAND = {
  red:       [176, 17, 22]  as [number, number, number], // Primary red
  gold:      [234, 179, 8]  as [number, number, number], // Gold accent
  dark:      [28, 25, 23]   as [number, number, number], // Dark text
  lightGray: [250, 250, 249] as [number, number, number], // Background panels
  midGray:   [87, 83, 78]   as [number, number, number], // Secondary text
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

export interface OrderPDFData {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    // Optional billing / delivery fields
    billingAddress?: string;
    deliveryAddress?: string;
    company?: string;
  };
  items: Array<{
    product_name: string;
    sku?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  subtotal?: number;
  vat?: number;
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

export function generateOrderPDF(data: OrderPDFData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ── 1. HEADER BAND ──────────────────────────────────────────────────────────
  const headerH = 42;
  setFill(doc, BRAND.red);
  doc.rect(0, 0, pageWidth, headerH, 'F');

  // Left: Company name
  setTxt(doc, BRAND.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ANMOL WHOLESALE', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(COMPANY.website, margin, 25);

  // Right: Order ID + Date
  const date = new Date().toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`ORDER #${data.orderId}`, pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(date, pageWidth - margin, 25, { align: 'right' });

  // Tagline (bottom-left of header)
  doc.setFontSize(8);
  setTxt(doc, [255, 200, 200]);
  doc.text('From Our Restaurant Kitchen to Yours', margin, 36);

  // ── 2. GOLD ACCENT LINE ──────────────────────────────────────────────────────
  setFill(doc, BRAND.gold);
  doc.rect(0, headerH, pageWidth, 2, 'F');

  // ── 3. CUSTOMER INFO — 2-column (Billing / Delivery) ─────────────────────────
  let yPos = headerH + 14;

  const colW  = (pageWidth - 2 * margin - 10) / 2;
  const colX1 = margin;
  const colX2 = margin + colW + 10;

  // Section header helper
  const drawSectionHeader = (label: string, x: number, y: number, w: number) => {
    setFill(doc, BRAND.red);
    doc.rect(x, y - 5, w, 8, 'F');
    setTxt(doc, BRAND.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x + 3, y);
  };

  // Panel backgrounds
  setFill(doc, BRAND.lightGray);
  doc.rect(colX1, yPos - 5, colW, 36, 'F');
  doc.rect(colX2, yPos - 5, colW, 36, 'F');

  // Billing column
  drawSectionHeader('BILLING INFORMATION', colX1, yPos, colW);
  yPos += 6;
  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  if (data.customer.company) {
    doc.text(data.customer.company, colX1 + 3, yPos);
    yPos += 5;
  }
  doc.setFont('helvetica', 'normal');
  doc.text(data.customer.name, colX1 + 3, yPos);       yPos += 5;
  doc.text(data.customer.email, colX1 + 3, yPos);      yPos += 5;
  if (data.customer.phone) {
    doc.text(data.customer.phone, colX1 + 3, yPos);    yPos += 5;
  }
  if (data.customer.billingAddress) {
    const lines = doc.splitTextToSize(data.customer.billingAddress, colW - 6);
    doc.text(lines, colX1 + 3, yPos);
  }

  // Delivery column
  let deliveryY = headerH + 14;
  drawSectionHeader('DELIVERY ADDRESS', colX2, deliveryY, colW);
  deliveryY += 6;
  setTxt(doc, BRAND.dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (data.customer.deliveryAddress) {
    const lines = doc.splitTextToSize(data.customer.deliveryAddress, colW - 6);
    doc.text(lines, colX2 + 3, deliveryY);
  } else {
    setTxt(doc, BRAND.midGray);
    doc.text('Same as billing address', colX2 + 3, deliveryY);
  }

  // ── 4. ORDER ITEMS TABLE ─────────────────────────────────────────────────────
  yPos = headerH + 60;

  // Section label above table
  setTxt(doc, BRAND.red);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ORDER ITEMS', margin, yPos);

  // Gold underline for the label
  setFill(doc, BRAND.gold);
  doc.rect(margin, yPos + 2, 35, 1, 'F');

  yPos += 6;

  // Prepare table data — include SKU column
  const tableData = data.items.map((item) => [
    item.product_name,
    item.sku || '—',
    item.quantity.toString(),
    `${item.price.toFixed(2)} ${data.currency}`,
    `${item.total.toFixed(2)} ${data.currency}`,
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Product', 'SKU', 'Qty', 'Unit Price', 'Total']],
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
      0: { cellWidth: 72 },
      1: { cellWidth: 28 },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
    },
    margin: { left: margin, right: margin },
    tableLineColor: [220, 218, 215],
    tableLineWidth: 0.1,
  });

  // ── 5. TOTALS BOX ────────────────────────────────────────────────────────────
  const tableEndY = doc.lastAutoTable.finalY;
  const totalsBoxW = 80;
  const totalsBoxX = pageWidth - margin - totalsBoxW;
  let totalsY = tableEndY + 8;

  // Calculate VAT if not provided
  const subtotal = data.subtotal ?? data.total / 1.25;
  const vat      = data.vat      ?? data.total - subtotal;

  // Box background
  setFill(doc, BRAND.lightGray);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, 30, 'F');

  // Light border
  setDraw(doc, [220, 218, 215]);
  doc.setLineWidth(0.2);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, 30, 'S');

  const pad = 5;
  totalsY += 7;

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Subtotal (excl. VAT)', totalsBoxX + pad, totalsY);
  doc.text(`${subtotal.toFixed(2)} ${data.currency}`, totalsBoxX + totalsBoxW - pad, totalsY, { align: 'right' });

  totalsY += 6;
  doc.text('VAT (25%)', totalsBoxX + pad, totalsY);
  doc.text(`${vat.toFixed(2)} ${data.currency}`, totalsBoxX + totalsBoxW - pad, totalsY, { align: 'right' });

  // Divider inside box
  totalsY += 3;
  setDraw(doc, BRAND.red);
  doc.setLineWidth(0.5);
  doc.line(totalsBoxX + pad, totalsY, totalsBoxX + totalsBoxW - pad, totalsY);

  // Grand total — larger, red
  totalsY += 7;
  setTxt(doc, BRAND.red);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL', totalsBoxX + pad, totalsY);
  doc.text(`${data.total.toFixed(2)} ${data.currency}`, totalsBoxX + totalsBoxW - pad, totalsY, { align: 'right' });

  // ── 6. QUOTE NOTE BOX ────────────────────────────────────────────────────────
  const noteY = doc.lastAutoTable.finalY + 50;
  const noteBoxH = 14;
  setFill(doc, BRAND.lightGray);
  doc.rect(margin, noteY, pageWidth - 2 * margin, noteBoxH, 'F');
  setDraw(doc, BRAND.gold);
  doc.setLineWidth(0.6);
  // Left gold accent stripe
  setFill(doc, BRAND.gold);
  doc.rect(margin, noteY, 3, noteBoxH, 'F');

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(
    'This is a quote request. Final pricing and availability will be confirmed by our team.',
    margin + 7,
    noteY + 6,
  );
  doc.text(
    'Payment is due upon invoice confirmation. All prices are in SEK unless stated otherwise.',
    margin + 7,
    noteY + 11,
  );

  // ── 7. FOOTER ────────────────────────────────────────────────────────────────
  const footerY = pageHeight - 18;

  // Thin red line
  setFill(doc, BRAND.red);
  doc.rect(0, footerY - 4, pageWidth, 1, 'F');

  setTxt(doc, BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const footerText = `Thank you for your order  |  ${COMPANY.website}  |  ${COMPANY.email}  |  ${COMPANY.phone}`;
  doc.text(footerText, pageWidth / 2, footerY + 2, { align: 'center' });

  doc.setFontSize(7.5);
  setTxt(doc, [180, 175, 170]);
  doc.text(COMPANY.address, pageWidth / 2, footerY + 8, { align: 'center' });

  return doc;
}

/**
 * Download PDF to user's device
 */
export function downloadOrderPDF(data: OrderPDFData) {
  const doc = generateOrderPDF(data);
  const filename = `Anmol_Wholesale_Order_${data.orderId}.pdf`;
  doc.save(filename);
}

/**
 * Generate PDF as Blob (useful for email attachments)
 */
export function generateOrderPDFBlob(data: OrderPDFData): Blob {
  const doc = generateOrderPDF(data);
  return doc.output('blob');
}
