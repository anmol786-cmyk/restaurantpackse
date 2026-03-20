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
            number: '01',
            accent: 'text-primary',
        },
        {
            icon: Percent,
            title: t('volume'),
            description: t('volumeDesc'),
            number: '02',
            accent: 'text-accent',
        },
        {
            icon: CreditCard,
            title: t('flexible'),
            description: t('flexibleDesc'),
            number: '03',
            accent: 'text-primary',
        },
        {
            icon: ShieldCheck,
            title: t('quality'),
            description: t('qualityDesc'),
            number: '04',
            accent: 'text-accent',
        }
    ];

    return (
        <section className="w-full relative z-30 -mt-10 md:-mt-14">
            <div className="site-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden shadow-lg">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            className="relative bg-card p-6 md:p-8 group hover:bg-primary/[0.03] transition-colors duration-300"
                        >
                            {/* Number label */}
                            <span className={`font-heading text-[0.65rem] font-bold tracking-[0.18em] uppercase ${feature.accent} mb-4 block`}>
                                {feature.number}
                            </span>

                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 bg-muted group-hover:bg-primary/10 transition-colors ${feature.accent}`}>
                                <feature.icon className="w-5 h-5" strokeWidth={1.75} />
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-base md:text-lg font-bold text-foreground leading-snug mb-2 tracking-tight">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-normal">
                                {feature.description}
                            </p>

                            {/* Bottom accent line — appears on hover */}
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 ${index % 2 === 0 ? 'bg-primary' : 'bg-accent'} group-hover:w-full transition-all duration-500`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
