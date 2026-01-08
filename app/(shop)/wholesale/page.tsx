import { Metadata } from 'next';
import Link from 'next/link';
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
    Mail
} from 'lucide-react';
import Image from 'next/image';
import { brandConfig } from '@/config/brand.config';

export const metadata: Metadata = {
    title: 'Wholesale & B2B Solutions | Anmol Wholesale',
    description: 'Sweden\'s trusted B2B supplier for restaurants and grocers. Exclusive wholesale pricing, bulk ingredients, and international shipping.',
};

export default function WholesaleLandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop"
                        alt="Commercial Kitchen"
                        fill
                        className="object-cover opacity-40 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>

                <div className="container relative z-10 px-4">
                    <div className="max-w-3xl space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            Fuel Your Business with <span className="text-primary">Anmol Wholesale</span>
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-xl">
                            Professional restaurant supplies, authentic Indo-Pak ingredients, and the world-famous Anmol Electric Tandoor. All in one place.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
                                <Link href="/wholesale/register">Register Business Account</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">
                                <Link href="/wholesale/quote">Request Custom Quote</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <div className="bg-white border-b relative z-20 -mt-10 mx-4 lg:mx-auto container rounded-xl shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { icon: Building2, label: 'Verified Partners', value: '500+' },
                    { icon: Package, label: 'SKUs in Stock', value: '2,000+' },
                    { icon: Truck, label: 'Stockholm Areas', value: 'Own Fleet' },
                    { icon: Globe, label: 'Europe Delivery', value: 'DHL/PostNord' },
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

            {/* Core Benefits */}
            <section className="py-24 bg-neutral-50">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Professional Edge</h2>
                        <p className="text-neutral-600">
                            We understand the restaurant business because we are in the restaurant business.
                            Our supply chain is optimized for quality and reliability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Tiered B2B Pricing',
                                desc: 'Save more as you grow. Our transparent tiered pricing structure rewards volume orders with up to 20% discounts.',
                                icon: Tag,
                            },
                            {
                                title: 'Exclusive Inventory',
                                desc: 'Access products not available to the public, including restaurant-grade basmati rice, case-pack spices, and custom machinery.',
                                icon: Package,
                            },
                            {
                                title: 'Credit Terms',
                                desc: 'Verified business partners enjoy flexible payment options including Net 30 and Net 60 invoicing.',
                                icon: ShieldCheck,
                            },
                            {
                                title: 'Express Fulfillment',
                                desc: 'Stockholm-based warehouse ensures next-day delivery via our own fleet or coordinated ex-warehouse pickup.',
                                icon: Zap,
                            },
                            {
                                title: 'European Logistics',
                                desc: 'Expanding across the Nordics? We ship to Germany, Norway, Finland, and Denmark via DHL and DB Schenker.',
                                icon: Globe,
                            },
                            {
                                title: 'Expert Support',
                                desc: 'Dedicated account managers who speak the language of food service. We help you source what you need.',
                                icon: CheckCircle2,
                            },
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

            {/* Tandoor Promo */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-sm font-bold">
                            Sole Manufacturer
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            The Anmol Electric Tandoor
                        </h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Designed for high-performance commercial use. No charcoal, no mess, just authentic results.
                            Manufactured exclusively by us for the European market.
                        </p>
                        <ul className="space-y-3">
                            {['CE Certified for European Standards', 'High-Efficiency Insulation', 'Instant Start & Precise Temperature Control', 'Durable Stainless Steel Construction'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button asChild size="lg" className="h-14 px-8">
                            <Link href="/shop?category=tandoors">View Models & Specs <ArrowRight className="ml-2 w-5 h-5" /></Link>
                        </Button>
                    </div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1544681280-d25a780adc9b?q=80&w=2000&auto=format&fit=crop"
                            alt="Electric Tandoor"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-white text-center">
                <div className="container px-4 max-w-3xl space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to optimize your supply chain?</h2>
                    <p className="text-xl text-primary-foreground/80">
                        Join our network of professional chefs, restaurateurs, and retailers today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                            <Link href="/wholesale/register">Open Business Account</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-white/10 border-white/20 hover:bg-white/20">
                            <Link href="/wholesale/quote">Request Price List</Link>
                        </Button>
                    </div>
                    <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-center gap-4">
                            <PhoneCall className="w-6 h-6" />
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-bold">Call our Sales Team</p>
                                <p className="text-lg font-bold">{brandConfig.contact.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Mail className="w-6 h-6" />
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-bold">Email Wholesale Dept</p>
                                <p className="text-lg font-bold">{brandConfig.contact.reservationEmail}</p>
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
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
