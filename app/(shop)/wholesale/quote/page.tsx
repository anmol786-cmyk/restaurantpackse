import { Metadata } from 'next';
import Link from 'next/link';
import { QuoteRequestForm } from '@/components/wholesale/quote-request-form';
import { ClipboardList, Phone, Mail, Clock, Building2, Package, TrendingUp, CheckCircle2 } from 'lucide-react';
import { brandProfile } from '@/config/brand-profile';

export const metadata: Metadata = {
    title: 'Request Wholesale Quote | Anmol Wholesale - Bulk Pricing for Restaurants & Grocery Stores',
    description: 'Get customized wholesale pricing for bulk orders, pallet quantities, and recurring supplies. Our B2B team provides competitive rates for restaurants, grocery stores, and caterers across Sweden and Europe.',
};

export default function WholesaleQuotePage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Header */}
            <div className="bg-[#A80E13] py-20 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A80E13] to-neutral-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="site-container px-4 relative z-10">
                    <div className="inline-block mb-4">
                        <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20">
                            From Our Restaurant Kitchen to Yours
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-heading">Request a Wholesale Quote</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
                        Get personalized B2B pricing for bulk orders, pallet quantities, or recurring restaurant supplies.
                        We understand the needs of professional kitchens—because we run one ourselves.
                    </p>
                </div>
            </div>

            <div className="site-container px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-100 p-6 md:p-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 font-heading">What would you like to order?</h2>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Tell us about your business needs. Our wholesale team will review your request and provide competitive pricing
                                    based on order volumes, delivery location, and recurring order potential.
                                </p>
                            </div>
                            <QuoteRequestForm />
                        </div>
                    </div>

                    {/* Contact Info Column */}
                    <div className="space-y-6">
                        {/* Response Time Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-[#A80E13]">
                                <Clock className="w-5 h-5" />
                                Response Time
                            </h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Our B2B sales team reviews all wholesale quote requests within 24 hours on business days (Monday - Friday).
                                For urgent orders or immediate assistance, contact us directly.
                            </p>

                            <div className="space-y-5 pt-2">
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">B2B Sales Direct Line</p>
                                        <a href={`tel:${brandProfile.contact.phone}`} className="text-lg font-bold text-[#A80E13] hover:underline decoration-2 underline-offset-4">
                                            {brandProfile.contact.phone}
                                        </a>
                                        <p className="text-xs text-slate-500 mt-1">Mon-Fri: 10 AM - 8 PM | Sat-Sun: 11 AM - 7 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Wholesale Email</p>
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
                                How It Works
                            </h3>
                            <ul className="space-y-4 text-sm">
                                {[
                                    "We receive your product list and review availability at our Spånga warehouse.",
                                    "Our team calculates wholesale pricing based on your order volumes and delivery needs.",
                                    "You receive a detailed quote via email with itemized pricing and delivery options.",
                                    "Once approved, we coordinate delivery (own fleet, DHL, or Ex-Warehouse pickup)."
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
                                Popular Wholesale Items
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
                                And many more authentic Indo-Pak ingredients for professional kitchens.
                            </p>
                        </div>

                        {/* Business Account CTA */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                                <Building2 className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading relative z-10">Want Faster Access?</h3>
                            <p className="text-sm text-white/70 mb-6 relative z-10 leading-relaxed">
                                Create a verified B2B account for instant wholesale pricing on standard catalog items,
                                streamlined reordering, and dedicated account management.
                            </p>
                            <Link
                                href="/wholesale/register"
                                className="inline-flex items-center text-white font-bold hover:text-[#A80E13] transition-colors relative z-10 group"
                            >
                                Register Business Account
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
