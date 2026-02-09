import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function BlogPage() {
  const t = await getTranslations('blogPage');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('comingSoon')}
        </p>
      </div>
    </div>
  );
}
