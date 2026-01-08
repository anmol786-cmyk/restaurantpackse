'use client';

import { Truck, Percent, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Truck,
        title: "Next-Day Delivery",
        description: "Own fleet delivery across Stockholm area",
        color: "text-primary",
        bg: "bg-primary/5"
    },
    {
        icon: Percent,
        title: "Volume Discounts",
        description: "Tiered pricing for pallet and case quantities",
        color: "text-secondary",
        bg: "bg-secondary/5"
    },
    {
        icon: CreditCard,
        title: "Flexible Terms",
        description: "Net-30 payment options for businesses",
        color: "text-primary",
        bg: "bg-primary/5"
    },
    {
        icon: ShieldCheck,
        title: "Quality Assured",
        description: "Sourced directly from manufacturers",
        color: "text-secondary",
        bg: "bg-secondary/5"
    }
];

export function Features() {
    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                        >
                            <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
