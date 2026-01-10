import { Metadata } from 'next';
import { brandConfig } from '@/config/brand.config';

export const metadata: Metadata = {
  title: `Blog - ${brandConfig.businessName}`,
  description: `Stay tuned for the latest articles, recipes, and news from ${brandConfig.businessName}.`,
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Our Blog
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          We are currently crafting amazing content for you. Check back soon!
        </p>
      </div>
    </div>
  );
}
