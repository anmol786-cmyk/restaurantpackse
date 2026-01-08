'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MarqueeProps {
    items: string[];
    direction?: 'left' | 'right';
    speed?: number;
    className?: string;
    separator?: React.ReactNode;
}

export function Marquee({
    items,
    direction = 'left',
    speed = 20,
    className,
    separator = '•',
}: MarqueeProps) {
    return (
        <div className={cn('relative flex overflow-hidden py-4', className)}>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600" />

            {/* Animated Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s infinite linear'
                }}
            />

            <motion.div
                initial={{ x: 0 }}
                animate={{ x: direction === 'left' ? '-50%' : '50%' }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="flex min-w-full shrink-0 items-center gap-8 whitespace-nowrap px-4 relative z-10"
            >
                {/* Duplicate items to create seamless loop */}
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-wider md:text-base lg:text-lg">
                        <span className="text-white drop-shadow-lg">{item}</span>
                        <span className="text-yellow-300 opacity-80 scale-125">{separator}</span>
                    </div>
                ))}
            </motion.div>
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: direction === 'left' ? '-50%' : '50%' }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="flex min-w-full shrink-0 items-center gap-8 whitespace-nowrap px-4 relative z-10"
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-wider md:text-base lg:text-lg">
                        <span className="text-white drop-shadow-lg">{item}</span>
                        <span className="text-yellow-300 opacity-80 scale-125">{separator}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
