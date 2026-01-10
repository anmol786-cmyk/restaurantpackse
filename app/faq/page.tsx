import { Metadata } from 'next';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { brandConfig } from '@/config/brand.config';

export const metadata: Metadata = {
    title: 'B2B Wholesale FAQ | Anmol Wholesale - Restaurant Supply Questions',
    description: 'Answers to common questions about wholesale ordering, B2B accounts, bulk delivery across Sweden & Europe, payment terms, tiered pricing, and our Indo-Pak products for restaurants.',
    alternates: {
        canonical: '/faq',
    },
};

const faqs = [
    {
        category: "B2B Wholesale Ordering",
        questions: [
            {
                q: "How do I place a wholesale order?",
                a: "Browse our professional catalog, add items to your cart, and proceed to checkout. You can also use our Quick Order Form for faster bulk ordering by product name, or upload CSV files for large recurring orders. Business account holders get preferential pricing automatically."
            },
            {
                q: "What are your minimum order quantities (MOQ)?",
                a: "We offer flexible MOQs based on product categories. Many items can be ordered by the unit, while others require case or pallet quantities. Contact our B2B team for specific MOQ details on bulk items. Business account holders receive preferential terms."
            },
            {
                q: "Do I need a business account to order?",
                a: "No, you can place orders as a guest. However, opening a free Business Account provides tiered wholesale pricing (up to 20% off at volume thresholds), saved order templates, invoice payment options, and dedicated B2B support."
            },
            {
                q: "What payment methods do you accept for B2B orders?",
                a: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe, Klarna, Swish, and bank transfers. Verified business accounts qualify for Net 30 or Net 60 invoice terms after credit approval."
            },
            {
                q: "Can I get a custom quote for a large order?",
                a: "Absolutely! Use our Quote Request form or email wholesale@restaurantpack.se with your product list and quantities. Our B2B team will prepare a competitive quote within 24 hours, including any available volume discounts."
            },
        ]
    },
    {
        category: "Wholesale Delivery & Logistics",
        questions: [
            {
                q: "What delivery options do you offer for B2B orders?",
                a: "We offer four flexible options: (1) Our own delivery fleet for Stockholm region, (2) DHL partnership for Sweden & Scandinavia, (3) Third-party freight (DB Schenker, PostNord, or your carrier), and (4) Ex-warehouse pickup from our Spånga facility. Choose what works best for your business."
            },
            {
                q: "Do you deliver across Sweden and Europe?",
                a: "Yes! We serve all of Sweden, Scandinavia (Norway, Denmark, Finland), and 28+ European countries via DHL and DB Schenker. Shipping costs are calculated based on weight and destination at checkout. Recurring bulk orders qualify for preferential freight rates."
            },
            {
                q: "What are your delivery times for wholesale orders?",
                a: "Stockholm area: 1-2 business days with our fleet. Sweden: 2-4 business days via DHL. Scandinavia: 2-4 days. Europe: 3-10 days depending on zone. Ex-warehouse pickup is available immediately after order confirmation during operating hours."
            },
            {
                q: "Can I arrange my own freight carrier?",
                a: "Yes! We support third-party freight arrangements. Your carrier can collect Ex-warehouse from Fagerstagatan 13, Spånga. Orders are priced Ex-warehouse for self-arranged pickup. Schedule during our operating hours: Mon-Fri 10 AM-8 PM, Sat-Sun 11 AM-7 PM."
            },
            {
                q: "Do you offer pallet and case delivery?",
                a: "Yes, we handle full pallets, mixed pallets, and case quantities. Our Stockholm fleet can deliver pallets directly. For other regions, we arrange freight via DHL Freight, DB Schenker, or PostNord based on your location and order size."
            },
        ]
    },
    {
        category: "Products & Pricing",
        questions: [
            {
                q: "What products do you supply?",
                a: "We specialize in authentic Indo-Pak ingredients (basmati rice, spices, lentils, flours, ghee, condiments), fresh/frozen vegetables when in season, snacks, beverages, and professional kitchen equipment including our signature Anmol Electric Tandoor. Over 150+ brands from India, Pakistan, and Europe."
            },
            {
                q: "Do you have tiered wholesale pricing?",
                a: "Yes! Business account holders receive automatic tiered discounts: 10-49 units (-10%), 50-99 units (-16%), 100+ units (-20%). The more you buy, the more you save. Pricing tiers are shown on each product page for logged-in business accounts."
            },
            {
                q: "Can I get samples before placing a large order?",
                a: "Yes! Contact wholesale@restaurantpack.se to request product samples. We understand you need to taste and test before committing to case or pallet quantities. Sample costs may apply but can be credited toward your first bulk order."
            },
            {
                q: "What is the Anmol Electric Tandoor?",
                a: "Our flagship product! The Anmol Electric Tandoor is a professional-grade electric tandoor oven designed and manufactured by Anmol Restaurant. It's used in our own restaurant and now available to professional kitchens across Sweden and Europe. Perfect for naan, tandoori chicken, kebabs, and more."
            },
            {
                q: "Do you stock products from specific brands I need?",
                a: "We carry major Indo-Pak brands: TRS, Shan, MDH, India Gate, National Foods,Shan, Ahmed Foods, Laziza, Haldiram's, and many more. If you need a specific brand or product not on our site, email us at wholesale@restaurantpack.se—we can source it for you."
            },
        ]
    },
    {
        category: "Business Accounts & Support",
        questions: [
            {
                q: "How do I open a business account?",
                a: "Register at /wholesale/register. You'll need your business name, VAT/Org number, and contact details. Basic business accounts are approved instantly for wholesale pricing. Full credit terms (Net 30/60) require verification and credit approval."
            },
            {
                q: "What are the benefits of a business account?",
                a: "Business accounts receive: (1) Tiered wholesale pricing up to 20% off, (2) Invoice payment terms (Net 30/60 after verification), (3) Saved order templates for quick reordering, (4) Order history and tracking, (5) Dedicated B2B support, and (6) Preferential freight rates on recurring orders."
            },
            {
                q: "Can I save my regular orders as templates?",
                a: "Yes! Use our Quick Order Form to save frequently ordered items as templates. Name them (e.g., 'Weekly Stock Order') and load them with one click for instant reordering. Perfect for restaurants with consistent menu needs."
            },
            {
                q: "Do you provide invoices for business purchases?",
                a: "Yes! All B2B orders automatically receive professional invoices with full VAT breakdown. Invoices are emailed immediately after order confirmation and available in your account dashboard. We comply with all EU VAT regulations for cross-border sales."
            },
        ]
    },
    {
        category: "VAT & International Sales",
        questions: [
            {
                q: "How is VAT handled for B2B orders?",
                a: "Swedish businesses pay 12% VAT on food products and 25% on other items (tax-inclusive pricing). For B2B cross-border EU sales with a valid VAT number, reverse charge applies (0% VAT—you account for VAT in your country). Non-EU countries follow standard export rules."
            },
            {
                q: "Do I need to pay customs duties for EU deliveries?",
                a: "No customs duties within the EU! Since we're based in Sweden (EU member), shipments to other EU countries incur no customs or import fees. Your checkout price is your final price. Standard import rules apply for non-EU countries like Norway (customs may apply)."
            },
            {
                q: "Can you provide export documentation for customs?",
                a: "Yes! For non-EU shipments requiring customs documentation, we provide complete commercial invoices, packing lists, and origin certificates as needed. Our freight partners handle customs clearance for a smooth delivery experience."
            },
        ]
    },
    {
        category: "Returns & Quality",
        questions: [
            {
                q: "What is your return policy for wholesale orders?",
                a: "We accept returns on unopened, unused products within 14 days for non-perishable items. Perishable goods (fresh/frozen) cannot be returned. Damaged or defective products will be replaced or refunded immediately—contact us with photos within 48 hours of delivery."
            },
            {
                q: "What if an item arrives damaged during shipping?",
                a: "Contact us immediately at wholesale@restaurantpack.se with photos. We'll arrange replacement shipment or full refund. All freight is insured. For third-party freight, document damage with your carrier at time of delivery for insurance claims."
            },
            {
                q: "How do you ensure product quality and freshness?",
                a: "We operate Anmol Sweets & Restaurant—we use what we sell! All products meet our own restaurant's standards. We rotate stock religiously (FIFO), maintain proper cold chain for perishables, and source directly from reputable suppliers. Your kitchen's success is our reputation."
            },
        ]
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="site-container py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            B2B Wholesale FAQ
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about wholesale ordering, B2B accounts, bulk delivery, tiered pricing, and our Indo-Pak products for professional kitchens. Can't find your answer? Our team is here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16">
                <div className="site-container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQ Categories */}
                        <div className="lg:col-span-2">
                            <div className="space-y-12">
                                {faqs.map((category, idx) => (
                                    <div key={idx}>
                                        <h2 className="text-2xl font-bold mb-6 text-primary">{category.category}</h2>
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.questions.map((faq, qIdx) => (
                                                <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                                                    <AccordionTrigger className="text-left hover:no-underline">
                                                        <span className="font-semibold">{faq.q}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Still Have Questions */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 className="text-lg font-semibold mb-4">Still Have Questions?</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Our B2B team is ready to help with bulk orders, custom quotes, and logistics solutions.
                                    </p>
                                    <div className="space-y-3">
                                        <a
                                            href={`mailto:${brandConfig.contact.reservationEmail}`}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Mail className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Email Us</p>
                                                <p className="text-xs text-muted-foreground">{brandConfig.contact.reservationEmail}</p>
                                            </div>
                                        </a>
                                        <a
                                            href={`tel:${brandConfig.contact.phone}`}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Call or WhatsApp</p>
                                                <p className="text-xs text-muted-foreground">{brandConfig.contact.phone}</p>
                                            </div>
                                        </a>
                                        <a
                                            href={brandConfig.contact.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Visit Warehouse</p>
                                                <p className="text-xs text-muted-foreground">Fagerstagatan 13, Spånga</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="border rounded-lg p-6 bg-muted/30">
                                    <h3 className="text-lg font-semibold mb-4">Helpful Resources</h3>
                                    <div className="space-y-2">
                                        <Link href="/wholesale" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → B2B Wholesale Hub
                                        </Link>
                                        <Link href="/wholesale/register" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → Open Business Account
                                        </Link>
                                        <Link href="/wholesale/quick-order" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → Quick Order Form
                                        </Link>
                                        <Link href="/delivery-information" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → Delivery Information
                                        </Link>
                                        <Link href="/europe-delivery" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → European Shipping
                                        </Link>
                                        <Link href="/refund-return" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            → Return Policy
                                        </Link>
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 className="text-lg font-semibold mb-4">Warehouse Hours</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monday - Friday</span>
                                            <span className="font-medium">10:00 - 20:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Saturday - Sunday</span>
                                            <span className="font-medium">11:00 - 19:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
