'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Menu,
    Phone,
    Home,
    ShoppingBag,
    BookOpen,
    Info,
    Mail,
    MapPin,
    Clock,
    Crown,
    Heart,
    Building2,
    ClipboardList,
    Facebook,
    Instagram,
    Youtube,
    Zap,
    UserPlus
} from 'lucide-react';
import { brandConfig } from '@/config/brand.config';
import { brandProfile } from '@/config/brand-profile';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { getStoreStatus, type StoreStatus } from '@/lib/store-hours';

const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/wholesale', label: 'Wholesale', icon: Building2 },
    { href: '/wholesale/quick-order', label: 'Quick Order', icon: Zap },
    { href: '/wholesale/quote', label: 'Bulk Quote', icon: ClipboardList },
    { href: '/wholesale/register', label: 'B2B Account', icon: UserPlus },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/my-account', label: 'My Account', icon: Crown },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);
    const logoUrl = 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png';

    useEffect(() => {
        const updateStatus = () => setStoreStatus(getStoreStatus());
        updateStatus();
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 transition-colors">
                    <Menu className="h-6 w-6 text-slate-700" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-full max-w-[300px] p-0 bg-white border-l border-slate-100"
            >
                {/* Header with Logo */}
                <div className="p-6 border-b border-slate-50">
                    <SheetHeader>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="relative h-16 w-16">
                                <Image
                                    src={logoUrl}
                                    alt={brandProfile.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-heading font-bold text-lg text-primary uppercase tracking-wide text-center">
                                Anmol Wholesale
                            </span>
                        </div>
                    </SheetHeader>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-all font-medium"
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Contact */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="space-y-4">
                        <a
                            href={`tel:${brandConfig.contact.phone}`}
                            className="flex items-center gap-3 text-sm font-semibold text-slate-900 hover:text-primary transition-colors"
                        >
                            <Phone className="h-4 w-4 text-primary" />
                            {brandConfig.contact.phone}
                        </a>

                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            <span>Spånga, Stockholm</span>
                        </div>

                        {storeStatus && (
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className={storeStatus.isOpen ? 'text-emerald-600 font-medium' : 'text-red-600'}>
                                    {storeStatus.statusText}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
