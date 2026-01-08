"use client";

import Image from "next/image";
import { ArrowRight, QrCode, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeliveryInfoBanner() {
    return (
        <section className="w-full bg-blue-50 dark:bg-blue-950/20 border-b border-border">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Text Content */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                            America&apos;s largest <br />
                            <span className="text-blue-600">online Asian supermarket</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0">
                            Fresh produce, asian snacks, and pantry staples delivered to your door.
                        </p>
                    </div>

                    {/* Van Image Placeholder */}
                    <div className="flex-1 flex justify-center items-center relative h-48 md:h-64 w-full">
                        <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 transform scale-90 blur-3xl"></div>
                        {/* Using a Lucide icon as a placeholder for the van if no image */}
                        <div className="relative z-10 p-8 bg-white dark:bg-card rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Truck className="w-24 h-24 text-blue-600" />
                        </div>
                        {/* We could use a real image here if we had one */}
                    </div>

                    {/* App Download / QR Code */}
                    <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-border/50">
                        <div className="bg-white p-2 rounded-lg border border-border">
                            <QrCode className="w-20 h-20 text-foreground" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm">Scan to</span>
                            <span className="font-bold text-sm text-blue-600">download app</span>
                            <div className="flex gap-0.5 text-orange-400 text-xs">
                                {"★★★★★".split("").map((star, i) => (
                                    <span key={i}>{star}</span>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">1m+ reviews</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
