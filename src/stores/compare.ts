import { create } from 'zustand';
import type { ShopifyProduct } from '@/lib/shopify';

type CompareState = { items: ShopifyProduct[]; open: boolean; setOpen(open: boolean): void; add(product: ShopifyProduct): void; toggle(product: ShopifyProduct): void; clear(): void };
export const useCompare = create<CompareState>((set) => ({
  items: [],
  open: false,
  setOpen: (open) => set({ open }),
  add: (product) => set((state) => ({ items: state.items.some(p => p.id === product.id) ? state.items : [...state.items, product], open: true })),
  toggle: (product) => set((state) => ({ items: state.items.some((p) => p.id === product.id) ? state.items.filter((p) => p.id !== product.id) : [...state.items, product] })),
  clear: () => set({ items: [] }),
}));