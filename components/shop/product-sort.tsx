'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowUpDown } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
  orderby: string;
  order: 'asc' | 'desc';
}

const SORT_OPTIONS: SortOption[] = [
  {
    label: 'Default sorting',
    value: 'default',
    orderby: 'menu_order',
    order: 'asc',
  },
  {
    label: 'Popularity',
    value: 'popularity',
    orderby: 'popularity',
    order: 'desc',
  },
  {
    label: 'Average rating',
    value: 'rating',
    orderby: 'rating',
    order: 'desc',
  },
  {
    label: 'Latest',
    value: 'date-desc',
    orderby: 'date',
    order: 'desc',
  },
  {
    label: 'Price: Low to high',
    value: 'price-asc',
    orderby: 'price',
    order: 'asc',
  },
  {
    label: 'Price: High to low',
    value: 'price-desc',
    orderby: 'price',
    order: 'desc',
  },
  {
    label: 'Name: A to Z',
    value: 'name-asc',
    orderby: 'title',
    order: 'asc',
  },
  {
    label: 'Name: Z to A',
    value: 'name-desc',
    orderby: 'title',
    order: 'desc',
  },
];

interface ProductSortProps {
  className?: string;
  showLabel?: boolean;
}

export function ProductSort({ className, showLabel = true }: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentOrderby = searchParams?.get('orderby') || 'menu_order';
  const currentOrder = searchParams?.get('order') || 'asc';

  // Find current sort option
  const currentSort = SORT_OPTIONS.find(
    (option) => option.orderby === currentOrderby && option.order === currentOrder
  ) || SORT_OPTIONS[0];

  const handleSortChange = (value: string) => {
    const selectedOption = SORT_OPTIONS.find((option) => option.value === value);
    if (!selectedOption) return;

    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('orderby', selectedOption.orderby);
    params.set('order', selectedOption.order);

    // Reset page to 1 when sorting changes
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {showLabel && (
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            Sort by:
          </Label>
        )}
        <Select value={currentSort.value} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
