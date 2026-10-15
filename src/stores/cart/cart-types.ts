// SRP: cart domain shapes only.
import type { Money, ShopifyProduct } from "@/lib/shopify";

export type CartItem = {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: Money;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
};
export type CartState = {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  busy: boolean;
  drawerOpen: boolean;
  setDrawerOpen(v: boolean): void;
  addItem(item: Omit<CartItem, "lineId">): Promise<void>;
  updateQuantity(variantId: string, q: number): Promise<void>;
  removeItem(variantId: string): Promise<void>;
  clearCart(): void;
  syncCart(): Promise<void>;
};
