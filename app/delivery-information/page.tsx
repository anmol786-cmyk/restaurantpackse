import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { Truck, Package, Clock, ShieldCheck, MapPin, ExternalLink, Globe, Info, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { SchemaScript } from "@/lib/schema/schema-script";
import { stockholmDeliveryServiceSchema, deliveryFAQSchema } from "@/lib/schema";
import { GoogleMapCompact } from "@/components/shared/google-map";

export const metadata: Metadata = {
    title: "B2B Wholesale Delivery & Logistics | Anmol Wholesale - Restaurant Supply Sweden",
    description: "Flexible B2B wholesale delivery across Sweden & Scandinavia. Own fleet for Stockholm, DHL partnership for Europe, and Ex-Warehouse pickup options. Reliable supply chain for restaurants, grocery stores & caterers.",
    alternates: {
        canonical: '/delivery-information',
    },
};

export default function DeliveryInformationPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="site-container py-16 md:py-20 text-center md:text-left">
                    <div className="max-w-3xl">
                        <h1 style={{
                            fontSize: '31.25px',
                            fontWeight: 700,
                            lineHeight: 1.47,
                            letterSpacing: '0.02em'
                        }} className="mb-4">
                            B2B Wholesale Delivery & Logistics Solutions
                        </h1>
                        <p className="text-muted-foreground" style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 1.52,
                            letterSpacing: '0.03em'
                        }}>
                            From Our Restaurant Kitchen to Yours. Reliable wholesale distribution across Sweden, Scandinavia, and Europe with flexible delivery options tailored for professional kitchens.
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
                                    Welcome to Anmol Wholesale – your trusted B2B partner for authentic Indo-Pak ingredients and professional kitchen equipment.
                                </p>
                                <p>
                                    As restaurateurs ourselves, we understand the critical importance of a reliable supply chain. We offer a hybrid distribution model combining our own dedicated delivery fleet for the Stockholm region with strategic partnerships with DHL, DB Schenker, PostNord, and other freight carriers to serve restaurants, grocery stores, caterers, and food chains across Sweden, Scandinavia, and Europe.
                                </p>
                            </section>

                            {/* Delivery Options Overview */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
                                    Flexible Distribution Options for Your Business
                                </h2>
                                <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                                    Choose the logistics solution that best fits your business operations – whether you need regular bulk deliveries, prefer to arrange your own freight, or want to pick up directly from our warehouse.
                                </p>
                            </section>

                            {/* 1. Own Fleet Delivery */}
                            <section className="space-y-6">
                                <div className="p-6 rounded-xl border bg-card/50">
                                    <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        1. Anmol Wholesale Fleet – Stockholm & Surrounding Areas
                                    </h3>
                                    <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        <p className="font-medium text-foreground">Our own delivery service provides personalized, flexible delivery for B2B clients in the greater Stockholm region.</p>

                                        <div className="bg-muted/20 p-4 rounded-lg">
                                            <h4 className="font-semibold text-foreground mb-3">Coverage Areas:</h4>
                                            <p className="mb-2">Comprehensive coverage across Stockholm and surrounding municipalities including:</p>
                                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                                <li>• Central Stockholm</li>
                                                <li>• Spånga (Warehouse Hub)</li>
                                                <li>• Solna & Sundbyberg</li>
                                                <li>• Kista & Järfälla</li>
                                                <li>• Nacka & Värmdö</li>
                                                <li>• Huddinge & Flemingsberg</li>
                                                <li>• Södertälje region</li>
                                                <li>• Märsta & Arlanda area</li>
                                            </ul>
                                        </div>

                                        <div className="bg-muted/20 p-4 rounded-lg">
                                            <h4 className="font-semibold text-foreground mb-3">Delivery Schedule:</h4>
                                            <ul className="space-y-2">
                                                <li><strong>Operating Days:</strong> Monday - Friday, 10 AM - 8 PM</li>
                                                <li><strong>Weekend Delivery:</strong> Saturday - Sunday, 11 AM - 7 PM</li>
                                                <li><strong>Bulk Orders:</strong> Schedule can be arranged based on your receiving hours</li>
                                            </ul>
                                        </div>

                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                            <h4 className="font-semibold text-foreground mb-2">Bulk & Pallet Delivery:</h4>
                                            <p className="text-sm">For case and pallet-level orders, contact us to schedule convenient delivery times that align with your kitchen operations. We understand professional kitchens operate on tight schedules.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Sweden-Wide & Scandinavian Shipping */}
                            <section className="space-y-6">
                                <div className="p-6 rounded-xl border bg-card/50">
                                    <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-primary" />
                                        2. Sweden & Scandinavia – DHL Partnership
                                    </h3>
                                    <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        <p className="font-medium text-foreground">For wholesale clients outside the Stockholm area, we partner with DHL for reliable nationwide delivery.</p>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="bg-muted/20 p-4 rounded-lg">
                                                <p className="font-semibold text-foreground mb-2">Coverage:</p>
                                                <ul className="text-sm space-y-1">
                                                    <li>• All of Sweden</li>
                                                    <li>• Norway</li>
                                                    <li>• Denmark</li>
                                                    <li>• Finland</li>
                                                </ul>
                                            </div>
                                            <div className="bg-muted/20 p-4 rounded-lg">
                                                <p className="font-semibold text-foreground mb-2">Delivery:</p>
                                                <ul className="text-sm space-y-1">
                                                    <li>• Weight-based rates</li>
                                                    <li>• Calculated at checkout</li>
                                                    <li>• Fully tracked shipments</li>
                                                    <li>• Business-day delivery</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <p className="text-sm">Shipping costs are automatically calculated based on order weight and destination. For high-volume recurring orders, please contact us for preferential freight rates.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Third-Party & Customer-Arranged Freight */}
                            <section className="space-y-6">
                                <div className="p-6 rounded-xl border bg-card/50">
                                    <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        3. Third-Party Freight & Custom Logistics
                                    </h3>
                                    <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        <p className="font-medium text-foreground">For businesses with existing freight contracts or specific logistics needs, we offer full flexibility.</p>

                                        <div className="bg-muted/20 p-4 rounded-lg">
                                            <h4 className="font-semibold text-foreground mb-3">Supported Services:</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li>• <strong>Your Own Freight:</strong> Use your existing logistics partner</li>
                                                <li>• <strong>DB Schenker:</strong> We can arrange pickup for large shipments</li>
                                                <li>• <strong>PostNord:</strong> Available for standard freight</li>
                                                <li>• <strong>Custom Carriers:</strong> Coordinate with any freight company of your choice</li>
                                            </ul>
                                        </div>

                                        <p className="text-sm italic">All third-party freight orders are priced Ex-Warehouse from our facility at Fagerstagatan 13, Spånga. Your carrier can schedule pickup during our operating hours.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Ex-Warehouse Pickup */}
                            <section className="space-y-6">
                                <div className="p-6 rounded-xl border bg-primary/5 border-primary/20">
                                    <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                        <Warehouse className="h-5 w-5 text-primary" />
                                        4. Ex-Warehouse Pickup – Direct from Spånga
                                    </h3>
                                    <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        <p className="font-medium text-foreground">For maximum cost efficiency and immediate availability, collect your orders directly from our warehouse.</p>

                                        <div className="bg-background/80 p-4 rounded-lg">
                                            <h4 className="font-semibold text-foreground mb-3">Warehouse Details:</h4>
                                            <ul className="space-y-2">
                                                <li><strong>Address:</strong> Fagerstagatan 13, 163 53 Spånga, Sweden</li>
                                                <li><strong>Hours:</strong> Mon-Fri: 10 AM - 8 PM | Sat-Sun: 11 AM - 7 PM</li>
                                                <li><strong>Pickup:</strong> Place your order online, receive confirmation, and collect at your convenience</li>
                                                <li><strong>Benefits:</strong> Zero shipping costs, immediate order fulfillment, inspect products on-site</li>
                                            </ul>
                                        </div>

                                        <p className="text-sm font-medium text-primary">Ideal for local restaurants and grocery stores looking to minimize freight costs and maintain complete control over pickup timing.</p>
                                    </div>
                                </div>
                            </section>

                            {/* European Shipping CTA */}
                            <section className="p-8 rounded-2xl bg-muted/20 border">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4">
                                    Expanding Across Europe?
                                </h2>
                                <p style={{ fontSize: '16px' }} className="text-muted-foreground mb-4">
                                    We serve B2B clients across Germany, Norway, Finland, and key European markets with our DHL partnership. Competitive rates for bulk wholesale orders.
                                </p>
                                <Link href="/europe-delivery" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                    View European Shipping Details <ExternalLink className="w-4 h-4" />
                                </Link>
                            </section>

                            {/* Our Commitment */}
                            <section className="p-8 rounded-2xl bg-card border">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4">
                                    Why Choose Anmol Wholesale Logistics?
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                    <div className="flex gap-3">
                                        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-foreground">Restaurateur Experience</p>
                                            <p className="text-sm">We operate Anmol Sweets & Restaurant. We understand your supply chain needs.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-foreground">Case & Pallet Quantities</p>
                                            <p className="text-sm">Wholesale pricing on bulk orders. Competitive rates for high-volume clients.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-foreground">Flexible Logistics</p>
                                            <p className="text-sm">Choose our fleet, DHL, your own carrier, or warehouse pickup.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-foreground">Scandinavian & European Reach</p>
                                            <p className="text-sm">Serving B2B clients from Stockholm to Germany, Norway, and beyond.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Operating Hours */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">Operating Hours</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Monday - Friday</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">10:00 AM - 8:00 PM</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Saturday - Sunday</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">11:00 AM - 7:00 PM</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Quick Links */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">More Information</h3>
                                    <div className="space-y-2">
                                        <Link href="/europe-delivery" className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-sm">
                                            European Shipping <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <Link href="/wholesale" className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-sm">
                                            B2B Wholesale Hub <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <Link href="/wholesale/register" className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-sm">
                                            Open Wholesale Account <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Warehouse Location Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            Warehouse: Fagerstagatan 13, 163 53 Spånga
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Support */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">Logistics Questions?</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">Contact our B2B team for bulk orders and custom freight solutions.</p>
                                    <a href={`mailto:${brandProfile.contact.email}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm mb-2">
                                        Email Us
                                    </a>
                                    <a href={`tel:${brandProfile.contact.phone}`} className="inline-block w-full py-2 border border-primary text-primary rounded-lg font-medium text-sm">
                                        {brandProfile.contact.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="delivery-service-schema"
                schema={stockholmDeliveryServiceSchema()}
            />
            <SchemaScript
                id="delivery-faq-schema"
                schema={deliveryFAQSchema()}
            />
        </main>
    );
}
