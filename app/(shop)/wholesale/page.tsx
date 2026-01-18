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
    Mail,
    Factory,
    Users,
    Award,
    TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { brandProfile } from '@/config/brand-profile';

export const metadata: Metadata = {
    title: 'B2B Wholesale Hub | 15% Lower Prices | Anmol Wholesale Stockholm',
    description: 'The primary B2B hub for authentic Indo-Pak ingredients & equipment. 15% lower prices, restaurateur-backed quality, and own delivery fleet. Direct manufacturer of Anmol Electric Tandoor. Partner with Stockholm\'s experts.',
};

export default function WholesaleLandingPage() {
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
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>

                <div className="container relative z-10 px-4">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-block mb-4">
                            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                From Our Restaurant Kitchen to Yours
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            Power Your Business with <span className="text-primary">Anmol Wholesale</span>
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-xl leading-relaxed">
                            Authentic Indo-Pak ingredients, professional kitchen equipment, and the exclusive Anmol Electric Tandoor. Born from Anmol Sweets & Restaurant, trusted by professional kitchens across Sweden and Europe.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
                                <Link href="/wholesale/register">Open B2B Account</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">
                                <Link href="/wholesale/quote">Request Bulk Quote</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <div className="bg-white border-b relative z-20 -mt-10 mx-4 lg:mx-auto container rounded-xl shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { icon: Users, label: 'B2B Partners', value: 'Sweden & EU' },
                    { icon: Package, label: 'Product Categories', value: 'Bulk Staples' },
                    { icon: Truck, label: 'Stockholm Fleet', value: 'Own Delivery' },
                    { icon: Globe, label: 'European Reach', value: 'DHL/Schenker' },
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
                                    Our Story
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                We Are Restaurateurs. We Understand Your Needs.
                            </h2>
                            <div className="space-y-4 text-neutral-600 text-lg leading-relaxed">
                                <p>
                                    Anmol Wholesale was born from the success of <strong className="text-neutral-900">Anmol Sweets & Restaurant</strong>, a beloved culinary landmark in Stockholm. We are not just suppliers—we are chefs, restaurateurs, and food industry professionals who understand the pressures of a professional kitchen.
                                </p>
                                <p>
                                    We sell what we would confidently use ourselves. Every ingredient, every piece of equipment, and every product in our catalog has been tested in our own restaurant kitchen. That's our guarantee of quality.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="flex items-start gap-3">
                                    <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-neutral-900">Unmatched Authenticity</p>
                                        <p className="text-sm text-neutral-600">Trusted by Indo-Pak food businesses</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Factory className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-neutral-900">Manufacturer</p>
                                        <p className="text-sm text-neutral-600">We make the Anmol Electric Tandoor</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Anmol Wholesale?</h2>
                        <p className="text-neutral-600 text-lg">
                            We offer a complete B2B solution tailored for professional kitchens, grocery stores, and catering businesses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Competitive B2B Pricing',
                                desc: 'Wholesale pricing on case and pallet quantities. Volume discounts available for bulk orders and recurring customers.',
                                icon: Tag,
                            },
                            {
                                title: 'Hybrid Distribution Model',
                                desc: 'Own fleet for Stockholm deliveries, DHL/Schenker partnership for Sweden & Europe, plus Ex-Warehouse pickup options.',
                                icon: Truck,
                            },
                            {
                                title: 'Signature Manufactured Equipment',
                                desc: 'Exclusive access to the Anmol Electric Tandoor—manufactured by us for authentic Indo-Pak cuisine at scale.',
                                icon: Factory,
                            },
                            {
                                title: 'Trusted Brands',
                                desc: 'Ocean Pearl Basmati Rice, Khanum Butter Ghee, TRS Gram Flour, and premium bulk ingredients we use in our own kitchen.',
                                icon: Package,
                            },
                            {
                                title: 'European Expansion Support',
                                desc: 'We ship to Germany, Norway, Finland, UK, and Spain. Expand your business across Europe with our logistics network.',
                                icon: Globe,
                            },
                            {
                                title: 'Partner-Oriented Service',
                                desc: 'Dedicated account management, flexible payment terms for verified businesses, and supply chain reliability you can trust.',
                                icon: ShieldCheck,
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

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Product Portfolio</h2>
                        <p className="text-neutral-600 text-lg">
                            From signature equipment to bulk staples—everything your professional kitchen needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                category: 'Signature Equipment',
                                items: ['Anmol Electric Tandoor', 'Professional kitchen tools'],
                                icon: Factory,
                                color: 'bg-red-50 text-red-600'
                            },
                            {
                                category: 'Premium Basmati Rice',
                                items: ['Ocean Pearl Basmati (5kg)', 'Restaurant-grade quality'],
                                icon: Package,
                                color: 'bg-amber-50 text-amber-600'
                            },
                            {
                                category: 'Oils & Ghee',
                                items: ['Khanum Butter Ghee (6x2kg)', 'Mat Olja & Frityrolja (10L)'],
                                icon: Package,
                                color: 'bg-green-50 text-green-600'
                            },
                            {
                                category: 'Bulk Staples',
                                items: ['TRS Gram Flour (6x2kg)', 'Nordic Sugar (25kg)', 'Milk Powder (25kg)'],
                                icon: Package,
                                color: 'bg-blue-50 text-blue-600'
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
                            Browse Full Wholesale Catalog <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tandoor Spotlight */}
            <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574966740793-34d9dfdc8640?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="container px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 px-4 py-1 text-sm font-bold">
                            Manufactured by Anmol Wholesale
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            The Anmol Electric Tandoor
                        </h2>
                        <p className="text-lg text-neutral-300 leading-relaxed">
                            Designed for high-performance commercial kitchens across Europe. No charcoal, no mess—just authentic Indo-Pak tandoor cooking with precise temperature control. We are the direct manufacturer, giving you unbeatable pricing and support.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'CE Certified for European Market Standards',
                                'High-Efficiency Insulation for Energy Savings',
                                'Instant Start & Precise Temperature Control',
                                'Durable Stainless Steel Commercial Construction',
                                'Multiple Sizes for Different Kitchen Capacities'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button asChild size="lg" variant="secondary" className="h-14 px-8">
                            <Link href="/shop?category=equipment">View Tandoor Models & Specs <ArrowRight className="ml-2 w-5 h-5" /></Link>
                        </Button>
                    </div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                        <Image
                            src="https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2070&auto=format&fit=crop"
                            alt="Anmol Electric Tandoor in Professional Kitchen"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Logistics & Distribution */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Flexible Logistics Solutions</h2>
                        <p className="text-neutral-600 text-lg">
                            Choose the delivery method that works best for your business operations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Own Fleet - Stockholm',
                                desc: 'Dedicated delivery service covering all of Stockholm and surrounding municipalities. Flexible scheduling for bulk orders.',
                                icon: Truck,
                                link: '/delivery-information'
                            },
                            {
                                title: 'DHL Partnership - Europe',
                                desc: 'Reliable shipping across Sweden, Scandinavia, and key European markets including Germany, Norway, Finland, UK, and Spain.',
                                icon: Globe,
                                link: '/europe-delivery'
                            },
                            {
                                title: 'Ex-Warehouse - Spånga',
                                desc: 'Pickup directly from our warehouse at Fagerstagatan 13, Spånga. Use your own logistics partner for maximum cost efficiency.',
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
            <section className="py-24 bg-primary text-white text-center">
                <div className="container px-4 max-w-3xl space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Partner with Anmol Wholesale?</h2>
                    <p className="text-xl text-primary-foreground/90">
                        Join our network of professional chefs, restaurateurs, grocery stores, and caterers. Experience the difference of working with suppliers who truly understand the food business.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                            <Link href="/wholesale/register">Open B2B Account</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-white/10 border-white/20 hover:bg-white/20">
                            <Link href="/wholesale/quote">Request Price List</Link>
                        </Button>
                    </div>
                    <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-center gap-4">
                            <PhoneCall className="w-6 h-6" />
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-bold">B2B Sales Team</p>
                                <p className="text-lg font-bold">{brandProfile.contact.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Mail className="w-6 h-6" />
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-bold">Wholesale Email</p>
                                <p className="text-lg font-bold">{brandProfile.contact.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 text-sm text-primary-foreground/70">
                        <p><strong>Operating Hours:</strong> Mon-Fri: 10 AM - 8 PM | Sat-Sun: 11 AM - 7 PM</p>
                        <p className="mt-2"><strong>Warehouse:</strong> Fagerstagatan 13, 163 53 Spånga, Sweden</p>
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
