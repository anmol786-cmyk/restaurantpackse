import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { Truck, MapPin, Package, Clock, Euro, ShieldCheck, Globe, MessageCircle, Mail, ExternalLink, Info, Building2 } from 'lucide-react';
import Link from 'next/link';
import { SchemaScript } from '@/lib/schema/schema-script';
import { europeDeliveryServiceSchema } from '@/lib/schema';
import { GoogleMapCompact } from "@/components/shared/google-map";

export const metadata: Metadata = {
    title: 'European B2B Wholesale Shipping | Anmol Wholesale - Indo-Pak Restaurant Supplies',
    description: 'B2B wholesale shipping of authentic Indo-Pak ingredients & kitchen equipment across Europe via DHL. Serving restaurants, grocery stores & caterers in Germany, Norway, Finland, UK & Spain. Competitive freight rates for bulk orders.',
    alternates: {
        canonical: '/europe-delivery',
    },
};

export default function EuropeDeliveryPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b">
                <div className="site-container py-16 md:py-20 text-center md:text-left">
                    <div className="max-w-3xl">
                        <h1 style={{
                            fontSize: '31.25px',
                            fontWeight: 700,
                            lineHeight: 1.47,
                            letterSpacing: '0.02em'
                        }} className="mb-4">
                            European B2B Wholesale Shipping
                        </h1>
                        <p className="text-muted-foreground" style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 1.52,
                            letterSpacing: '0.03em'
                        }}>
                            Authentic Indo-Pak ingredients and professional kitchen equipment delivered across Europe. Reliable wholesale distribution from Stockholm to your business, anywhere in the EU.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content & Sidebar */}
            <section className="py-16">
                <div className="site-container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content Area (2/3) */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Introduction */}
                            <section className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground" style={{
                                fontSize: '16px',
                                fontWeight: 400,
                                lineHeight: 1.52,
                                letterSpacing: '0.03em'
                            }}>
                                <p className="text-foreground font-medium" style={{ fontSize: '18px' }}>
                                    Expanding your restaurant, grocery store, or catering business across Europe? Anmol Wholesale brings authentic flavors to your professional kitchen, wherever you operate.
                                </p>
                                <p>
                                    Born from the success of Anmol Sweets & Restaurant in Stockholm, we leverage our deep culinary expertise to supply B2B partners across the European continent. We understand what professional kitchens need: consistency, quality, and a supply chain you can depend on. From basmati rice by the pallet to our signature Anmol Electric Tandoor, we deliver the ingredients and equipment that define authentic Indo-Pak cuisine.
                                </p>
                            </section>

                            {/* European Shipping Overview */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                    Wholesale Distribution Across Europe
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Flexible Order Sizes</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">Order by the case, pallet, or mixed loads. No minimum order requirements for B2B clients.</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Transparent Freight Rates</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">Weight-based shipping calculated at checkout. Preferential rates for recurring bulk orders.</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">DHL Partnership</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">Reliable European logistics through our DHL partnership. Fully tracked, insured shipments.</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">B2B Account Benefits</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">Open a wholesale account for preferential pricing, recurring order management, and dedicated support.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Key European Markets */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                    Key European Markets We Serve
                                </h2>
                                <div className="p-6 rounded-xl border bg-card/50 text-muted-foreground">
                                    <p className="mb-6 text-foreground font-medium" style={{ fontSize: '16px' }}>
                                        We actively ship to B2B clients across all EU member states and key Scandinavian markets.
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                Priority Expansion Markets:
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm bg-primary/5 p-4 rounded-lg">
                                                {[
                                                    "Germany",
                                                    "Norway",
                                                    "Finland",
                                                    "United Kingdom",
                                                    "Spain",
                                                    "Denmark"
                                                ].map((country, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                        <strong>{country}</strong>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs mt-3 italic">We actively target restaurant and grocery store partnerships in these high-demand markets.</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-foreground mb-3">Additional EU Countries:</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm">
                                                {[
                                                    "France", "Netherlands", "Belgium", "Austria",
                                                    "Italy", "Portugal", "Poland", "Ireland",
                                                    "Luxembourg", "Czech Republic", "Greece", "Hungary"
                                                ].map((country, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                                                        {country}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-background/80 rounded-lg border">
                                        <p className="text-sm">
                                            <strong className="text-foreground">Don't see your country?</strong> We ship to most European destinations. Contact us at <a href={`mailto:${brandProfile.contact.email}`} className="text-primary hover:underline">{brandProfile.contact.email}</a> or <a href={`tel:${brandProfile.contact.phone}`} className="text-primary hover:underline">{brandProfile.contact.phone}</a> to discuss your specific logistics needs.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Methods & Logistics */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
                                    Shipping Methods & Logistics
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">DHL Parcel Connect (Standard)</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                Cost-effective solution for regular case orders. Ideal for restaurants and small grocery stores ordering mixed loads of ingredients.
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>• Estimated delivery: 2-4 days (Scandinavia), 4-7 days (Rest of Europe)</li>
                                                <li>• Full tracking & insurance included</li>
                                                <li>• Suitable for orders up to 300kg</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Truck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Freight & Pallet Shipping</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                For bulk orders, pallet quantities, or heavy equipment like the Anmol Electric Tandoor. We partner with DHL Freight, DB Schenker, and other carriers for large shipments.
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>• Competitive pallet rates for bulk staples (rice, flour, oil)</li>
                                                <li>• Scheduled delivery for receiving convenience</li>
                                                <li>• Preferential rates for recurring orders</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-6 rounded-xl border bg-primary/5 border-primary/20 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Your Own Freight (Ex-Warehouse)</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                Have an existing freight contract or logistics partner? Arrange pickup directly from our Spånga warehouse at Ex-Warehouse rates.
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>• Orders priced Ex-Warehouse (Fagerstagatan 13, Spånga)</li>
                                                <li>• Coordinate pickup Mon-Fri: 10 AM - 8 PM | Sat-Sun: 11 AM - 7 PM</li>
                                                <li>• Maximum cost control for large international shipments</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Product Categories for European B2B */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Package className="h-6 w-6 text-primary" />
                                    What We Supply to European B2B Clients
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">Signature Equipment</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Anmol Electric Tandoor (Manufactured by us)</li>
                                            <li>• Professional kitchen equipment</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">Basmati Rice</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Ocean Pearl Basmati Rice (5kg cases)</li>
                                            <li>• Premium quality for authentic biryani</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">Oils & Ghee</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Khanum Butter Ghee (6x2kg cases)</li>
                                            <li>• Mat Olja & Frityrolja (10L bulk)</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">Flours & Staples</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• TRS Gram Flour (6x2kg cases)</li>
                                            <li>• Nordic Sugar (25kg bulk)</li>
                                            <li>• Milk Powder, Glucose, specialty ingredients</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    All products are sourced and verified by Anmol Sweets & Restaurant. We supply what we use in our own professional kitchen.
                                </p>
                            </section>

                            {/* EU Customs & Compliance */}
                            <section className="p-8 rounded-2xl bg-card border">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                    <Euro className="h-5 w-5 text-primary" />
                                    EU Customs & Compliance
                                </h2>
                                <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                    <p className="font-medium text-foreground">Shipping within the EU and EEA is straightforward and hassle-free for B2B clients.</p>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li><strong>No Customs Fees:</strong> All products ship freely within the EU/EEA with no additional customs duties or import taxes.</li>
                                        <li><strong>VAT Handling:</strong> B2B clients with valid VAT numbers receive intra-community supply invoicing. Contact us with your VAT registration details.</li>
                                        <li><strong>UK & Non-EU:</strong> For shipments to the UK, Norway (certain goods), or other non-EU destinations, customs documentation will be provided. Some duties may apply based on local regulations.</li>
                                    </ul>
                                    <p className="text-sm mt-4">
                                        Our logistics team can guide you through any cross-border compliance requirements. Email us at <a href={`mailto:${brandProfile.contact.email}`} className="text-primary hover:underline">{brandProfile.contact.email}</a> for detailed support.
                                    </p>
                                </div>
                            </section>

                            {/* CTA for B2B Account */}
                            <section className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4">
                                    Open a B2B Wholesale Account
                                </h2>
                                <p style={{ fontSize: '16px' }} className="text-muted-foreground mb-6">
                                    Get access to preferential pricing, dedicated account management, and streamlined ordering for recurring shipments. Ideal for restaurants, grocery chains, and caterers with consistent supply needs.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/wholesale/register" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                        Register B2B Account <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    <Link href="/wholesale/quote" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                                        Request Bulk Quote <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Shipping Estimator Info */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">Shipping Info</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Estimated Delivery</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">
                                                    Scandinavia: 2-4 days<br />
                                                    Germany/Benelux: 4-6 days<br />
                                                    Rest of EU: 4-7 days
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Info className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Freight Calculation</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">Based on weight & destination. Calculated automatically at checkout.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Package className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Bulk Orders</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">Contact us for preferential pallet rates and recurring order discounts.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Warehouse Location Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            Shipping from: Fagerstagatan 13, 163 53 Spånga, Sweden
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Support */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">European B2B Support</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">Questions about shipping to your country or bulk pricing?</p>
                                    <a href={`mailto:${brandProfile.contact.email}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm mb-2">
                                        Email B2B Team
                                    </a>
                                    <a href={`tel:${brandProfile.contact.phone}`} className="inline-block w-full py-2 border border-primary text-primary rounded-lg font-medium text-sm">
                                        {brandProfile.contact.phone}
                                    </a>
                                </div>

                                {/* Shop CTA */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">Ready to Order?</h3>
                                    <p className="text-sm text-muted-foreground mb-3">Browse our wholesale product catalog.</p>
                                    <Link href="/shop" className="text-primary hover:underline text-sm flex items-center justify-between">
                                        View Wholesale Catalog <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="europe-delivery-schema"
                schema={europeDeliveryServiceSchema()}
            />
        </main>
    );
}
