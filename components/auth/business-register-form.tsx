'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerBusinessAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronRight, ChevronLeft, Building2, User, MapPin, CheckCircle2, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { validateBusinessNumber, type VATValidationResult } from '@/lib/vat-validation';

const businessRegisterSchema = z.object({
    // Step 1: Account
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),

    // Step 2: Business
    company_name: z.string().min(1, 'Company name is required'),
    vat_number: z.string()
        .refine((val) => {
            // Allow empty - VAT is optional
            if (!val || val.trim() === '') return true;

            // Normalize: remove spaces, hyphens, dots and convert to uppercase
            const normalized = val.replace(/[\s\-\.]/g, '').toUpperCase();

            // Swedish Org Number: 10 digits (e.g., 5592538069 or 559253-8069)
            if (/^\d{10}$/.test(normalized)) return true;

            // Swedish VAT: SE + 12 digits (e.g., SE559253806901)
            if (/^SE\d{12}$/.test(normalized)) return true;

            // Generic EU VAT: Country Code (2 letters) + 8-12 alphanumeric chars
            if (/^[A-Z]{2}[A-Z0-9]{8,12}$/.test(normalized)) return true;

            // Norwegian Org Number: 9 digits
            if (/^\d{9}$/.test(normalized)) return true;

            // Danish CVR: 8 digits
            if (/^\d{8}$/.test(normalized)) return true;

            return false;
        }, 'Invalid VAT or Organization number format. Examples: 559253-8069, SE559253806901'),
    business_type: z.string().min(1, 'Business type is required'),

    // Step 3: Contact & Address
    phone: z.string().min(5, 'Valid phone number is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),

    // Step 3: Credit Application (optional)
    apply_for_credit: z.boolean().default(false),
    estimated_monthly_volume: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type BusinessRegisterFormValues = z.infer<typeof businessRegisterSchema>;

export function BusinessRegisterForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidatingVAT, setIsValidatingVAT] = useState(false);
    const [vatValidation, setVatValidation] = useState<VATValidationResult | null>(null);
    const router = useRouter();

    const handleValidateVAT = async (vatNumber: string, country: string) => {
        if (!vatNumber || vatNumber.length < 5) {
            toast.error('Please enter a valid VAT/Organization number');
            return;
        }

        setIsValidatingVAT(true);
        setVatValidation(null);

        try {
            // First do a smart validation (formats, Luhn, etc.)
            const result = await validateBusinessNumber(vatNumber, country);

            // If it's a valid format and we're in SE, let's try to get company info if we had an API for it
            // For now, we rely on the result from validateBusinessNumber
            setVatValidation(result);

            if (result.valid) {
                toast.success('Business identity verified!');

                // Auto-fill formatted VAT number
                if (result.formatted) {
                    form.setValue('vat_number', result.formatted, { shouldValidate: true });
                }

                // If we got a company name (e.g. from VIES), auto-fill it
                if (result.companyName) {
                    form.setValue('company_name', result.companyName, { shouldValidate: true });
                }

                // If we got an address, auto-fill it (split it if needed for city/postcode)
                if (result.companyAddress) {
                    form.setValue('address', result.companyAddress, { shouldValidate: true });
                }
            } else {
                toast.error(result.error || 'Validation failed');
            }
        } catch (error) {
            console.error('VAT validation error:', error);
            toast.error('Unable to validate number. Please try manual entry.');
        } finally {
            setIsValidatingVAT(false);
        }
    };

    const form = useForm<BusinessRegisterFormValues>({
        resolver: zodResolver(businessRegisterSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            company_name: '',
            vat_number: '',
            business_type: '',
            phone: '',
            address: '',
            city: '',
            postcode: '',
            country: 'SE',
            apply_for_credit: false,
            estimated_monthly_volume: '',
        },
        mode: 'onBlur', // Validate when field loses focus (less aggressive)
        shouldUnregister: false, // Keep values even when fields are hidden
        shouldFocusError: true, // Auto-focus the first field with error
    });

    const nextStep = async () => {
        let fieldsToValidate: (keyof BusinessRegisterFormValues)[] = [];

        if (step === 1) {
            fieldsToValidate = ['first_name', 'last_name', 'username', 'email', 'password', 'confirmPassword'];
        } else if (step === 2) {
            fieldsToValidate = ['company_name', 'vat_number', 'business_type'];
        }

        const isValid = await form.trigger(fieldsToValidate);

        if (!isValid) {
            const errors = form.formState.errors;
            const errorFields = fieldsToValidate.filter(f => errors[f]);
            if (errorFields.length > 0) {
                toast.error(`Please fix: ${errorFields.join(', ')}`);
            }
        }

        if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    async function onSubmit(data: BusinessRegisterFormValues) {
        setIsLoading(true);
        toast.info('Submitting registration...', { duration: 2000 });

        try {
            const result = await registerBusinessAction(data);

            if (result.success) {
                toast.success('Registration successful! Redirecting to login...', { duration: 3000 });
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            } else {
                toast.error(result.error || 'Registration failed', { duration: 5000 });
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An unexpected error occurred. Please try again.', { duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    }

    const steps = [
        { id: 1, name: 'Account', icon: User },
        { id: 2, name: 'Business', icon: Building2 },
        { id: 3, name: 'Address', icon: MapPin },
    ];

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between max-w-sm mx-auto mb-8">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex flex-col items-center relative gap-2">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                            step === s.id ? "border-primary bg-primary text-primary-foreground shadow-lg scale-110" :
                                step > s.id ? "border-green-500 bg-green-500 text-white" : "border-muted bg-background text-muted-foreground"
                        )}>
                            {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={cn(
                            "text-xs font-medium",
                            step === s.id ? "text-primary" : "text-muted-foreground"
                        )}>{s.name}</span>
                        {i < steps.length - 1 && (
                            <div className={cn(
                                "absolute left-1/2 top-5 w-full h-[2px] -z-0 ml-5",
                                step > s.id ? "bg-green-500" : "bg-muted"
                            )} style={{ width: 'calc(100% + 20px)' }} />
                        )}
                    </div>
                ))}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    // Find which step has errors and navigate to it
                    const step1Fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirmPassword'];
                    const step2Fields = ['company_name', 'vat_number', 'business_type'];
                    const step3Fields = ['phone', 'address', 'city', 'postcode', 'country'];

                    const errorKeys = Object.keys(errors);
                    const step1Errors = errorKeys.filter(k => step1Fields.includes(k));
                    const step2Errors = errorKeys.filter(k => step2Fields.includes(k));
                    const step3Errors = errorKeys.filter(k => step3Fields.includes(k));

                    if (step1Errors.length > 0) {
                        toast.error(`Step 1 has errors: ${step1Errors.join(', ')}`);
                        setStep(1);
                    } else if (step2Errors.length > 0) {
                        toast.error(`Step 2 has errors: ${step2Errors.join(', ')}`);
                        setStep(2);
                    } else if (step3Errors.length > 0) {
                        toast.error(`Step 3 has errors: ${step3Errors.join(', ')}`);
                    } else {
                        const firstError = Object.values(errors)[0];
                        toast.error(firstError?.message || 'Please check all fields');
                    }
                })} className="space-y-6">
                    {/* Step 1: Account Info */}
                    <div className={cn("space-y-4 animate-in fade-in slide-in-from-right-4 duration-500", step !== 1 && "hidden")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe_wholesale" {...field} />
                                    </FormControl>
                                    <FormDescription>Choose a unique username for your business account.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Email *</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="orders@company.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password *</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password *</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Step 2: Business details */}
                    <div className={cn("space-y-4 animate-in fade-in slide-in-from-right-4 duration-500", step !== 2 && "hidden")}>
                        <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Anmol Food Services AB" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="vat_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VAT Number / Organization Number (Optional)</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                placeholder="SE123456789001 or 123456-7890"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    // Reset validation when input changes
                                                    if (vatValidation) setVatValidation(null);
                                                }}
                                                className={cn(
                                                    vatValidation?.valid && "border-green-500 focus-visible:ring-green-500",
                                                    vatValidation && !vatValidation.valid && "border-red-500 focus-visible:ring-red-500"
                                                )}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleValidateVAT(field.value, form.getValues('country'))}
                                            disabled={isValidatingVAT || !field.value}
                                            className="shrink-0"
                                        >
                                            {isValidatingVAT ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <ShieldCheck className="h-4 w-4" />
                                            )}
                                            <span className="ml-2 hidden sm:inline">Verify</span>
                                        </Button>
                                    </div>

                                    {/* Validation Status */}
                                    {vatValidation && (
                                        <div className={cn(
                                            "mt-2 p-2 rounded-md text-sm flex items-start gap-2",
                                            vatValidation.valid
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-red-50 text-red-700 border border-red-200"
                                        )}>
                                            {vatValidation.valid ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="font-medium">VAT number verified</p>
                                                        {vatValidation.companyName && (
                                                            <p className="text-xs mt-0.5">{vatValidation.companyName}</p>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="font-medium">Validation failed</p>
                                                        <p className="text-xs mt-0.5">{vatValidation.error}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <FormDescription>
                                        Enter your VAT number (SE123456789001) or Swedish org number (123456-7890).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="business_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Type *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your business type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="restaurant">Restaurant</SelectItem>
                                            <SelectItem value="cafe">Café</SelectItem>
                                            <SelectItem value="catering">Catering Service</SelectItem>
                                            <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                                            <SelectItem value="pizzeria">Pizzeria</SelectItem>
                                            <SelectItem value="grocery">Grocery Store / Retailer</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Step 3: Address & Contact */}
                    <div className={cn("space-y-4 animate-in fade-in slide-in-from-right-4 duration-500", step !== 3 && "hidden")}>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Phone Number *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="+46 70 123 45 67"
                                            {...field}
                                            autoComplete="tel"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Delivery Address *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Main Street 12"
                                            {...field}
                                            autoComplete="shipping street-address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="postcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postcode *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 45"
                                                {...field}
                                                autoComplete="shipping postal-code"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Stockholm"
                                                {...field}
                                                autoComplete="shipping address-level2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || 'SE'}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SE">Sweden</SelectItem>
                                            <SelectItem value="NO">Norway</SelectItem>
                                            <SelectItem value="DK">Denmark</SelectItem>
                                            <SelectItem value="FI">Finland</SelectItem>
                                            <SelectItem value="DE">Germany</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Credit Application Section */}
                        <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                            <FormField
                                control={form.control}
                                name="apply_for_credit"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base font-semibold">
                                                Apply for 28-Day Credit Terms
                                            </FormLabel>
                                            <FormDescription>
                                                Optional: Request invoice payment with 28-day terms. Subject to approval after account verification.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {form.watch('apply_for_credit') && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <FormField
                                        control={form.control}
                                        name="estimated_monthly_volume"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estimated Monthly Order Volume (SEK)</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select estimated volume" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="5000-15000">5,000 - 15,000 SEK</SelectItem>
                                                        <SelectItem value="15000-30000">15,000 - 30,000 SEK</SelectItem>
                                                        <SelectItem value="30000-50000">30,000 - 50,000 SEK</SelectItem>
                                                        <SelectItem value="50000-100000">50,000 - 100,000 SEK</SelectItem>
                                                        <SelectItem value="100000+">100,000+ SEK</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    This helps us determine your credit limit. Minimum order of 5,000 SEK required for credit terms.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4 border-t">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <Button type="button" onClick={nextStep} variant="premium">
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="premium"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Registration
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
