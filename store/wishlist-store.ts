import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariation } from '@/types/woocommerce';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type WishlistPriority = 'low' | 'medium' | 'high';
export type WishlistVisibility = 'private' | 'shared';

export interface WishlistItem {
  id: string; // Unique ID for the wishlist item
  productId: number;
  variationId?: number;
  product: Product;
  variation?: ProductVariation;
  addedAt: number; // Timestamp
  notes?: string;
  priority: WishlistPriority;
  originalPrice: number; // For price drop tracking
  currentPrice: number;
  listId: string; // Which list this item belongs to
}

export interface WishlistList {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  visibility: WishlistVisibility;
  shareToken?: string; // For sharing wishlists
  isDefault: boolean;
}

export interface WishlistNotification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

export interface PriceDropAlert {
  productId: number;
  variationId?: number;
  originalPrice: number;
  newPrice: number;
  percentageChange: number;
  detectedAt: number;
  notified: boolean;
}

// ============================================================================
// STORE STATE & ACTIONS
// ============================================================================

interface WishlistState {
  // State
  items: WishlistItem[];
  lists: WishlistList[];
  isOpen: boolean;
  currentListId: string; // Active list being viewed
  notification: WishlistNotification | null;
  priceDropAlerts: PriceDropAlert[];
  isCheckingPrices: boolean;

  // Core Actions
  addItem: (
    product: Product,
    variation?: ProductVariation,
    listId?: string,
    options?: {
      notes?: string;
      priority?: WishlistPriority;
    }
  ) => void;
  removeItem: (itemId: string) => void;
  updateItem: (
    itemId: string,
    updates: Partial<Pick<WishlistItem, 'notes' | 'priority' | 'listId'>>
  ) => void;
  clearList: (listId?: string) => void;
  isInWishlist: (productId: number, variationId?: number, listId?: string) => boolean;
  getItemId: (productId: number, variationId?: number, listId?: string) => string | null;
  toggleItem: (product: Product, variation?: ProductVariation, listId?: string) => void;
  moveToCart: (itemId: string, addToCartFn: (product: Product, variation?: ProductVariation) => void) => void;

  // List Management Actions
  createList: (name: string, description?: string) => string;
  updateList: (listId: string, updates: Partial<Pick<WishlistList, 'name' | 'description' | 'visibility' | 'shareToken'>>) => void;
  deleteList: (listId: string) => void;
  setCurrentList: (listId: string) => void;
  getListById: (listId: string) => WishlistList | undefined;
  getItemsByList: (listId?: string) => WishlistItem[];
  getDefaultList: () => WishlistList;

  // UI Actions
  toggleWishlist: () => void;
  openWishlist: (listId?: string) => void;
  closeWishlist: () => void;
  clearNotification: () => void;
  setNotification: (notification: WishlistNotification) => void;

  // Price Tracking Actions
  checkPriceDrops: () => Promise<void>;
  updatePrices: (productId: number, variationId: number | undefined, newPrice: number) => void;
  dismissPriceAlert: (productId: number, variationId?: number) => void;
  getPriceDropAlerts: () => PriceDropAlert[];

  // Share Actions
  generateShareToken: (listId: string) => string;
  getShareUrl: (listId: string) => string;
  importSharedList: (shareToken: string, items: WishlistItem[]) => void;

  // Computed Getters
  getTotalItems: (listId?: string) => number;
  getItemsByPriority: (priority: WishlistPriority, listId?: string) => WishlistItem[];
  hasItem: (productId: number, variationId?: number) => boolean;
  getListsCount: () => number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateItemId(productId: number, variationId?: number, listId?: string): string {
  const base = variationId ? `${productId}-${variationId}` : `${productId}`;
  return listId ? `${base}-${listId}` : base;
}

function generateListId(): string {
  return `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateShareToken(): string {
  return `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function calculatePriceChange(oldPrice: number, newPrice: number): number {
  return ((oldPrice - newPrice) / oldPrice) * 100;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => {
      // Initialize with a default list
      const defaultListId = 'default-wishlist';
      const defaultList: WishlistList = {
        id: defaultListId,
        name: 'My Wishlist',
        description: 'Your wholesale product list',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        visibility: 'private',
        isDefault: true,
      };

      return {
        // Initial State
        items: [],
        lists: [defaultList],
        isOpen: false,
        currentListId: defaultListId,
        notification: null,
        priceDropAlerts: [],
        isCheckingPrices: false,

        // Core Actions
        addItem: (product, variation, listId, options = {}) => {
          const targetListId = listId || get().currentListId;
          const itemId = generateItemId(product.id, variation?.id, targetListId);
          const state = get();

          // Check if item already exists in this list
          if (state.items.find((item) => item.id === itemId)) {
            set({
              notification: {
                message: `${product.name} is already in your wishlist`,
                type: 'info',
                timestamp: Date.now(),
              },
            });
            return;
          }

          const price = variation
            ? parseFloat(variation.price)
            : parseFloat(product.price);

          const newItem: WishlistItem = {
            id: itemId,
            productId: product.id,
            variationId: variation?.id,
            product,
            variation,
            addedAt: Date.now(),
            notes: options.notes,
            priority: options.priority || 'medium',
            originalPrice: price,
            currentPrice: price,
            listId: targetListId,
          };

          set((state) => ({
            items: [...state.items, newItem],
            notification: {
              message: `${product.name} added to wishlist`,
              type: 'success',
              timestamp: Date.now(),
            },
          }));

          // Update list's updatedAt timestamp
          get().updateList(targetListId, {});
        },

        removeItem: (itemId) => {
          const item = get().items.find((i) => i.id === itemId);
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
            notification: item
              ? {
                message: `${item.product.name} removed from wishlist`,
                type: 'info',
                timestamp: Date.now(),
              }
              : null,
          }));
        },

        updateItem: (itemId, updates) => {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }));
        },

        clearList: (listId) => {
          const targetListId = listId || get().currentListId;
          set((state) => ({
            items: state.items.filter((item) => item.listId !== targetListId),
            notification: {
              message: 'Wishlist cleared',
              type: 'info',
              timestamp: Date.now(),
            },
          }));
        },

        isInWishlist: (productId, variationId, listId) => {
          const targetListId = listId || get().currentListId;
          const itemId = generateItemId(productId, variationId, targetListId);
          return get().items.some((item) => item.id === itemId);
        },

        getItemId: (productId, variationId, listId) => {
          const targetListId = listId || get().currentListId;
          const itemId = generateItemId(productId, variationId, targetListId);
          const item = get().items.find((item) => item.id === itemId);
          return item ? item.id : null;
        },

        toggleItem: (product, variation, listId) => {
          const targetListId = listId || get().currentListId;
          const itemId = generateItemId(product.id, variation?.id, targetListId);
          const exists = get().items.find((item) => item.id === itemId);

          if (exists) {
            get().removeItem(itemId);
          } else {
            get().addItem(product, variation, targetListId);
          }
        },

        moveToCart: (itemId, addToCartFn) => {
          const item = get().items.find((i) => i.id === itemId);
          if (item) {
            addToCartFn(item.product, item.variation);
            get().removeItem(itemId);
            set({
              notification: {
                message: `${item.product.name} moved to cart`,
                type: 'success',
                timestamp: Date.now(),
              },
            });
          }
        },

        // List Management Actions
        createList: (name, description) => {
          const newListId = generateListId();
          const newList: WishlistList = {
            id: newListId,
            name,
            description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            visibility: 'private',
            isDefault: false,
          };

          set((state) => ({
            lists: [...state.lists, newList],
            currentListId: newListId,
            notification: {
              message: `List "${name}" created`,
              type: 'success',
              timestamp: Date.now(),
            },
          }));

          return newListId;
        },

        updateList: (listId, updates) => {
          set((state) => ({
            lists: state.lists.map((list) =>
              list.id === listId
                ? { ...list, ...updates, updatedAt: Date.now() }
                : list
            ),
          }));
        },

        deleteList: (listId) => {
          const list = get().lists.find((l) => l.id === listId);

          // Prevent deleting the default list
          if (list?.isDefault) {
            set({
              notification: {
                message: 'Cannot delete the default wishlist',
                type: 'error',
                timestamp: Date.now(),
              },
            });
            return;
          }

          // Remove all items in this list
          set((state) => ({
            items: state.items.filter((item) => item.listId !== listId),
            lists: state.lists.filter((list) => list.id !== listId),
            currentListId: state.currentListId === listId ? defaultListId : state.currentListId,
            notification: {
              message: `List "${list?.name}" deleted`,
              type: 'info',
              timestamp: Date.now(),
            },
          }));
        },

        setCurrentList: (listId) => {
          set({ currentListId: listId });
        },

        getListById: (listId) => {
          return get().lists.find((list) => list.id === listId);
        },

        getItemsByList: (listId) => {
          const targetListId = listId || get().currentListId;
          return get().items.filter((item) => item.listId === targetListId);
        },

        getDefaultList: () => {
          return get().lists.find((list) => list.isDefault) || get().lists[0];
        },

        // UI Actions
        toggleWishlist: () => {
          set((state) => ({ isOpen: !state.isOpen }));
        },

        openWishlist: (listId) => {
          set({
            isOpen: true,
            currentListId: listId || get().currentListId,
          });
        },

        closeWishlist: () => {
          set({ isOpen: false });
        },

        clearNotification: () => {
          set({ notification: null });
        },

        setNotification: (notification) => {
          set({ notification });
        },

        // Price Tracking Actions
        checkPriceDrops: async () => {
          set({ isCheckingPrices: true });

          try {
            const items = get().items;
            const alerts: PriceDropAlert[] = [];

            // In a real implementation, you'd fetch current prices from API
            // For now, we'll just update based on product.price
            items.forEach((item) => {
              const currentPrice =
                item.variation?.price || item.product.price;
              const newPrice = parseFloat(currentPrice);

              if (newPrice < item.originalPrice) {
                const percentageChange = calculatePriceChange(
                  item.originalPrice,
                  newPrice
                );

                // Only alert if price dropped more than 5%
                if (percentageChange >= 5) {
                  alerts.push({
                    productId: item.productId,
                    variationId: item.variationId,
                    originalPrice: item.originalPrice,
                    newPrice,
                    percentageChange,
                    detectedAt: Date.now(),
                    notified: false,
                  });

                  // Update current price
                  get().updateItem(item.id, {});
                  set((state) => ({
                    items: state.items.map((i) =>
                      i.id === item.id ? { ...i, currentPrice: newPrice } : i
                    ),
                  }));
                }
              }
            });

            if (alerts.length > 0) {
              set((state) => ({
                priceDropAlerts: [...state.priceDropAlerts, ...alerts],
                notification: {
                  message: `${alerts.length} price drop${alerts.length > 1 ? 's' : ''} detected!`,
                  type: 'success',
                  timestamp: Date.now(),
                },
              }));
            }
          } catch (error) {
            console.error('Failed to check price drops:', error);
          } finally {
            set({ isCheckingPrices: false });
          }
        },

        updatePrices: (productId, variationId, newPrice) => {
          set((state) => ({
            items: state.items.map((item) => {
              if (
                item.productId === productId &&
                item.variationId === variationId
              ) {
                const priceChange = calculatePriceChange(
                  item.originalPrice,
                  newPrice
                );

                // Create alert if price dropped significantly
                if (priceChange >= 5) {
                  const alert: PriceDropAlert = {
                    productId,
                    variationId,
                    originalPrice: item.originalPrice,
                    newPrice,
                    percentageChange: priceChange,
                    detectedAt: Date.now(),
                    notified: false,
                  };

                  set((state) => ({
                    priceDropAlerts: [...state.priceDropAlerts, alert],
                  }));
                }

                return { ...item, currentPrice: newPrice };
              }
              return item;
            }),
          }));
        },

        dismissPriceAlert: (productId, variationId) => {
          set((state) => ({
            priceDropAlerts: state.priceDropAlerts.filter(
              (alert) =>
                !(
                  alert.productId === productId &&
                  alert.variationId === variationId
                )
            ),
          }));
        },

        getPriceDropAlerts: () => {
          return get().priceDropAlerts.filter((alert) => !alert.notified);
        },

        // Share Actions
        generateShareToken: (listId) => {
          const token = generateShareToken();
          get().updateList(listId, { shareToken: token });
          return token;
        },

        getShareUrl: (listId) => {
          const list = get().getListById(listId);
          if (!list?.shareToken) {
            const token = get().generateShareToken(listId);
            return `${typeof window !== 'undefined' ? window.location.origin : ''}/wishlist/shared/${token}`;
          }
          return `${typeof window !== 'undefined' ? window.location.origin : ''}/wishlist/shared/${list.shareToken}`;
        },

        importSharedList: (shareToken, items) => {
          const newListId = get().createList('Shared Wishlist', 'Imported from shared link');

          items.forEach((item) => {
            get().addItem(item.product, item.variation, newListId, {
              notes: item.notes,
              priority: item.priority,
            });
          });

          set({
            notification: {
              message: 'Wishlist imported successfully',
              type: 'success',
              timestamp: Date.now(),
            },
          });
        },

        // Computed Getters
        getTotalItems: (listId) => {
          if (listId) {
            return get().items.filter((item) => item.listId === listId).length;
          }
          return get().items.length;
        },

        getItemsByPriority: (priority, listId) => {
          const items = listId
            ? get().items.filter((item) => item.listId === listId)
            : get().items;
          return items.filter((item) => item.priority === priority);
        },

        hasItem: (productId, variationId) => {
          return get().items.some(
            (item) =>
              item.productId === productId &&
              (variationId === undefined || item.variationId === variationId)
          );
        },

        getListsCount: () => {
          return get().lists.length;
        },
      };
    },
    {
      name: 'wishlist-storage',
      // Optionally, we can add partialize to only persist certain fields
      // partialize: (state) => ({
      //   items: state.items,
      //   lists: state.lists,
      //   currentListId: state.currentListId,
      // }),
    }
  )
);
