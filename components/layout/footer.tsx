import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, ExternalLink, Linkedin } from 'lucide-react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">

          {/* Column 1: Brand Identity */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <div className="relative h-16 w-36">
                <Image
                  src="https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png"
                  alt={brandProfile.name}
                  fill
                  className="object-contain object-left"
                  sizes="144px"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              {brandProfile.description}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: brandProfile.social.instagram },
                { icon: Facebook, href: brandProfile.social.facebook },
                { icon: Youtube, href: brandProfile.social.youtube },
                { icon: Linkedin, href: brandProfile.social.linkedin }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-md transition-all"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products/Catalog */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 underline decoration-primary decoration-2 underline-offset-8">
              Catalog
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Bulk Staples', href: '/product-category/staples' },
                { label: 'Oils & Ghee', href: '/product-category/oils-ghee' },
                { label: 'Basmati Rice', href: '/product-category/rice' },
                { label: 'Electric Tandoor', href: '/product-category/equipment' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-primary transition-colors">
                    {link.label}
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
                { label: 'Stockholm Fleet', href: '/delivery-information' },
                { label: 'Free Over 5000 kr', href: '/delivery-information' },
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
  );
}
