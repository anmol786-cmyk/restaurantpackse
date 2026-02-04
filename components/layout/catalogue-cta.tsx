'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Download Catalogue CTA Section
 * Placed above the footer to encourage catalogue downloads
 */
export function CatalogueCTA() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/catalog/pdf?lang=sv');

            if (!response.ok) {
                throw new Error('Failed to generate catalogue');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Anmol-Wholesale-Catalogue-${new Date().getFullYear()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setDownloaded(true);
            toast.success('Catalogue downloaded successfully!');

            // Reset after 5 seconds
            setTimeout(() => setDownloaded(false), 5000);

        } catch (error) {
            console.error('Error downloading catalogue:', error);
            toast.error('Failed to download catalogue. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                {/* Subtle pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="site-container relative py-16 md:py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    {/* Left: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
                            <FileText className="w-4 h-4" />
                            <span>Free Download</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Download Our
                            <span className="block text-accent">Product Catalogue</span>
                        </h2>

                        <p className="text-white/80 text-lg max-w-xl mb-8">
                            Browse our complete range of wholesale products, bulk pricing, and special offers.
                            Perfect for restaurants, caterers, and food businesses.
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
                            {[
                                { label: '100+ Products', icon: '📦' },
                                { label: 'Wholesale Prices', icon: '💰' },
                                { label: 'Updated Monthly', icon: '🔄' },
                            ].map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-2 text-white/90 text-sm"
                                >
                                    <span className="text-lg">{feature.icon}</span>
                                    <span>{feature.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Download Button */}
                        <Button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            size="lg"
                            className={`
                                h-14 px-8 text-base font-semibold shadow-xl
                                ${downloaded
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-accent hover:bg-accent/90 text-primary'
                                }
                                transition-all duration-300
                            `}
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : downloaded ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Downloaded!
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Catalogue (PDF)
                                </>
                            )}
                        </Button>

                        <p className="text-white/60 text-sm mt-4">
                            No registration required • Instant download
                        </p>
                    </div>

                    {/* Right: Visual/Preview */}
                    <div className="flex-shrink-0 relative">
                        {/* Mock PDF preview */}
                        <div className="relative w-64 md:w-80">
                            {/* Shadow/glow effect */}
                            <div className="absolute inset-0 bg-accent/30 rounded-lg blur-2xl transform translate-y-4" />

                            {/* PDF mockup */}
                            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                                {/* PDF Header bar */}
                                <div className="bg-primary h-3" />

                                {/* Content preview */}
                                <div className="p-6">
                                    {/* Logo area */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary rounded-lg" />
                                        <div>
                                            <div className="h-3 w-24 bg-primary rounded" />
                                            <div className="h-2 w-16 bg-accent/50 rounded mt-1" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="h-4 w-32 bg-primary/20 rounded mb-6" />

                                    {/* Product grid mockup */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="aspect-square bg-gray-100 rounded" />
                                        ))}
                                    </div>

                                    {/* Text lines */}
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-gray-100 rounded" />
                                        <div className="h-2 w-4/5 bg-gray-100 rounded" />
                                        <div className="h-2 w-3/5 bg-gray-100 rounded" />
                                    </div>
                                </div>

                                {/* Footer bar */}
                                <div className="bg-accent h-2" />
                            </div>

                            {/* Badge */}
                            <div className="absolute -top-3 -right-3 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                2026
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
