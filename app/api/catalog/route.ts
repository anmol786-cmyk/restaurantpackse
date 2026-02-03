'use server';

import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';
import { WC_API_CONFIG } from '@/lib/woocommerce/config';

function formatPrice(amount: number, currency: string = 'SEK'): string {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

interface ProductForCatalog {
    id: number;
    name: string;
    sku: string;
    price: string | number;
    currency: string;
    image?: string;
    category?: string;
    description?: string;
}

async function fetchProducts(): Promise<ProductForCatalog[]> {
    const baseUrl = WC_API_CONFIG.baseUrl;
    const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

    const auth = 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch(`${baseUrl}/products?per_page=100&status=publish`, {
        headers: { 'Authorization': auth },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products = await response.json();

    return products.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || 'N/A',
        price: p.price || '0',
        currency: 'SEK',
        image: p.images && p.images.length > 0 ? p.images[0].src : '',
        category: p.categories && p.categories.length > 0 ? p.categories[0].name : '',
        description: p.short_description || p.description || ''
    }));
}

async function generateCatalogPptx(products: ProductForCatalog[]): Promise<Buffer> {
    const pptx = new PptxGenJS();

    // Set Presentation properties
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Anmol Wholesale';
    pptx.company = 'Restaurant Pack';
    pptx.subject = 'Product Catalog';
    pptx.title = 'Anmol Wholesale Product Catalog';

    // 1. Cover Slide
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: 'FFFFFF' };

    coverSlide.addText('Anmol Wholesale', {
        x: 0.5, y: 2.5, w: '90%', h: 1,
        fontSize: 36, color: '8B0000', bold: true, align: 'center', fontFace: 'Arial'
    });

    coverSlide.addText('Product Catalog', {
        x: 0.5, y: 3.5, w: '90%', h: 0.5,
        fontSize: 24, color: '363636', align: 'center', fontFace: 'Arial'
    });

    coverSlide.addText(`Generated on: ${new Date().toLocaleDateString('sv-SE')}`, {
        x: 0.5, y: 4.5, w: '90%', h: 0.5,
        fontSize: 14, color: '666666', align: 'center', fontFace: 'Arial'
    });

    // 2. Product Slides (Grid Layout: 2x2 = 4 products per slide)
    const ITEMS_PER_SLIDE = 4;

    for (let i = 0; i < products.length; i += ITEMS_PER_SLIDE) {
        const slide = pptx.addSlide();
        const slideProducts = products.slice(i, i + ITEMS_PER_SLIDE);

        // Header
        slide.addText('Our Products', {
            x: 0.5, y: 0.3, w: '90%', h: 0.5,
            fontSize: 18, color: '8B0000', bold: true, fontFace: 'Arial'
        });

        slide.addShape(pptx.ShapeType.line, {
            x: 0.5, y: 0.8, w: '93%', h: 0,
            line: { color: 'E0E0E0', width: 1 }
        });

        // Grid positions
        const positions = [
            { x: 0.5, y: 1.0 },
            { x: 6.8, y: 1.0 },
            { x: 0.5, y: 4.0 },
            { x: 6.8, y: 4.0 }
        ];

        slideProducts.forEach((product, index) => {
            const pos = positions[index];
            const boxW = 6.0;

            // Text Info
            const textX = pos.x + 0.2;

            // Name
            slide.addText(product.name, {
                x: textX,
                y: pos.y + 0.1,
                w: boxW - 0.4,
                h: 0.6,
                fontSize: 14,
                bold: true,
                color: '333333',
                fontFace: 'Arial',
                valign: 'top'
            });

            // SKU
            slide.addText(`SKU: ${product.sku}`, {
                x: textX,
                y: pos.y + 0.7,
                w: boxW - 0.4,
                h: 0.3,
                fontSize: 10,
                color: '666666',
                fontFace: 'Arial'
            });

            // Category
            if (product.category) {
                slide.addText(`Category: ${product.category}`, {
                    x: textX,
                    y: pos.y + 1.0,
                    w: boxW - 0.4,
                    h: 0.3,
                    fontSize: 10,
                    color: '888888',
                    fontFace: 'Arial'
                });
            }

            // Price
            if (product.price) {
                slide.addText(formatPrice(Number(product.price), product.currency || 'SEK'), {
                    x: textX,
                    y: pos.y + 1.4,
                    w: boxW - 0.4,
                    h: 0.4,
                    fontSize: 16,
                    bold: true,
                    color: '8B0000',
                    fontFace: 'Arial'
                });
            }
        });

        // Add footer with page number
        slide.addText(`Page ${Math.floor(i / ITEMS_PER_SLIDE) + 1}`, {
            x: 12, y: 7.2, w: 1, h: 0.3,
            fontSize: 10, color: 'CCCCCC', align: 'right'
        });
    }

    // Generate as base64 and convert to Buffer
    const base64Data = await pptx.write({ outputType: 'base64' }) as string;
    return Buffer.from(base64Data, 'base64');
}

export async function GET() {
    try {
        // Fetch products from WooCommerce
        const products = await fetchProducts();

        if (products.length === 0) {
            return NextResponse.json(
                { error: 'No products found to generate catalog' },
                { status: 404 }
            );
        }

        // Generate PPTX
        const pptxBuffer = await generateCatalogPptx(products);

        // Return as downloadable file
        const filename = `Anmol-Wholesale-Catalog-${new Date().toISOString().split('T')[0]}.pptx`;

        // Convert Buffer to Uint8Array for NextResponse
        const uint8Array = new Uint8Array(pptxBuffer);

        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pptxBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error('Catalog generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate catalog' },
            { status: 500 }
        );
    }
}
