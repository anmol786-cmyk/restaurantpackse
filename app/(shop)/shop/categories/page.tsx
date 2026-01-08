import Link from 'next/link';
import Image from 'next/image';
import { getProductCategories } from '@/lib/woocommerce';
import { Container, Section } from '@/components/craft';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Categories',
  description: 'Browse all product categories at Anmol Sweets & Restaurant',
};

export default async function CategoriesPage() {
  const categories = await getProductCategories({
    per_page: 100,
    hide_empty: false,
    orderby: 'name',
    order: 'asc',
  });

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Product Categories</h1>
          <p className="text-muted-foreground">
            Browse our {categories.length} categories
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
            >
              <article>
                {/* Category Image */}
                {category.image?.src ? (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-muted">
                    <span className="text-sm text-muted-foreground">No image</span>
                  </div>
                )}

                {/* Category Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h2 className="font-semibold group-hover:text-primary">
                      {category.name}
                    </h2>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>

                  {category.description && (
                    <div
                      className="mt-2 line-clamp-2 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: category.description.replace(/<[^>]*>/g, ''),
                      }}
                    />
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
