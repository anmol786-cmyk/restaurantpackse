'use client';

import { useState } from "react";
import { Search, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

export function QuickOrder() {
    const [sku, setSku] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleQuickAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sku.trim()) return;

        setIsSearching(true);
        try {
            // Mock API search for demo - in production this would call a real SKU lookup
            const response = await fetch(`/api/search?q=${encodeURIComponent(sku)}&exact=true`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const product = data.results[0];
                addItem({
                    id: product.id,
                    name: product.name,
                    price: `${product.price}`,
                    slug: product.slug,
                    images: product.image ? [{ src: product.image, alt: product.name }] : [],
                    categories: product.categories?.map((c: string) => ({ name: c })) || [],
                    type: 'simple',
                    status: 'publish'
                } as unknown as any);
                toast.success(`Added ${product.name} to cart`);
                setSku("");
            } else {
                toast.error("Product SKU not found");
            }
        } catch (error) {
            toast.error("Error searching for product");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="w-full py-12 md:py-20 bg-primary overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="site-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest">
                            B2B Efficiency
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Quick Order by SKU
                        </h2>
                        <p className="text-white/80 max-w-lg leading-relaxed text-lg">
                            Know exactly what you need? Enter the product SKU or name to instantly add it to your wholesale order. Streamlined for professional kitchen buyers.
                        </p>

                        <form onSubmit={handleQuickAdd} className="flex gap-4 max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="Enter SKU or name..."
                                    className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-white focus:border-white text-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSearching}
                                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20"
                            >
                                {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                            </Button>
                        </form>
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <span className="text-white font-bold">Fast-Fill Checklist</span>
                                    <span className="text-primary text-xs font-black">SAVE TIME</span>
                                </div>
                                {[
                                    "Direct Warehouse Access",
                                    "Custom CSV Upload for Bulk",
                                    "Repeat Previous Orders",
                                    "Managed Account Support"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white/90">
                                        <div className="size-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                                            <ShoppingCart className="size-3" />
                                        </div>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative floating SKUs */}
                        <motion.div
                            initial={{ x: 20, y: 20 }}
                            animate={{ x: -20, y: -20 }}
                            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute -top-6 -right-6 bg-primary text-white p-3 rounded-lg shadow-xl text-[10px] font-mono leading-none z-20"
                        >
                            SKU-7829-XL
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
