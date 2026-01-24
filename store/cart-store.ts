import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariation } from '@/types/woocommerce';
import {
  calculateShipping,
  type ShippingMethod,
  type RestrictedProduct,
} from '@/lib/shipping-service';
import { CommerceRules, GLOBAL_MOQ } from '@/config/commerce-rules';

export interface CartItem {
  key: string;
  productId: number;
  variationId?: number;
  quantity: number;
  price: number;
  product: Product;
  variation?: ProductVariation;
}

export interface ShippingAddress {
  postcode: string;
  city: string;
  country: string;
}

export interface CartNotification {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Notification state
  notification: CartNotification | null;

  // Shipping state
  shippingAddress: ShippingAddress | null;
  availableShippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod | null;
  restrictedProducts: RestrictedProduct[];
  isCalculatingShipping: boolean;
  minimumOrder: number;
  minimumOrderMet: boolean;

  // Actions
  addItem: (product: Product, quantity?: number, variation?: ProductVariation) => void;
  addItemFromLineItem: (lineItem: { product_id: number; name: string; price: string; quantity: number; image?: { src: string } }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearNotification: () => void;

  // Shipping actions
  setShippingAddress: (address: ShippingAddress) => void;
  calculateShipping: () => Promise<void>;
  selectShippingMethod: (method: ShippingMethod) => void;
  clearShipping: () => void;

  // Computed values
  getTotalPrice: (isWholesale?: boolean) => number;
  getTotalItems: () => number;
  getSubtotal: (isWholesale?: boolean) => number;
  getShippingCost: () => number;
  getTotal: (isWholesale?: boolean) => number;
}

// Generate unique key for cart item
function generateCartKey(productId: number, variationId?: number): string {
  return variationId ? `${productId}-${variationId}` : `${productId}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Notification state
      notification: null,

      // Shipping state initialization
      shippingAddress: null,
      availableShippingMethods: [],
      selectedShippingMethod: null,
      restrictedProducts: [],
      isCalculatingShipping: false,
      minimumOrder: 300,
      minimumOrderMet: false,

      addItem: (product, quantity = 1, variation) => {
        const key = generateCartKey(product.id, variation?.id);
        const state = get();
        const existingItem = state.items.find((item) => item.key === key);

        // Get current quantity in cart
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        // Check quantity limit
        const validation = CommerceRules.canAddQuantity(product.id, currentQuantity, quantity);

        if (!validation.allowed) {
          // Set notification
          set({
            notification: {
              message: validation.message || 'Cannot add more of this item',
              type: 'warning',
              timestamp: Date.now(),
            },
          });

          // Cap at maximum allowed
          const maxAllowed = validation.maxQuantity;
          if (maxAllowed !== null && currentQuantity < maxAllowed) {
            quantity = maxAllowed - currentQuantity;
          } else {
            // Already at max, don't add
            return;
          }
        }

        // Check MOQ - use global MOQ (5) or product-specific
        const moqRequirement = CommerceRules.getMOQ(product.id, product.categories?.map(c => c.name));
        let finalQuantity = quantity;

        if (currentQuantity === 0 && quantity < moqRequirement) {
          finalQuantity = moqRequirement;
          set({
            notification: {
              message: `Minimum order quantity is ${moqRequirement} units. Quantity adjusted automatically.`,
              type: 'info',
              timestamp: Date.now(),
            },
          });
        }

        // Check if product has quantity discount - show info
        if (currentQuantity === 0 && CommerceRules.hasQuantityDiscount(product.id)) {
          const discountInfo = CommerceRules.calculateQuantityDiscount(product.id, finalQuantity);
          if (discountInfo?.nextTierSuggestion) {
            set({
              notification: {
                message: `Tip: ${discountInfo.nextTierSuggestion}`,
                type: 'info',
                timestamp: Date.now(),
              },
            });
          }
        }

        set((state) => {
          const price = variation
            ? parseFloat(variation.price)
            : parseFloat(product.price);

          if (existingItem) {
            // Update quantity of existing item
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + finalQuantity }
                  : item
              ),
            };
          }

          // Add new item
          const newItem: CartItem = {
            key,
            productId: product.id,
            variationId: variation?.id,
            quantity: finalQuantity,
            price,
            product,
            variation,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      // Add item from order line item (for repeat orders)
      addItemFromLineItem: (lineItem) => {
        const key = generateCartKey(lineItem.product_id);
        const state = get();
        const existingItem = state.items.find((item) => item.key === key);

        const price = parseFloat(lineItem.price) || 0;
        const quantity = lineItem.quantity || 1;

        // Create a minimal product object
        const minimalProduct = {
          id: lineItem.product_id,
          name: lineItem.name,
          price: lineItem.price,
          regular_price: lineItem.price,
          sale_price: '',
          images: lineItem.image ? [{ id: 0, src: lineItem.image.src, name: '', alt: '' }] : [],
          slug: lineItem.name.toLowerCase().replace(/\s+/g, '-'),
          permalink: '',
          date_created: '',
          date_created_gmt: '',
          date_modified: '',
          date_modified_gmt: '',
          date_on_sale_from: null,
          date_on_sale_from_gmt: null,
          date_on_sale_to: null,
          date_on_sale_to_gmt: null,
          price_html: '',
          type: 'simple',
          status: 'publish',
          featured: false,
          catalog_visibility: 'visible',
          description: '',
          short_description: '',
          sku: '',
          on_sale: false,
          purchasable: true,
          total_sales: 0,
          virtual: false,
          downloadable: false,
          downloads: [],
          download_limit: -1,
          download_expiry: -1,
          external_url: '',
          button_text: '',
          tax_status: 'taxable',
          tax_class: '',
          manage_stock: false,
          stock_quantity: null,
          stock_status: 'instock',
          backorders: 'no',
          backorders_allowed: false,
          backordered: false,
          sold_individually: false,
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          shipping_required: true,
          shipping_taxable: true,
          shipping_class: '',
          shipping_class_id: 0,
          reviews_allowed: true,
          average_rating: '0',
          rating_count: 0,
          related_ids: [],
          upsell_ids: [],
          cross_sell_ids: [],
          parent_id: 0,
          purchase_note: '',
          categories: [],
          tags: [],
          attributes: [],
          default_attributes: [],
          variations: [],
          grouped_products: [],
          menu_order: 0,
          meta_data: [],
        } as unknown as Product;

        set((state) => {
          if (existingItem) {
            // Update quantity of existing item
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Add new item
          const newItem: CartItem = {
            key,
            productId: lineItem.product_id,
            quantity,
            price,
            product: minimalProduct,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
      },

      updateQuantity: (key, quantity) => {
        const state = get();
        const item = state.items.find((i) => i.key === key);

        if (!item) return;

        // Check MOQ - don't allow going below minimum
        const moqRequirement = CommerceRules.getMOQ(item.productId);

        if (quantity < moqRequirement) {
          // If trying to go below MOQ, remove the item instead
          if (quantity <= 0) {
            get().removeItem(key);
            return;
          }
          // Otherwise enforce MOQ
          quantity = moqRequirement;
          set({
            notification: {
              message: `Minimum order quantity is ${moqRequirement} units.`,
              type: 'info',
              timestamp: Date.now(),
            },
          });
        }

        // Check quantity limit (max)
        const maxQuantity = CommerceRules.getQuantityLimit(item.productId);

        if (maxQuantity !== null && quantity > maxQuantity) {
          set({
            notification: {
              message: `Maximum ${maxQuantity} units allowed for this product.`,
              type: 'warning',
              timestamp: Date.now(),
            },
          });
          quantity = maxQuantity;
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            cartItem.key === key ? { ...cartItem, quantity } : cartItem
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      clearNotification: () => {
        set({ notification: null });
      },

      getTotalPrice: (isWholesale = false) => {
        const { items } = get();
        return items.reduce((total, item) => {
          // First check for quantity discount (product-specific)
          const quantityDiscount = CommerceRules.calculateQuantityDiscount(
            item.productId,
            item.quantity,
            item.price
          );

          if (quantityDiscount) {
            return total + quantityDiscount.totalPrice;
          }

          // Fall back to wholesale tiered pricing
          const { unitPrice } = CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale);
          return total + unitPrice * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: (isWholesale = false) => {
        const { items } = get();
        return items.reduce((total, item) => {
          // First check for quantity discount (product-specific)
          const quantityDiscount = CommerceRules.calculateQuantityDiscount(
            item.productId,
            item.quantity,
            item.price
          );

          if (quantityDiscount) {
            return total + quantityDiscount.totalPrice;
          }

          // Fall back to wholesale tiered pricing
          const { unitPrice } = CommerceRules.getTieredPrice(item.price, item.quantity, isWholesale);
          return total + unitPrice * item.quantity;
        }, 0);
      },

      // Shipping actions
      setShippingAddress: (address) => {
        set({ shippingAddress: address });
        // Auto-calculate shipping when address is set
        get().calculateShipping();
      },

      calculateShipping: async () => {
        const { items, shippingAddress } = get();

        if (process.env.NODE_ENV === 'development') {
          console.log('🚚 calculateShipping called', {
            itemsCount: items.length,
            shippingAddress,
          });
        }

        // Don't calculate if no items or no address
        if (items.length === 0 || !shippingAddress) {
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Skipping shipping calculation - no items or address');
          }
          return;
        }

        set({ isCalculatingShipping: true });

        try {
          // Convert cart items to shipping API format
          const shippingItems = items.map((item) => ({
            productId: item.productId,
            variationId: item.variationId,
            quantity: item.quantity,
          }));

          if (process.env.NODE_ENV === 'development') {
            console.log('📦 Calling shipping API with:', {
              items: shippingItems,
              postcode: shippingAddress.postcode,
              city: shippingAddress.city,
              country: shippingAddress.country,
            });
          }

          // Call shipping API (with DHL rates)
          const result = await calculateShipping(
            shippingItems,
            shippingAddress.postcode,
            shippingAddress.city,
            shippingAddress.country
          );

          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Shipping API response:', result);
          }

          if (result.success) {
            set({
              availableShippingMethods: result.available_methods || [],
              restrictedProducts: result.restricted_products || [],
              // No minimum order - set to 0
              minimumOrder: result.minimum_order || 0,
              minimumOrderMet: result.minimum_order_met ?? true,
              isCalculatingShipping: false,
            });

            // Auto-select shipping method intelligently
            const methods = result.available_methods || [];
            // Select the first available method by default
            const defaultMethod = methods[0];

            if (defaultMethod) {
              console.log('ℹ️ Auto-selecting first method:', defaultMethod.label);
              set({ selectedShippingMethod: defaultMethod });
            }
          } else {
            set({
              availableShippingMethods: [],
              restrictedProducts: result.restricted_products || [],
              isCalculatingShipping: false,
              minimumOrderMet: result.minimum_order_met || false,
            });
          }
        } catch (error) {
          console.error('Failed to calculate shipping:', error);
          set({
            isCalculatingShipping: false,
            availableShippingMethods: [],
            restrictedProducts: [],
          });
        }
      },

      selectShippingMethod: (method) => {
        set({ selectedShippingMethod: method });
      },

      clearShipping: () => {
        set({
          shippingAddress: null,
          availableShippingMethods: [],
          selectedShippingMethod: null,
          restrictedProducts: [],
        });
      },

      getShippingCost: () => {
        const { selectedShippingMethod } = get();
        return selectedShippingMethod?.total_cost || 0;
      },

      getTotal: (isWholesale = false) => {
        const subtotal = get().getSubtotal(isWholesale);
        const shipping = get().getShippingCost();
        return subtotal + shipping;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
