'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileFloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 100px
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 flex gap-3 md:hidden"
                >
                    <Button
                        asChild
                        className="flex-1 bg-primary/95 text-primary-foreground shadow-lg backdrop-blur-sm hover:bg-primary border border-primary/50"
                        size="lg"
                    >
                        <Link href="/bookings">
                            <CalendarDays className="mr-2 h-4 w-4 text-secondary-500" />
                            Book Table
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="flex-1 bg-accent/95 text-accent-foreground shadow-lg backdrop-blur-sm hover:bg-accent font-bold"
                        size="lg"
                    >
                        <Link href="/shop">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Order Now
                        </Link>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
