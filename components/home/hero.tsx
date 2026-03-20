'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';

interface HeroProps {
    title?: string;
    subtitle?: string;
    badge?: string;
}

export function Hero({ title, subtitle, badge }: HeroProps) {
    const t = useTranslations('hero');
    const tc = useTranslations('common');

    const displayTitle = title || t('title');
    const displaySubtitle = subtitle || t('subtitle');
    const displayBadge = badge || t('badge');

    return (
        <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-background">

            {/* Dot pattern — subtle texture on the content side */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.35] z-0 pointer-events-none" />

            {/* Primary brand red vertical accent bar — left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary z-10 hidden md:block" />

            {/* Hero Image — right column, full bleed */}
            <div className="absolute right-0 top-0 h-full w-full md:w-[58%] z-0">
                {/* Gradient mask — from background into image */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10 z-10" />
                <Image
                    src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/anmol-wholesale.png"
                    alt={t('imageAlt')}
                    fill
                    className="object-cover object-center"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 58vw"
                />
            </div>

            {/* Content */}
            <div className="site-container relative z-20 py-24 md:py-0">
                <div className="max-w-2xl space-y-7">

                    {/* Overline badge — editorial style */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-8 h-px bg-primary" />
                        <span className="section-label">{displayBadge}</span>
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="font-heading font-extrabold text-foreground tracking-tight leading-[1.08]"
                        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)' }}
                    >
                        {displayTitle.split(' ').slice(0, -1).join(' ')}{' '}
                        <em className="not-italic text-primary">{displayTitle.split(' ').slice(-1)}</em>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-lg text-muted-foreground leading-relaxed max-w-lg"
                    >
                        {displaySubtitle}
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="flex flex-wrap gap-3 pt-1"
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-7 text-base font-bold rounded-lg shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
                            asChild
                        >
                            <Link href="/shop">
                                <ShoppingBag className="mr-2 w-4 h-4" />
                                {tc('startShopping')}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-background/80 border-border text-foreground hover:bg-muted h-12 px-7 text-base font-semibold rounded-lg"
                            asChild
                        >
                            <Link href="/shop?sort=new">
                                {tc('viewNewArrivals')}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trust indicators — cleaner treatment */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-border"
                    >
                        {[
                            { label: t('trustHalal'), color: 'bg-success' },
                            { label: t('trustDelivery'), color: 'bg-info' },
                            { label: t('trustEurope'), color: 'bg-accent' },
                            { label: t('trustBulk'), color: 'bg-primary' },
                        ].map(({ label, color }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
                                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
