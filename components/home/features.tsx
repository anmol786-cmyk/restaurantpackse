'use client';

import { Truck, Percent, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export function Features() {
    const t = useTranslations('features');

    const features = [
        {
            icon: Truck,
            title: t('nextDay'),
            description: t('nextDayDesc'),
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            icon: Percent,
            title: t('volume'),
            description: t('volumeDesc'),
            color: "text-secondary",
            bg: "bg-secondary/5"
        },
        {
            icon: CreditCard,
            title: t('flexible'),
            description: t('flexibleDesc'),
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            icon: ShieldCheck,
            title: t('quality'),
            description: t('qualityDesc'),
            color: "text-secondary",
            bg: "bg-secondary/5"
        }
    ];

    return (
        <section className="w-full pb-8 md:pb-12 pt-0 relative z-30 -mt-10 md:-mt-16 bg-transparent pointer-events-none">
            <div className="site-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 md:p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group bg-white pointer-events-auto"
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform ${feature.bg} ${feature.color}`}>
                                <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-3 text-slate-900 leading-tight">{feature.title}</h3>
                            <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
