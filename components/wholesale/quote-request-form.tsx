'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Send, Package, Building2, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const quoteSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Phone number is required'),
    companyName: z.string().min(1, 'Company name is required'),
    vatNumber: z.string().optional(),
    businessType: z.string().min(1, 'Business type is required'),
    message: z.string().optional(),
    items: z.array(z.object({
        name: z.string().min(1, 'Product name is required'),
        quantity: z.string().min(1, 'Quantity is required'),
        sku: z.string().optional(),
    })).min(1, 'At least one item is required'),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuoteRequestForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            companyName: '',
            vatNumber: '',
            businessType: '',
            message: '',
            items: [{ name: '', quantity: '1', sku: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    async function onSubmit(data: QuoteFormValues) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/quotes/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                toast.success(result.message || 'Quote request submitted successfully!');
                form.reset();
            } else {
                toast.error(result.error || 'Failed to submit quote request');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Request Received!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for choosing Anmol Wholesale. Our B2B team has received your request and will provide a personalized quote within 24 business hours.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                    Send Another Request
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Business Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3>Business Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="companyName"
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
                            name="vatNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VAT / Org Number (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SE123456789001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
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
                            name="lastName"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@company.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+46 70 123 45 67" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select business type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="cafe">Café</SelectItem>
                                        <SelectItem value="catering">Catering Service</SelectItem>
                                        <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                                        <SelectItem value="grocery">Grocery Store</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 2: Items */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Package className="w-5 h-5 text-primary" />
                            <h3>Requested Products</h3>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: '', quantity: '1', sku: '' })}
                            className="h-8"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Item
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <Card key={field.id} className="border-muted bg-muted/30">
                                <CardContent className="p-4 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                        <div className="md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={index > 0 ? "sr-only" : ""}>Product Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Basmati Rice 20kg" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.sku`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={index > 0 ? "sr-only" : ""}>SKU (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="SKU-123" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={index > 0 ? "sr-only" : ""}>Quantity / Volume</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="50 kg / 10 boxes" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-1 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Section 3: Message */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <h3>Additional Details</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message or Special Requirements</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your delivery preferences, recurring needs, or any specific brands you are looking for..."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading} variant="premium">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Request...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-5 w-5" />
                            Submit Quote Request
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
