/**
 * PDF Generation for Quick Orders
 * Using jsPDF for client-side PDF generation
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export interface OrderPDFData {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  currency: string;
}

export function generateOrderPDF(data: OrderPDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Brand colors
  const primaryRed = [168, 14, 19]; // #A80E13
  const darkGray = [51, 51, 51];
  const lightGray = [128, 128, 128];

  // Header with logo area
  doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Anmol Wholesale', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('From Our Restaurant Kitchen to Yours', 15, 28);

  // Order ID
  doc.setFontSize(12);
  doc.text(`Order: ${data.orderId}`, pageWidth - 15, 20, { align: 'right' });

  // Date
  const date = new Date().toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFontSize(10);
  doc.text(date, pageWidth - 15, 28, { align: 'right' });

  // Reset text color
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  // Customer Information
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('Customer Information', 15, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  doc.text(`Name: ${data.customer.name}`, 15, yPos);
  yPos += 6;
  doc.text(`Email: ${data.customer.email}`, 15, yPos);
  yPos += 6;
  doc.text(`Phone: ${data.customer.phone}`, 15, yPos);

  // Order Items Table
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('Order Items', 15, yPos);

  yPos += 5;

  // Prepare table data
  const tableData = data.items.map((item) => [
    item.product_name,
    item.quantity.toString(),
    `${item.price.toFixed(2)} ${data.currency}`,
    `${item.total.toFixed(2)} ${data.currency}`,
  ]);

  // Add table
  doc.autoTable({
    startY: yPos,
    head: [['Product', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryRed,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
    margin: { left: 15, right: 15 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);

  const totalText = `Order Total: ${data.total.toFixed(2)} ${data.currency}`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - 15 - totalWidth, finalY);

  // Footer with contact info
  const footerY = doc.internal.pageSize.height - 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);

  doc.text('Anmol Wholesale', pageWidth / 2, footerY, { align: 'center' });
  doc.text(
    'Fagerstagatan 13, 163 53 Spånga, Sweden',
    pageWidth / 2,
    footerY + 5,
    { align: 'center' }
  );
  doc.text('Phone: +46 76 917 84 56 | Email: info@restaurantpack.se', pageWidth / 2, footerY + 10, {
    align: 'center',
  });

  // Note box
  doc.setDrawColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, footerY - 20, pageWidth - 30, 15);

  doc.setFontSize(8);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(
    'This is a quote request. Final pricing and availability will be confirmed by our team.',
    pageWidth / 2,
    footerY - 13,
    { align: 'center' }
  );

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
