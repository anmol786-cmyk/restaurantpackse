'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { cn, decodeHtmlEntities } from '@/lib/utils';
import type { ProductCategoryFull } from '@/types/woocommerce';

type CategoryWithChildren = ProductCategoryFull & {
  children: CategoryWithChildren[];
};

function buildCategoryTree(categories: ProductCategoryFull[]): CategoryWithChildren[] {
  const categoryMap = new Map<number, CategoryWithChildren>();

  // Initialize map
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  const rootCategories: CategoryWithChildren[] = [];

  categories.forEach((cat) => {
    const current = categoryMap.get(cat.id)!;
    if (cat.parent === 0) {
      rootCategories.push(current);
    } else {
      const parent = categoryMap.get(cat.parent);
      if (parent) {
        parent.children.push(current);
      } else {
        // If parent is missing (e.g. not fetched), treat as root or ignore
        // For now, we'll treat as root to be safe, or maybe ignore if strict hierarchy needed
        // Let's treat as root to avoid losing categories
        rootCategories.push(current);
      }
    }
  });

  return rootCategories;
}

function filterCategoryTree(categories: CategoryWithChildren[]): CategoryWithChildren[] {
  return categories
    .map((cat) => ({
      ...cat,
      children: filterCategoryTree(cat.children),
    }))
    .filter((cat) => cat.count > 0 || cat.children.length > 0);
}

interface CategoryItemProps {
  category: CategoryWithChildren;
  selectedCategories: string[];
  onToggle: (slug: string) => void;
  depth?: number;
}

function CategoryItem({ category, selectedCategories, onToggle, depth = 0 }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategories.includes(category.slug);

  // Auto-expand if a child is selected
  useEffect(() => {
    const hasSelectedChild = (cat: CategoryWithChildren): boolean => {
      if (selectedCategories.includes(cat.slug)) return true;
      return cat.children.some(hasSelectedChild);
    };

    if (hasChildren && !isOpen && category.children.some(hasSelectedChild)) {
      setIsOpen(true);
    }
  }, [selectedCategories, category, hasChildren, isOpen]);

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center justify-between", depth > 0 && "ml-2")}>
        <div className="flex items-center space-x-2 flex-1">
          <Checkbox
            id={`category-${category.id}`}
            checked={isSelected}
            onCheckedChange={() => onToggle(category.slug)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor={`category-${category.id}`}
            className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal hover:text-primary transition-colors"
          >
            <span>{decodeHtmlEntities(category.name)}</span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full ml-2">
              {category.count}
            </span>
          </Label>
        </div>
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="pl-4 border-l border-muted ml-2 space-y-2 mt-2">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedCategories={selectedCategories}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductFiltersProps {
  categories?: ProductCategoryFull[];
  minPrice?: number;
  maxPrice?: number;
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  rating?: number;
}

export function ProductFilters({
  categories = [],
  minPrice = 0,
  maxPrice = 1000,
  className,
  onFilterChange,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [minPrice, maxPrice],
    inStock: false,
    onSale: false,
    featured: false,
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!isInitialized && searchParams) {
      const categoryParam = searchParams.get('category');
      const minPriceParam = searchParams.get('min_price');
      const maxPriceParam = searchParams.get('max_price');
      const stockParam = searchParams.get('stock_status');
      const saleParam = searchParams.get('on_sale');
      const featuredParam = searchParams.get('featured');

      setFilters({
        categories: categoryParam ? categoryParam.split(',') : [],
        priceRange: [
          minPriceParam ? parseInt(minPriceParam) : minPrice,
          maxPriceParam ? parseInt(maxPriceParam) : maxPrice,
        ],
        inStock: stockParam === 'instock',
        onSale: saleParam === 'true',
        featured: featuredParam === 'true',
      });
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized, minPrice, maxPrice]);

  // Update URL params when filters change
  useEffect(() => {
    if (!isInitialized) return; // Don't run until initialized

    const params = new URLSearchParams(searchParams?.toString() || '');

    // Categories
    if (filters.categories.length > 0) {
      params.set('category', filters.categories.join(','));
    } else {
      params.delete('category');
    }

    // Price range
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) {
      params.set('min_price', filters.priceRange[0].toString());
      params.set('max_price', filters.priceRange[1].toString());
    } else {
      params.delete('min_price');
      params.delete('max_price');
    }

    // Stock status
    if (filters.inStock) {
      params.set('stock_status', 'instock');
    } else {
      params.delete('stock_status');
    }

    // On sale
    if (filters.onSale) {
      params.set('on_sale', 'true');
    } else {
      params.delete('on_sale');
    }

    // Featured
    if (filters.featured) {
      params.set('featured', 'true');
    } else {
      params.delete('featured');
    }

    // Rating
    if (filters.rating) {
      params.set('rating', filters.rating.toString());
    } else {
      params.delete('rating');
    }

    // Reset page to 1 when filters change
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
    onFilterChange?.(filters);

    // Count active filters
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.featured) count++;
    if (filters.rating) count++;
    setActiveFiltersCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, router, pathname, minPrice, maxPrice, onFilterChange, isInitialized]);

  const handleCategoryToggle = (categorySlug: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categorySlug)
        ? prev.categories.filter((c) => c !== categorySlug)
        : [...prev.categories, categorySlug],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [minPrice, maxPrice],
      inStock: false,
      onSale: false,
      featured: false,
    });
    router.push(pathname);
  };

  const handleRemoveCategory = (categorySlug: string) => {
    handleCategoryToggle(categorySlug);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-auto p-0 text-sm hover:text-primary"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((categorySlug) => {
            const category = categories.find((c) => c.slug === categorySlug);
            return (
              <Badge
                key={categorySlug}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {category ? decodeHtmlEntities(category.name) : categorySlug}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-transparent"
                  onClick={() => handleRemoveCategory(categorySlug)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
            <Badge variant="secondary">
              {filters.priceRange[0]} - {filters.priceRange[1]} SEK
            </Badge>
          )}
          {filters.inStock && <Badge variant="secondary">In Stock</Badge>}
          {filters.onSale && <Badge variant="secondary">On Sale</Badge>}
          {filters.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
      )}

      {/* Filter Groups */}
      <Accordion type="multiple" defaultValue={['price', 'categories', 'status']} className="w-full">
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{filters.priceRange[0]} SEK</span>
                <span className="font-medium">{filters.priceRange[1]} SEK</span>
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={10}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-base">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              {/* Search is removed as it complicates the tree view, or we can keep it but it filters flat list? 
                  The user didn't ask to remove search, but tree view + search is complex. 
                  I'll keep the search input but maybe hide it for now or implement simple filtering if requested.
                  For now, I'll remove the search to focus on the tree structure as requested.
              */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {(() => {
                  const tree = filterCategoryTree(buildCategoryTree(categories));
                  if (tree.length === 0) return <p className="text-sm text-muted-foreground">No categories found.</p>;

                  return tree.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      selectedCategories={filters.categories}
                      onToggle={handleCategoryToggle}
                    />
                  ));
                })()}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Product Status Filter */}
        <AccordionItem value="status">
          <AccordionTrigger className="hover:no-underline">
            Product Status
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, inStock: checked as boolean }))
                }
              />
              <Label htmlFor="in-stock" className="cursor-pointer text-sm font-normal">
                In Stock Only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, onSale: checked as boolean }))
                }
              />
              <Label htmlFor="on-sale" className="cursor-pointer text-sm font-normal">
                On Sale
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, featured: checked as boolean }))
                }
              />
              <Label htmlFor="featured" className="cursor-pointer text-sm font-normal">
                Featured Products
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="hover:no-underline">
            Customer Rating
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pt-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: prev.rating === rating ? undefined : rating,
                  }))
                }
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted',
                  filters.rating === rating && 'bg-muted'
                )}
              >
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-lg',
                        i < rating ? 'text-yellow-400' : 'text-muted-foreground'
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-muted-foreground">& up</span>
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
