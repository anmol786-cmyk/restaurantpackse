import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { getTranslations } from 'next-intl/server';
import { FileText, ShoppingCart, CreditCard, Truck, Scale, Shield, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsConditions' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/terms-conditions',
    },
  };
}

export default async function TermsConditionsPage() {
  const t = await getTranslations('termsConditions');

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
              {/* Introduction */}
              <div>
                <p className="text-muted-foreground mb-4" style={{ fontSize: '14.31px' }}>{t('lastUpdated')}</p>
                <div className="space-y-6 text-muted-foreground" style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.52,
                  letterSpacing: '0.03em'
                }}>
                  <p>
                    {t('introText', { businessName: brandProfile.name, websiteUrl: brandProfile.website.url })}
                  </p>
                </div>
              </div>

              {/* General Use & Orders */}
              <div className="grid sm:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {t('generalUseTitle')}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                    {t('generalUseItems').split('|').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    {t('ordersTitle')}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                    {t('ordersItems').split('|').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Pricing & Delivery */}
              <div className="grid sm:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t('pricingTitle')}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                    {t('pricingItems').split('|').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    {t('deliveryTitle')}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                    {t('deliveryItems').split('|').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Intellectual Property */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  {t('ipTitle')}
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" style={{ fontSize: '15.13px' }}>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t('ipDesc1', { businessName: brandProfile.name })}</li>
                    <li>{t('ipDesc2')}</li>
                  </ul>
                </div>
              </section>

              {/* Legal & Liability */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  {t('liabilityTitle')}
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" style={{ fontSize: '15.13px' }}>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t('liabilityDesc1')}</li>
                    <li>{t('liabilityDesc2')}</li>
                    <li>{t('liabilityDesc3')}</li>
                  </ul>
                </div>
              </section>

              {/* Governing Law */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{t('governingLawTitle')}</h2>
                <div className="p-6 rounded-xl border bg-muted/5 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                  <p>{t('governingLawDesc')}</p>
                </div>
              </section>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Legal Entities */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('legalEntity')}</h3>
                  <div className="space-y-2 text-muted-foreground" style={{ fontSize: '13.53px' }}>
                    <p className="font-bold text-foreground">{t('legalEntityName')}</p>
                    <p>{brandProfile.address.street}</p>
                    <p>{brandProfile.address.postalCode} {brandProfile.address.area}</p>
                    <p>{brandProfile.address.city}, {brandProfile.address.country}</p>
                  </div>
                </div>

                {/* Questions */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('haveQuestions')}</h3>
                  <div className="space-y-3">
                    <a href={`mailto:${brandProfile.contact.email}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                      <Mail className="h-4 w-4 text-primary" />
                      <span style={{ fontSize: '13.53px' }}>{brandProfile.contact.email}</span>
                    </a>
                    <a href="https://wa.me/46769178456" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span style={{ fontSize: '13.53px' }}>{t('whatsappSupport')}</span>
                    </a>
                  </div>
                </div>

                {/* Related Links */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('relatedPolicies')}</h3>
                  <div className="space-y-2">
                    <Link href="/privacy-policy" className="block text-primary hover:underline" style={{ fontSize: '14.31px' }}>Privacy Policy</Link>
                    <Link href="/refund-return" className="block text-primary hover:underline" style={{ fontSize: '14.31px' }}>Refund & Return Policy</Link>
                    <Link href="/delivery-information" className="block text-primary hover:underline" style={{ fontSize: '14.31px' }}>Delivery Information</Link>
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
