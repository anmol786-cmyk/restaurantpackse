import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

// Brand colors
const BRAND = {
    burgundy: '8B1538',
    gold: 'D4AF37',
    darkText: '1a1a1a',
    lightText: '666666',
    white: 'FFFFFF',
    lightBg: 'F8F6F3',
};

async function generateCompanyPresentation(): Promise<Buffer> {
    const pptx = new PptxGenJS();

    // Set Presentation properties
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Anmol Wholesale';
    pptx.company = 'Restaurant Pack';
    pptx.subject = 'Company Presentation';
    pptx.title = 'Anmol Wholesale - Your Trusted B2B Partner';

    // ============================================
    // SLIDE 1: Cover
    // ============================================
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: BRAND.white };

    // Decorative top bar
    coverSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.5,
        fill: { color: BRAND.burgundy }
    });

    // Company Name
    coverSlide.addText('Anmol Wholesale', {
        x: 0.5, y: 2.0, w: '90%', h: 1,
        fontSize: 48, color: BRAND.burgundy, bold: true, align: 'center', fontFace: 'Arial'
    });

    // Tagline
    coverSlide.addText('Your Trusted B2B Partner for Quality Indo-Pak Foods', {
        x: 0.5, y: 3.2, w: '90%', h: 0.6,
        fontSize: 24, color: BRAND.darkText, align: 'center', fontFace: 'Arial'
    });

    // Subtitle
    coverSlide.addText('Premium Wholesale Foods for Restaurants, Hotels & Caterers', {
        x: 0.5, y: 4.0, w: '90%', h: 0.5,
        fontSize: 16, color: BRAND.lightText, align: 'center', fontFace: 'Arial'
    });

    // Website
    coverSlide.addText('restaurantpack.se', {
        x: 0.5, y: 6.5, w: '90%', h: 0.4,
        fontSize: 14, color: BRAND.burgundy, align: 'center', fontFace: 'Arial'
    });

    // ============================================
    // SLIDE 2: About Us
    // ============================================
    const aboutSlide = pptx.addSlide();
    aboutSlide.background = { color: BRAND.white };

    // Header
    aboutSlide.addText('About Anmol Wholesale', {
        x: 0.5, y: 0.5, w: '90%', h: 0.8,
        fontSize: 32, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
    });

    aboutSlide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.3, w: 2, h: 0,
        line: { color: BRAND.gold, width: 3 }
    });

    // Content
    const aboutText = [
        'Based in Stockholm, Sweden, Anmol Wholesale is your dedicated partner for authentic Indo-Pakistani food products.',
        '',
        'We specialize in supplying restaurants, hotels, caterers, and food service businesses with premium quality ingredients at competitive wholesale prices.',
        '',
        'Our extensive product range includes:',
        '• Premium Basmati Rice & Grains',
        '• Authentic Spices & Seasonings',
        '• Lentils & Pulses',
        '• Cooking Oils & Ghee',
        '• Canned & Packaged Foods',
        '• Fresh & Frozen Products'
    ].join('\n');

    aboutSlide.addText(aboutText, {
        x: 0.5, y: 1.6, w: '90%', h: 5,
        fontSize: 16, color: BRAND.darkText, fontFace: 'Arial', valign: 'top',
        lineSpacing: 24
    });

    // ============================================
    // SLIDE 3: Why Choose Us
    // ============================================
    const whySlide = pptx.addSlide();
    whySlide.background = { color: BRAND.white };

    whySlide.addText('Why Choose Anmol Wholesale?', {
        x: 0.5, y: 0.5, w: '90%', h: 0.8,
        fontSize: 32, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
    });

    whySlide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.3, w: 2, h: 0,
        line: { color: BRAND.gold, width: 3 }
    });

    // Benefits grid
    const benefits = [
        { title: 'Wholesale Pricing', desc: 'Exclusive B2B prices with volume discounts up to 30%' },
        { title: 'Flexible Payment', desc: 'Net 28/60 day payment terms for approved businesses' },
        { title: 'Free Delivery', desc: 'Free shipping on orders over 5,000 SEK' },
        { title: 'Quality Assured', desc: 'Carefully sourced authentic products with full traceability' },
        { title: 'Easy Ordering', desc: 'Online platform with quick reorder and saved lists' },
        { title: 'Dedicated Support', desc: 'Personal account manager for your business needs' },
    ];

    const gridPositions = [
        { x: 0.5, y: 1.6 }, { x: 4.5, y: 1.6 }, { x: 8.5, y: 1.6 },
        { x: 0.5, y: 4.0 }, { x: 4.5, y: 4.0 }, { x: 8.5, y: 4.0 },
    ];

    benefits.forEach((benefit, index) => {
        const pos = gridPositions[index];

        // Benefit box
        whySlide.addShape(pptx.ShapeType.rect, {
            x: pos.x, y: pos.y, w: 3.8, h: 2.0,
            fill: { color: BRAND.lightBg },
            line: { color: 'E0E0E0', width: 1 }
        });

        whySlide.addText(benefit.title, {
            x: pos.x + 0.2, y: pos.y + 0.2, w: 3.4, h: 0.5,
            fontSize: 16, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
        });

        whySlide.addText(benefit.desc, {
            x: pos.x + 0.2, y: pos.y + 0.8, w: 3.4, h: 1.0,
            fontSize: 12, color: BRAND.lightText, fontFace: 'Arial', valign: 'top'
        });
    });

    // ============================================
    // SLIDE 4: Pricing Tiers
    // ============================================
    const pricingSlide = pptx.addSlide();
    pricingSlide.background = { color: BRAND.white };

    pricingSlide.addText('Wholesale Pricing Tiers', {
        x: 0.5, y: 0.5, w: '90%', h: 0.8,
        fontSize: 32, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
    });

    pricingSlide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.3, w: 2, h: 0,
        line: { color: BRAND.gold, width: 3 }
    });

    // Pricing table - using proper TableRow format
    const pricingData: PptxGenJS.TableRow[] = [
        [
            { text: 'Quantity', options: { bold: true, fill: { color: BRAND.lightBg } } },
            { text: 'Discount', options: { bold: true, fill: { color: BRAND.lightBg } } },
            { text: 'Example Savings', options: { bold: true, fill: { color: BRAND.lightBg } } }
        ],
        [{ text: '1-9 units' }, { text: 'Base Price' }, { text: '-' }],
        [{ text: '10-49 units' }, { text: '10% OFF', options: { color: BRAND.burgundy, bold: true } }, { text: 'Save 100 SEK on 1,000 SEK order' }],
        [{ text: '50-99 units' }, { text: '15% OFF', options: { color: BRAND.burgundy, bold: true } }, { text: 'Save 750 SEK on 5,000 SEK order' }],
        [{ text: '100+ units' }, { text: '20% OFF', options: { color: BRAND.burgundy, bold: true } }, { text: 'Save 2,000 SEK on 10,000 SEK order' }],
    ];

    pricingSlide.addTable(pricingData, {
        x: 0.5, y: 1.8, w: 12,
        colW: [3, 3, 6],
        border: { type: 'solid', color: 'E0E0E0', pt: 1 },
        fill: { color: BRAND.white },
        fontFace: 'Arial',
        fontSize: 14,
        color: BRAND.darkText,
        valign: 'middle',
        rowH: 0.6,
    });

    // Note
    pricingSlide.addText('* Additional discounts available for large volume orders. Contact us for custom pricing.', {
        x: 0.5, y: 5.5, w: '90%', h: 0.4,
        fontSize: 12, color: BRAND.lightText, italic: true, fontFace: 'Arial'
    });

    // ============================================
    // SLIDE 5: How to Order
    // ============================================
    const orderSlide = pptx.addSlide();
    orderSlide.background = { color: BRAND.white };

    orderSlide.addText('How to Order', {
        x: 0.5, y: 0.5, w: '90%', h: 0.8,
        fontSize: 32, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
    });

    orderSlide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.3, w: 2, h: 0,
        line: { color: BRAND.gold, width: 3 }
    });

    const steps = [
        { num: '1', title: 'Register', desc: 'Create your business account at restaurantpack.se/wholesale/register' },
        { num: '2', title: 'Get Approved', desc: 'Our team verifies your business within 24-48 hours' },
        { num: '3', title: 'Browse & Order', desc: 'Access wholesale prices and place orders online' },
        { num: '4', title: 'Receive Delivery', desc: 'Fast delivery to your business address' },
    ];

    steps.forEach((step, index) => {
        const y = 1.8 + (index * 1.3);

        // Step number circle
        orderSlide.addShape(pptx.ShapeType.ellipse, {
            x: 0.5, y: y, w: 0.8, h: 0.8,
            fill: { color: BRAND.burgundy }
        });

        orderSlide.addText(step.num, {
            x: 0.5, y: y, w: 0.8, h: 0.8,
            fontSize: 24, color: BRAND.white, bold: true, align: 'center', valign: 'middle', fontFace: 'Arial'
        });

        orderSlide.addText(step.title, {
            x: 1.5, y: y, w: 3, h: 0.4,
            fontSize: 18, color: BRAND.burgundy, bold: true, fontFace: 'Arial'
        });

        orderSlide.addText(step.desc, {
            x: 1.5, y: y + 0.4, w: 10, h: 0.4,
            fontSize: 14, color: BRAND.lightText, fontFace: 'Arial'
        });
    });

    // ============================================
    // SLIDE 6: Contact
    // ============================================
    const contactSlide = pptx.addSlide();
    contactSlide.background = { color: BRAND.burgundy };

    contactSlide.addText('Get Started Today', {
        x: 0.5, y: 1.5, w: '90%', h: 1,
        fontSize: 40, color: BRAND.white, bold: true, align: 'center', fontFace: 'Arial'
    });

    contactSlide.addText('Join hundreds of satisfied business customers', {
        x: 0.5, y: 2.5, w: '90%', h: 0.6,
        fontSize: 20, color: BRAND.gold, align: 'center', fontFace: 'Arial'
    });

    // Contact info
    const contactInfo = [
        'Website: restaurantpack.se',
        'Email: info@restaurantpack.se',
        'Phone: +46 8 XXX XXXX',
        '',
        'Address:',
        'Fagerstagatan 13',
        '163 53 Spånga, Sweden',
    ].join('\n');

    contactSlide.addText(contactInfo, {
        x: 0.5, y: 3.5, w: '90%', h: 3,
        fontSize: 16, color: BRAND.white, align: 'center', fontFace: 'Arial',
        lineSpacing: 24
    });

    // CTA
    contactSlide.addShape(pptx.ShapeType.roundRect, {
        x: 4.5, y: 6.2, w: 4, h: 0.8,
        fill: { color: BRAND.gold }
    });

    contactSlide.addText('Register Now', {
        x: 4.5, y: 6.2, w: 4, h: 0.8,
        fontSize: 18, color: BRAND.burgundy, bold: true, align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    // Generate as base64 and convert to Buffer
    const base64Data = await pptx.write({ outputType: 'base64' }) as string;
    return Buffer.from(base64Data, 'base64');
}

export async function GET() {
    try {
        // Generate PPTX
        const pptxBuffer = await generateCompanyPresentation();

        // Return as downloadable file
        const filename = `Anmol-Wholesale-Presentation-${new Date().toISOString().split('T')[0]}.pptx`;

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
        console.error('Presentation generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate presentation' },
            { status: 500 }
        );
    }
}
