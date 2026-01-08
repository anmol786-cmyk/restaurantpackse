'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title?: string;
    subtitle?: string;
    badge?: string;
}

export function Hero({
    title = "Fresh Groceries Delivered to Your Door",
    subtitle = "Experience the finest selection of organic produce, pantry staples, and international delicacies. Delivered fresh, daily.",
    badge = "Premium Quality Guaranteed"
}: HeroProps) {
    return (
        <section className="relative w-full h-[70vh] min-h-[450px] flex items-start justify-start overflow-hidden bg-muted/20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Robust Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:via-white/90 md:to-transparent z-10" />

                {/* Hero Image - Right Aligned */}
                <div className="absolute right-0 top-0 h-full w-full md:w-3/4 lg:w-2/3 ml-auto">
                    <div className="relative h-full w-full">
                        <Image
                            src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/anmol-wholesale.png"
                            alt="Anmol Wholesale - Restaurant Supply"
                            fill
                            className="object-cover object-center"
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                    </div>
                </div>
            </div>

            <div className="site-container relative z-20 pt-16 md:pt-28">
                <div className="max-w-2xl space-y-6 md:space-y-4">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full"
                    >
                        <Truck className="w-4 h-4 text-primary" />
                        <span className="text-primary font-bold text-xs tracking-wider uppercase">{badge}</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
                    >
                        {title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="text-primary">{title.split(' ').slice(-1)}</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-sm sm:text-base md:text-base lg:text-lg text-slate-500 leading-relaxed font-sans max-w-xl"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4"
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                            asChild
                        >
                            <Link href="/shop">
                                <ShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                                Start Shopping
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white/80 backdrop-blur border-border text-foreground hover:bg-muted rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-semibold"
                            asChild
                        >
                            <Link href="/shop?sort=new">
                                View New Arrivals
                                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-wrap items-center gap-3 sm:gap-6 pt-4 sm:pt-8 text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Halal Certified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Same-Day Delivery Stockholm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span>Europe-Wide Shipping</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
