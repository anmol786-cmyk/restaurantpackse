'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const socialPosts = [
    {
        id: 1,
        image: 'https://anmolsweets.se/wp-content/uploads/2025/09/lunch-buffet-web.jpg',
        likes: 124,
        comments: 12,
        caption: 'Delicious lunch buffet spread! 🍛',
    },
    {
        id: 2,
        image: 'https://anmolsweets.se/wp-content/uploads/2025/04/anmol-breakfast-swedish.jpg',
        likes: 89,
        comments: 5,
        caption: 'Traditional breakfast favorites! 🍳',
    },
    {
        id: 3,
        image: 'https://anmolsweets.se/wp-content/uploads/2024/09/pakistani-snacks-samosa.jpg',
        likes: 245,
        comments: 34,
        caption: 'Crispy samosas fresh from the kitchen! 🥟',
    },
    {
        id: 4,
        image: 'https://anmolsweets.se/wp-content/uploads/2024/09/pakistani-bread-naan.jpg',
        likes: 156,
        comments: 8,
        caption: 'Freshly baked naan bread! 🫓',
    },
    {
        id: 5,
        image: 'https://anmolsweets.se/wp-content/uploads/2024/09/pakistani-dessert-sweets.jpg',
        likes: 198,
        comments: 15,
        caption: 'Traditional sweets made with love ❤️',
    },
    {
        id: 6,
        image: 'https://anmolsweets.se/wp-content/uploads/2024/09/pakistani-chicken-curry.jpg',
        likes: 210,
        comments: 18,
        caption: 'Our signature curry dishes! 🍛',
    },
];

export function SocialFeed() {
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const handleImageError = (postId: number) => {
        setImageErrors(prev => ({ ...prev, [postId]: true }));
    };

    return (
        <section className="py-16 md:py-24 bg-background dark:bg-neutral-950">
            <div className="container px-4 md:px-6 mb-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center gap-2 text-secondary-500 font-medium">
                        <Instagram className="h-5 w-5" />
                        <span>@anmolsweetsstockholm</span>
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-950 dark:text-primary-50">
                        Our Instagram Reels
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
                        Watch our latest reels for behind-the-scenes moments, food prep videos, and exclusive content.
                    </p>
                </div>
            </div>

            {/* 6 Reels in a row grid layout */}
            <div className="container px-4 md:px-6">
                {/* Mobile: Horizontal scrollable, Desktop: Grid layout */}
                <div className="md:hidden">
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                        {socialPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative flex-shrink-0 w-40 aspect-[9/16] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-lg"
                            >
                                {!imageErrors[post.id] ? (
                                    <Image
                                        src={post.image}
                                        alt={post.caption}
                                        fill
                                        sizes="160px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={() => handleImageError(post.id)}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                        <Instagram className="h-12 w-12 text-primary/40" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Heart className="h-4 w-4 fill-white" />
                                            <span className="text-xs font-bold">{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4 fill-white" />
                                            <span className="text-xs font-bold">{post.comments}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs line-clamp-3">{post.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {socialPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-lg"
                        >
                            {!imageErrors[post.id] ? (
                                <Image
                                    src={post.image}
                                    alt={post.caption}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={() => handleImageError(post.id)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                    <Instagram className="h-16 w-16 text-primary/40" />
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center text-white p-4 text-center">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-5 w-5 fill-white" />
                                        <span className="font-bold">{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="h-5 w-5 fill-white" />
                                        <span className="font-bold">{post.comments}</span>
                                    </div>
                                </div>
                                <p className="text-xs md:text-sm line-clamp-3">{post.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-12 text-center container px-4 md:px-6">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none" asChild>
                    <Link href="https://www.instagram.com/anmolsweetsstockholm/reels/" target="_blank">
                        <Instagram className="mr-2 h-5 w-5" />
                        Watch More Reels
                    </Link>
                </Button>
            </div>
        </section>
    );
}
