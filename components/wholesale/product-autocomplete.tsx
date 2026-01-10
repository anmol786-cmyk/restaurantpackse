'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/woocommerce';
import Image from 'next/image';

interface ProductAutocompleteProps {
  onSelect: (product: Product) => void;
  selectedProduct: Product | null;
}

export function ProductAutocomplete({ onSelect, selectedProduct }: ProductAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products when query changes (min 3 characters)
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsSearching(true);
      setIsOpen(true);

      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&per_page=10`);
        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setResults(data.products || []);
      } catch (error) {
        console.error('Product search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(null as any);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {selectedProduct ? (
        <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/50">
          {selectedProduct.images && selectedProduct.images[0] ? (
            <div className="relative h-6 w-6 flex-shrink-0">
              <Image
                src={selectedProduct.images[0].src}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded"
                sizes="24px"
              />
            </div>
          ) : (
            <Package className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm flex-1 truncate">{selectedProduct.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type 3+ letters to search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Dropdown Results */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Searching products...
                </div>
              ) : results.length > 0 ? (
                <div className="py-1">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelect(product)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                    >
                      {product.images && product.images[0] ? (
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={product.images[0].src}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku || 'N/A'} • Stock: {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {product.price ? `${parseFloat(String(product.price)).toFixed(2)} kr` : 'N/A'}
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length >= 3 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found for "{query}"
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
