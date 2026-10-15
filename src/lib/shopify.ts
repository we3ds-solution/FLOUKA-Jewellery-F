// Facade over the catalog query layer: storefront-friendly getters.
// Product shaping lives in lib/catalog/*; money formatting in lib/format.
// Re-exports keep existing `@/lib/shopify` imports working.
import { fetchProduct, fetchProducts, fetchRelated, type FamilyMember } from "./floukaa.functions";
import { formatCurrency, type Money } from "./format";
export type { FamilyMember, Money };
export { formatCurrency };

export const STORE_URL = "https://floukaa.com";
export type ShopifyVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
};
export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: Money };
  compareAtPrice?: Money | null;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
  family?: FamilyMember[];
  specs?: Array<{ name: string; value: string }>;
};
export async function getRelated(handle: string, first = 8): Promise<ShopifyProduct[]> {
  return fetchRelated({ data: { handle, first } });
}

export async function getProducts(first = 24, query?: string): Promise<ShopifyProduct[]> {
  return fetchProducts({ data: { first, ...(query ? { query } : {}) } });
}
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  return fetchProduct({ data: { handle } });
}
