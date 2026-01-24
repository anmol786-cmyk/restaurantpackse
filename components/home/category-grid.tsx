"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: {
        src: string;
        alt: string;
    } | null;
    count?: number;
}

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    if (!categories || categories.length === 0) return null;

    // Gradient backgrounds for categories without images
    const gradientBackgrounds = [
        'bg-gradient-to-br from-primary to-primary/80',
        'bg-gradient-to-br from-secondary to-secondary/80',
        'bg-gradient-to-br from-slate-900 to-slate-800',
        'bg-gradient-to-br from-primary/90 to-primary/70',
        'bg-gradient-to-br from-secondary/90 to-secondary/70',
        'bg-gradient-to-br from-slate-800 to-slate-700',
    ];

    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="site-container">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="space-y-1">
                        <span className="text-primary font-bold text-xs uppercase tracking-wider">Explore</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Top Categories</h2>
                    </div>
                    <Link
                        href="/shop"
                        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <span className="hidden sm:inline">View All</span>
                        <span className="sm:hidden">All</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                            <Link href={`/product-category/${category.slug}`} className="group block h-full">
                                <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-[4/5] border border-border/50 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">

                                    {/* Image Background or Colored Gradient */}
                                    <div className="absolute inset-0">
                                        {category.image ? (
                                            <Image
                                                src={category.image.src}
                                                alt={category.image.alt || category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, 16vw"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${gradientBackgrounds[index % gradientBackgrounds.length]}`}>
                                                <div className="text-white text-4xl font-bold opacity-20">
                                                    {category.name.charAt(0)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay Gradient - Uses Brand Primary Red dynamically */}
                                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="text-white font-heading font-bold text-lg leading-tight mb-1 group-hover:text-primary-foreground transition-colors">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                                            <span>{category.count || 0} Items</span>
                                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
