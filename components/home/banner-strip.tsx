"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BannerStrip() {
    return (
        <section className="w-full pb-6 md:pb-8">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                <Link href="/shop" className="block group relative overflow-hidden rounded-2xl h-[130px] sm:h-[140px] md:h-[150px]">
                    {/* Background Image/Gradient Placeholder - Primary Theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/95 flex flex-col justify-center px-4 sm:px-6 md:px-10">
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1 sm:mb-2 text-yellow-400">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                    <span className="text-xs font-bold tracking-widest uppercase">Premium Quality</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                                    Basmati Rice & Authentic Spices
                                </h2>
                                <p className="text-primary-foreground/80 text-xs sm:text-sm md:text-base">
                                    Explore our selection of premium Indian & Pakistani ingredients
                                </p>
                            </div>

                            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform">
                                <ArrowRight className="text-white w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
