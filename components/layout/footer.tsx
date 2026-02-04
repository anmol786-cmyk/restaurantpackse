import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, ExternalLink, Linkedin } from 'lucide-react';
import { getOnSaleProducts, getProductCategories } from '@/lib/woocommerce';
import { CatalogueCTA } from './catalogue-cta';

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);
  const categories = await getProductCategories({ parent: 0, per_page: 5, hide_empty: true });

  return (
    <>
      {/* Download Catalogue CTA Section */}
      <CatalogueCTA />

      <footer className="w-full bg-slate-50 border-t border-slate-200">
      <div className="site-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">

          {/* Column 1: Brand Identity */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105">
              <div className="relative h-14 w-14">
                <Image
                  src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png"
                  alt={brandProfile.name}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              <span className="font-heading font-bold text-lg text-primary uppercase tracking-wide">
                Anmol Wholesale
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              {brandProfile.description}
            </p>
            <div className="flex gap-4">
              <a
                href={brandProfile.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-md transition-all"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="size-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Products/Catalog */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 underline decoration-primary decoration-2 underline-offset-8">
              Catalog
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link href={`/product-category/${category.slug}`} className="text-sm text-slate-500 hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Logistics */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 underline decoration-primary decoration-2 underline-offset-8">
              Logistics
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Delivery Info', href: '/delivery-information' },
                { label: 'Europe Shipping', href: '/europe-delivery' },
                { label: 'Ex-Warehouse', href: '/delivery-information' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: B2B Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 underline decoration-primary decoration-2 underline-offset-8">
              Partnership
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'B2B Account', href: '/wholesale/register' },
                { label: 'Request Quote', href: '/wholesale/quote' },
                { label: 'Wholesale Hub', href: '/wholesale' },
                { label: 'Partner Program', href: '/wholesale' },
                { label: 'FAQ', href: '/faq' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} {brandProfile.name}. {brandProfile.tagline}.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms-conditions' },
              { label: 'Returns', href: '/refund-return' }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Brand Accent - Red Bottom bar as requested */}
      <div className="h-1.5 w-full bg-primary" />
    </footer>
    </>
  );
}
