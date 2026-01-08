'use client';

import { motion } from "framer-motion";
import { Clock, MapPin, Users, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { brandConfig } from "@/config/brand.config";

const brunchMenu = {
  mainDishes: [
    "Halwa Puri - Traditional Pakistani Breakfast",
    "Choley (Chickpea Curry)",
    "Aloo Bhaji (Spiced Potatoes)",
    "Paratha or Poori (Fresh Bread)",
    "Pakistani Omelette"
  ],
  sides: [
    "Pakistani Sweets & Desserts",
    "Naan",
    "Raita",
    "Yogurt",
    "Chutney"
  ],
  beverages: [
    "Chai (Pakistani Tea)",
    "Coffee",
    "Lassi",
    "Cold Drinks"
  ]
};

export function WeekendBrunch() {
  return (
    <section className="w-full py-24 bg-background relative overflow-hidden border-t border-border/40">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Two Column Layout: Image Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="top-24"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm">
              <Image
                src="https://anmolsweets.se/wp-content/uploads/2025/04/anmol-breakfast-swedish.jpg"
                alt="Weekend Brunch Buffet featuring traditional Pakistani breakfast Halwa Puri at Anmol Sweets & Restaurant Stockholm"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-6 rounded-xl border border-border/50 text-center">
                <p className="text-secondary font-bold uppercase tracking-wider text-xs mb-1">Time</p>
                <p className="font-heading font-bold text-foreground">10:00 - 14:00</p>
                <p className="text-sm text-muted-foreground mt-1">Sat & Sun</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border/50 text-center">
                <p className="text-secondary font-bold uppercase tracking-wider text-xs mb-1">Price</p>
                <p className="font-heading font-bold text-primary text-xl">129 SEK</p>
                <p className="text-sm text-muted-foreground mt-1">Per Person</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            {/* Header */}
            <div className="space-y-4">
              <span className="inline-block text-primary font-bold tracking-wider uppercase text-sm">
                Weekend Special
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Weekend Brunch <br />
                <span className="text-primary">Buffet Experience</span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Start your weekend right with our traditional Pakistani breakfast buffet featuring the famous
                <span className="font-semibold text-foreground mx-1">Halwa Puri</span>
                and over 12 delicious items.
              </p>
            </div>

            {/* Menu Sections */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-border/60 hover:border-primary/20 transition-colors shadow-sm">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-2xl">🍛</span>
                  Main Dishes
                </h3>
                <ul className="space-y-3">
                  {brunchMenu.mainDishes.map((dish, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-xl">🥗</span>
                    Sides & Sweets
                  </h3>
                  <ul className="space-y-2">
                    {brunchMenu.sides.map((side, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-secondary flex-shrink-0" />
                        {side}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-xl">☕</span>
                    Beverages
                  </h3>
                  <ul className="space-y-2">
                    {brunchMenu.beverages.map((beverage, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-secondary flex-shrink-0" />
                        {beverage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/weekend-brunch-buffet">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-12 text-base font-semibold shadow-sm transition-transform hover:scale-105">
                  View Full Brunch Menu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
