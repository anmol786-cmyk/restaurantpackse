import { Metadata } from 'next';
import { WishlistPage } from '@/components/wishlist/wishlist-page';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'View and manage your wishlist of favorite products',
};

export default function WishlistPageRoute() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <div className="w-full px-5 py-8 md:py-12 max-w-full">
        <WishlistPage />
      </div>
    </div>
  );
}
