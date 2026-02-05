import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { brandProfile } from '@/config/brand-profile';

/**
 * Modern Product Catalogue PDF Generator
 * Creates a beautiful, professional B2B product catalogue with images
 *
 * Design System:
 * - Primary: Anmol Red #b01116 (RGB: 176, 17, 22)
 * - Accent: Gold #eab308 (RGB: 234, 179, 8)
 * - Typography: Clean, professional hierarchy
 */

// Theme Colors (matching theme.config.ts Royal Heritage theme)
const THEME = {
    primary: { r: 176, g: 17, b: 22 },      // Anmol Red #b01116
    primaryDark: { r: 127, g: 29, b: 29 },  // Darker red #7f1d1d
    accent: { r: 234, g: 179, b: 8 },       // Gold #eab308
    accentDark: { r: 161, g: 98, b: 7 },    // Dark gold #a16207
    text: { r: 28, g: 25, b: 23 },          // Dark warm gray #1c1917
    textMuted: { r: 87, g: 83, b: 78 },     // Muted text #57534e
    white: { r: 255, g: 255, b: 255 },
    background: { r: 250, g: 250, b: 249 }, // Warm off-white #fafaf9
    border: { r: 231, g: 229, b: 228 },     // Border #e7e5e4
};

// Company info from brand profile
const COMPANY = {
    name: brandProfile.name,
    tagline: brandProfile.tagline,
    taglineFull: brandProfile.taglineFull,
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

/**
 * Generate Product Catalogue PDF with Modern Design
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
    addCoverPage(doc, pageWidth, pageHeight, title, subtitle, categories.length, products.length, language);
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

    // Back Cover: Contact & Order Info
    doc.addPage();
    addBackCover(doc, pageWidth, pageHeight, margin, language);

    return doc.output('blob');
}

/**
 * Image data with format info
 */
interface ImageData {
    base64: string;
    format: 'JPEG' | 'PNG' | 'GIF' | 'WEBP';
}

/**
 * Preload product images for embedding in PDF
 * Skip image loading for server-side PDF generation to avoid issues
 */
async function preloadImages(products: CatalogueProduct[]): Promise<Map<number, ImageData | null>> {
    const cache = new Map<number, ImageData | null>();

    // For server-side generation, we'll skip images to avoid encoding issues
    // Images from external URLs often fail in server context
    for (const product of products) {
        cache.set(product.id, null);
    }

    return cache;
}

/**
 * Cover Page - Premium Modern Design
 */
function addCoverPage(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    title: string,
    subtitle: string,
    categoryCount: number,
    productCount: number,
    language: string
) {
    // Full page primary background
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Top gold accent bar
    setColor(doc, THEME.accent, 'fill');
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Diagonal gold stripe decoration (top-right corner)
    setColor(doc, THEME.accent, 'fill');
    doc.triangle(pageWidth - 80, 0, pageWidth, 0, pageWidth, 80, 'F');

    // Company Logo Area (white circle background)
    setColor(doc, THEME.white, 'fill');
    doc.circle(pageWidth / 2, 55, 25, 'F');

    // Company Name
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.name.toUpperCase(), pageWidth / 2, 100, { align: 'center' });

    // Tagline
    setColor(doc, THEME.accent, 'text');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(COMPANY.tagline, pageWidth / 2, 112, { align: 'center' });

    // Decorative line
    setColor(doc, THEME.accent, 'draw');
    doc.setLineWidth(1);
    doc.line(60, 125, pageWidth - 60, 125);

    // Catalogue Title
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), pageWidth / 2, 150, { align: 'center' });

    // Subtitle
    setColor(doc, THEME.accent, 'text');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, pageWidth / 2, 162, { align: 'center' });

    // Stats Section
    const statsY = 185;
    const boxWidth = 55;
    const boxHeight = 40;
    const gap = 15;
    const startX = (pageWidth - (boxWidth * 2 + gap)) / 2;

    // Products stat box
    setColor(doc, THEME.accent, 'fill');
    doc.roundedRect(startX, statsY, boxWidth, boxHeight, 4, 4, 'F');
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(productCount.toString(), startX + boxWidth / 2, statsY + 22, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(language === 'sv' ? 'PRODUKTER' : 'PRODUCTS', startX + boxWidth / 2, statsY + 33, { align: 'center' });

    // Categories stat box
    setColor(doc, THEME.accent, 'fill');
    doc.roundedRect(startX + boxWidth + gap, statsY, boxWidth, boxHeight, 4, 4, 'F');
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(categoryCount.toString(), startX + boxWidth + gap + boxWidth / 2, statsY + 22, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(language === 'sv' ? 'KATEGORIER' : 'CATEGORIES', startX + boxWidth + gap + boxWidth / 2, statsY + 33, { align: 'center' });

    // Bottom contact section
    const bottomY = pageHeight - 50;
    setColor(doc, THEME.white, 'text');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY.website, pageWidth / 2, bottomY, { align: 'center' });

    doc.setFontSize(9);
    doc.text(`${COMPANY.phone}  •  ${COMPANY.email}`, pageWidth / 2, bottomY + 7, { align: 'center' });
    doc.text(COMPANY.address, pageWidth / 2, bottomY + 14, { align: 'center' });

    // Bottom gold bar
    setColor(doc, THEME.accent, 'fill');
    doc.rect(0, pageHeight - 6, pageWidth, 6, 'F');

    // Date in bottom corner
    setColor(doc, THEME.accent, 'text');
    doc.setFontSize(8);
    doc.text(format(new Date(), 'MMMM yyyy'), pageWidth / 2, pageHeight - 12, { align: 'center' });
}

/**
 * Table of Contents - Clean Modern Design
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
    // Header
    addPageHeader(doc, pageWidth, margin, language === 'sv' ? 'Innehåll' : 'Contents');

    let yPos = 55;
    let startPage = pageNum + 1;

    // Category list with modern styling
    for (const category of categories) {
        const productCount = productsByCategory[category].length;

        // Category row background
        if (categories.indexOf(category) % 2 === 0) {
            setColor(doc, THEME.background, 'fill');
            doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 12, 'F');
        }

        // Category name
        setColor(doc, THEME.text, 'text');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(category, margin + 3, yPos);

        // Product count
        setColor(doc, THEME.textMuted, 'text');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const countText = language === 'sv' ? `${productCount} produkter` : `${productCount} products`;
        doc.text(countText, margin + 3 + doc.getTextWidth(category) + 5, yPos);

        // Page number
        setColor(doc, THEME.primary, 'text');
        doc.setFont('helvetica', 'bold');
        doc.text(startPage.toString(), pageWidth - margin - 3, yPos, { align: 'right' });

        // Dotted line
        const textEndX = margin + 3 + doc.getTextWidth(category) + 5 + doc.getTextWidth(countText) + 5;
        setColor(doc, THEME.border, 'draw');
        doc.setLineDashPattern([1, 2], 0);
        doc.line(textEndX, yPos - 1, pageWidth - margin - 15, yPos - 1);
        doc.setLineDashPattern([], 0);

        yPos += 12;
        startPage++;
    }

    // Info box at bottom
    yPos += 20;
    setColor(doc, THEME.background, 'fill');
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');

    setColor(doc, THEME.textMuted, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const infoText1 = language === 'sv'
        ? 'Alla priser är i SEK exklusive moms (25%).'
        : 'All prices are in SEK excluding VAT (25%).';
    const infoText2 = language === 'sv'
        ? 'Priser och tillgänglighet kan ändras. Kontakta oss för aktuellt lager.'
        : 'Prices and availability subject to change. Contact us for current stock.';

    doc.text(infoText1, margin + 8, yPos + 12);
    doc.text(infoText2, margin + 8, yPos + 22);

    // Page footer
    addPageFooter(doc, pageWidth, pageHeight, margin, pageNum);
}

/**
 * Category Page with Product Cards
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
    // Category header bar
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, 30, 'F');

    setColor(doc, THEME.white, 'text');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(category.toUpperCase(), margin, 20);

    // Product count badge
    setColor(doc, THEME.accent, 'fill');
    doc.roundedRect(pageWidth - margin - 35, 8, 32, 14, 2, 2, 'F');
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const countText = `${products.length} ${language === 'sv' ? 'st' : 'items'}`;
    doc.text(countText, pageWidth - margin - 19, 17, { align: 'center' });

    // Product grid layout
    const cardWidth = (pageWidth - 2 * margin - 10) / 2; // 2 columns with gap
    const cardHeight = 55;
    const gap = 10;
    let yPos = 40;
    let col = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const xPos = margin + col * (cardWidth + gap);

        // Check if we need a new page
        if (yPos + cardHeight > pageHeight - 25) {
            addPageFooter(doc, pageWidth, pageHeight, margin, pageNum);
            doc.addPage();
            pageNum++;
            yPos = 20;

            // Add category continuation header
            setColor(doc, THEME.primary, 'fill');
            doc.rect(0, 0, pageWidth, 15, 'F');
            setColor(doc, THEME.white, 'text');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${category} (${language === 'sv' ? 'fortsättning' : 'continued'})`, margin, 10);
            yPos = 25;
        }

        // Product card
        drawProductCard(doc, product, imageCache, xPos, yPos, cardWidth, cardHeight, includePrice, language);

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
 * Draw individual product card - Clean text-based design
 */
function drawProductCard(
    doc: jsPDF,
    product: CatalogueProduct,
    imageCache: Map<number, ImageData | null>,
    x: number,
    y: number,
    width: number,
    height: number,
    includePrice: boolean,
    language: string
) {
    // Card background
    setColor(doc, THEME.white, 'fill');
    doc.roundedRect(x, y, width, height, 3, 3, 'F');

    // Card border
    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');

    // Left accent bar
    setColor(doc, THEME.primary, 'fill');
    doc.rect(x, y + 3, 3, height - 6, 'F');

    const padding = 8;
    const textX = x + padding;
    const textWidth = width - padding * 2;

    // Product name (truncate if too long)
    setColor(doc, THEME.text, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const productName = truncateText(doc, product.name, textWidth - 10);
    doc.text(productName, textX, y + 12);

    // SKU badge
    if (product.sku) {
        setColor(doc, THEME.background, 'fill');
        const skuText = product.sku;
        const skuWidth = doc.getTextWidth(skuText) + 6;
        doc.roundedRect(textX, y + 16, skuWidth, 8, 1, 1, 'F');

        setColor(doc, THEME.textMuted, 'text');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(skuText, textX + 3, y + 21);
    }

    // Description (truncate to 2 lines max)
    if (product.description) {
        setColor(doc, THEME.textMuted, 'text');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const cleanDesc = product.description.replace(/<[^>]*>/g, '').substring(0, 80);
        const desc = truncateText(doc, cleanDesc, textWidth - 5);
        doc.text(desc, textX, y + 32);
    }

    // Price section at bottom
    if (includePrice && product.price) {
        const priceY = y + height - 8;
        const price = parseFloat(product.price);
        const priceText = isNaN(price) ? 'Kontakta oss' : `${price.toLocaleString('sv-SE')} kr`;

        setColor(doc, THEME.primary, 'text');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(priceText, textX, priceY);

        // Show sale badge if on sale
        if (product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice) {
            setColor(doc, THEME.accent, 'fill');
            doc.roundedRect(textX + doc.getTextWidth(priceText) + 3, priceY - 5, 18, 7, 1, 1, 'F');
            setColor(doc, THEME.primary, 'text');
            doc.setFontSize(6);
            doc.setFont('helvetica', 'bold');
            doc.text('REA', textX + doc.getTextWidth(priceText) + 12, priceY - 1, { align: 'center' });
        }
    }
}

/**
 * Truncate text to fit width
 */
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
 * Back Cover - Order & Contact Information
 */
function addBackCover(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    language: string
) {
    // Header section
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, 55, 'F');

    setColor(doc, THEME.white, 'text');
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'BESTÄLL IDAG' : 'ORDER TODAY', pageWidth / 2, 28, { align: 'center' });

    setColor(doc, THEME.accent, 'text');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
        language === 'sv' ? 'Snabb leverans i hela Sverige & Europa' : 'Fast delivery across Sweden & Europe',
        pageWidth / 2, 42, { align: 'center' }
    );

    let yPos = 70;

    // Contact card
    setColor(doc, THEME.background, 'fill');
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 65, 5, 5, 'F');

    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'KONTAKTA OSS' : 'CONTACT US', margin + 12, yPos + 18);

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const contactInfo = [
        { icon: '📍', text: COMPANY.address },
        { icon: '📞', text: COMPANY.phone },
        { icon: '✉️', text: COMPANY.email },
        { icon: '🌐', text: COMPANY.website },
    ];

    contactInfo.forEach((item, i) => {
        doc.text(`${item.icon}  ${item.text}`, margin + 12, yPos + 32 + i * 8);
    });

    yPos += 80;

    // Why choose us section
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'VARFÖR VÄLJA OSS?' : 'WHY CHOOSE US?', margin, yPos);

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
        '✓  Invoice with 28-day credit for businesses',
        '✓  Own manufacturing of Anmol Electric Tandoor',
        '✓  Fast delivery in Stockholm area',
        '✓  Over 1000+ satisfied restaurant customers',
    ];

    setColor(doc, THEME.text, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    benefits.forEach((benefit) => {
        doc.text(benefit, margin, yPos);
        yPos += 9;
    });

    yPos += 12;

    // How to order box
    setColor(doc, THEME.accent, 'fill');
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 50, 5, 5, 'F');

    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'sv' ? 'SÅ HÄR BESTÄLLER DU' : 'HOW TO ORDER', margin + 12, yPos + 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const steps = language === 'sv' ? [
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

    steps.forEach((step, i) => {
        doc.text(step, margin + 12, yPos + 26 + i * 6);
    });

    // Footer bar
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

    setColor(doc, THEME.white, 'text');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.name, pageWidth / 2, pageHeight - 18, { align: 'center' });

    setColor(doc, THEME.accent, 'text');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(COMPANY.tagline, pageWidth / 2, pageHeight - 9, { align: 'center' });
}

/**
 * Page Header - Consistent across pages
 */
function addPageHeader(doc: jsPDF, pageWidth: number, margin: number, title: string) {
    // Top accent bar
    setColor(doc, THEME.primary, 'fill');
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Title
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin, 22);

    // Company name (right aligned)
    setColor(doc, THEME.textMuted, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY.name, pageWidth - margin, 22, { align: 'right' });

    // Separator line
    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.5);
    doc.line(margin, 28, pageWidth - margin, 28);
}

/**
 * Page Footer - Consistent with contact info on all pages
 */
function addPageFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, pageNum: number) {
    const footerY = pageHeight - 18;

    // Footer separator line
    setColor(doc, THEME.border, 'draw');
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    // Contact info (left)
    setColor(doc, THEME.textMuted, 'text');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`${COMPANY.website}  •  ${COMPANY.phone}  •  ${COMPANY.email}`, margin, footerY + 6);

    // Address (left, second line)
    doc.text(COMPANY.address, margin, footerY + 11);

    // Page number (right)
    setColor(doc, THEME.primary, 'text');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pageNum}`, pageWidth - margin, footerY + 8, { align: 'right' });
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
