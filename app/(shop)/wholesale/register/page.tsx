import { Metadata } from 'next';
import Link from 'next/link';
import { BusinessRegisterForm } from '@/components/auth/business-register-form';
import { Building2, CheckCircle2, ShieldCheck, Zap, Package, Globe, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Open a B2B Wholesale Account | Anmol Wholesale - Restaurant & Grocery Supply',
    description: 'Register your restaurant, grocery store, or catering business for wholesale pricing on authentic Indo-Pak ingredients and equipment. Competitive B2B rates, flexible delivery, and dedicated support.',
};

export default function WholesaleRegisterPage() {
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
                                From Our Restaurant Kitchen to Yours
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight font-heading">Become a B2B Partner</h1>
                        <p className="text-lg text-white/90 leading-relaxed">
                            Join Sweden's trusted wholesale network for Indo-Pak restaurant supplies. Get access to competitive B2B pricing,
                            dedicated account management, and a supply chain you can rely on.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Wholesale Pricing on Bulk Orders</h3>
                                    <p className="text-sm text-white/80">Competitive rates on case and pallet quantities.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Flexible Delivery Options</h3>
                                    <p className="text-sm text-white/80">Own fleet, DHL partnership, or Ex-Warehouse pickup.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Verified Business Accounts</h3>
                                    <p className="text-sm text-white/80">Secure B2B dashboard for VAT-registered companies.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">European Shipping</h3>
                                    <p className="text-sm text-white/80">Expand across Sweden, Scandinavia, and key EU markets.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Exclusive Products</h3>
                                    <p className="text-sm text-white/80">Direct access to the Anmol Electric Tandoor (we manufacture it).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <blockquote className="mt-8 space-y-2 border-l-4 border-white/30 pl-4">
                        <p className="text-sm text-white/90 italic">
                            &ldquo;Anmol Wholesale understands the restaurant business because they run one themselves.
                            The quality of their basmati rice and ghee is consistent, and their delivery is always reliable.
                            They're a true partner, not just a supplier.&rdquo;
                        </p>
                        <footer className="text-sm font-bold text-white">Rajesh Kumar &mdash; Spice Garden Restaurant, Stockholm</footer>
                    </blockquote>
                </div>
            </div>

            <div className="lg:p-8 pt-20 pb-12 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight font-heading text-[#A80E13]">Register Your Business</h1>
                        <p className="text-sm text-muted-foreground">
                            Create your wholesale account to access B2B pricing and dedicated support
                        </p>
                    </div>

                    <BusinessRegisterForm />

                    <div className="px-8 space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            Already have a business account?{' '}
                            <Link href="/login" className="underline underline-offset-4 hover:text-[#A80E13] font-medium transition-colors">
                                Login here
                            </Link>
                        </p>

                        <div className="pt-4 border-t text-center">
                            <p className="text-xs text-muted-foreground mb-3">What happens after registration?</p>
                            <div className="space-y-2 text-left">
                                {[
                                    "We verify your business details (typically 24-48 hours)",
                                    "You receive access to wholesale pricing tiers",
                                    "Your account manager contacts you for onboarding",
                                    "You can start ordering with flexible delivery options"
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
