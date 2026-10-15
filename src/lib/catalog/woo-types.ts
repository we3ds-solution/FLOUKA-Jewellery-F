// Single source for catalog category ids and WooCommerce payload shapes.
// SRP: types only — no fetching, mapping, or caching here.
export const CAT_IDS: Record<string, number> = {
  necklaces: 207,
  bracelets: 209,
  earrings: 255,
  anklets: 208,
  rings: 262,
  kids: 309,
};

export const CATALOG_CATEGORIES = CAT_IDS;

export type WooImage = { src: string; alt: string };
export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  on_sale: boolean;
  prices: { price: string; regular_price: string; currency_code: string };
  images: WooImage[];
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ slug: string }>;
  attributes: Array<{
    name: string;
    has_variations: boolean;
    terms: Array<{ name: string; slug: string }>;
  }>;
  variations: Array<{ id: number; attributes: Array<{ name: string; value: string }> }>;
  is_in_stock: boolean;
};
