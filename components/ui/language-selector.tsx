'use client';

import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  currentLocale: Locale;
}

export function LanguageSelector({
  variant = 'default',
  className,
  currentLocale,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (locale: Locale) => {
    // Remove current locale from pathname if it exists
    const segments = pathname.split('/').filter(Boolean);
    const newSegments = segments[0] && locales.includes(segments[0] as Locale)
      ? [locale, ...segments.slice(1)]
      : [locale, ...segments];

    const newPath = '/' + newSegments.join('/');
    router.push(newPath);
    setOpen(false);
  };

  const currentLocaleName = localeNames[currentLocale];
  const currentLocaleFlag = localeFlags[currentLocale];

  // Icon-only variant (for mobile)
  if (variant === 'icon-only') {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-9 w-9', className)}
            aria-label="Select language"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-base">{localeFlags[locale]}</span>
                  <span className="font-medium text-sm">{localeNames[locale]}</span>
                </div>
                {currentLocale === locale && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Compact variant (for header)
  if (variant === 'compact') {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={cn('h-9 gap-1.5 px-2.5', className)}>
            <span className="text-base">{currentLocaleFlag}</span>
            <span className="font-medium text-sm uppercase">{currentLocale}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-base">{localeFlags[locale]}</span>
                  <span className="font-medium text-sm">{localeNames[locale]}</span>
                </div>
                {currentLocale === locale && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant (full display)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn('h-10 gap-2', className)}>
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLocaleFlag}</span>
          <span className="font-medium">{currentLocaleName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Select Language
        </div>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className="cursor-pointer py-2.5"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-xl">{localeFlags[locale]}</span>
                <span className="font-medium">{localeNames[locale]}</span>
              </div>
              {currentLocale === locale && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
