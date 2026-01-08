'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { decodeHtmlEntities } from '@/lib/utils';

interface PageTemplateProps {
    title: string;
    content: string;
    featuredImage?: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
    };
    excerpt?: string;
    breadcrumbs?: BreadcrumbItem[];
    layout?: 'single-column' | 'two-column' | 'three-column';
    showHero?: boolean;
    className?: string;
}

export function PageTemplate({
    title,
    content,
    featuredImage,
    excerpt,
    breadcrumbs,
    layout = 'two-column',
    showHero = true,
    className = '',
}: PageTemplateProps) {

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            {showHero && (
                <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b border-border overflow-hidden">
                    {featuredImage ? (
                        // Hero with Featured Image
                        <div className="relative">
                            {/* Image Background */}
                            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                                <Image
                                    src={featuredImage.src}
                                    alt={featuredImage.alt || title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="100vw"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex items-end">
                                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl pb-12 md:pb-16">
                                    {breadcrumbs && breadcrumbs.length > 0 && (
                                        <Breadcrumbs items={breadcrumbs} className="mb-6" />
                                    )}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-foreground mb-4 max-w-4xl">
                                        {decodeHtmlEntities(title)}
                                    </h1>
                                    {excerpt && (
                                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                                            {decodeHtmlEntities(excerpt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Text-Only Hero
                        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl py-12 md:py-16 lg:py-20">
                            {breadcrumbs && breadcrumbs.length > 0 && (
                                <Breadcrumbs items={breadcrumbs} className="mb-6" />
                            )}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-primary mb-4 max-w-4xl">
                                {decodeHtmlEntities(title)}
                            </h1>
                            {excerpt && (
                                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                                    {decodeHtmlEntities(excerpt)}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Content Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className={`container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl ${className}`}>
                    {/* Multi-column Content */}
                    <div
                        className={`
              page-content
              ${layout === 'single-column' ? 'max-w-4xl mx-auto' : ''}
              ${layout === 'two-column' ? 'max-w-screen-xl mx-auto columns-1 md:columns-2 gap-8 md:gap-12' : ''}
              ${layout === 'three-column' ? 'max-w-screen-2xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-8 md:gap-12' : ''}
            `}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </section>
        </main>
    );
}
