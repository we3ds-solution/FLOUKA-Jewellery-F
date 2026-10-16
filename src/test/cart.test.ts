import { beforeEach, describe, expect, it } from "vitest";
import { checkoutFor } from "@/stores/cart/checkout-url";
import { revalidateLines } from "@/stores/cart/cart-sync";
import { useCart, type CartItem } from "@/stores/cart";
import type { WooProduct } from "@/lib/catalog/woo-types";
import type { ShopifyProduct } from "@/lib/shopify";

const product = (id: string, price = "100"): ShopifyProduct => ({
  id,
  title: `P ${id}`,
  description: "",
  handle: `h-${id}`,
  productType: "T",
  tags: [],
  priceRange: { minVariantPrice: { amount: price, currencyCode: "EGP" } },
  compareAtPrice: null,
  images: { edges: [] },
  variants: { edges: [] },
  options: [],
});

const line = (variantId: string, productId: string, qty = 1): CartItem => ({
  lineId: variantId,
  product: product(productId),
  variantId,
  variantTitle: "Default Title",
  price: { amount: "100", currencyCode: "EGP" },
  quantity: qty,
  selectedOptions: [],
});

const woo = (over: Partial<WooProduct> & { id: number }): WooProduct => ({
  name: `P ${over.id}`,
  slug: `p-${over.id}`,
  description: "",
  short_description: "",
  on_sale: false,
  prices: { price: "100", regular_price: "100", currency_code: "EGP" },
  images: [],
  categories: [{ name: "سلاسل", slug: "necklaces" }],
  tags: [],
  attributes: [],
  variations: [],
  is_in_stock: true,
  ...over,
});

beforeEach(() => {
  localStorage.clear();
  useCart.setState({ items: [], cartId: null, checkoutUrl: null, busy: false, drawerOpen: false });
});

describe("cart math", () => {
  it("merges quantities for the same variant and opens the drawer", async () => {
    const p = product("7");
    await useCart.getState().addItem({
      product: p,
      variantId: "7",
      variantTitle: "Default Title",
      price: p.priceRange.minVariantPrice,
      quantity: 1,
      selectedOptions: [],
    });
    await useCart.getState().addItem({
      product: p,
      variantId: "7",
      variantTitle: "Default Title",
      price: p.priceRange.minVariantPrice,
      quantity: 2,
      selectedOptions: [],
    });
    const s = useCart.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0]?.quantity).toBe(3);
    expect(s.drawerOpen).toBe(true);
    expect(s.checkoutUrl).toContain("quantity=3");
  });

  it("updates, removes, and clears lines", async () => {
    const s0 = useCart.getState();
    await s0.addItem({ ...line("7", "7"), quantity: 2 });
    await useCart.getState().updateQuantity("7", 1);
    expect(useCart.getState().items[0]?.quantity).toBe(1);
    await useCart.getState().removeItem("7");
    expect(useCart.getState().items).toHaveLength(0);
    await useCart.getState().addItem({ ...line("8", "8"), quantity: 1 });
    useCart.getState().clearCart();
    expect(useCart.getState().items).toHaveLength(0);
    expect(useCart.getState().checkoutUrl).toBeNull();
  });
});

describe("checkoutFor", () => {
  it("returns null for an empty cart", () => {
    expect(checkoutFor([])).toBeNull();
  });
  it("points at the first line on floukaa.com", () => {
    expect(checkoutFor([line("abc", "7", 2)])).toBe(
      "https://floukaa.com/checkout/?add-to-cart=abc&quantity=2",
    );
  });
});

describe("revalidateLines", () => {
  it("refreshes stale prices", () => {
    const catalog = [woo({ id: 7 })];
    const r = revalidateLines([line("7", "7")], [{ ...catalog[0]!, prices: { price: "150", regular_price: "200", currency_code: "EGP" } }]);
    expect(r.removed).toBe(0);
    expect(r.updated).toBe(1);
    expect(r.items[0]?.price.amount).toBe("150");
  });

  it("drops vanished products and variants", () => {
    const gone = revalidateLines([line("7", "7")], []);
    expect(gone.removed).toBe(1);
    expect(gone.items).toHaveLength(0);
    const catalog = [woo({ id: 7, variations: [{ id: 11, attributes: [] }] })];
    const wrongVariant = revalidateLines([line("999", "7")], catalog);
    expect(wrongVariant.removed).toBe(1);
  });
});
