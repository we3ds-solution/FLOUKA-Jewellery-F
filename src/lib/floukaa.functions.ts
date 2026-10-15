import { z } from "zod";
import catalogAsset from '@/assets/catalog.json.asset.json';

const CAT_IDS: Record<string, number> = { necklaces: 207, bracelets: 209, earrings: 255, anklets: 208, rings: 262, kids: 309 };

type WooImage = { src: string; alt: string };
type WooProduct = {
  id: number; name: string; slug: string; description: string; short_description: string; on_sale: boolean;
  prices: { price: string; regular_price: string; currency_code: string };
  images: WooImage[]; categories: Array<{ name: string; slug: string }>; tags: Array<{ slug: string }>;
  attributes: Array<{ name: string; has_variations: boolean; terms: Array<{ name: string; slug: string }> }>;
  variations: Array<{ id: number; attributes: Array<{ name: string; value: string }> }>;
  is_in_stock: boolean;
};

const strip = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "–").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function map(p: WooProduct) {
  const price = { amount: p.prices.price, currencyCode: p.prices.currency_code || "EGP" };
  const compare = p.on_sale ? { amount: p.prices.regular_price, currencyCode: price.currencyCode } : null;
  const varAttrs = p.attributes.filter((a) => a.has_variations);
  const variants = Array.isArray(p.variations) && p.variations.length
    ? p.variations.map((v) => ({
        id: String(v.id), availableForSale: p.is_in_stock, price,
        ...(() => {
          const opts = v.attributes.map((a) => {
            const attr = varAttrs.find((x) => x.name.toLowerCase() === a.name.toLowerCase()) ?? varAttrs[0];
            return { name: attr?.name ?? a.name, value: attr?.terms.find((t) => t.slug === a.value)?.name ?? a.value };
          });
          return { title: opts.map((o) => o.value).join(" / ") || "Default", selectedOptions: opts };
        })(),
      }))
    : optionVariants(p, varAttrs, price);
  return {
    id: String(p.id), title: strip(p.name), handle: p.slug,
    description: strip(p.description || p.short_description),
    productType: p.categories[0]?.name ?? "", tags: [...p.categories.map((c) => c.slug), ...p.tags.map((t) => t.slug)],
    priceRange: { minVariantPrice: price }, compareAtPrice: compare,
    images: { edges: p.images.map((i) => ({ node: { url: i.src, altText: i.alt || null } })) },
    variants: { edges: variants.map((node) => ({ node })) },
    options: varAttrs.map((a) => ({ name: a.name, values: a.terms.map((t) => t.name) })),
    family: familyOf(p),
    specs: p.attributes.filter((a) => !a.has_variations && a.terms.length).map((a) => ({ name: a.name, value: a.terms.map((t) => t.name).join("، ") })),
  };
}

// Variable products whose variation list is unavailable: build one choice per option combination.
function optionVariants(p: WooProduct, attrs: WooProduct["attributes"], price: { amount: string; currencyCode: string }) {
  const combos = attrs.reduce<Array<Array<{ name: string; value: string }>>>(
    (acc, a) => acc.flatMap((c) => a.terms.map((t) => [...c, { name: a.name, value: t.name }])), [[]],
  ).slice(0, 60);
  if (!attrs.length || !combos[0]?.length) return [{ id: String(p.id), title: "Default Title", availableForSale: p.is_in_stock, price, selectedOptions: [] }];
  return combos.map((opts) => ({ id: `${p.id}:${opts.map((o) => o.value).join("|")}`, title: opts.map((o) => o.value).join(" / "), availableForSale: p.is_in_stock, price, selectedOptions: opts }));
}

/* ---------- Product families: same item in different colors / sizes ---------- */
const COLORS: Record<string, [string, string]> = {
  "off white": ["أوف وايت", "#f3eee2"], gold: ["ذهبي", "#d4af37"], golden: ["ذهبي", "#d4af37"], silver: ["فضي", "#c0c0c0"],
  white: ["أبيض", "#ffffff"], black: ["أسود", "#111111"], pink: ["وردي", "#f4a7c0"], rose: ["روز", "#e8a0a8"],
  blue: ["أزرق", "#3b6fd8"], navy: ["كحلي", "#1f2a52"], green: ["أخضر", "#3e9b5a"], red: ["أحمر", "#d23b3b"],
  yellow: ["أصفر", "#f2cc3a"], brown: ["بني", "#7a4a2b"], beige: ["بيج", "#e3d1b0"], purple: ["موف", "#8a5bb8"],
  turquoise: ["تركواز", "#33b8b0"], orange: ["برتقالي", "#f08a2c"], grey: ["رمادي", "#8d8d8d"], gray: ["رمادي", "#8d8d8d"],
  hazel: ["عسلي", "#a8743a"], nude: ["نود", "#e0b89a"], colorful: ["ملون", "conic-gradient(#e44,#fc3,#3c6,#39f,#c4f,#e44)"],
  mix: ["مكس", "conic-gradient(#e44,#fc3,#3c6,#39f,#c4f,#e44)"], metallic: ["ميتاليك", "linear-gradient(135deg,#ddd,#888,#eee)"],
};
const COLOR_RE = new RegExp(`\\b(${Object.keys(COLORS).sort((a, b) => b.length - a.length).join("|")})\\b`, "g");
const SIZE_RE = /\b\d+(?:\.\d+)?\s*(?:mm|cm|g|gm|gram|grams)\b/g;
const clean = (n: string) => strip(n).toLowerCase();

export type FamilyMember = { handle: string; title: string; color: string | null; swatch: string | null; size: string | null; label: string; price: string; image: string | null; inStock: boolean };

let familyIndex: Map<string, WooProduct[]> | null = null;
let keyById: Map<number, string> | null = null;
function familyKey(p: WooProduct) {
  const n = clean(p.name).replace(SIZE_RE, " ").replace(COLOR_RE, " ").replace(/[^\w\u0600-\u06ff]+/g, " ").replace(/\s+/g, " ").trim();
  const cat = (p.categories[0] as { id?: number } | undefined)?.id ?? 0;
  return `${cat}:${n}`;
}
function buildFamilies(list: WooProduct[]) {
  if (familyIndex) return;
  familyIndex = new Map(); keyById = new Map();
  for (const p of list) { const k = familyKey(p); keyById.set(p.id, k); const f = familyIndex.get(k); if (f) f.push(p); else familyIndex.set(k, [p]); }
}
function familyOf(p: WooProduct): FamilyMember[] {
  const k = keyById?.get(p.id); const members = k ? familyIndex?.get(k) : undefined;
  if (!members || members.length < 2) return [];
  const seen = new Map<string, number>();
  return members.map((m) => {
    const n = clean(m.name);
    const colors = [...new Set(n.match(COLOR_RE) ?? [])];
    const size = n.match(SIZE_RE)?.[0]?.replace(/\s+/g, "") ?? null;
    const color = colors.length ? colors.map((c) => COLORS[c]?.[0] ?? c).join(" و ") : null;
    let label = [color, size].filter(Boolean).join(" · ") || "تصميم";
    const count = (seen.get(label) ?? 0) + 1; seen.set(label, count);
    if (count > 1 || label === "تصميم") label = `${label} ${count}`;
    return { handle: m.slug, title: strip(m.name), color, swatch: colors[0] ? COLORS[colors[0]]?.[1] ?? null : null, size, label, price: m.prices.price, image: m.images[0]?.src ?? null, inStock: m.is_in_stock };
  });
}
// Listings show one card per family so color/size duplicates don't repeat.
function dedupe(list: WooProduct[]) {
  const seen = new Set<string>();
  return list.filter((p) => { const k = keyById?.get(p.id) ?? String(p.id); if (seen.has(k)) return false; seen.add(k); return true; });
}

let catalogCache: Promise<WooProduct[]> | null = null;
function loadCatalog() {
  catalogCache ??= fetch(catalogAsset.url).then(async (res) => {
    if (!res.ok) throw new Error("تعذر تحميل المنتجات");
    const all = await res.json() as WooProduct[];
    buildFamilies(all);
    return all;
  });
  catalogCache.catch(() => { catalogCache = null; });
  return catalogCache;
}

async function woo(path: string) {
  let list = [...await loadCatalog()];
  const params = new URLSearchParams(path.split('?')[1]);
  if (params.get('slug')) list = list.filter(p => p.slug === params.get('slug'));
  if (params.get('category')) list = list.filter(p => p.categories.some(c => String((c as { id?: number }).id) === params.get('category')));
  if (params.get('on_sale')) list = list.filter(p => p.on_sale);
  const search = params.get('search')?.toLocaleLowerCase();
  if (search) list = list.filter(p => strip(p.name).toLocaleLowerCase().includes(search));
  if (params.has('min_price')) list = list.filter(p => Number(p.prices.price) >= Number(params.get('min_price')));
  if (params.has('max_price')) list = list.filter(p => Number(p.prices.price) <= Number(params.get('max_price')));
  if (params.get('orderby') === 'price') list.sort((a,b) => (Number(a.prices.price)-Number(b.prices.price)) * (params.get('order') === 'desc' ? -1 : 1));
  if (params.get('orderby') === 'title') list.sort((a,b) => a.name.localeCompare(b.name,'ar'));
  return list;
}

export function buildParams(first: number, query?: string) {
  const sp = new URLSearchParams({ per_page: String(Math.min(first, 100)) });
  const q = query?.trim();
  if (!q) return sp;
  if (q === "tag:new") sp.set("orderby", "date");
  else if (q === "tag:featured") sp.set("featured", "true");
  else if (q === "tag:sale") sp.set("on_sale", "true");
  else if (q === "tag:best") sp.set("orderby", "popularity");
  else if (q.startsWith("tag:")) { const s = q.slice(4); const id = /^c\d+$/.test(s) ? Number(s.slice(1)) : CAT_IDS[s]; if (id) sp.set("category", String(id)); }
  else sp.set("search", q);
  return sp;
}

export async function fetchProducts({ data }: { data: { first: number; query?: string } }) {
    const list = (await woo("/products?" + buildParams(data.first, data.query).toString())) as WooProduct[];
    return dedupe(list).slice(0, data.first).map(map);
  }

export async function fetchProduct({ data }: { data: { handle: string } }) {
    const list = (await woo("/products?slug=" + encodeURIComponent(data.handle))) as Array<WooProduct & { type: string; parent: number }>;
    const p = list.find((x) => x.type !== "variation") ?? list[0];
    return p ? map(p) : null;
  }

export const CATALOG_CATEGORIES = CAT_IDS;

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

const SORTS = { new: ["date", "desc"], popular: ["popularity", "desc"], "price-asc": ["price", "asc"], "price-desc": ["price", "desc"], title: ["title", "asc"] } as const;

export async function fetchCatalog({ data: input }: { data: CatalogParams }) {
    const data = catalogSchema.parse(input);
    const sp = buildParams(data.perPage, data.base);
    sp.set("page", String(data.page));
    if (!(data.base === "tag:best" && data.sort === "new")) { const [o, d] = SORTS[data.sort]; sp.set("orderby", o); sp.set("order", d); }
    if (data.category) { const id = /^c\d+$/.test(data.category) ? Number(data.category.slice(1)) : CAT_IDS[data.category]; if (id) sp.set("category", String(id)); }
    if (data.onSale) sp.set("on_sale", "true");
    if (data.minPrice != null) sp.set("min_price", String(data.minPrice));
    if (data.maxPrice != null) sp.set("max_price", String(data.maxPrice));
    if (data.search?.trim()) sp.set("search", data.search.trim());
    const list = dedupe(await woo('/products?' + sp.toString()));
    const start = (data.page - 1) * data.perPage;
    return { products: list.slice(start, start + data.perPage).map(map), total: list.length, totalPages: Math.max(1, Math.ceil(list.length / data.perPage)) };
  }

// Related items: same category, outside the product's own color family, ranked by shared name words.
export async function fetchRelated({ data }: { data: { handle: string; first?: number } }) {
  const all = await loadCatalog();
  const p = all.find((x) => x.slug === data.handle);
  if (!p) return [];
  const own = keyById?.get(p.id);
  const cats = new Set(p.categories.map((c) => c.slug));
  const words = new Set(clean(p.name).replace(COLOR_RE, " ").split(/[^\w\u0600-\u06ff]+/).filter((w) => w.length > 2));
  const scored = dedupe(all.filter((x) => x.id !== p.id && keyById?.get(x.id) !== own && x.categories.some((c) => cats.has(c.slug))))
    .map((x) => ({ x, s: clean(x.name).split(/[^\w\u0600-\u06ff]+/).filter((w) => words.has(w)).length + (x.is_in_stock ? 0.5 : 0) }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, data.first ?? 8).map(({ x }) => map(x));
}
