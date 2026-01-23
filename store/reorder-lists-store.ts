import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReorderListItem {
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string;
  defaultQuantity: number;
  price: number;
  addedAt: string;
}

export interface ReorderList {
  id: string;
  name: string;
  description?: string;
  items: ReorderListItem[];
  createdAt: string;
  updatedAt: string;
}

interface ReorderListsState {
  lists: ReorderList[];

  // List management
  createList: (name: string, description?: string) => ReorderList;
  updateList: (id: string, updates: Partial<Pick<ReorderList, 'name' | 'description'>>) => void;
  deleteList: (id: string) => void;
  getList: (id: string) => ReorderList | undefined;

  // Item management
  addItemToList: (listId: string, item: Omit<ReorderListItem, 'addedAt'>) => void;
  removeItemFromList: (listId: string, productId: number) => void;
  updateItemQuantity: (listId: string, productId: number, quantity: number) => void;
  isProductInList: (listId: string, productId: number) => boolean;
  isProductInAnyList: (productId: number) => string[]; // Returns list IDs

  // Utility
  clearAllLists: () => void;
}

export const useReorderListsStore = create<ReorderListsState>()(
  persist(
    (set, get) => ({
      lists: [],

      createList: (name, description) => {
        const newList: ReorderList = {
          id: crypto.randomUUID(),
          name,
          description,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          lists: [...state.lists, newList],
        }));

        return newList;
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, ...updates, updatedAt: new Date().toISOString() }
              : list
          ),
        }));
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        }));
      },

      getList: (id) => {
        return get().lists.find((list) => list.id === id);
      },

      addItemToList: (listId, item) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;

            // Check if product already exists
            const existingItem = list.items.find((i) => i.productId === item.productId);
            if (existingItem) {
              // Update quantity instead of adding duplicate
              return {
                ...list,
                items: list.items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, defaultQuantity: i.defaultQuantity + item.defaultQuantity }
                    : i
                ),
                updatedAt: new Date().toISOString(),
              };
            }

            return {
              ...list,
              items: [...list.items, { ...item, addedAt: new Date().toISOString() }],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeItemFromList: (listId, productId) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.productId !== productId),
                  updatedAt: new Date().toISOString(),
                }
              : list
          ),
        }));
      },

      updateItemQuantity: (listId, productId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.productId === productId
                      ? { ...item, defaultQuantity: quantity }
                      : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : list
          ),
        }));
      },

      isProductInList: (listId, productId) => {
        const list = get().lists.find((l) => l.id === listId);
        return list?.items.some((item) => item.productId === productId) ?? false;
      },

      isProductInAnyList: (productId) => {
        return get()
          .lists.filter((list) => list.items.some((item) => item.productId === productId))
          .map((list) => list.id);
      },

      clearAllLists: () => {
        set({ lists: [] });
      },
    }),
    {
      name: 'reorder-lists-storage',
    }
  )
);
