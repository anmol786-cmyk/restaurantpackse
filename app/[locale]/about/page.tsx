import { Metadata } from "next";
import Image from "next/image";
import { Link } from '@/i18n/navigation';
import { brandConfig } from "@/config/brand.config";
import { getTranslations } from 'next-intl/server';
import { ShoppingBag, Heart, Users, Award, Truck, Globe, Warehouse, Building2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/about',
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('aboutPage');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b">
        <div className="site-container py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('heroTitle', { businessName: brandConfig.businessName })}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('heroSubtitle', { tagline: brandConfig.tagline })}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="site-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Area (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Our Story */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {t('storyTitle')}
                </h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p className="text-foreground font-semibold text-xl">
                    {t('storyLead')}
                  </p>
                  <p>
                    {t('storyP1')}
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border mt-8">
                    <Image
                      src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png"
                      alt={t('imageAlt')}
                      fill
                      className="object-contain bg-muted"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <p className="mt-8" dangerouslySetInnerHTML={{ __html: t('storyP2') }} />
                </div>
              </div>

              {/* What We Offer */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {t('offerTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: t('offer1Title'),
                      desc: t('offer1Desc'),
                      icon: Award
                    },
                    {
                      title: t('offer2Title'),
                      desc: t('offer2Desc'),
                      icon: ShoppingBag
                    },
                    {
                      title: t('offer3Title'),
                      desc: t('offer3Desc'),
                      icon: Heart
                    },
                    {
                      title: t('offer4Title'),
                      desc: t('offer4Desc'),
                      icon: Users
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border">
                <h2 className="text-3xl font-bold mb-6">
                  {t('whyTitle')}
                </h2>
                <div className="grid gap-6">
                  {[
                    {
                      title: t('why1Title'),
                      desc: t('why1Desc')
                    },
                    {
                      title: t('why2Title'),
                      desc: t('why2Desc')
                    },
                    {
                      title: t('why3Title'),
                      desc: t('why3Desc')
                    },
                    {
                      title: t('why4Title'),
                      desc: t('why4Desc')
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Stats */}
              <div>
                <h2 className="text-3xl font-bold mb-8">{t('statsTitle')}</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { stat: t('stat1Value'), label: t('stat1Label'), desc: t('stat1Desc') },
                    { stat: t('stat2Value'), label: t('stat2Label'), desc: t('stat2Desc') },
                    { stat: t('stat3Value'), label: t('stat3Label'), desc: t('stat3Desc') },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-6 rounded-xl bg-muted/30 border">
                      <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                      <div className="font-semibold mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Our Values */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4">{t('commitmentTitle')}</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <Award className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t('commitQuality')}</p>
                        <p className="text-muted-foreground text-xs">{t('commitQualityDesc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t('commitSupply')}</p>
                        <p className="text-muted-foreground text-xs">{t('commitSupplyDesc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t('commitEurope')}</p>
                        <p className="text-muted-foreground text-xs">{t('commitEuropeDesc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t('commitB2B')}</p>
                        <p className="text-muted-foreground text-xs">{t('commitB2BDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehouse Location */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-primary" />
                    {t('warehouseTitle')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{brandConfig.contact.address}</p>
                    <p className="text-muted-foreground">{t('warehouseDesc')}</p>
                    <a
                      href={brandConfig.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                    >
                      {t('viewOnMaps')}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4">{t('operatingHours')}</h3>
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

                {/* CTA */}
                <div className="border rounded-lg p-6 bg-primary text-primary-foreground">
                  <h3 className="text-lg font-semibold mb-2">{t('ctaTitle')}</h3>
                  <p className="text-sm mb-4 opacity-90">
                    {t('ctaDesc')}
                  </p>
                  <Link
                    href="/wholesale/register"
                    className="block w-full py-3 bg-background text-foreground text-center rounded-lg font-semibold hover:bg-background/90 transition-colors"
                  >
                    {t('ctaButton')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
