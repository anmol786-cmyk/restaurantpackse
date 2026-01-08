'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { TransparentHeader } from '@/components/layout/transparent-header';
import type { ProductCategoryFull } from '@/types/woocommerce';

interface HeaderSelectorProps {
  categories: ProductCategoryFull[];
}

export function HeaderSelector({ categories }: HeaderSelectorProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Show transparent header only on homepage
  // Mobile will use the same header component but with transparent styles
  if (isHomepage) {
    return <TransparentHeader categories={categories} />;
  }

  // Regular header for all other pages
  return <Header categories={categories} />;
}
