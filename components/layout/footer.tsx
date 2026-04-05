import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, ExternalLink, Linkedin } from 'lucide-react';
import { getOnSaleProducts, getProductCategories } from '@/lib/woocommerce';
import { CatalogueCTA } from './catalogue-cta';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);
  const categories = await getProductCategories({ parent: 0, per_page: 5, hide_empty: true });
  const t = await getTranslations('footer');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');

  return (
    <>
      {/* Download Catalogue CTA Section */}
      <CatalogueCTA />

      <footer className="w-full bg-muted border-t border-border">
        <div className="site-container py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-16">

            {/* Column 1: Brand Identity */}
            <div className="col-span-2 lg:col-span-2 space-y-6 min-w-0">
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
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {t('brandDescription')}
              </p>
              <div className="flex gap-4">
                <a
                  href={brandProfile.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary hover:shadow-md transition-all"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="size-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Products/Catalog */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 underline decoration-primary decoration-2 underline-offset-8">
                {t('catalog')}
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {tc('allProducts')}
                  </Link>
                </li>
                {categories?.map((category) => (
                  <li key={category.id}>
                    <Link href={`/product-category/${category.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Logistics */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 underline decoration-primary decoration-2 underline-offset-8">
                {t('logistics')}
              </h4>
              <ul className="space-y-4">
                {[
                  { label: t('deliveryInfo'), href: '/delivery-information' },
                  { label: t('europeShipping'), href: '/europe-delivery' },
                  { label: t('exWarehouse'), href: '/delivery-information' }
                ].map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: B2B Support */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 underline decoration-primary decoration-2 underline-offset-8">
                {t('partnership')}
              </h4>
              <ul className="space-y-4">
                {[
                  { label: tn('b2bAccount'), href: '/wholesale/register' },
                  { label: t('requestQuote'), href: '/wholesale/quote' },
                  { label: t('wholesaleHub'), href: '/wholesale' },
                  { label: t('partnerProgram'), href: '/wholesale' },
                  { label: t('faq'), href: '/faq' }
                ].map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 underline decoration-primary decoration-2 underline-offset-8">
                {t('company')}
              </h4>
              <ul className="space-y-4">
                {[
                  { label: tn('about'), href: '/about' },
                  { label: tn('contact'), href: '/contact' },
                  { label: tn('blog'), href: '/blog' },
                  { label: t('deliveryInfo'), href: '/delivery-information' },
                  { label: t('europeShipping'), href: '/europe-delivery' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                &copy; {new Date().getFullYear()} {brandProfile.name}. {t('copyright')}
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                Anmol AB &nbsp;|&nbsp; Org.nr: 559159-8726 &nbsp;|&nbsp; VAT: SE559159872601 &nbsp;|&nbsp; Fagerstagatan 13, 163 53 Spånga, Stockholm
              </p>
            </div>
            <div className="flex gap-8">
              {[
                { label: t('privacyPolicy'), href: '/privacy-policy' },
                { label: t('terms'), href: '/terms-conditions' },
                { label: t('returns'), href: '/refund-return' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
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
