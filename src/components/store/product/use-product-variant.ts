import { useEffect, useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify";

type Variant = ShopifyProduct["variants"]["edges"][number]["node"];

// SRP: variant/option/quantity selection state only. No rendering, no store,
// no fetching — the route composes this with presentational components.
export function useProductVariant(product: ShopifyProduct, handle: string) {
  const [sel, setSel] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  useEffect(() => {
    setSel({});
    setQty(1);
  }, [handle]);

  const variants = product.variants.edges.map((e) => e.node);
  const chosen: Record<string, string> = Object.fromEntries(
    product.options.map((o) => [o.name, sel[o.name] ?? o.values[0] ?? ""]),
  );
  const variant: Variant | undefined =
    variants.find((x) => x.selectedOptions.every((o) => chosen[o.name] === o.value)) ?? variants[0];
  const pick = (option: string, value: string) => setSel((x) => ({ ...x, [option]: value }));

  return { chosen, variant, qty, setQty, pick };
}
