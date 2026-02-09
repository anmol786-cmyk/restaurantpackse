import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { getTranslations } from 'next-intl/server';
import { Truck, MapPin, Package, Clock, Euro, ShieldCheck, Globe, MessageCircle, Mail, ExternalLink, Info, Building2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SchemaScript } from '@/lib/schema/schema-script';
import { europeDeliveryServiceSchema } from '@/lib/schema';
import { GoogleMapCompact } from "@/components/shared/google-map";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'europePage' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: '/europe-delivery',
        },
    };
}

export default async function EuropeDeliveryPage() {
    const t = await getTranslations('europePage');

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2069&auto=format&fit=crop"
                        alt="European Logistics"
                        fill
                        className="object-cover opacity-40"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>

                <div className="site-container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block mb-4">
                            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                {t('badge')}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                            {t('heroTitle')}
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-2xl leading-relaxed">
                            {t('heroDesc')}
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
                                    {t('introLead')}
                                </p>
                                <p>
                                    {t('introDesc')}
                                </p>
                            </section>

                            {/* European Shipping Overview */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                    {t('distributionTitle')}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('flexibleOrders')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('flexibleOrdersDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('transparentRates')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('transparentRatesDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('dhlPartnership')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('dhlPartnershipDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('b2bBenefits')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('b2bBenefitsDesc')}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Key European Markets */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                    {t('marketsTitle')}
                                </h2>
                                <div className="p-6 rounded-xl border bg-card/50 text-muted-foreground">
                                    <p className="mb-6 text-foreground font-medium" style={{ fontSize: '16px' }}>
                                        {t('marketsIntro')}
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                {t('priorityMarkets')}
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
                                            <h4 className="font-semibold text-foreground mb-3">{t('additionalCountries')}</h4>
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
                                            <strong className="text-foreground">{t('dontSeeCountry')}</strong> {t('dontSeeCountryDesc')}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Methods & Logistics */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
                                    {t('shippingMethodsTitle')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('dhlParcel')}</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                {t('dhlParcelDesc')}
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>&#x2022; Estimated delivery: 2-4 days (Scandinavia), 4-7 days (Rest of Europe)</li>
                                                <li>&#x2022; Full tracking & insurance included</li>
                                                <li>&#x2022; Suitable for orders up to 300kg</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Truck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('freightPallet')}</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                {t('freightPalletDesc')}
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>&#x2022; Competitive pallet rates for bulk staples (rice, flour, oil)</li>
                                                <li>&#x2022; Scheduled delivery for receiving convenience</li>
                                                <li>&#x2022; Preferential rates for recurring orders</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-6 rounded-xl border bg-primary/5 border-primary/20 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('exWarehouse')}</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-3">
                                                {t('exWarehouseDesc')}
                                            </p>
                                            <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>&#x2022; Orders priced Ex-Warehouse (Fagerstagatan 13, Sp&aring;nga)</li>
                                                <li>&#x2022; Coordinate pickup Mon-Fri: 10 AM - 8 PM | Sat-Sun: 11 AM - 7 PM</li>
                                                <li>&#x2022; Maximum cost control for large international shipments</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Product Categories for European B2B */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Package className="h-6 w-6 text-primary" />
                                    {t('supplyCategoriesTitle')}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">{t('signatureEquipment')}</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>&#x2022; Anmol Electric Tandoor (Manufactured by us)</li>
                                            <li>&#x2022; Professional kitchen equipment</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">{t('basmatiRice')}</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>&#x2022; Ocean Pearl Basmati Rice (5kg cases)</li>
                                            <li>&#x2022; Premium quality for authentic biryani</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">{t('oilsGhee')}</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>&#x2022; Khanum Butter Ghee (6x2kg cases)</li>
                                            <li>&#x2022; Mat Olja & Frityrolja (10L bulk)</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 rounded-lg border bg-muted/10">
                                        <h4 className="font-semibold text-foreground mb-2">{t('floursStaples')}</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>&#x2022; TRS Gram Flour (6x2kg cases)</li>
                                            <li>&#x2022; Nordic Sugar (25kg bulk)</li>
                                            <li>&#x2022; Milk Powder, Glucose, specialty ingredients</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    {t('supplyCategoriesNote')}
                                </p>
                            </section>

                            {/* EU Customs & Compliance */}
                            <section className="p-8 rounded-2xl bg-card border">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4 flex items-center gap-2">
                                    <Euro className="h-5 w-5 text-primary" />
                                    {t('customsTitle')}
                                </h2>
                                <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                    <p className="font-medium text-foreground">{t('customsIntro')}</p>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li><strong>{t('noCustomsFees')}</strong> {t('noCustomsFeesDesc')}</li>
                                        <li><strong>{t('vatHandling')}</strong> {t('vatHandlingDesc')}</li>
                                        <li><strong>{t('ukNonEu')}</strong> {t('ukNonEuDesc')}</li>
                                    </ul>
                                    <p className="text-sm mt-4">
                                        {t('customsSupport')}
                                    </p>
                                </div>
                            </section>

                            {/* CTA for B2B Account */}
                            <section className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4">
                                    {t('ctaTitle')}
                                </h2>
                                <p style={{ fontSize: '16px' }} className="text-muted-foreground mb-6">
                                    {t('ctaDesc')}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/wholesale/register" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                        {t('registerAccount')} <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    <Link href="/wholesale/quote" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                                        {t('requestQuote')} <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Shipping Estimator Info */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('sidebarShippingInfo')}</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('estimatedDelivery')}</p>
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
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('freightCalculation')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('freightCalculationDesc')}</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Package className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('bulkOrders')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('bulkOrdersDesc')}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Warehouse Location Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            {t('shippingFrom')}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Support */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('europeanSupport')}</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('europeanSupportDesc')}</p>
                                    <a href={`mailto:${brandProfile.contact.email}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm mb-2">
                                        {t('emailB2B')}
                                    </a>
                                    <a href={`tel:${brandProfile.contact.phone}`} className="inline-block w-full py-2 border border-primary text-primary rounded-lg font-medium text-sm">
                                        {brandProfile.contact.phone}
                                    </a>
                                </div>

                                {/* Shop CTA */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('readyToOrder')}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{t('readyToOrderDesc')}</p>
                                    <Link href="/shop" className="text-primary hover:underline text-sm flex items-center justify-between">
                                        {t('viewCatalog')} <ExternalLink className="w-3 h-3" />
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
