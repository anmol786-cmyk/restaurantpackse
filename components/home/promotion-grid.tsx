"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromotionGrid() {
    return (
        <section className="w-full py-6 md:py-8">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Card 1: Biryani Pre-Order Promotion */}
                    <Link href="/prepared-meals" className="group">
                        <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-lg transition-all h-full">
                            <div className="relative aspect-[4/4] w-full">
                                <Image
                                    src="https://crm.ideallivs.com/wp-content/uploads/2026/01/biryani-at-ideal-indiska-stockholm.jpg"
                                    alt="Weekend Biryani Pre-Orders - Authentic Dum Biryani"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: 99 kr Special Offers */}
                    <Link href="/deals" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm group-hover:shadow-xl transition-all h-full">
                            <div className="p-6 relative z-10 flex flex-col h-full justify-between min-h-[280px]">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase border border-white/30">
                                            Limited Time
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-5xl md:text-6xl font-black text-white mb-2">
                                            99 kr
                                        </h3>
                                        <p className="text-2xl md:text-3xl font-bold text-white/90">
                                            Special Offers
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-white/90">
                                        <p className="text-base font-semibold">
                                            Amazing deals on:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            <li>✓ Premium Rice 5kg</li>
                                            <li>✓ Chakki Atta 5kg</li>
                                            <li>✓ & More!</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Button size="sm" className="rounded-full bg-white text-orange-600 hover:bg-gray-100 font-bold">
                                        View All Deals <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Background Decorations */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
                        </div>
                    </Link>

                    {/* Card 3: Europe-Wide Delivery via DHL */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm group hover:shadow-lg transition-all">
                        <div className="p-6 relative z-10 h-full flex flex-col justify-between min-h-[280px]">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="h-5 w-5 text-white" />
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30 uppercase">
                                        Europe-Wide
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white">
                                    We Deliver All Over Europe
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-white">
                                        No Minimum Required
                                    </p>

                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                            <span className="text-sm font-bold text-white">via DHL</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-white/80 mt-3">
                                        Fast and reliable shipping to your doorstep anywhere in Europe
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button size="sm" className="rounded-full bg-white text-blue-600 hover:bg-gray-100">
                                    Learn More <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-1/2 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-30"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
