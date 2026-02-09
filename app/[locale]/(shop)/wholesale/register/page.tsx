import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { BusinessRegisterForm } from '@/components/auth/business-register-form';
import { Building2, CheckCircle2, ShieldCheck, Zap, Package, Globe, TrendingUp } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'wholesaleRegister' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function WholesaleRegisterPage() {
    const t = await getTranslations('wholesaleRegister');

    return (
        <div className="site-container relative min-h-[80vh] grid lg:grid-cols-2 gap-8 py-10">
            <div className="relative hidden h-full flex-col bg-[#A80E13] p-10 text-white lg:flex dark:border-r overflow-hidden rounded-l-2xl my-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

                <div className="relative z-20 flex items-center text-lg font-bold font-heading">
                    <Building2 className="mr-2 h-6 w-6" />
                    Anmol Wholesale
                </div>
                <div className="relative z-20 mt-auto">
                    <div className="space-y-6">
                        <div className="inline-block mb-2">
                            <span className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                                {t('badge')}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight font-heading">{t('heroTitle')}</h1>
                        <p className="text-lg text-white/90 leading-relaxed">
                            {t('heroDesc')}
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t('benefit1Title')}</h3>
                                    <p className="text-sm text-white/80">{t('benefit1Desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t('benefit2Title')}</h3>
                                    <p className="text-sm text-white/80">{t('benefit2Desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t('benefit3Title')}</h3>
                                    <p className="text-sm text-white/80">{t('benefit3Desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t('benefit4Title')}</h3>
                                    <p className="text-sm text-white/80">{t('benefit4Desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t('benefit5Title')}</h3>
                                    <p className="text-sm text-white/80">{t('benefit5Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <blockquote className="mt-8 space-y-2 border-l-4 border-white/30 pl-4">
                        <p className="text-sm text-white/90 italic">
                            &ldquo;{t('testimonial')}&rdquo;
                        </p>
                        <footer className="text-sm font-bold text-white">{t('testimonialAuthor')}</footer>
                    </blockquote>
                </div>
            </div>

            <div className="lg:p-8 pt-20 pb-12 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight font-heading text-[#A80E13]">{t('formTitle')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('formSubtitle')}
                        </p>
                    </div>

                    <BusinessRegisterForm />

                    <div className="px-8 space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            {t('haveAccount')}{' '}
                            <Link href="/login" className="underline underline-offset-4 hover:text-[#A80E13] font-medium transition-colors">
                                {t('loginHere')}
                            </Link>
                        </p>

                        <div className="pt-4 border-t text-center">
                            <p className="text-xs text-muted-foreground mb-3">{t('afterReg')}</p>
                            <div className="space-y-2 text-left">
                                {[
                                    t('step1'),
                                    t('step2'),
                                    t('step3'),
                                    t('step4'),
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="flex-none w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center font-bold text-[10px] text-primary border border-primary/20">{i + 1}</span>
                                        <span className="leading-relaxed pt-0.5">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
