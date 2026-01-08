import { CartDrawer } from '@/components/cart/cart-drawer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
