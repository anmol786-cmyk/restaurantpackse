import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { CTASection } from "@/components/home/cta-banner";
import Image from 'next/image';
import { Truck, Package, Clock, ShieldCheck, MapPin, ExternalLink, Globe, Info, Warehouse } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { SchemaScript } from "@/lib/schema/schema-script";
import { stockholmDeliveryServiceSchema, deliveryFAQSchema } from "@/lib/schema";
import { GoogleMapCompact } from "@/components/shared/google-map";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'deliveryPage' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: '/delivery-information',
        },
    };
}

export default async function DeliveryInformationPage() {
    const t = await getTranslations('deliveryPage');

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=2070&auto=format&fit=crop"
                        alt="Logistics and Delivery"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>

                <div className="site-container relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-block mb-6">
                            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                                {t('badge')}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                            {t('heroTitle')} <br />
                            <span className="text-primary">{t('heroHighlight')}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl leading-relaxed font-light">
                            {t('heroDesc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content & Sidebar */}
            <section className="py-20 bg-neutral-50">
                <div className="site-container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content Area (2/3) */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Introduction */}
                            <div className="prose prose-lg max-w-none text-neutral-600">
                                <p className="text-xl font-medium text-neutral-900 leading-relaxed">
                                    {t('introLead')}
                                </p>
                                <p className="leading-relaxed">
                                    {t('introDesc')}
                                </p>
                            </div>

                            {/* Delivery Options Overview */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                                        {t('distributionTitle')}
                                    </h2>
                                </div>

                                {/* 1. Own Fleet Delivery */}
                                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <MapPin className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h3 className="text-2xl font-bold text-neutral-900">
                                                {t('fleetTitle')}
                                            </h3>
                                            <p className="text-neutral-600">
                                                {t('fleetDesc')}
                                            </p>

                                            {/* Free Shipping Banner */}
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                                                <p className="flex items-center gap-2 text-green-700 font-bold">
                                                    <span className="text-xl">&#x1F69A;</span> {t('freeShipTitle')}
                                                </p>
                                                <p className="text-green-600 text-sm mt-1">
                                                    {t('freeShipDesc')}
                                                </p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                                    <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-primary" /> {t('coverageTitle')}
                                                    </h4>
                                                    <ul className="text-sm text-neutral-600 space-y-1">
                                                        {t('coverageItems').split('|').map((item: string, i: number) => (
                                                            <li key={i}>&#x2022; {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                                    <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary" /> {t('scheduleTitle')}
                                                    </h4>
                                                    <ul className="text-sm text-neutral-600 space-y-1">
                                                        <li><span className="font-medium">{t('scheduleMonFri')}</span> {t('scheduleMonFriHours')}</li>
                                                        <li><span className="font-medium">{t('scheduleSatSun')}</span> {t('scheduleSatSunHours')}</li>
                                                        <li className="pt-2 text-xs italic">{t('scheduleNote')}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Sweden & Scandinavia */}
                                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-info/10 text-info flex items-center justify-center flex-shrink-0 group-hover:bg-info group-hover:text-white transition-colors">
                                            <Globe className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h3 className="text-2xl font-bold text-neutral-900">
                                                {t('dhlTitle')}
                                            </h3>
                                            <p className="text-neutral-600">
                                                {t('dhlDesc')}
                                            </p>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {t('dhlTags').split('|').map((tag: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 rounded-full bg-info/10 text-info text-xs font-bold uppercase tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-neutral-100">
                                                <Link href="/europe-delivery" className="inline-flex items-center text-primary font-bold hover:underline">
                                                    {t('viewEuropean')} <ExternalLink className="ml-2 w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Third Party */}
                                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-800 group-hover:text-white transition-colors">
                                            <Package className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h3 className="text-2xl font-bold text-neutral-900">
                                                {t('thirdPartyTitle')}
                                            </h3>
                                            <p className="text-neutral-600">
                                                {t('thirdPartyDesc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Warehouse Pickup */}
                                <div className="bg-white p-8 rounded-2xl border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Warehouse className="w-32 h-32 text-primary" />
                                    </div>
                                    <div className="flex items-start gap-6 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                                            <Warehouse className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h3 className="text-2xl font-bold text-neutral-900">
                                                {t('pickupTitle')}
                                            </h3>
                                            <p className="text-neutral-600">
                                                {t('pickupDesc')}
                                            </p>

                                            <div className="bg-neutral-900 text-white p-5 rounded-xl mt-2">
                                                <div className="flex items-start gap-4">
                                                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="font-bold text-lg">Fagerstagatan 13</p>
                                                        <p className="text-neutral-400">163 53 Sp&aring;nga, Sweden</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Operating Hours */}
                                <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" /> {t('operatingHours')}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-dashed border-neutral-100">
                                            <span className="text-neutral-600 font-medium">{t('monFri')}</span>
                                            <span className="text-neutral-900 font-bold">10:00 - 20:00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-600 font-medium">{t('satSun')}</span>
                                            <span className="text-neutral-900 font-bold">11:00 - 19:00</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('quickLinksTitle')}</h3>
                                    <nav className="space-y-2">
                                        {[
                                            { label: t('linkEuropean'), url: '/europe-delivery' },
                                            { label: t('linkApplication'), url: '/wholesale/register' },
                                            { label: t('linkPriceList'), url: '/wholesale/quote' }
                                        ].map((link, i) => (
                                            <Link key={i} href={link.url} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                                                <span className="text-sm font-medium text-neutral-600 group-hover:text-primary transition-colors">{link.label}</span>
                                                <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary" />
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Warehouse Map */}
                                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                                    <GoogleMapCompact />
                                    <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center">
                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{t('warehouseLocation')}</p>
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="bg-[#A80E13] p-6 rounded-2xl text-white shadow-lg shadow-primary/20 text-center">
                                    <h3 className="text-xl font-bold mb-2">{t('haveQuestions')}</h3>
                                    <p className="text-white/80 text-sm mb-6">{t('questionsDesc')}</p>
                                    <div className="space-y-3">
                                        <a href={`tel:${brandProfile.contact.phone}`} className="block w-full py-3 bg-white text-[#A80E13] rounded-xl font-bold hover:bg-neutral-100 transition-colors">
                                            {t('callBtn', { phone: brandProfile.contact.phone })}
                                        </a>
                                        <a href={`mailto:${brandProfile.contact.email}`} className="block w-full py-3 bg-[#005c4b] text-white rounded-xl font-bold hover:bg-[#004a3c] transition-colors">
                                            {t('emailSupport')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection />

            {/* SEO Structured Data */}
            <SchemaScript
                id="delivery-service-schema"
                schema={stockholmDeliveryServiceSchema()}
            />
            <SchemaScript
                id="delivery-faq-schema"
                schema={deliveryFAQSchema()}
            />
        </main >
    );
}
