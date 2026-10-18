import { loadCatalog } from "@/lib/catalog/catalog-cache";
import { map } from "@/lib/catalog/woo-map";
import type { WooProduct } from "@/lib/catalog/woo-types";
import type { CartItem } from "./cart-types";

export type Revalidation = { items: CartItem[]; removed: number; updated: number };

// SRP: cart-vs-catalog reconciliation. Pure function over pinned data, so it
// is unit-testable without network. Drops lines whose product/variant no
// longer exists or is out of stock, and refreshes prices/titles of the rest.
export function revalidateLines(items: CartItem[], catalog: WooProduct[]): Revalidation {
  let removed = 0;
  let updated = 0;
  const next: CartItem[] = [];
  for (const item of items) {
    const raw = catalog.find((p) => String(p.id) === item.product.id);
    const node = raw
      ? map(raw).variants.edges.find((e) => e.node.id === item.variantId)?.node
      : undefined;
    if (!node || node.availableForSale === false) {
      removed++;
      continue;
    }
    if (
      node.price.amount !== item.price.amount ||
      node.price.currencyCode !== item.price.currencyCode ||
      node.title !== item.variantTitle
    ) {
      updated++;
    }
    next.push({
      ...item,
      price: node.price,
      variantTitle: node.title,
      selectedOptions: node.selectedOptions,
    });
  }
  return { items: next, removed, updated };
}

export async function syncCartFromCatalog(items: CartItem[]): Promise<Revalidation> {
  return revalidateLines(items, await loadCatalog());
}
