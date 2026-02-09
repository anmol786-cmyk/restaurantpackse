import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { QuickOrderFormEnhanced } from '@/components/wholesale/quick-order-form-enhanced';
import { Zap, Package, Clock, CheckCircle, FileSpreadsheet, Save } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quickOrderPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function QuickOrderPage() {
  const t = await getTranslations('quickOrderPage');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#A80E13] to-[#7A0A0E] py-16 text-white">
        <div className="site-container px-4">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20">
                {t('badge')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
              {t('title')}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="site-container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('fastOrdering')}</h3>
              <p className="text-xs text-muted-foreground">{t('fastOrderingDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('smartSearch')}</h3>
              <p className="text-xs text-muted-foreground">{t('smartSearchDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('csvUpload')}</h3>
              <p className="text-xs text-muted-foreground">{t('csvUploadDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-orange-600/10 rounded-lg">
              <Save className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('saveTemplates')}</h3>
              <p className="text-xs text-muted-foreground">{t('saveTemplatesDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('pdfDownload')}</h3>
              <p className="text-xs text-muted-foreground">{t('pdfDownloadDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-pink-600/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{t('emailConfirm')}</h3>
              <p className="text-xs text-muted-foreground">{t('emailConfirmDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="site-container px-4 py-8">
        <QuickOrderFormEnhanced />
      </div>

      {/* Help Section */}
      <div className="site-container px-4 py-12">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 font-heading">{t('howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold mb-2">{t('step1Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('step1Desc')}
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold mb-2">{t('step2Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('step2Desc')}
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold mb-2">{t('step3Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('step3Desc')}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold mb-2">{t('needHelp')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('helpDesc')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+46769178456"
                className="text-sm font-medium text-primary hover:underline"
              >
                +46 76 917 84 56
              </a>
              <a
                href="mailto:wholesale@restaurantpack.se"
                className="text-sm font-medium text-primary hover:underline"
              >
                wholesale@restaurantpack.se
              </a>
              <a
                href="https://wa.me/46769178456"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
