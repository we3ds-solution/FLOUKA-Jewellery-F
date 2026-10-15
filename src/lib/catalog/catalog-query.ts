// SRP: catalog query API — param building, validation, and ranked queries.
// Depends on the cache (loading), the mapper (shaping), and family helpers.
// Nothing here touches the network directly except through the cache layer.
import { z } from "zod";
import { loadCatalog, woo } from "./catalog-cache";
import { clean, COLOR_RE, dedupe, familyKeyOf } from "./family";
import { map } from "./woo-map";
import { CAT_IDS } from "./woo-types";

export function buildParams(first: number, query?: string) {
  const sp = new URLSearchParams({ per_page: String(Math.min(first, 100)) });
  const q = query?.trim();
  if (!q) return sp;
  if (q === "tag:new") sp.set("orderby", "date");
  else if (q === "tag:featured") sp.set("featured", "true");
  else if (q === "tag:sale") sp.set("on_sale", "true");
  else if (q === "tag:best") sp.set("orderby", "popularity");
  else if (q.startsWith("tag:")) {
    const s = q.slice(4);
    const id = /^c\d+$/.test(s) ? Number(s.slice(1)) : CAT_IDS[s];
    if (id) sp.set("category", String(id));
  } else sp.set("search", q);
  return sp;
}

export async function fetchProducts({ data }: { data: { first: number; query?: string } }) {
  const list = await woo("/products?" + buildParams(data.first, data.query).toString());
  return dedupe(list).slice(0, data.first).map(map);
}

export async function fetchProduct({ data }: { data: { handle: string } }) {
  const list = (await woo("/products?slug=" + encodeURIComponent(data.handle))) as Array<
    import("./woo-types").WooProduct & { type: string; parent: number }
  >;
  const p = list.find((x) => x.type !== "variation") ?? list[0];
  return p ? map(p) : null;
}

const catalogSchema = z.object({
  base: z.string().max(200).optional(),
  page: z.number().int().min(1).max(500).default(1),
  perPage: z.number().int().min(1).max(100).default(24),
  sort: z.enum(["new", "popular", "price-asc", "price-desc", "title"]).default("new"),
  category: z.string().max(40).optional(),
  onSale: z.boolean().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  search: z.string().max(200).optional(),
});
export type CatalogParams = z.input<typeof catalogSchema>;

const SORTS = {
  new: ["date", "desc"],
  popular: ["popularity", "desc"],
  "price-asc": ["price", "asc"],
  "price-desc": ["price", "desc"],
  title: ["title", "asc"],
} as const;

export async function fetchCatalog({ data: input }: { data: CatalogParams }) {
  const data = catalogSchema.parse(input);
  const sp = buildParams(data.perPage, data.base);
  sp.set("page", String(data.page));
  if (!(data.base === "tag:best" && data.sort === "new")) {
    const [o, d] = SORTS[data.sort];
    sp.set("orderby", o);
    sp.set("order", d);
  }
  if (data.category) {
    const id = /^c\d+$/.test(data.category)
      ? Number(data.category.slice(1))
      : CAT_IDS[data.category];
    if (id) sp.set("category", String(id));
  }
  if (data.onSale) sp.set("on_sale", "true");
  if (data.minPrice != null) sp.set("min_price", String(data.minPrice));
  if (data.maxPrice != null) sp.set("max_price", String(data.maxPrice));
  if (data.search?.trim()) sp.set("search", data.search.trim());
  const list = dedupe(await woo("/products?" + sp.toString()));
  const start = (data.page - 1) * data.perPage;
  return {
    products: list.slice(start, start + data.perPage).map(map),
    total: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / data.perPage)),
  };
}

// Related items: same category, outside the product's own color family, ranked by shared name words.
export async function fetchRelated({ data }: { data: { handle: string; first?: number } }) {
  const all = await loadCatalog();
  const p = all.find((x) => x.slug === data.handle);
  if (!p) return [];
  const own = familyKeyOf(p.id);
  const cats = new Set(p.categories.map((c) => c.slug));
  const words = new Set(
    clean(p.name)
      .replace(COLOR_RE, " ")
      .split(/[^\w\u0600-\u06ff]+/)
      .filter((w) => w.length > 2),
  );
  const scored = dedupe(
    all.filter(
      (x) =>
        x.id !== p.id && familyKeyOf(x.id) !== own && x.categories.some((c) => cats.has(c.slug)),
    ),
  )
    .map((x) => ({
      x,
      s:
        clean(x.name)
          .split(/[^\w\u0600-\u06ff]+/)
          .filter((w) => words.has(w)).length + (x.is_in_stock ? 0.5 : 0),
    }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, data.first ?? 8).map(({ x }) => map(x));
}
