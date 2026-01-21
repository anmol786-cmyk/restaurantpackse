'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateVATNumberFormat, getVATConfig } from '@/config/vat-rates';
import { CheckCircle2, XCircle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VATNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, countryCode: string | null) => void;
  required?: boolean;
  label?: string;
  className?: string;
}

export function VATNumberInput({
  value,
  onChange,
  onValidationChange,
  required = false,
  label = 'VAT Number',
  className,
}: VATNumberInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    countryCode: string | null;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!value) {
      setValidationResult(null);
      onValidationChange?.(false, null);
      return;
    }

    // Debounce validation
    const timeoutId = setTimeout(() => {
      setIsValidating(true);
      const result = validateVATNumberFormat(value);
      setValidationResult(result);
      onValidationChange?.(result.valid, result.countryCode);
      setIsValidating(false);
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (!validationResult) {
      return null;
    }

    if (validationResult.valid) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }

    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  const vatConfig = validationResult?.countryCode
    ? getVATConfig(validationResult.countryCode)
    : null;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="vat-number">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        <Input
          id="vat-number"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="e.g., SE123456789001"
          className={cn(
            'pr-10',
            validationResult?.valid && 'border-green-600',
            validationResult && !validationResult.valid && 'border-destructive'
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{getStatusIcon()}</div>
      </div>

      {/* Validation Messages */}
      {validationResult && (
        <Alert
          variant={validationResult.valid ? 'default' : 'destructive'}
          className={cn(validationResult.valid && 'border-green-600 bg-green-50')}
        >
          {validationResult.valid ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {validationResult.valid ? (
              <div className="space-y-1">
                <p className="font-medium text-green-800">Valid VAT number format</p>
                {vatConfig && (
                  <p className="text-sm text-green-700">
                    {vatConfig.countryName} • VAT rate: {vatConfig.reducedRate}% (food products)
                  </p>
                )}
              </div>
            ) : (
              <p>{validationResult.message}</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Info about VAT validation */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <p>
          For B2B cross-border orders within the EU, a valid VAT number enables reverse charge
          mechanism (0% VAT).
        </p>
      </div>
    </div>
  );
}
