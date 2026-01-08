/**
 * Prepared Meals Page - Weekend Biryani Pre-Orders
 * Fresh, authentic biryani available for weekend pickup/delivery
 */

import type { Metadata } from 'next';
import { BiryaniBookingForm } from '@/components/prepared-meals/biryani-booking-form';
import { BiryaniMenu } from '@/components/prepared-meals/biryani-menu';
import { Clock, Calendar, ChefHat, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Weekend Biryani Pre-Orders | Ideal Livs',
  description: 'Order authentic Chicken Biryani and Vegetable Biryani for weekend enjoyment. Pre-order before Friday for weekend pickup or delivery.',
  openGraph: {
    title: 'Weekend Biryani Pre-Orders | Ideal Livs',
    description: 'Authentic dum biryani available for weekend orders. Pre-book before Friday!',
    images: [
      {
        url: 'https://crm.ideallivs.com/wp-content/uploads/2026/01/dum-biryani-scaled.jpg',
        width: 1200,
        height: 630,
        alt: 'Weekend Biryani Pre-Orders - Authentic Dum Biryani',
      },
    ],
  },
};

export default function PreparedMealsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://crm.ideallivs.com/wp-content/uploads/2026/01/Ideal-Biryani-Stockholm.jpg)' }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-red-900/90"></div>
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <ChefHat className="h-5 w-5" />
              <span className="text-sm font-medium">Fresh & Authentic</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Authentic Biryani
            </h1>
            <p className="text-lg md:text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
              Weekend pre-orders for family meals. Bulk orders available any day for events and catering (13:00-19:00).
            </p>

            {/* Key Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Available Weekends</p>
                <p className="text-sm text-orange-100">Saturday & Sunday</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Pre-Order Deadline</p>
                <p className="text-sm text-orange-100">Before Friday 6 PM</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <ChefHat className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Fresh Prepared</p>
                <p className="text-sm text-orange-100">Made to Order</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Alert className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Pre-Order Required</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            All biryani orders must be placed before <strong>Friday 6:00 PM</strong> for weekend pickup or delivery.
            Limited quantities available - order early to secure your meal!
          </AlertDescription>
        </Alert>
      </section>

      {/* Biryani Menu */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Signature Biryanis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Slow-cooked using traditional dum pukht method, layered with aromatic basmati rice,
              fresh herbs, and authentic spices.
            </p>
          </div>

          <BiryaniMenu />
        </div>
      </section>

      {/* Bulk Orders & Catering Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
              <ChefHat className="h-5 w-5 text-green-700 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Events & Catering</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bulk Orders for Events & Catering
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Planning a party, corporate event, or celebration? Order our delicious biryani in bulk!
              Available any day of the week between 13:00 to 19:00.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Flexible Timing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Any day of the week<br />13:00 - 19:00
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <ChefHat className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Fresh Prepared</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Made fresh for your event<br />Minimum 10 portions
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Advance Booking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Order 24-48 hours in advance<br />for best availability
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Perfect For:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Birthday Parties
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Corporate Events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Wedding Functions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Family Gatherings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Office Lunches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Special Celebrations
              </li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded">
              <strong>Note:</strong> For bulk orders, use the "Events or Catering" option in the booking form below.
              No calendar or time restrictions - order any day you need!
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pre-Order Your Biryani
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fill in your details below or contact us via WhatsApp for quick booking
            </p>
          </div>

          <BiryaniBookingForm />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Choose Your Biryani</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Select from Chicken or Vegetable Dum Biryani
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Pre-Order</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Book before Friday 6 PM via form or WhatsApp
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">We Prepare</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Fresh biryani made to order for weekend
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Pickup/Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Collect on Saturday or Sunday
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                What is the minimum order quantity?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Minimum order is 1 portion. Each portion serves 1-2 people generously.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Can I order for specific time on weekend?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Specify your preferred pickup/delivery time in the booking form, and we'll confirm availability.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Is delivery available?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, delivery is available within Stockholm area. Delivery charges may apply based on location.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                What if I miss the Friday deadline?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Contact us via WhatsApp. We may be able to accommodate late orders based on availability,
                but we cannot guarantee it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
