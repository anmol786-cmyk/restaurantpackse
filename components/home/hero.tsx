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
    title = "Professional Restaurant Supplies Delivered Across Sweden",
    subtitle = "The finest selection of authentic Indo-Pak ingredients, commercial equipment, and bulk staples. Direct-from-warehouse pricing for professional kitchens.",
    badge = "Wholesale Pricing Guaranteed"
}: HeroProps) {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center bg-white overflow-hidden pb-12 pt-24 md:py-0">
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

            <div className="site-container relative z-20">
                <div className="max-w-3xl space-y-6 md:space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-block"
                    >
                        <span className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold text-primary backdrop-blur-sm">
                            <Truck className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="tracking-wide uppercase">{badge}</span>
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
                    >
                        {title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="text-primary">{title.split(' ').slice(-1)}</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4"
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/shop">
                                <ShoppingBag className="mr-2 w-5 h-5" />
                                Start Shopping
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white/80 backdrop-blur border-border text-foreground hover:bg-muted rounded-xl h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/shop?sort=new">
                                View New Arrivals
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 sm:pt-8 text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Halal Certified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Stockholm Fleet Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span>Europe Shipping</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Bulk Discounts Available</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
