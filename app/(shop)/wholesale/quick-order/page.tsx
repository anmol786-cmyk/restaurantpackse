import { Metadata } from 'next';
import { QuickOrderFormEnhanced } from '@/components/wholesale/quick-order-form-enhanced';
import { Zap, Package, Clock, CheckCircle, FileSpreadsheet, Save } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quick Order - Bulk Ordering Made Easy | Anmol Wholesale',
  description: 'Speed up your wholesale ordering with our quick order form. Search products, enter quantities, and submit your order in minutes. Perfect for regular reordering and bulk purchases.',
};

export default function QuickOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#A80E13] to-[#7A0A0E] py-16 text-white">
        <div className="site-container px-4">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20">
                From Our Restaurant Kitchen to Yours
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
              Quick Order Form
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Place bulk orders in minutes. Search products by name, enter quantities, and submit—it's that simple.
              Perfect for regular reorders and large purchases.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="site-container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Fast Ordering</h3>
              <p className="text-xs text-muted-foreground">Add multiple products at once</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Smart Search</h3>
              <p className="text-xs text-muted-foreground">Autocomplete after 3 letters</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-blue-600/10 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">CSV Upload</h3>
              <p className="text-xs text-muted-foreground">Import bulk orders from spreadsheet</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-orange-600/10 rounded-lg">
              <Save className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Save Templates</h3>
              <p className="text-xs text-muted-foreground">Quick reorder from saved lists</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">PDF Download</h3>
              <p className="text-xs text-muted-foreground">Professional order documents</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="p-2 bg-pink-600/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Email Confirmation</h3>
              <p className="text-xs text-muted-foreground">Instant order confirmation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="site-container px-4 py-8">
        <QuickOrderFormEnhanced />
      </div>

      {/* Help Section */}
      <div className="site-container px-4 py-12">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 font-heading">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold mb-2">Search Products</h3>
              <p className="text-sm text-muted-foreground">
                Type at least 3 letters in the product field to see autocomplete suggestions. Select the products you need.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold mb-2">Enter Quantities</h3>
              <p className="text-sm text-muted-foreground">
                Specify how many units you need for each product. Add more lines if you need to order multiple products.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold mb-2">Submit Order</h3>
              <p className="text-sm text-muted-foreground">
                Review your order total and submit. You'll receive an email confirmation, and our team will contact you within 24 hours.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our team is here to assist you with your wholesale orders. Contact us anytime:
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+46769178456"
                className="text-sm font-medium text-primary hover:underline"
              >
                📞 +46 76 917 84 56
              </a>
              <a
                href="mailto:wholesale@restaurantpack.se"
                className="text-sm font-medium text-primary hover:underline"
              >
                ✉️ wholesale@restaurantpack.se
              </a>
              <a
                href="https://wa.me/46769178456"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
