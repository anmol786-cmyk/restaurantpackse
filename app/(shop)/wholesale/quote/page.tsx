import { Metadata } from 'next';
import { QuoteRequestForm } from '@/components/wholesale/quote-request-form';
import { ClipboardList, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { brandConfig } from '@/config/brand.config';

export const metadata: Metadata = {
    title: 'Request a Wholesale Quote | Anmol Wholesale',
    description: 'Request group or bulk pricing for your restaurant or business. Our B2B team will provide you with the best rates for your culinary needs.',
};

export default function WholesaleQuotePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Header */}
            <div className="bg-neutral-900 py-16 text-white text-center">
                <div className="container px-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Request a Wholesale Quote</h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Get personalized pricing for bulk orders, pallet quantities, or recurring restaurant supplies.
                    </p>
                </div>
            </div>

            <div className="container px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                            <QuoteRequestForm />
                        </div>
                    </div>

                    {/* Contact Info Column */}
                    <div className="space-y-6">
                        <div className="bg-primary/5 rounded-xl border border-primary/10 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Response Time
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our dedicated wholesale team reviews all requests within 24 hours (Monday - Friday).
                                For urgent inquiries, please call us directly.
                            </p>

                            <div className="space-y-4 pt-2 border-t border-primary/10">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold">Direct Wholesale Line</p>
                                        <a href={`tel:${brandConfig.contact.phone}`} className="text-lg hover:text-primary">
                                            {brandConfig.contact.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold">B2B Email</p>
                                        <a href={`mailto:${brandConfig.contact.reservationEmail}`} className="text-lg hover:text-primary">
                                            {brandConfig.contact.reservationEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                What's Next?
                            </h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold text-xs">1</span>
                                    <span>We receive your item list and check availability.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold text-xs">2</span>
                                    <span>We apply wholesale discounts based on your volumes.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold text-xs">3</span>
                                    <span>A draft order is sent to your email with the total quote.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold text-xs">4</span>
                                    <span>Once approved, we schedule your delivery or pickup.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-neutral-900 rounded-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Building2 className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Business Account</h3>
                            <p className="text-sm text-neutral-400 mb-4">
                                Save time by creating a verified business account for instant wholesale pricing on standard items.
                            </p>
                            <a
                                href="/wholesale/register"
                                className="inline-flex items-center text-primary font-medium hover:underline"
                            >
                                Register Business →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
