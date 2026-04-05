import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SchemaScript } from '@/lib/schema/schema-script';
import { anmolWholesaleOrganizationSchema } from '@/lib/schema';
import { Section, Container, Prose } from '@/components/craft';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

// Static blog posts — add new entries here as you publish more
const STATIC_POSTS = [
  {
    slug: 'elektrisk-tandoor-vs-koleldad-tandoor',
    title: 'Elektrisk Tandoor vs. Koleldad Tandoor – Vilket passar din restaurang?',
    excerpt:
      'Komplett jämförelse av elektrisk och koleldad tandoor för restauranger i Sverige. Brandkrav, driftkostnad, underhåll och smak – allt du behöver veta innan du köper.',
    date: '6 april 2026',
    category: 'Köksutrustning',
    image: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/front-graphics.png',
    readTime: '7 min',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `https://restaurantpack.se${locale === 'en' ? '' : `/${locale}`}/blog`,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('blogPage');
  const localePath = locale === 'en' ? '' : `/${locale}`;
  const localeUrl = `https://restaurantpack.se${localePath}`;

  return (
    <Section>
      <SchemaScript id="blog-schema" schema={anmolWholesaleOrganizationSchema(localeUrl)} />

      <Container>
        <Prose className="mb-12">
          <h1>{t('title')}</h1>
          <p className="text-muted-foreground">{t('metaDescription')}</p>
        </Prose>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATIC_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 bg-accent/10 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>

                <h2 className="text-base font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  Läs artikel
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
