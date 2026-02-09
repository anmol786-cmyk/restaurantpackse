import { CartDrawer } from '@/components/cart/cart-drawer';

export default function DynamicLayout({
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
