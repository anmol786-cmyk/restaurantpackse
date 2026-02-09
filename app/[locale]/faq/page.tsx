import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { brandConfig } from '@/config/brand.config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'faqPage' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: '/faq',
        },
    };
}

export default async function FAQPage() {
    const t = await getTranslations('faqPage');

    const faqCategories = [
        { key: 'ordering', title: t('ordering.title'), items: t.raw('ordering.items') as Array<{ q: string; a: string }> },
        { key: 'delivery', title: t('delivery.title'), items: t.raw('delivery.items') as Array<{ q: string; a: string }> },
        { key: 'products', title: t('products.title'), items: t.raw('products.items') as Array<{ q: string; a: string }> },
        { key: 'accounts', title: t('accounts.title'), items: t.raw('accounts.items') as Array<{ q: string; a: string }> },
        { key: 'vatIntl', title: t('vatIntl.title'), items: t.raw('vatIntl.items') as Array<{ q: string; a: string }> },
        { key: 'returns', title: t('returns.title'), items: t.raw('returns.items') as Array<{ q: string; a: string }> },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="site-container py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t('subtitle')}
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
                                {faqCategories.map((category, idx) => (
                                    <div key={idx}>
                                        <h2 className="text-2xl font-bold mb-6 text-primary">{category.title}</h2>
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.items.map((faq, qIdx) => (
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
                                    <h3 className="text-lg font-semibold mb-4">{t('stillQuestions')}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {t('stillQuestionsDesc')}
                                    </p>
                                    <div className="space-y-3">
                                        <a
                                            href={`mailto:${brandConfig.contact.reservationEmail}`}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Mail className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">{t('emailUs')}</p>
                                                <p className="text-xs text-muted-foreground">{brandConfig.contact.reservationEmail}</p>
                                            </div>
                                        </a>
                                        <a
                                            href={`tel:${brandConfig.contact.phone}`}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">{t('callWhatsApp')}</p>
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
                                                <p className="text-sm font-medium">{t('visitWarehouse')}</p>
                                                <p className="text-xs text-muted-foreground">Fagerstagatan 13, Sp&aring;nga</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="border rounded-lg p-6 bg-muted/30">
                                    <h3 className="text-lg font-semibold mb-4">{t('resources')}</h3>
                                    <div className="space-y-2">
                                        <Link href="/wholesale" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkWholesale')}
                                        </Link>
                                        <Link href="/wholesale/register" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkAccount')}
                                        </Link>
                                        <Link href="/wholesale/quick-order" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkQuickOrder')}
                                        </Link>
                                        <Link href="/delivery-information" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkDelivery')}
                                        </Link>
                                        <Link href="/europe-delivery" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkEurope')}
                                        </Link>
                                        <Link href="/refund-return" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                                            {t('linkReturns')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 className="text-lg font-semibold mb-4">{t('warehouseHours')}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('monFri')}</span>
                                            <span className="font-medium">10:00 - 20:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('satSun')}</span>
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
