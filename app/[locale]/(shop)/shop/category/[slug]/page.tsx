import { notFound } from 'next/navigation';
import { localeAlternates } from '@/lib/seo/alternates';
import { getProductsByCategory, getProductCategoryBySlug } from '@/lib/woocommerce';
import { ArchiveTemplate } from '@/components/templates';
import type { Metadata } from 'next';
import { ORDERING_BLOCK, WHOLESALE_WORD, categoryCopy, categoryName, toContentLocale } from '@/lib/content/category-content';

const SHOP_LABEL = { en: 'Shop', sv: 'Butik', no: 'Butikk', da: 'Butik' } as const;
const CATEGORIES_LABEL = { en: 'Categories', sv: 'Kategorier', no: 'Kategorier', da: 'Kategorier' } as const;

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const category = await getProductCategoryBySlug(resolvedParams.slug);

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    // Localized name + "<name> <wholesale> Stockholm"; the root title template appends the brand
    const locale = toContentLocale(resolvedParams.locale);
    const name = categoryName(resolvedParams.slug, locale, category.name.replace(/&amp;/g, '&'));
    const seoTitle = `${name} ${WHOLESALE_WORD[locale]} Stockholm`;
    const copy = categoryCopy(resolvedParams.slug, locale);
    const plainDescription = category.description?.replace(/<[^>]*>/g, '').substring(0, 100) || '';
    const seoDescription = copy?.intro
      ?? `Browse our professional-grade ${name} at wholesale prices. Anmol Wholesale: Stockholm-based B2B restaurant supplier with own Scandinavian delivery. ${plainDescription}`;

    return {
      title: seoTitle,
      description: seoDescription.substring(0, 160),
      openGraph: {
        title: seoTitle,
        description: seoDescription.substring(0, 160),
        type: 'website',
        url: `https://restaurantpack.se/shop/category/${resolvedParams.slug}`,
        siteName: 'Anmol Wholesale',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription.substring(0, 160),
      },
      alternates: localeAlternates(resolvedParams.locale, `/shop/category/${resolvedParams.slug}`),
    };
  } catch {
    return {
      title: 'Category Not Found',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 20;

  // API errors propagate (5xx) instead of becoming a 404 - only a confirmed missing category is notFound
  const category = await getProductCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const { data: products, total, totalPages } = await getProductsByCategory(resolvedParams.slug, {
    page,
    per_page: perPage,
    orderby: (resolvedSearchParams.orderby as 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating') || 'popularity',
    order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
    status: 'publish',
  });

  const locale = toContentLocale(resolvedParams.locale);
  const name = categoryName(resolvedParams.slug, locale, category.name.replace(/&amp;/g, '&'));
  const copy = categoryCopy(resolvedParams.slug, locale);
  const ordering = ORDERING_BLOCK[locale];
  // English keeps the WooCommerce description when one exists; other locales use the translated intro
  const headerDescription = locale === 'en' && category.description
    ? <div dangerouslySetInnerHTML={{ __html: category.description }} />
    : copy?.intro;

  return (
    <>
      <ArchiveTemplate
        title={name}
        description={headerDescription}
        breadcrumbs={[
          { label: SHOP_LABEL[locale], href: '/shop' },
          { label: CATEGORIES_LABEL[locale], href: '/shop/categories' },
          { label: name },
        ]}
        products={products}
        totalProducts={total}
        currentPage={page}
        totalPages={totalPages}
        basePath={`/shop/category/${resolvedParams.slug}`}
        gridColumns={5}
      />

      {/* Category guide: unique copy per category + shared ordering info (fixes thin category pages) */}
      {copy && page === 1 && (
        <section className="site-container pb-12 md:pb-16">
          <div className="max-w-3xl border-t border-border pt-8 md:pt-10 space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground">{name}</h2>
            {(locale !== 'en' || category.description) && <p>{copy.intro}</p>}
            {copy.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <h3 className="font-heading text-lg font-semibold text-foreground pt-2">{ordering.pointsHeading}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {copy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <h3 className="font-heading text-lg font-semibold text-foreground pt-2">{ordering.heading}</h3>
            <p>{ordering.text}</p>
          </div>
        </section>
      )}
    </>
  );
}
