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
import { Loader2, ChevronRight, ChevronLeft, Building2, User, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    vat_number: z.string().min(1, 'VAT/Org number is required'),
    business_type: z.string().min(1, 'Business type is required'),

    // Step 3: Contact & Address
    phone: z.string().min(5, 'Valid phone number is required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required').default('SE'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type BusinessRegisterFormValues = z.infer<typeof businessRegisterSchema>;

export function BusinessRegisterForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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
        },
    });

    const nextStep = async () => {
        let fieldsToValidate: (keyof BusinessRegisterFormValues)[] = [];

        if (step === 1) {
            fieldsToValidate = ['first_name', 'last_name', 'username', 'email', 'password', 'confirmPassword'];
        } else if (step === 2) {
            fieldsToValidate = ['company_name', 'vat_number', 'business_type'];
        }

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    async function onSubmit(data: BusinessRegisterFormValues) {
        setIsLoading(true);
        try {
            const result = await registerBusinessAction(data);

            if (result.success) {
                toast.success('Business registration submitted! Our team will verify your account shortly.');
                router.push('/login');
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error(error);
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Account Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
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
                                            <FormLabel>Last Name</FormLabel>
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
                                        <FormLabel>Username</FormLabel>
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
                                        <FormLabel>Business Email</FormLabel>
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
                                            <FormLabel>Password</FormLabel>
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
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Business details */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <FormField
                                control={form.control}
                                name="company_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
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
                                        <FormLabel>VAT Number / Organization Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SE123456789001" {...field} />
                                        </FormControl>
                                        <FormDescription>Format: SE plus 12 digits for Sweden.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="business_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    )}

                    {/* Step 3: Address & Contact */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+46 70 123 45 67" {...field} />
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
                                        <FormLabel>Delivery Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Main Street 12" {...field} />
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
                                            <FormLabel>Postcode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 45" {...field} />
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
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Stockholm" {...field} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        </div>
                    )}

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
                            <Button type="submit" disabled={isLoading} variant="premium">
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
