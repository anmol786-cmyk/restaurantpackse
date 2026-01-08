import { HeaderSelector } from '@/components/layout/header-selector';
import { getProductCategories } from '@/lib/woocommerce';

export async function HeaderProvider() {
  const categories = await getProductCategories();

  return <HeaderSelector categories={categories} />;
}
