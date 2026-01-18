import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandConfig } from "@/config/brand.config";
import { ShoppingBag, Heart, Users, Award, Truck, Globe, Warehouse, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: `About Anmol Wholesale | Restaurant Expertise & Wholesale Power`,
  description: `Discover Anmol Wholesale, Stockholm's leading B2B supplier. With 5+ years of restaurant experience, we provide authentic Indo-Pak ingredients and manufacture the Electric Mini Tandoor. Quality guaranteed by chefs, for chefs.`,
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b">
        <div className="site-container py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About {brandConfig.businessName}
            </h1>
            <p className="text-xl text-muted-foreground">
              {brandConfig.tagline} - Your trusted B2B wholesale partner for professional kitchens across Sweden and Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="site-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Area (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Our Story */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Born from Restaurant Experience
                </h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p className="text-foreground font-semibold text-xl">
                    Anmol Wholesale emerged from the success and real-world demands of Anmol Sweets & Restaurant, a beloved culinary destination in Stockholm known for authentic Indo-Pak cuisine.
                  </p>
                  <p>
                    We're not just distributors—we're restaurateurs who understand the pressures of running a professional kitchen. We know what it's like when an ingredient shipment is late, when quality isn't consistent, or when you need a specific product that no one else stocks. That's why we built Anmol Wholesale: to create the reliable supply chain we wished existed when we were starting out.
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border mt-8">
                    <Image
                      src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png"
                      alt="Anmol Wholesale - Professional Restaurant Supply"
                      fill
                      className="object-contain bg-muted"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <p className="mt-8">
                    As the designers and manufacturers of the <strong>Anmol Electric Tandoor</strong>—a professional-grade tandoor used in our own restaurant and now in commercial kitchens across Europe—we understand what professional equipment needs to deliver. We supply what we use ourselves. No compromises, no shortcuts.
                  </p>
                </div>
              </div>

              {/* What We Offer */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  What We Supply to Professional Kitchens
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Authentic Indo-Pak Ingredients",
                      desc: "Basmati rice by the pallet, premium spices (whole & ground), dals, flours, ghee, condiments. Brands: Shan, MDH, TRS, India Gate, National Foods.",
                      icon: Award
                    },
                    {
                      title: "Professional Kitchen Equipment",
                      desc: "Anmol Electric Tandoor (our flagship product), commercial cookware, serving equipment, and specialty tools for authentic cuisine preparation.",
                      icon: ShoppingBag
                    },
                    {
                      title: "Fresh & Frozen Produce",
                      desc: "Seasonal vegetables (karela, bhindi, tinda, methi), herbs, frozen items. Cold chain maintained from warehouse to your kitchen.",
                      icon: Heart
                    },
                    {
                      title: "Bulk Snacks & Beverages",
                      desc: "Case and pallet quantities of popular brands: Haldiram's, Britannia, Parle, plus traditional sweets and pantry essentials.",
                      icon: Users
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border">
                <h2 className="text-3xl font-bold mb-6">
                  Why B2B Partners Choose Anmol Wholesale
                </h2>
                <div className="grid gap-6">
                  {[
                    {
                      title: "Restaurateur-Backed Quality",
                      desc: "We operate Anmol Sweets & Restaurant. Every product we sell meets our own professional kitchen standards. Your reputation is our reputation."
                    },
                    {
                      title: "Flexible Distribution Options",
                      desc: "Own delivery fleet (Stockholm), DHL partnership (Sweden & EU), third-party freight support, or Ex-warehouse pickup. You choose what works for your business."
                    },
                    {
                      title: "Tiered Wholesale Pricing",
                      desc: "Business accounts receive automatic volume discounts: 10-49 units (-10%), 50-99 units (-16%), 100+ units (-20%). The more you order, the more you save."
                    },
                    {
                      title: "European Expansion Support",
                      desc: "We serve 28+ countries across the EU and Scandinavia. Whether you're opening in Berlin, Oslo, or Copenhagen, we deliver authentic ingredients to your door."
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Stats */}
              <div>
                <h2 className="text-3xl font-bold mb-8">By the Numbers</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { stat: "150+", label: "Brands Stocked", desc: "From India, Pakistan, and Europe" },
                    { stat: "28+", label: "Countries Served", desc: "Across EU & Scandinavia" },
                    { stat: "4", label: "Delivery Options", desc: "Fleet, DHL, freight, pickup" },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-6 rounded-xl bg-muted/30 border">
                      <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                      <div className="font-semibold mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Our Values */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4">Our Commitment</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <Award className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Quality First</p>
                        <p className="text-muted-foreground text-xs">We supply what we use in our own restaurant</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Reliable Supply Chain</p>
                        <p className="text-muted-foreground text-xs">Consistent availability when you need it</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">European Reach</p>
                        <p className="text-muted-foreground text-xs">From Stockholm to your kitchen, anywhere in EU</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">B2B Focused</p>
                        <p className="text-muted-foreground text-xs">Built for restaurants, caterers, grocery stores</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehouse Location */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-primary" />
                    Warehouse Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{brandConfig.contact.address}</p>
                    <p className="text-muted-foreground">Central Stockholm location with easy access for pickup and delivery.</p>
                    <a
                      href={brandConfig.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">10:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday - Sunday</span>
                      <span className="font-medium">11:00 - 19:00</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="border rounded-lg p-6 bg-primary text-primary-foreground">
                  <h3 className="text-lg font-semibold mb-2">Ready to Partner With Us?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Open a business account to access wholesale pricing and preferential terms.
                  </p>
                  <Link
                    href="/wholesale/register"
                    className="block w-full py-3 bg-background text-foreground text-center rounded-lg font-semibold hover:bg-background/90 transition-colors"
                  >
                    Open Business Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
