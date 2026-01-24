'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { brandProfile } from "@/config/brand-profile";

export function CTASection() {
    return (
        <section className="w-full py-20">
            <div className="site-container relative overflow-hidden rounded-[2.5rem] bg-[#A80E13] min-h-[500px] flex items-center">

                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#A80E13] via-[#A80E13]/90 to-transparent z-10" />
                    <Image
                        src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png"
                        alt="Join Anmol Wholesale"
                        fill
                        className="object-cover object-right opacity-40 mix-blend-overlay"
                    />
                </div>

                <div className="relative z-20 px-8 md:px-16 lg:px-24 py-16 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                                Empower Your <br />
                                <span className="text-white">Restaurant Kitchen</span>
                            </h2>
                            <p className="text-xl text-white/90 max-w-lg leading-relaxed font-medium">
                                Join hundreds of professional partners in Stockholm. Get access to wholesale pricing, dedicated support, and our premium product catalog.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-xl text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1"
                                asChild
                            >
                                <Link href="/wholesale/register">
                                    <UserPlus className="mr-2 w-5 h-5" />
                                    Register Business Account
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl text-lg font-bold backdrop-blur-sm"
                                asChild
                            >
                                <a href={`tel:${brandProfile.contact.phone}`}>
                                    <Phone className="mr-2 w-5 h-5 text-white" />
                                    {brandProfile.contact.phone}
                                </a>
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {[
                                { label: 'Active Partners', value: '450+' },
                                { label: 'Premium SKUs', value: '2500+' },
                                { label: 'Stockholm Presence', value: '15 Years' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-2xl font-black text-white">{stat.value}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-white/70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative floating element */}
                <div className="hidden lg:block absolute right-24 bottom-24 size-48 border-4 border-primary/20 rounded-full animate-pulse" />
            </div>
        </section>
    );
}
