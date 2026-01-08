'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowRight } from 'lucide-react';

/**
 * ============================================
 * STATIC PAGE LAYOUT SYSTEM
 * ============================================
 * A comprehensive, reusable layout system for all static pages
 * Ensures consistent design across the entire website
 * 
 * Components included:
 * - StaticPageLayout: Main wrapper with hero, breadcrumbs, CTA
 * - PageSection: Consistent section structure
 * - PageCard: Standard card component
 * - PageGrid: Flexible grid layouts
 * - PageList: Styled lists
 * - PageInfoCard: Info display cards
 * - PageFeatureItem: Feature items with icons
 * ============================================
 */

// ============================================
// STATIC PAGE LAYOUT - Main Wrapper
// ============================================

interface StaticPageLayoutProps {
    /** Page title (H1) */
    title: string;
    /** Description below title */
    description?: string;
    /** Hero image URL (optional) */
    heroImage?: string;
    /** Badge text above title */
    badgeText?: string;
    /** Breadcrumb navigation */
    breadcrumbs?: { label: string; href: string }[];
    /** Quick info items */
    quickInfo?: { icon: ReactNode; label: string; value: string }[];
    /** Page content */
    children: ReactNode;
    /** CTA section at bottom */
    cta?: {
        title: string;
        description: string;
        primaryAction?: { label: string; href: string };
        secondaryAction?: { label: string; href: string };
    };
}

export function StaticPageLayout({
    title,
    description,
    heroImage,
    badgeText,
    breadcrumbs,
    quickInfo,
    children,
    cta,
}: StaticPageLayoutProps) {
    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="bg-muted/30" aria-label="Breadcrumb">
                    <div className="container mx-auto px-4 py-3 max-w-7xl">
                        <ol className="flex items-center gap-2 text-sm">
                            {breadcrumbs.map((item, index) => (
                                <li key={item.href} className="flex items-center gap-2">
                                    {index > 0 && (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    {index === breadcrumbs.length - 1 ? (
                                        <span className="font-medium text-foreground">{item.label}</span>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                </nav>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />


                <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl relative z-10">
                    <div className={cn(
                        "grid gap-8 lg:gap-12 items-center",
                        heroImage ? "lg:grid-cols-5" : "lg:grid-cols-1"
                    )}>
                        {/* Text Content */}
                        <motion.div
                            className={cn(heroImage ? "lg:col-span-3" : "max-w-3xl", "space-y-6")}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Badge */}
                            {badgeText && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                    className="inline-flex"
                                >
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        {badgeText}
                                    </span>
                                </motion.div>
                            )}

                            {/* Title */}
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                {title}
                            </h1>

                            {/* Description */}
                            {description && (
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                                    {description}
                                </p>
                            )}

                            {/* Quick Info Cards */}
                            {quickInfo && quickInfo.length > 0 && (
                                <div className="flex flex-wrap gap-4 pt-4">
                                    {quickInfo.map((info, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                                            className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{info.label}</p>
                                                <p className="text-sm font-semibold text-foreground">{info.value}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Hero Image */}
                        {heroImage && (
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl shadow-2xl">
                                    <Image
                                        src={heroImage}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="page-section">
                <div className="container mx-auto px-4 max-w-7xl">
                    {children}
                </div>
            </section>

            {/* CTA Section */}
            {cta && (
                <section className="py-12 bg-gradient-to-r from-primary via-primary/95 to-primary/90">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
                            {cta.title}
                        </h2>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            {cta.description}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {cta.primaryAction && (
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href={cta.primaryAction.href}>
                                        {cta.primaryAction.label}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                            {cta.secondaryAction && (
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                                    <Link href={cta.secondaryAction.href}>
                                        {cta.secondaryAction.label}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

// ============================================
// PAGE SECTION - Consistent Section Structure
// ============================================

interface PageSectionProps {
    title?: string;
    subtitle?: string;
    badge?: string;
    children: ReactNode;
    className?: string;
    id?: string;
}

export function PageSection({ title, subtitle, badge, children, className, id }: PageSectionProps) {
    return (
        <section id={id} className={cn("section-gap scroll-mt-24", className)}>
            {(title || subtitle || badge) && (
                <div className="section-header-gap">
                    {badge && <span className="badge-muted mb-2 inline-block">{badge}</span>}
                    {title && <h2 className="section-title">{title}</h2>}
                    {subtitle && <p className="section-subtitle mt-1.5">{subtitle}</p>}
                    <div className="section-divider mt-3" />
                </div>
            )}
            {children}
        </section>
    );
}

// ============================================
// PAGE CARD - Reusable Card Component
// ============================================

interface PageCardProps {
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: ReactNode;
    image?: string;
    badge?: string;
    price?: string;
    children?: ReactNode;
    className?: string;
    variant?: 'default' | 'highlight' | 'interactive';
    href?: string;
}

export function PageCard({
    title,
    subtitle,
    description,
    icon,
    image,
    badge,
    price,
    children,
    className,
    variant = 'default',
    href,
}: PageCardProps) {
    const cardClasses = cn(
        variant === 'highlight' ? 'card-highlight' :
            variant === 'interactive' ? 'card-interactive' : 'card-base',
        'overflow-hidden',
        className
    );

    const content = (
        <article className={cardClasses}>
            {/* Image */}
            {image && (
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={image}
                        alt={title || 'Image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {badge && (
                        <span className="absolute top-3 left-3 badge-highlight">{badge}</span>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="card-padding">
                <div className="flex items-start gap-3">
                    {icon && <div className="icon-box-lg">{icon}</div>}
                    <div className="flex-1 min-w-0">
                        {title && (
                            <h3 className="card-title group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="label-text mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {price && <span className="price-small flex-shrink-0">{price}</span>}
                </div>
                {description && (
                    <p className="body-text-sm mt-2">{description}</p>
                )}
                {children}
            </div>
        </article>
    );

    if (href) {
        return <Link href={href} className="group">{content}</Link>;
    }

    return content;
}

// ============================================
// PAGE GRID - Flexible Grid Layouts
// ============================================

interface PageGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    scroll?: boolean;
    className?: string;
}

export function PageGrid({ children, columns = 3, scroll = false, className }: PageGridProps) {
    if (scroll) {
        return (
            <div className={cn("scroll-container", className)}>
                {children}
            </div>
        );
    }

    const gridClasses = {
        2: 'grid-2',
        3: 'grid-3',
        4: 'grid-4',
    };

    return (
        <div className={cn(gridClasses[columns], className)}>
            {children}
        </div>
    );
}

// ============================================
// PAGE LIST - Styled List Component
// ============================================

interface PageListProps {
    items: { name: string; description?: string }[];
    className?: string;
    variant?: 'default' | 'tight';
}

export function PageList({ items, className, variant = 'default' }: PageListProps) {
    return (
        <ul className={cn("space-y-0.5", className)}>
            {items.map((item, index) => (
                <li key={index} className={variant === 'tight' ? 'list-item-tight' : 'list-item'}>
                    <p className="font-medium text-[13px] text-foreground leading-tight">{item.name}</p>
                    {item.description && (
                        <p className="text-[10px] text-muted-foreground mt-px">{item.description}</p>
                    )}
                </li>
            ))}
        </ul>
    );
}

// ============================================
// PAGE INFO CARD - Info Display Component
// ============================================

interface PageInfoCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    description?: string;
    variant?: 'default' | 'highlight';
    className?: string;
}

export function PageInfoCard({ icon, title, value, description, variant = 'default', className }: PageInfoCardProps) {
    return (
        <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md",
            variant === 'highlight' ? "card-highlight" : "card-base",
            className
        )}>
            <div className={cn(
                "icon-box",
                variant === 'highlight' && "bg-primary/15"
            )}>
                {icon}
            </div>
            <div>
                <p className="label-text">{title}</p>
                <p className="text-base font-bold text-foreground">{value}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
        </div>
    );
}

// ============================================
// PAGE FEATURE LIST - Features with Icons
// ============================================

interface PageFeatureListProps {
    features: { icon: ReactNode; text: string }[];
    columns?: 1 | 2 | 3;
    className?: string;
}

export function PageFeatureList({ features, columns = 2, className }: PageFeatureListProps) {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    };

    return (
        <ul className={cn("grid item-gap", gridClasses[columns], className)}>
            {features.map((feature, index) => (
                <li key={index} className="feature-item hover:shadow-md transition-shadow">
                    <div className="icon-box">{feature.icon}</div>
                    <p className="body-text-sm pt-1">{feature.text}</p>
                </li>
            ))}
        </ul>
    );
}

// ============================================
// PAGE PRICING CARD - Pricing Display
// ============================================

interface PagePricingCardProps {
    title: string;
    price: string;
    description?: string;
    features?: string[];
    highlighted?: boolean;
    icon?: ReactNode;
    className?: string;
}

export function PagePricingCard({
    title,
    price,
    description,
    features,
    highlighted = false,
    icon,
    className
}: PagePricingCardProps) {
    return (
        <div className={cn(
            "relative flex flex-col card-padding-lg rounded-lg transition-all duration-200 shadow-sm hover:shadow-md",
            highlighted ? "card-highlight ring-1 ring-primary/10" : "card-base",
            className
        )}>
            {highlighted && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 badge-highlight text-[10px] px-3 py-0.5">
                    Popular
                </span>
            )}

            <div className="text-center mb-4">
                {icon && <div className="mx-auto mb-3 icon-box-lg">{icon}</div>}
                <h3 className="card-title mb-1">{title}</h3>
                <div className="price-large">{price}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </div>

            {features && features.length > 0 && (
                <ul className="space-y-1.5">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-foreground">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </span>
                            {feature}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
