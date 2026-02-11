import jsPDF, { GState } from 'jspdf';
import { format } from 'date-fns';
import { brandProfile } from '@/config/brand-profile';

/**
 * Modern Product Catalogue PDF Generator
 * Professional B2B design: Strict Red & White Theme
 *
 * Design System:
 * - Primary: Brand Red #A80E13 (RGB: 168, 14, 19)
 * - Secondary: Dark Gray #111827 (RGB: 17, 24, 39)
 * - Background: Pure White #FFFFFF
 */

// Theme Colors (Strict Red & White)
const THEME = {
    primary: { r: 168, g: 14, b: 19 },      // Brand Red #A80E13
    primaryLight: { r: 220, g: 38, b: 38 }, // Lighter Red
    secondary: { r: 17, g: 24, b: 39 },     // Dark Gray (Text)
    text: { r: 17, g: 24, b: 39 },          // Main Text (Black/Gray)
    textMuted: { r: 107, g: 114, b: 128 },  // Muted Text (Gray)
    white: { r: 255, g: 255, b: 255 },
    background: { r: 255, g: 255, b: 255 }, // Pure White
    border: { r: 229, g: 231, b: 235 },     // Light Gray Border
    lightBg: { r: 249, g: 250, b: 251 }     // Very light gray for clear separation
};

// Company info from brand profile
const COMPANY = {
    name: brandProfile.name,
    tagline: "Professional Restaurant Supply",
    address: brandProfile.address.formatted,
    phone: brandProfile.contact.phone,
    email: brandProfile.contact.email,
    website: brandProfile.website.domain,
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

// Helper to set colors
const setColor = (doc: jsPDF, color: { r: number; g: number; b: number }, type: 'fill' | 'text' | 'draw') => {
    if (type === 'fill') doc.setFillColor(color.r, color.g, color.b);
    else if (type === 'text') doc.setTextColor(color.r, color.g, color.b);
    else doc.setDrawColor(color.r, color.g, color.b);
};

// Helper: Add Red Bar
const addRedBar = (doc: jsPDF, x: number, y: number, w: number, h: number) => {
    setColor(doc, THEME.primary, 'fill');
    doc.rect(x, y, w, h, 'F');
};

/**
 * Generate Product Catalogue PDF with Modern Red/White Design
 */
export async function generateCataloguePDF(
    products: CatalogueProduct[],
    options: CatalogueOptions = {}
): Promise<Blob> {
    const {
        title = 'Product Catalogue',
        subtitle = `${format(new Date(), 'yyyy')} Edition`,
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

    // Preload images
    const imageCache = await preloadImages(products);

    let currentPage = 1;

    // Page 1: Cover
    addCoverPage(doc, pageWidth, pageHeight, margin, title, subtitle, categories.length, products.length, language);
    currentPage++;

    // Page 2: Table of Contents
    doc.addPage();
    addTableOfContents(doc, categories, productsByCategory, pageWidth, pageHeight, margin, currentPage, language);
    currentPage++;

    // Category Pages with Product Cards
    for (const category of categories) {
        doc.addPage();
        currentPage = await addCategoryPage(
            doc,
            category,
            productsByCategory[category],
            imageCache,
            pageWidth,
            pageHeight,
            margin,
            currentPage,
            includePrice,
            language
        );
    }

    // Back Cover: Order Info
    doc.addPage();
    addBackCover(doc, pageWidth, pageHeight, margin, language);

    return doc.output('blob');
}

/**
 * Image data w/ format info
 */
interface ImageData {
    base64: string;
    format: 'JPEG' | 'PNG' | 'GIF' | 'WEBP';
}

async function preloadImages(products: CatalogueProduct[]): Promise<Map<number, ImageData | null>> {
    const cache = new Map<number, ImageData | null>();
    // Logic kept simple for server/client compatibility
    for (const product of products) {
        cache.set(product.id, null);
    }
    return cache;
}

/**
 * Cover Page - Modern Bold Red & White
 */
function addCoverPage(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    title: string,
    subtitle: string,
    categoryCount: number,
    productCount: number,
    language: string
) {
    // 1. Massive Primary Red Background Header
    const headerHeight = pageHeight * 0.45;
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // 2. Logo / Brand Name (Large, White, Bold)
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.text("ANMOL", margin, 45); // Left aligned
    doc.setFont('helvetica', 'normal'); // Thinner weight variation
    doc.text("WHOLESALE", margin, 60);

    // Tagline
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(COMPANY.tagline, margin, 75);

    // 3. Catalogue Title (White on Red)
    // Decorative line
    setColor(doc, THEME.white, 'draw');
    doc.setLineWidth(1);
    doc.line(margin, 100, 80, 100);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin, 115);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const editionText = subtitle.toUpperCase();
    doc.text(editionText, margin, 125);

    // 4. White Body Section
    // Stats in a clean "floating" box that overlaps Red and White sections
    const statsY = headerHeight - 20;
    const boxW = 140;
    const boxH = 40;
    const statsMargin = margin;

    setColor(doc, THEME.white, 'fill');
    // Drop shadow simulation (gray rect behind)
    setColor(doc, { r: 0, g: 0, b: 0 }, 'fill'); // Black
    doc.setGState(new GState({ opacity: 0.1 })); // Transparent
    doc.rect(statsMargin + 2, statsY + 2, boxW, boxH, 'F');
    doc.setGState(new GState({ opacity: 1 })); // Reset

    setColor(doc, THEME.white, 'fill');
    doc.rect(statsMargin, statsY, boxW, boxH, 'F'); // Main white box

    // Stat 1: Products
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(productCount.toString(), statsMargin + 15, statsY + 25);

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? "PREMIUM PRODUKTER" : "PREMIUM PRODUCTS", statsMargin + 15, statsY + 34);

    // Vertical Divider
    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.5);
    doc.line(statsMargin + 70, statsY + 10, statsMargin + 70, statsY + 30);

    // Stat 2: Categories
    setColor(doc, THEME.primary, 'text'); // Keep using primary red
    doc.setFontSize(32);
    doc.text(categoryCount.toString(), statsMargin + 85, statsY + 25);

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? "KATEGORIER" : "CATEGORIES", statsMargin + 85, statsY + 34);

    // 5. Bottom Info (Website & Contact)
    // Red Accent Line at bottom
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    // Website URL (Large, center bottom)
    const bottomTextY = pageHeight - 50;

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.website, pageWidth / 2, bottomTextY, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${COMPANY.phone}  |  ${COMPANY.email}`, pageWidth / 2, bottomTextY + 8, { align: 'center' });

    // Address
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(COMPANY.address, pageWidth / 2, bottomTextY + 16, { align: 'center' });

    // Footer text
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("WWW.RESTAURANTPACK.SE", pageWidth / 2, pageHeight - 6, { align: 'center' });
}

/**
 * Table of Contents - Clean & Corporate
 */
function addTableOfContents(
    doc: jsPDF,
    categories: string[],
    productsByCategory: Record<string, CatalogueProduct[]>,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    pageNum: number,
    language: string
) {
    addPageHeader(doc, pageWidth, margin, language === 'sv' ? 'INNEHÅLLSFÖRTECKNING' : 'TABLE OF CONTENTS');

    let yPos = 50;
    let startPage = pageNum + 1;

    for (const category of categories) {
        const productCount = productsByCategory[category].length;

        // Zebra striping - Very subtle
        if (categories.indexOf(category) % 2 === 0) {
            setColor(doc, THEME.lightBg, 'fill');
            doc.rect(margin, yPos - 6, pageWidth - 2 * margin, 12, 'F');
        }

        // Category Name
        setColor(doc, THEME.text, 'text');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(category.toUpperCase(), margin + 5, yPos);

        // Dot leader
        const nameWidth = doc.getTextWidth(category.toUpperCase());
        const startDot = margin + 5 + nameWidth + 5;
        const endDot = pageWidth - margin - 20;

        setColor(doc, THEME.border, 'draw');
        doc.setLineDashPattern([0.5, 2], 0);
        doc.line(startDot, yPos, endDot, yPos);
        doc.setLineDashPattern([], 0);

        // Page Number (Red Box)
        const pageStr = startPage.toString();
        // setColor(doc, THEME.primary, 'fill');
        // doc.roundedRect(pageWidth - margin - 15, yPos - 4, 12, 8, 1, 1, 'F');

        setColor(doc, THEME.primary, 'text'); // Red text instead of box for cleaner look
        doc.setFont('helvetica', 'bold');
        doc.text(pageStr, pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 12;
        startPage++;
    }

    addPageFooter(doc, pageWidth, pageHeight, margin, pageNum);
}

/**
 * Category Page
 */
async function addCategoryPage(
    doc: jsPDF,
    category: string,
    products: CatalogueProduct[],
    imageCache: Map<number, ImageData | null>,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    pageNum: number,
    includePrice: boolean,
    language: string
): Promise<number> {
    // Header
    setColor(doc, THEME.white, 'fill');
    doc.rect(0, 0, pageWidth, 40, 'F'); // Clear header area

    // Red accent block
    setColor(doc, THEME.primary, 'fill');
    doc.rect(margin, 20, 6, 12, 'F');

    // Title
    setColor(doc, THEME.text, 'text');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(category.toUpperCase(), margin + 12, 30);

    // Products Grid
    // 2 Columns
    const cardWidth = (pageWidth - 2 * margin - 10) / 2;
    const cardHeight = 45; // Compact design
    const gap = 10;

    let yPos = 50;
    let col = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (yPos + cardHeight > pageHeight - 20) {
            addPageFooter(doc, pageWidth, pageHeight, margin, pageNum);
            doc.addPage();
            pageNum++;
            yPos = 25; // Header space on new page

            // Small continuation header
            setColor(doc, THEME.textMuted, 'text');
            doc.setFontSize(10);
            doc.text(`${category} / ...`, margin, 15);
        }

        drawProductCard(doc, product, imageCache, margin + col * (cardWidth + gap), yPos, cardWidth, cardHeight, includePrice, language);

        col++;
        if (col >= 2) {
            col = 0;
            yPos += cardHeight + gap;
        }
    }

    addPageFooter(doc, pageWidth, pageHeight, margin, pageNum);
    return pageNum;
}

/**
 * Draw Product Card - Modern Red/White
 */
function drawProductCard(
    doc: jsPDF,
    product: CatalogueProduct,
    imageCache: Map<number, ImageData | null>,
    x: number,
    y: number,
    w: number,
    h: number,
    includePrice: boolean,
    language: string
) {
    const contentX = x + 5;
    const contentW = w - 10;
    const contentY = y + 5;

    // Card border (very subtle)
    // setColor(doc, THEME.border, 'draw');
    // doc.setLineWidth(0.2);
    // doc.rect(x, y, w, h, 'S');

    // Instead of border, maybe just a left border for the whole item?
    // Let's do a Red vertical line for visual anchor
    setColor(doc, THEME.primary, 'draw');
    doc.setLineWidth(0.5);
    doc.line(x, y + 5, x, y + h - 5);

    // Product Name (Bold, Dark)
    setColor(doc, THEME.text, 'text');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Truncate name
    const name = truncateText(doc, product.name, contentW - 5);
    doc.text(name, x + 5, y + 10);

    // SKU
    if (product.sku) {
        setColor(doc, THEME.textMuted, 'text');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`SKU: ${product.sku}`, x + 5, y + 16);
    }

    // Description (Optional, small)
    if (product.description) {
        const cleanDesc = product.description.replace(/<[^>]*>/g, '').substring(0, 60);
        const desc = truncateText(doc, cleanDesc, contentW);
        doc.text(desc, x + 5, y + 24);
    }

    // Price (Right Aligned, Red, Bold)
    if (includePrice && product.price) {
        setColor(doc, THEME.primary, 'text');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');

        const priceNum = parseFloat(product.price);
        const priceTxt = isNaN(priceNum) ? '-' : `${priceNum.toLocaleString('sv-SE')} kr`;

        // Bottom right alignment inside card
        doc.text(priceTxt, x + 5, y + h - 5);

        // Sale badge?
        if (product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice) {
            // Small red badge
            const priceWidth = doc.getTextWidth(priceTxt);
            const badgeX = x + 5 + priceWidth + 5;

            setColor(doc, THEME.primary, 'fill');
            doc.roundedRect(badgeX, y + h - 9, 12, 5, 1, 1, 'F');
            setColor(doc, THEME.white, 'text');
            doc.setFontSize(6);
            doc.text("SALE", badgeX + 1, y + h - 5.5);
        }
    }
}

function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
    if (!text) return '';
    if (doc.getTextWidth(text) <= maxWidth) return text;

    let truncated = text;
    while (doc.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
}

/**
 * Standard Header
 */
function addPageHeader(doc: jsPDF, pageWidth: number, margin: number, title: string) {
    // Top red line
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, 4, 'F');

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, 20);

    setColor(doc, THEME.textMuted, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(brandProfile.name, pageWidth - margin, 20, { align: 'right' });

    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.2);
    doc.line(margin, 25, pageWidth - margin, 25);
}

/**
 * Standard Footer
 */
function addPageFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, pageNum: number) {
    const footerY = pageHeight - 12;

    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    setColor(doc, THEME.textMuted, 'text');
    doc.setFontSize(8);
    doc.text(`${COMPANY.website} • ${COMPANY.phone}`, margin, footerY);

    setColor(doc, THEME.primary, 'text'); // Red page numbering
    doc.setFont('helvetica', 'bold');
    doc.text(pageNum.toString(), pageWidth - margin, footerY, { align: 'right' });
}

/**
 * Back Cover
 */
function addBackCover(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, language: string) {
    const midY = pageHeight / 2;

    // Red Bottom Half
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, midY, pageWidth, pageHeight / 2, 'F');

    // Title (Top Half)
    setColor(doc, THEME.text, 'text');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? "KONTAKTA OSS" : "CONTACT US", margin, 40);

    // Info
    setColor(doc, THEME.text, 'text');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    let y = 60;
    doc.text(`Web: ${COMPANY.website}`, margin, y); y += 10;
    doc.text(`Email: ${COMPANY.email}`, margin, y); y += 10;
    doc.text(`Phone: ${COMPANY.phone}`, margin, y); y += 10;
    doc.text(`Address: ${COMPANY.address}`, margin, y);

    // White Text on Red (Bottom Half)
    const bottomY = midY + 40;
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? "RESTAURANG GROSSIST" : "RESTAURANT WHOLESALE", margin, bottomY);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(language === 'sv' ? "Din Partner i Professionell Matlagning" : "Your Partner in Professional Cooking", margin, bottomY + 12);

    // QR Code placeholder aspect
    setColor(doc, THEME.white, 'draw');
    doc.rect(pageWidth - margin - 40, bottomY - 10, 40, 40, 'S');
    doc.setFontSize(8);
    doc.text("SCAN FOR WEB", pageWidth - margin - 20, bottomY + 15, { align: 'center' });
}

function groupByCategory(products: CatalogueProduct[]): Record<string, CatalogueProduct[]> {
    return products.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, CatalogueProduct[]>);
}

export async function downloadCataloguePDF(
    products: CatalogueProduct[],
    options: CatalogueOptions = {},
    filename?: string
) {
    const blob = await generateCataloguePDF(products, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `Anmol-Catalogue-${format(new Date(), 'yyyy-MM')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
