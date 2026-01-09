import { Metadata } from 'next';
import Link from 'next/link';
import { QuoteRequestForm } from '@/components/wholesale/quote-request-form';
import { ClipboardList, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { brandConfig } from '@/config/brand.config';

export const metadata: Metadata = {
    title: 'Request a Wholesale Quote | Anmol Wholesale',
    description: 'Request group or bulk pricing for your restaurant or business. Our B2B team will provide you with the best rates for your culinary needs.',
};

export default function WholesaleQuotePage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Header */}
            <div className="bg-[#A80E13] py-20 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A80E13] to-neutral-900 opacity-90" />
                <div className="site-container px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-heading">Request a Wholesale Quote</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Get personalized pricing for bulk orders, pallet quantities, or recurring restaurant supplies.
                    </p>
                </div>
            </div>

            <div className="site-container px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-100 p-6 md:p-10">
                            <QuoteRequestForm />
                        </div>
                    </div>

                    {/* Contact Info Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-[#A80E13]">
                                <Clock className="w-5 h-5" />
                                Response Time
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                Our dedicated wholesale team reviews all requests within 24 hours (Monday - Friday).
                                For urgent inquiries, please call us directly.
                            </p>

                            <div className="space-y-5 pt-2">
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Direct Wholesale Line</p>
                                        <a href={`tel:${brandConfig.contact.phone}`} className="text-lg font-bold text-[#A80E13] hover:underline decoration-2 underline-offset-4">
                                            {brandConfig.contact.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-[#A80E13]/10 flex items-center justify-center text-[#A80E13] group-hover:bg-[#A80E13] group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">B2B Email</p>
                                        <a href={`mailto:${brandConfig.contact.reservationEmail}`} className="text-base font-bold text-[#A80E13] hover:underline decoration-2 underline-offset-4">
                                            {brandConfig.contact.reservationEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-heading text-slate-900">
                                <ClipboardList className="w-5 h-5 text-[#A80E13]" />
                                What's Next?
                            </h3>
                            <ul className="space-y-4 text-sm">
                                {[
                                    "We receive your item list and check availability.",
                                    "We apply wholesale discounts based on your volumes.",
                                    "A draft order is sent to your email with the total quote.",
                                    "Once approved, we schedule your delivery or pickup."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <span className="flex-none w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">{i + 1}</span>
                                        <span className="text-slate-600 leading-snug pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                                <Building2 className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading relative z-10">Business Account</h3>
                            <p className="text-sm text-white/70 mb-6 relative z-10 leading-relaxed">
                                Save time by creating a verified business account for instant wholesale pricing on standard items.
                            </p>
                            <Link
                                href="/wholesale/register"
                                className="inline-flex items-center text-white font-bold hover:text-[#A80E13] transition-colors relative z-10 group"
                            >
                                Register Business
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
