import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { getTranslations } from 'next-intl/server';
import { RotateCcw, Package, Clock, CheckCircle2, XCircle, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'refundReturn' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: '/refund-return',
        },
    };
}

export default async function RefundReturnPage() {
    const t = await getTranslations('refundReturn');

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="site-container py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 style={{
                            fontSize: '31.25px',
                            fontWeight: 700,
                            lineHeight: 1.47,
                            letterSpacing: '0.02em'
                        }} className="mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-muted-foreground" style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 1.52,
                            letterSpacing: '0.03em'
                        }}>
                            {t('subtitle')}
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
                            {/* Overview */}
                            <div>
                                <p className="text-muted-foreground mb-4" style={{ fontSize: '14.31px' }}>{t('lastUpdated')}</p>
                                <div className="space-y-6 text-muted-foreground" style={{
                                    fontSize: '16px',
                                    fontWeight: 400,
                                    lineHeight: 1.52,
                                    letterSpacing: '0.03em'
                                }}>
                                    <p dangerouslySetInnerHTML={{ __html: t('overviewText', { businessName: brandProfile.name }) }} />
                                </div>
                            </div>

                            {/* Eligibility Grid */}
                            <div className="grid sm:grid-cols-2 gap-8">
                                <section className="space-y-4">
                                    <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        {t('eligibleTitle')}
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        {t('eligibleItems').split('|').map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-destructive" />
                                        {t('nonReturnableTitle')}
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        {t('nonReturnableItems').split('|').map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            {/* Return Process */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <RotateCcw className="h-6 w-6 text-primary" />
                                    {t('howToReturnTitle')}
                                </h2>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-3">{t('inPersonTitle')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('inPersonDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-3">{t('byPostTitle')}</h3>
                                        <div className="space-y-3 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                            <p>{t('byPostStep1')}</p>
                                            <p>{t('byPostStep2')}</p>
                                            <p><strong>Note:</strong> {t('byPostNote')}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Damaged & Out of Stock */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Package className="h-6 w-6 text-primary" />
                                    {t('specialCircumstancesTitle')}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                        <h3 className="font-semibold mb-2" style={{ fontSize: '16px' }}>{t('damagedTitle')}</h3>
                                        <p style={{ fontSize: '14.31px' }} className="text-muted-foreground">{t('damagedDesc')}</p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                                        <h3 className="font-semibold mb-2" style={{ fontSize: '16px' }}>{t('outOfStockTitle')}</h3>
                                        <p style={{ fontSize: '14.31px' }} className="text-muted-foreground">{t('outOfStockDesc')}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Refund Processing */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>{t('refundProcessingTitle')}</h2>
                                <div className="bg-muted/10 p-6 rounded-xl border">
                                    <p style={{ fontSize: '16px' }} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('refundProcessingDesc') }} />
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Need Immediate Help? */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('needHelp')}</h3>
                                    <div className="space-y-3">
                                        <a href="https://wa.me/46769178456" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                                            <MessageCircle className="h-4 w-4 text-primary" />
                                            <span style={{ fontSize: '13.53px' }}>{t('whatsappSupport')}</span>
                                        </a>
                                        <a href={`mailto:${brandProfile.contact.email}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span style={{ fontSize: '13.53px' }}>{t('emailReturns')}</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Store Info */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('returnAddress')}</h3>
                                    <div className="space-y-2 text-muted-foreground" style={{ fontSize: '13.53px' }}>
                                        <p className="font-bold text-foreground">{brandProfile.name}</p>
                                        <p>{brandProfile.address.street}</p>
                                        <p>{brandProfile.address.postalCode} {brandProfile.address.area}</p>
                                        <p>{brandProfile.address.city}, {brandProfile.address.country}</p>
                                    </div>
                                </div>

                                {/* FAQ Link */}
                                <div className="border rounded-lg p-6 bg-muted/30">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('quickQuestions')}</h3>
                                    <div className="space-y-2">
                                        <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('quickQuestionsDesc')}</p>
                                        <Link href="/faq" className="block text-primary hover:underline font-medium" style={{ fontSize: '14.31px' }}>{t('visitFaq')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
