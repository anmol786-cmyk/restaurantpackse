import { ReactNode } from 'react';
import Link from 'next/link';
import { Section } from '@/components/craft';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { ContactForm, ContactFormData } from '@/components/forms';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { brandConfig } from '@/config/brand.config';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
}

interface ContactTemplateProps {
  title: string;
  description?: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  contactInfo?: ContactInfo;
  onFormSubmit?: (data: ContactFormData) => void | Promise<void>;
  additionalContent?: ReactNode;
  showMap?: boolean;
  mapEmbedUrl?: string;
}

export function ContactTemplate({
  title,
  description,
  breadcrumbs,
  contactInfo,
  onFormSubmit,
  additionalContent,
  showMap = false,
  mapEmbedUrl,
}: ContactTemplateProps) {
  return (
    <>
      <Section>
        <div className="container px-4 md:px-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
          )}

          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{title}</h1>
            {description && (
              <div className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {typeof description === 'string' ? <p>{description}</p> : description}
              </div>
            )}
          </div>

          {/* Contact Cards */}
          {contactInfo && (
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contactInfo.address && (
                <a
                  href={brandConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center rounded-lg border bg-card p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="mb-3 rounded-full bg-primary/10 p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.address}
                  </p>
                  <p className="mt-2 text-xs text-primary">Click to open in Google Maps →</p>
                </a>
              )}

              {contactInfo.phone && (
                <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
                  <div className="mb-3 rounded-full bg-primary/10 p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Phone</h3>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              )}

              {contactInfo.email && (
                <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
                  <div className="mb-3 rounded-full bg-primary/10 p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {contactInfo.hours && contactInfo.hours.length > 0 && (
                <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
                  <div className="mb-3 rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Hours</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {contactInfo.hours.map((hour, index) => (
                      <p key={index}>{hour}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <div className="rounded-lg border bg-card p-6 md:p-8">
                <h2 className="mb-6 text-2xl font-semibold">Send us a Message</h2>
                <ContactForm onSubmit={onFormSubmit} />
              </div>
            </div>

            {/* Additional Content or Info */}
            <div className="space-y-6">
              {additionalContent ? (
                additionalContent
              ) : (
                <div className="rounded-lg border bg-muted/50 p-6">
                  <h3 className="mb-4 text-xl font-semibold">Get in Touch</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Have a question or feedback? We&apos;d love to hear from you!
                      Fill out the form and we&apos;ll get back to you as soon as
                      possible.
                    </p>
                    <p>
                      For immediate assistance or same-day reservations, please
                      call us directly during business hours.
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ or Quick Links could go here */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/menu"
                      className="text-primary transition-colors hover:underline"
                    >
                      View Our Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bookings"
                      className="text-primary transition-colors hover:underline"
                    >
                      Make a Reservation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-primary transition-colors hover:underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-primary transition-colors hover:underline"
                    >
                      Order Online
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Map Section */}
      {showMap && mapEmbedUrl && (
        <Section className="bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="overflow-hidden rounded-lg border">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
