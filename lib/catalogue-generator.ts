import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Modern Product Catalogue PDF Generator
 * Creates a beautiful, professional B2B product catalogue
 */

// Brand Colors (Anmol Red & Gold)
const COLORS = {
    primary: [176, 17, 22] as [number, number, number],      // Anmol Red #b01116
    primaryLight: [220, 38, 38] as [number, number, number], // Lighter red
    accent: [234, 179, 8] as [number, number, number],       // Gold #eab308
    accentDark: [161, 98, 7] as [number, number, number],    // Dark gold
    text: [28, 25, 23] as [number, number, number],          // Dark gray
    textLight: [107, 114, 128] as [number, number, number],  // Gray
    white: [255, 255, 255] as [number, number, number],
    lightGray: [249, 250, 251] as [number, number, number],  // Background
    border: [229, 231, 235] as [number, number, number],
};

// Company Information
const COMPANY = {
    name: 'Anmol Wholesale',
    tagline: 'From Our Restaurant Kitchen to Yours',
    address: 'Fagerstagatan 13, 163 53 Spånga, Stockholm',
    phone: '+46 76 917 84 56',
    email: 'info@restaurantpack.se',
    website: 'www.restaurantpack.se',
    vat: 'SE559253806901',
};

export interface CatalogueProduct {
    id: number;
    name: string;
    sku: string;
    price: string;
    currency: string;
    image: string;
    category: string;
    description: string;
    regularPrice?: string;
    salePrice?: string;
}

export interface CatalogueOptions {
    title?: string;
    subtitle?: string;
    includePrice?: boolean;
    language?: 'en' | 'sv';
    categoryFilter?: string[];
}

/**
 * Generate Product Catalogue PDF
 */
export async function generateCataloguePDF(
    products: CatalogueProduct[],
    options: CatalogueOptions = {}
): Promise<Blob> {
    const {
        title = 'Product Catalogue',
        subtitle = '2026 Edition',
        includePrice = true,
        language = 'sv',
    } = options;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Group products by category
    const productsByCategory = groupByCategory(products);
    const categories = Object.keys(productsByCategory).sort();

    let currentPage = 1;

    // Page 1: Cover
    addCoverPage(doc, pageWidth, pageHeight, title, subtitle, categories.length, products.length);
    currentPage++;

    // Page 2: Table of Contents
    doc.addPage();
    currentPage = addTableOfContents(doc, categories, productsByCategory, pageWidth, margin, currentPage);

    // Category Pages
    for (const category of categories) {
        doc.addPage();
        currentPage = addCategoryPage(
            doc,
            category,
            productsByCategory[category],
            pageWidth,
            pageHeight,
            margin,
            currentPage,
            includePrice,
            language
        );
    }

    // Back Cover: Contact & Order Info
    doc.addPage();
    addBackCover(doc, pageWidth, pageHeight, margin, language);

    return doc.output('blob');
}

/**
 * Cover Page - Modern Hero Design
 */
function addCoverPage(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    title: string,
    subtitle: string,
    categoryCount: number,
    productCount: number
) {
    // Full page primary color background
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative gold accent bar at top
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Decorative gold accent circle (bottom right)
    doc.setFillColor(245, 215, 120); // Light gold for subtle decoration
    doc.circle(pageWidth + 30, pageHeight - 60, 120, 'F');

    // Company Name - Large
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.name.toUpperCase(), pageWidth / 2, 70, { align: 'center' });

    // Tagline
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...COLORS.accent);
    doc.text(COMPANY.tagline, pageWidth / 2, 82, { align: 'center' });

    // Horizontal gold line
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.8);
    doc.line(40, 95, pageWidth - 40, 95);

    // Catalogue Title
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), pageWidth / 2, 130, { align: 'center' });

    // Subtitle / Edition
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.accent);
    doc.text(subtitle, pageWidth / 2, 142, { align: 'center' });

    // Stats boxes
    const boxY = 170;
    const boxWidth = 50;
    const boxHeight = 35;
    const gap = 20;
    const startX = (pageWidth - (boxWidth * 2 + gap)) / 2;

    // Products box
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(startX, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(productCount.toString(), startX + boxWidth / 2, boxY + 18, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('PRODUCTS', startX + boxWidth / 2, boxY + 28, { align: 'center' });

    // Categories box
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(startX + boxWidth + gap, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(categoryCount.toString(), startX + boxWidth + gap + boxWidth / 2, boxY + 18, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CATEGORIES', startX + boxWidth + gap + boxWidth / 2, boxY + 28, { align: 'center' });

    // Bottom section - Contact info
    const bottomY = pageHeight - 45;
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY.website, pageWidth / 2, bottomY, { align: 'center' });
    doc.text(`${COMPANY.phone}  |  ${COMPANY.email}`, pageWidth / 2, bottomY + 6, { align: 'center' });

    // Gold accent bar at bottom
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

    // Date
    doc.setTextColor(...COLORS.accent);
    doc.setFontSize(9);
    doc.text(format(new Date(), 'MMMM yyyy'), pageWidth / 2, pageHeight - 15, { align: 'center' });
}

/**
 * Table of Contents
 */
function addTableOfContents(
    doc: jsPDF,
    categories: string[],
    productsByCategory: Record<string, CatalogueProduct[]>,
    pageWidth: number,
    margin: number,
    startPage: number
): number {
    // Header
    addPageHeader(doc, pageWidth, margin, 'Contents');

    let yPos = 55;

    doc.setFontSize(11);
    let pageNum = startPage + 1; // Start after TOC

    for (const category of categories) {
        const productCount = productsByCategory[category].length;

        // Category name
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.text);
        doc.text(category, margin, yPos);

        // Product count
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textLight);
        doc.text(`(${productCount} products)`, margin + doc.getTextWidth(category) + 3, yPos);

        // Dotted line
        const textEnd = margin + doc.getTextWidth(category) + doc.getTextWidth(`(${productCount} products)`) + 6;
        const pageNumX = pageWidth - margin - 10;

        doc.setDrawColor(...COLORS.border);
        doc.setLineDashPattern([1, 2], 0);
        doc.line(textEnd, yPos - 1, pageNumX - 5, yPos - 1);
        doc.setLineDashPattern([], 0);

        // Page number
        doc.setTextColor(...COLORS.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(pageNum.toString(), pageNumX, yPos, { align: 'right' });

        yPos += 10;
        pageNum++;
    }

    // Footer note
    yPos += 15;
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text('All prices are in SEK and exclude VAT (25% moms).', margin + 5, yPos + 9);
    doc.text('Prices and availability are subject to change. Contact us for current stock.', margin + 5, yPos + 17);

    addPageFooter(doc, pageWidth, margin, startPage);
    return startPage;
}

/**
 * Category Page with Product Grid
 */
function addCategoryPage(
    doc: jsPDF,
    category: string,
    products: CatalogueProduct[],
    pageWidth: number,
    pageHeight: number,
    margin: number,
    pageNum: number,
    includePrice: boolean,
    language: string
): number {
    // Category header with colored bar
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(category.toUpperCase(), margin, 23);

    // Product count badge
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(pageWidth - margin - 30, 12, 28, 12, 2, 2, 'F');
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${products.length} items`, pageWidth - margin - 16, 20, { align: 'center' });

    // Products table
    const tableData = products.map((p, index) => {
        const row = [
            (index + 1).toString(),
            p.sku || '-',
            p.name,
        ];

        if (includePrice) {
            const price = p.price ? `${parseFloat(p.price).toFixed(0)} kr` : 'Contact us';
            row.push(price);
        }

        return row;
    });

    const headers = ['#', 'SKU', language === 'sv' ? 'Produkt' : 'Product'];
    if (includePrice) {
        headers.push(language === 'sv' ? 'Pris' : 'Price');
    }

    autoTable(doc, {
        startY: 45,
        head: [headers],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: 4,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: COLORS.text,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: COLORS.lightGray,
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 25, fontStyle: 'bold', font: 'courier' },
            2: { cellWidth: 'auto' },
            3: includePrice ? { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: COLORS.primary } : {},
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
            addPageFooter(doc, pageWidth, margin, pageNum);
        },
    });

    // Check if we need more pages for this category
    const finalY = (doc as any).lastAutoTable?.finalY || pageHeight - 30;

    if (finalY > pageHeight - 30) {
        pageNum++;
    }

    return pageNum;
}

/**
 * Back Cover - Contact & Order Information
 */
function addBackCover(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    language: string
) {
    // Header bar
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'BESTÄLL IDAG' : 'ORDER TODAY', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.accent);
    doc.text(language === 'sv' ? 'Snabb leverans i hela Sverige' : 'Fast delivery across Sweden', pageWidth / 2, 42, { align: 'center' });

    let yPos = 70;

    // Contact Section
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 55, 5, 5, 'F');

    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'Kontakta Oss' : 'Contact Us', margin + 10, yPos + 15);

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`📍  ${COMPANY.address}`, margin + 10, yPos + 27);
    doc.text(`📞  ${COMPANY.phone}`, margin + 10, yPos + 37);
    doc.text(`✉️  ${COMPANY.email}`, margin + 10, yPos + 47);

    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(`🌐  ${COMPANY.website}`, pageWidth - margin - 10, yPos + 27, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(`VAT: ${COMPANY.vat}`, pageWidth - margin - 10, yPos + 37, { align: 'right' });

    yPos += 70;

    // Why Choose Us
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'Varför Välja Oss?' : 'Why Choose Us?', margin, yPos);

    yPos += 12;
    const benefits = language === 'sv' ? [
        '✓  Grossistpriser med upp till 20% rabatt',
        '✓  Gratis frakt för beställningar över 5 000 kr',
        '✓  Faktura med 28 dagars kredit för företag',
        '✓  Egen tillverkning av Anmol Electric Tandoor',
        '✓  Snabb leverans i Stockholmsområdet',
        '✓  Över 1000+ nöjda restaurangkunder',
    ] : [
        '✓  Wholesale prices with up to 20% discount',
        '✓  Free shipping on orders over 5,000 SEK',
        '✓  Invoice payment with 28-day credit for businesses',
        '✓  Own manufacturing of Anmol Electric Tandoor',
        '✓  Fast delivery in Stockholm area',
        '✓  Over 1000+ satisfied restaurant customers',
    ];

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    benefits.forEach((benefit) => {
        doc.text(benefit, margin, yPos);
        yPos += 8;
    });

    yPos += 15;

    // How to Order Box
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 5, 5, 'F');

    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'HUR DU BESTÄLLER' : 'HOW TO ORDER', margin + 10, yPos + 12);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const orderSteps = language === 'sv' ? [
        '1. Besök restaurantpack.se och skapa ett företagskonto',
        '2. Lägg till produkter i varukorgen',
        '3. Välj leveransalternativ och betalningsmetod',
        '4. Få dina varor levererade inom 2-5 arbetsdagar',
    ] : [
        '1. Visit restaurantpack.se and create a business account',
        '2. Add products to your cart',
        '3. Select delivery option and payment method',
        '4. Get your goods delivered within 2-5 business days',
    ];

    orderSteps.forEach((step, i) => {
        doc.text(step, margin + 10, yPos + 22 + i * 6);
    });

    // Bottom footer
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.name, pageWidth / 2, pageHeight - 14, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.accent);
    doc.text(COMPANY.tagline, pageWidth / 2, pageHeight - 7, { align: 'center' });
}

/**
 * Page Header
 */
function addPageHeader(doc: jsPDF, pageWidth: number, margin: number, title: string) {
    // Accent line
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Title
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin, 25);

    // Company name (right)
    doc.setTextColor(...COLORS.textLight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY.name, pageWidth - margin, 25, { align: 'right' });

    // Separator line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(margin, 32, pageWidth - margin, 32);
}

/**
 * Page Footer
 */
function addPageFooter(doc: jsPDF, pageWidth: number, margin: number, pageNum: number) {
    const pageHeight = doc.internal.pageSize.getHeight();

    // Footer line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Website
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(COMPANY.website, margin, pageHeight - 8);

    // Page number
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
}

/**
 * Group products by category
 */
function groupByCategory(products: CatalogueProduct[]): Record<string, CatalogueProduct[]> {
    return products.reduce((acc, product) => {
        const category = product.category || 'Other Products';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, CatalogueProduct[]>);
}

/**
 * Download catalogue PDF (client-side)
 */
export async function downloadCataloguePDF(
    products: CatalogueProduct[],
    options: CatalogueOptions = {},
    filename?: string
) {
    const blob = await generateCataloguePDF(products, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `Anmol-Wholesale-Catalogue-${format(new Date(), 'yyyy-MM')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
