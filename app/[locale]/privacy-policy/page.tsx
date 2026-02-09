import { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, Eye, FileText, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/privacy-policy',
    },
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacyPolicy');

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
                    {t('introP1', { businessName: brandProfile.name, websiteUrl: brandProfile.website.url })}
                  </p>
                  <p>
                    {t('introP2')}
                  </p>
                </div>
              </div>

              {/* Data Collection */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  {t('dataCollectionTitle')}
                </h2>
                <div className="space-y-4 text-muted-foreground" style={{ fontSize: '16px' }}>
                  <p>{t('dataCollectionIntro')}</p>
                  <ul className="list-disc pl-6 space-y-4">
                    <li><strong>{t('identityData')}</strong> {t('identityDataDesc')}</li>
                    <li><strong>{t('transactionalData')}</strong> {t('transactionalDataDesc')}</li>
                    <li><strong>{t('technicalData')}</strong> {t('technicalDataDesc')}</li>
                    <li><strong>{t('communicationData')}</strong> {t('communicationDataDesc')}</li>
                  </ul>
                </div>
              </section>

              {/* Data Usage */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  {t('dataUsageTitle')}
                </h2>
                <div className="space-y-4 text-muted-foreground" style={{ fontSize: '16px' }}>
                  <ul className="list-disc pl-6 space-y-4">
                    <li><strong>{t('usageOrderFulfillment')}</strong> {t('usageOrderFulfillmentDesc')}</li>
                    <li><strong>{t('usageCustomerService')}</strong> {t('usageCustomerServiceDesc')}</li>
                    <li><strong>{t('usageImprovements')}</strong> {t('usageImprovementsDesc')}</li>
                    <li><strong>{t('usageMarketing')}</strong> {t('usageMarketingDesc')}</li>
                    <li><strong>{t('usageSecurity')}</strong> {t('usageSecurityDesc')}</li>
                  </ul>
                </div>
              </section>

              {/* Cookies */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>{t('cookiesTitle')}</h2>
                <div className="p-6 rounded-xl border bg-card/50 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                  <p className="mb-4">{t('cookiesIntro')}</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>{t('essentialCookies')}</strong> {t('essentialCookiesDesc')}</li>
                    <li><strong>{t('performanceCookies')}</strong> {t('performanceCookiesDesc')}</li>
                    <li><strong>{t('marketingCookies')}</strong> {t('marketingCookiesDesc')}</li>
                  </ul>
                </div>
              </section>

              {/* GDPR Rights */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  {t('gdprTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {t('gdprRights').split('|').map((right: string, i: number) => (
                    <div key={i} className="p-4 rounded-lg border bg-card/50">
                      <p style={{ fontSize: '15.13px', fontWeight: 500 }}>{right}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm italic text-muted-foreground">{t('gdprExercise', { email: brandProfile.contact.email })}</p>
              </section>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Data Controller */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('dataController')}</h3>
                  <div className="space-y-2 text-muted-foreground" style={{ fontSize: '13.53px' }}>
                    <p className="font-bold text-foreground">Anmol AB</p>
                    <p>{brandProfile.address.street}</p>
                    <p>{brandProfile.address.postalCode} {brandProfile.address.area}</p>
                    <p>{brandProfile.address.city}, {brandProfile.address.country}</p>
                  </div>
                </div>

                {/* Privacy Contact */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('privacyInquiries')}</h3>
                  <div className="space-y-3">
                    <a href={`mailto:${brandProfile.contact.email}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                      <Mail className="h-4 w-4 text-primary" />
                      <span style={{ fontSize: '13.53px' }}>{brandProfile.contact.email}</span>
                    </a>
                    <a href="https://wa.me/46769178456" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span style={{ fontSize: '13.53px' }}>{t('privacyWhatsApp')}</span>
                    </a>
                  </div>
                </div>

                {/* Other Policies */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('otherPolicies')}</h3>
                  <div className="space-y-2">
                    <Link href="/terms-conditions" className="block text-primary hover:underline" style={{ fontSize: '14.31px' }}>Terms & Conditions</Link>
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
