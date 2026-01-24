"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/woocommerce";

interface ProductShowcaseProps {
    title: string;
    products: Product[];
    moreLink?: string;
}

export function ProductShowcase({ title, products, moreLink = "/shop" }: ProductShowcaseProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full py-6 md:py-8">
            <div className="site-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        {title}
                    </h2>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8" asChild>
                        <Link href={moreLink}>
                            <span className="hidden sm:inline">More</span>
                            <span className="sm:hidden">View</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 scrollbar-hide snap-x">
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[160px] w-[160px] sm:min-w-[180px] sm:w-[180px] md:min-w-[220px] md:w-[220px] snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
