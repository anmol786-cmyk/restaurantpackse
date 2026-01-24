'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TandoorShowcase() {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="site-container">
                <div className="rounded-[2.5rem] overflow-hidden bg-[#A80E13] shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Left Content Column */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:24px_24px]" />

                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                                    <Flame className="w-3 h-3 fill-current" />
                                    Official Anmol Brand
                                </div>

                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                                    Mini Electric <br />
                                    <span className="text-white/90">Tandoor Oven</span>
                                </h2>

                                <p className="text-lg text-white/90 leading-relaxed font-medium max-w-lg">
                                    Experience the authentic taste of tandoori cooking right in your European kitchen.
                                    Engineered specifically for home use, this compact powerhouse delivers professional
                                    results for char-grilled flavor without the smoke.
                                </p>

                                <div className="space-y-3 pt-2">
                                    {[
                                        "Perfect for Roti, Naan, Pizza & Grilling",
                                        "Compact Design for European Homes",
                                        "Energy Efficient & Quick Heating",
                                        "Smoke-free Indoor Operation"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-white/90">
                                            <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                                            <span className="text-base font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 bg-white text-[#A80E13] hover:bg-white/90 rounded-full font-bold text-lg shadow-xl shadow-black/10 transition-transform hover:-translate-y-1 group"
                                        asChild
                                    >
                                        <Link href="/product/mini-electric-tandoor-oven">
                                            Shop Now
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Column */}
                        <div className="relative h-[400px] lg:h-auto min-h-[400px] bg-gray-50 overflow-hidden group">

                            {/* Decorative Elements - optional, maybe remove if image covers all */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

                            <motion.div
                                className="relative w-full h-full"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <Image
                                    src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/anmol-tandoor-Photoroom.jpg"
                                    alt="Anmol Mini Electric Tandoor - Authentic Tandoori Cooking at Home"
                                    fill
                                    className="object-cover z-10"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
