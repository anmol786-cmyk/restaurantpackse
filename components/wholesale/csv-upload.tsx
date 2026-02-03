'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import type { Product } from '@/types/woocommerce';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, HelpCircle } from "lucide-react";

interface CSVRow {
  product_name?: string;
  sku?: string;
  quantity?: string;
}

interface ParsedProduct {
  identifier: string; // name or SKU
  quantity: number;
  searchType: 'name' | 'sku';
}

interface CSVUploadProps {
  onProductsImported: (products: Array<{ product: Product; quantity: number }>) => void;
}

export function CSVUpload({ onProductsImported }: CSVUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      // Parse CSV
      Papa.parse<CSVRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const parsedProducts = parseCSVData(results.data);
            if (parsedProducts.length === 0) {
              toast.error('No valid products found in CSV');
              setUploadStatus('error');
              setIsProcessing(false);
              return;
            }

            // Search for products
            const importedProducts = await searchAndMatchProducts(parsedProducts);

            if (importedProducts.length > 0) {
              onProductsImported(importedProducts);
              toast.success(
                `Successfully imported ${importedProducts.length} of ${parsedProducts.length} products`
              );
              setUploadStatus('success');
            } else {
              toast.error('No matching products found');
              setUploadStatus('error');
            }
          } catch (error) {
            console.error('CSV processing error:', error);
            toast.error('Failed to process CSV file');
            setUploadStatus('error');
          } finally {
            setIsProcessing(false);
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast.error('Failed to parse CSV file');
          setUploadStatus('error');
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error('File reading error:', error);
      toast.error('Failed to read file');
      setUploadStatus('error');
      setIsProcessing(false);
    }
  };

  const parseCSVData = (data: CSVRow[]): ParsedProduct[] => {
    const parsed: ParsedProduct[] = [];

    for (const row of data) {
      // Try to find product identifier (name or SKU)
      const identifier = row.product_name || row.sku || '';
      const quantity = parseInt(row.quantity || '1');

      if (identifier && !isNaN(quantity) && quantity > 0) {
        parsed.push({
          identifier: identifier.trim(),
          quantity,
          searchType: row.sku ? 'sku' : 'name',
        });
      }
    }

    return parsed;
  };

  const searchAndMatchProducts = async (
    parsedProducts: ParsedProduct[]
  ): Promise<Array<{ product: Product; quantity: number }>> => {
    const matched: Array<{ product: Product; quantity: number }> = [];

    for (const item of parsedProducts) {
      try {
        // Search by name or SKU
        const searchParam =
          item.searchType === 'sku' ? `sku=${item.identifier}` : `q=${item.identifier}`;
        const response = await fetch(`/api/products/search?${searchParam}&per_page=1`);

        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            matched.push({
              product: data.products[0],
              quantity: item.quantity,
            });
          }
        }

        // Small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to search for ${item.identifier}:`, error);
      }
    }

    return matched;
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const csvContent =
      'product_name,quantity\n' +
      'Basmati Rice 5kg,10\n' +
      'Ghee Pure 1L,5\n' +
      'Turmeric Powder 500g,20\n';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_order_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          onClick={handleButtonClick}
          disabled={isProcessing}
          variant="outline"
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload CSV
            </>
          )}
        </Button>

        <Button onClick={downloadTemplate} variant="ghost" size="sm" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Download Template
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
              Format Help
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>CSV Upload Guide</DialogTitle>
              <DialogDescription>
                Follow these formatting rules to ensure your bulk order is imported correctly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Recommended Format (by SKU)</h4>
                <div className="bg-muted p-2 rounded-md font-mono text-xs">
                  sku,quantity<br />
                  ANM-101,50<br />
                  ANM-102,100
                </div>
                <p className="text-xs text-muted-foreground">
                  Using SKUs is the most accurate way to match products.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Alternative Format (by Name)</h4>
                <div className="bg-muted p-2 rounded-md font-mono text-xs">
                  product_name,quantity<br />
                  Basmati Rice 5kg,10<br />
                  Ghee Pure 1L,5
                </div>
                <p className="text-xs text-muted-foreground">
                  Our system will try to find the closest match for the product names.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-md">
                <div className="flex gap-2 text-amber-800">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-xs">
                    Please ensure your file has headers in the first row. The column names must be exactly <strong>product_name</strong> or <strong>sku</strong>, and <strong>quantity</strong>.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Import successful</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Import failed</span>
          </div>
        )}
      </div>
    </div>
  );
}
