import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { brandConfig } from "@/config/brand.config";
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, Warehouse } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/contact',
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contactPage');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
        <div className="site-container py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('heroSubtitle')}
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
              {/* Direct Contact Methods */}
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  {t('directContact')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('whatsappTitle')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('whatsappDesc')}
                    </p>
                    <a
                      href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-sm"
                    >
                      {brandConfig.contact.phone} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('callTitle')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('callDesc')}
                    </p>
                    <a
                      href={`tel:${brandConfig.contact.phone}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {brandConfig.contact.phone}
                    </a>
                  </div>

                  {/* Email - Wholesale */}
                  <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('wholesaleTitle')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('wholesaleDesc')}
                    </p>
                    <a
                      href={`mailto:${brandConfig.contact.reservationEmail}`}
                      className="text-primary hover:underline font-medium text-sm break-all"
                    >
                      {brandConfig.contact.reservationEmail}
                    </a>
                  </div>

                  {/* Email - General */}
                  <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('generalTitle')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('generalDesc')}
                    </p>
                    <a
                      href={`mailto:${brandConfig.contact.email}`}
                      className="text-primary hover:underline font-medium text-sm break-all"
                    >
                      {brandConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {t('sendMessage')}
                </h2>
                <div className="p-8 rounded-xl border bg-card">
                  <p className="text-muted-foreground mb-6">
                    {t('formIntro')}
                  </p>
                  <ContactForm />
                </div>
              </div>

              {/* Warehouse Visit */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Warehouse className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t('visitWarehouse')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('visitDesc')}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{brandConfig.contact.address}</span>
                      </div>
                      <a
                        href={brandConfig.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm ml-6"
                      >
                        {t('viewOnMaps')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Operating Hours */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t('warehouseHours')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-1">{t('monFri')}</p>
                      <p className="text-sm text-muted-foreground">{brandConfig.hours.weekday}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{t('saturday')}</p>
                      <p className="text-sm text-muted-foreground">{brandConfig.hours.saturday}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{t('sunday')}</p>
                      <p className="text-sm text-muted-foreground">{brandConfig.hours.sunday}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> {t('hoursNote')}
                    </p>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-card">
                  <GoogleMapCompact />
                  <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                    <p className="text-xs text-center text-muted-foreground">
                      Fagerstagatan 13, 163 53 Spånga, Stockholm
                    </p>
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
                    <Link href="/wholesale/quote" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                      {t('linkQuote')}
                    </Link>
                    <Link href="/delivery-information" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                      {t('linkDelivery')}
                    </Link>
                    <Link href="/faq" className="block p-2 rounded hover:bg-background transition-colors text-sm">
                      {t('linkFaq')}
                    </Link>
                  </div>
                </div>

                {/* Response Time */}
                <div className="border rounded-lg p-6 bg-primary/5 border-primary/20">
                  <h3 className="text-lg font-semibold mb-2">{t('responseTime')}</h3>
                  <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('responseDesc') }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
