import { Metadata } from 'next';
import Link from 'next/link';
import { BusinessRegisterForm } from '@/components/auth/business-register-form';
import { Building2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Business Registration | Anmol Wholesale',
    description: 'Open a business account with Anmol Wholesale for competitive B2B pricing and premium restaurant supplies.',
};

export default function WholesaleRegisterPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-neutral-900"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=2071&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.6
                    }}
                />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Building2 className="mr-2 h-6 w-6" />
                    Anmol Wholesale
                </div>
                <div className="relative z-20 mt-auto">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold tracking-tight">Become a B2B Partner</h1>
                        <p className="text-lg text-neutral-300">
                            Join Sweden's leading restaurant supply network. Get access to wholesale-only pricing,
                            tax-exempt ordering, and dedicated support.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Tiered Pricing</h3>
                                    <p className="text-sm text-neutral-400">Save up to 20% on bulk ingredient orders.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Business Verification</h3>
                                    <p className="text-sm text-neutral-400">Secure B2B dashboard for VAT-registered companies.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Flexible Terms</h3>
                                    <p className="text-sm text-neutral-400">Invoice payment options (Net 30/60) for verified accounts.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <blockquote className="mt-8 space-y-2">
                        <p className="text-sm text-neutral-400 italic">
                            &ldquo;Choosing Anmol Wholesale was the best decision for our catering business.
                            The quality of their bulk ingredients and the reliability of their delivery
                            is unmatched in Stockholm.&rdquo;
                        </p>
                        <footer className="text-sm font-medium">David Andersson &mdash; Green Garden Catering</footer>
                    </blockquote>
                </div>
            </div>

            <div className="lg:p-8 pt-20 pb-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Register Your Business</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your wholesale account
                        </p>
                    </div>

                    <BusinessRegisterForm />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have a business account?{' '}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary font-medium">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
