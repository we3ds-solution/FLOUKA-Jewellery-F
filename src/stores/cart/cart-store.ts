// SRP: cart state + persistence only. Link building lives in
// checkout-url; shapes in cart-types.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartState } from "./cart-types";
import { checkoutFor } from "./checkout-url";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      busy: false,
      drawerOpen: false,
      setDrawerOpen: (v) => set({ drawerOpen: v }),
      clearCart: () => set({ items: [], checkoutUrl: null }),
      addItem: async (item) => {
        const items = get().items;
        const ex = items.find((i) => i.variantId === item.variantId);
        const next = ex
          ? items.map((i) => (i === ex ? { ...i, quantity: i.quantity + item.quantity } : i))
          : [...items, { ...item, lineId: item.variantId }];
        set({ items: next, checkoutUrl: checkoutFor(next), drawerOpen: true });
      },
      updateQuantity: async (id, q) => {
        if (q <= 0) return get().removeItem(id);
        const next = get().items.map((i) => (i.variantId === id ? { ...i, quantity: q } : i));
        set({ items: next, checkoutUrl: checkoutFor(next) });
      },
      removeItem: async (id) => {
        const next = get().items.filter((i) => i.variantId !== id);
        set({ items: next, checkoutUrl: checkoutFor(next) });
      },
      /** @deprecated Local-only cart; kept as a no-op so existing callers don't break. */
      syncCart: async () => {},
    }),
    {
      name: "floukaa-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, checkoutUrl: s.checkoutUrl }),
    },
  ),
);
