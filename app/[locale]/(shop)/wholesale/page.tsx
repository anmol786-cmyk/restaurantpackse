import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import {
    Building2,
    Truck,
    Tag,
    ShieldCheck,
    Zap,
    Package,
    ArrowRight,
    Globe,
    CheckCircle2,
    PhoneCall,
    Mail,
    Factory,
    Users,
    Award,
    TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { brandProfile } from '@/config/brand-profile';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'wholesaleLanding' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function WholesaleLandingPage() {
    const t = await getTranslations('wholesaleLanding');

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                        alt="Professional Restaurant Kitchen"
                        fill
                        className="object-cover opacity-40 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#A80E13] via-[#A80E13]/80 to-transparent" />
                </div>

                <div className="container relative z-10 px-4">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-block mb-4">
                            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                {t('badge')}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            {t('heroTitle')} <span className="text-primary">{t('heroHighlight')}</span>
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-xl leading-relaxed">
                            {t('heroDesc')}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
                                <Link href="/wholesale/register">{t('openAccount')}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">
                                <Link href="/wholesale/quote">{t('requestQuote')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <div className="bg-white border-b relative z-20 -mt-10 mx-4 lg:mx-auto container rounded-xl shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { icon: Users, label: t('statPartners'), value: t('statPartnersValue') },
                    { icon: Package, label: t('statProducts'), value: t('statProductsValue') },
                    { icon: Truck, label: t('statFleet'), value: t('statFleetValue') },
                    { icon: Globe, label: t('statEurope'), value: t('statEuropeValue') },
                ].map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Brand Story */}
            <section className="py-20 bg-white">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                                alt="Anmol Sweets & Restaurant"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                                    {t('storyBadge')}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                {t('storyTitle')}
                            </h2>
                            <div className="space-y-4 text-neutral-600 text-lg leading-relaxed">
                                <p dangerouslySetInnerHTML={{ __html: t('storyP1') }} />
                                <p>
                                    {t('storyP2')}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="flex items-start gap-3">
                                    <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-neutral-900">{t('unmatchedAuth')}</p>
                                        <p className="text-sm text-neutral-600">{t('unmatchedAuthDesc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Factory className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-neutral-900">{t('manufacturer')}</p>
                                        <p className="text-sm text-neutral-600">{t('manufacturerDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Benefits */}
            <section className="py-24 bg-neutral-50">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('whyChooseTitle')}</h2>
                        <p className="text-neutral-600 text-lg">
                            {t('whyChooseDesc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: t('benefit1Title'), desc: t('benefit1Desc'), icon: Tag },
                            { title: t('benefit2Title'), desc: t('benefit2Desc'), icon: Truck },
                            { title: t('benefit3Title'), desc: t('benefit3Desc'), icon: Factory },
                            { title: t('benefit4Title'), desc: t('benefit4Desc'), icon: Package },
                            { title: t('benefit5Title'), desc: t('benefit5Desc'), icon: Globe },
                            { title: t('benefit6Title'), desc: t('benefit6Desc'), icon: ShieldCheck },
                        ].map((benefit, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('portfolioTitle')}</h2>
                        <p className="text-neutral-600 text-lg">
                            {t('portfolioDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                category: t('catSignature'),
                                items: ['Anmol Electric Tandoor', 'Professional kitchen tools'],
                                icon: Factory,
                                color: 'bg-red-50 text-red-600'
                            },
                            {
                                category: t('catRice'),
                                items: ['Ocean Pearl Basmati (5kg)', 'Restaurant-grade quality'],
                                icon: Package,
                                color: 'bg-amber-50 text-amber-600'
                            },
                            {
                                category: t('catOils'),
                                items: ['Khanum Butter Ghee (6x2kg)', 'Mat Olja & Frityrolja (10L)'],
                                icon: Package,
                                color: 'bg-green-50 text-green-600'
                            },
                            {
                                category: t('catStaples'),
                                items: ['TRS Gram Flour (6x2kg)', 'Nordic Sugar (25kg)', 'Milk Powder (25kg)'],
                                icon: Package,
                                color: 'bg-primary/10 text-primary'
                            },
                        ].map((product, i) => (
                            <div key={i} className="p-6 rounded-xl border bg-gradient-to-br from-white to-neutral-50 hover:shadow-lg transition-shadow">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${product.color} mb-4`}>
                                    <product.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{product.category}</h3>
                                <ul className="space-y-1.5">
                                    {product.items.map((item, idx) => (
                                        <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-lg">
                            {t('browseCatalog')} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tandoor Spotlight */}
            <section className="py-24 bg-[#A80E13] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574966740793-34d9dfdc8640?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="container px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 px-4 py-1 text-sm font-bold">
                            {t('tandoorBadge')}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            {t('tandoorTitle')}
                        </h2>
                        <p className="text-lg text-neutral-300 leading-relaxed">
                            {t('tandoorDesc')}
                        </p>
                        <ul className="space-y-3">
                            {[
                                t('tandoorFeature1'),
                                t('tandoorFeature2'),
                                t('tandoorFeature3'),
                                t('tandoorFeature4'),
                                t('tandoorFeature5'),
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button asChild size="lg" variant="secondary" className="h-14 px-8">
                            <Link href="/shop?category=equipment">{t('viewTandoorModels')} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                        </Button>
                    </div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                        <Image
                            src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/front-graphics.png"
                            alt="Anmol Electric Tandoor in Professional Kitchen"
                            fill
                            className="object-cover object-left"
                        />
                    </div>
                </div>
            </section>

            {/* Logistics & Distribution */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('logisticsTitle')}</h2>
                        <p className="text-neutral-600 text-lg">
                            {t('logisticsDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: t('ownFleetTitle'),
                                desc: t('ownFleetDesc'),
                                icon: Truck,
                                link: '/delivery-information'
                            },
                            {
                                title: t('dhlTitle'),
                                desc: t('dhlDesc'),
                                icon: Globe,
                                link: '/europe-delivery'
                            },
                            {
                                title: t('exWarehouseTitle'),
                                desc: t('exWarehouseDesc'),
                                icon: Building2,
                                link: '/delivery-information'
                            },
                        ].map((method, i) => (
                            <Link key={i} href={method.link} className="block p-8 rounded-2xl border bg-gradient-to-br from-white to-neutral-50 hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{method.desc}</p>
                                <div className="mt-6 inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                                    Learn More <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#A80E13] text-white">
                <div className="container px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                            {t('ctaTitle')}
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                            {t('ctaDesc')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold bg-[#005c4b] hover:bg-[#004a3c] text-white border-0 shadow-lg">
                                <Link href="/wholesale/register">{t('ctaOpenAccount')}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-[#bf2026] text-white border-white/20 hover:bg-[#a61b21] hover:text-white">
                                <Link href="/wholesale/quote">{t('ctaRequestPriceList')}</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
                            {/* Column 1: Sales Team */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 mb-2">
                                    <PhoneCall className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t('salesTeam')}</span>
                                </div>
                                <p className="text-lg font-bold text-white">{brandProfile.contact.phone}</p>
                                <p className="text-sm text-white/60">Mon-Fri: 10am - 8pm</p>
                            </div>

                            {/* Column 2: Email */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 mb-2">
                                    <Mail className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t('wholesaleEmail')}</span>
                                </div>
                                <p className="text-lg font-bold text-white">{brandProfile.contact.email}</p>
                                <p className="text-sm text-white/60">{t('responseWithin24h')}</p>
                            </div>

                            {/* Column 3: Hours */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 mb-2">
                                    <Building2 className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t('operatingHours')}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-white">Mon-Fri: 10 AM - 8 PM</p>
                                    <p className="text-sm text-white">Sat-Sun: 11 AM - 7 PM</p>
                                </div>
                            </div>

                            {/* Column 4: Warehouse */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 mb-2">
                                    <Truck className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t('warehousePickup')}</span>
                                </div>
                                <p className="text-sm text-white leading-relaxed">
                                    Fagerstagatan 13,<br />
                                    163 53 Sp&aring;nga, Sweden
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border ${className}`}>
            {children}
        </span>
    );
}
