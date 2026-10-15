// SRP: external checkout link building. Pure — no store access.
import { STORE_URL } from "@/lib/shopify";
import type { CartItem } from "./cart-types";

// Checkout happens on floukaa.com: the link adds the first cart line there, then opens checkout.
export function checkoutFor(items: CartItem[]) {
  const first = items[0];
  if (!first) return null;
  return `${STORE_URL}/checkout/?add-to-cart=${first.variantId}&quantity=${first.quantity}`;
}
