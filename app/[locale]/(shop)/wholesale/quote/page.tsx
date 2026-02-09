import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { QuoteRequestFormPro } from '@/components/wholesale/quote-request-form-pro';
import { ClipboardList, Phone, Mail, Clock, Building2, Package, CheckCircle2, Sparkles } from 'lucide-react';
import { brandProfile } from '@/config/brand-profile';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quotePage' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function WholesaleQuotePage() {
    const t = await getTranslations('quotePage');

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Header */}
            <div className="bg-[#A80E13] py-20 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A80E13] to-neutral-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="site-container px-4 relative z-10">
                    <div className="inline-block mb-4">
                        <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20">
                            {t('badge')}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-heading">{t('title')}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="site-container px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-100 p-6 md:p-10">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">{t('buildQuote')}</h2>
                                    <p className="text-sm text-slate-600">
                                        {t('buildQuoteDesc')}
                                    </p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                                    <Sparkles className="w-3 h-3" />
                                    <span>{t('enhancedForm')}</span>
                                </div>
                            </div>
                            <QuoteRequestFormPro />
                        </div>
                    </div>

                    {/* Contact Info Column */}
                    <div className="space-y-6">
                        {/* Response Time Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-[#A80E13]">
                                <Clock className="w-5 h-5" />
                                {t('responseTitle')}
                            </h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                {t('responseDesc')}
                            </p>

                            <div className="space-y-5 pt-2">
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{t('salesLine')}</p>
                                        <a href={`tel:${brandProfile.contact.phone}`} className="text-lg font-bold text-[#A80E13] hover:underline decoration-2 underline-offset-4">
                                            {brandProfile.contact.phone}
                                        </a>
                                        <p className="text-xs text-slate-500 mt-1">{t('salesHours')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{t('wholesaleEmail')}</p>
                                        <a href={`mailto:${brandProfile.contact.email}`} className="text-base font-bold text-[#A80E13] hover:underline decoration-2 underline-offset-4 break-all">
                                            {brandProfile.contact.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What's Next Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-slate-900">
                                <ClipboardList className="w-5 h-5 text-[#A80E13]" />
                                {t('howItWorks')}
                            </h3>
                            <ul className="space-y-4 text-sm">
                                {[
                                    t('step1'),
                                    t('step2'),
                                    t('step3'),
                                    t('step4'),
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <span className="flex-none w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">{i + 1}</span>
                                        <span className="text-slate-600 leading-snug pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Featured Products Card */}
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-slate-900">
                                <Package className="w-5 h-5 text-[#A80E13]" />
                                {t('popularItems')}
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                {[
                                    'Anmol Electric Tandoor (Multiple Sizes)',
                                    'Ocean Pearl Basmati Rice (5kg cases)',
                                    'Khanum Butter Ghee (6x2kg cases)',
                                    'TRS Gram Flour (6x2kg cases)',
                                    'Mat Olja & Frityrolja (10L bulk)',
                                    'Nordic Sugar (25kg bags)',
                                    'Dried Milk Powder (25kg bulk)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#A80E13] flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-slate-500 mt-4 italic">
                                {t('popularNote')}
                            </p>
                        </div>

                        {/* Business Account CTA */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                                <Building2 className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading relative z-10">{t('fasterAccess')}</h3>
                            <p className="text-sm text-white/70 mb-6 relative z-10 leading-relaxed">
                                {t('fasterDesc')}
                            </p>
                            <Link
                                href="/wholesale/register"
                                className="inline-flex items-center text-white font-bold hover:text-[#A80E13] transition-colors relative z-10 group"
                            >
                                {t('registerAccount')}
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
