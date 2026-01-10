"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromotionGrid() {
    return (
        <section className="w-full py-6 md:py-8">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="w-full">




                    {/* Card 3: Europe-Wide Delivery via DHL */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm group hover:shadow-lg transition-all min-h-[200px]">
                        <div className="p-6 sm:p-10 relative z-10 h-full flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="h-6 w-6 text-white" />
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30 uppercase">
                                        Europe-Wide
                                    </span>
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-bold text-white">
                                    We Deliver All Over Europe
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-xl font-semibold text-white/90">
                                        No Minimum Required • Reliable Shipping via DHL
                                    </p>
                                    <p className="text-base text-white/80">
                                        Fast and reliable shipping to your doorstep anywhere in Europe. Order today!
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-0 flex-shrink-0">
                                <Link href="/europe-delivery">
                                    <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-8">
                                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl opacity-30 translate-x-1/4 translate-y-1/4"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
