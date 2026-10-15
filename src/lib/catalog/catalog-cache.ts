// SRP: catalog loading + in-memory filtering. Owns the fetch promise cache
// and the query-string filter/sort. No mapping or presentation here.
import catalogAsset from "@/assets/catalog.json.asset.json";
import { buildFamilies } from "./family";
import { strip } from "./html";
import type { WooProduct } from "./woo-types";

let catalogCache: Promise<WooProduct[]> | null = null;

export function loadCatalog() {
  catalogCache ??= fetch(catalogAsset.url).then(async (res) => {
    if (!res.ok) throw new Error("تعذر تحميل المنتجات");
    const all = (await res.json()) as WooProduct[];
    buildFamilies(all);
    return all;
  });
  catalogCache.catch(() => {
    catalogCache = null;
  });
  return catalogCache;
}

export async function woo(path: string) {
  // NOTE (verified against live catalog data): the catalog JSON carries no
  // date/featured/sales fields, so `orderby=date|popularity` and
  // `featured=true` intentionally fall through to catalog order instead of
  // faking a sort. Supported here: slug, category, on_sale, search,
  // min/max_price, orderby=price|title.
  let list = [...(await loadCatalog())];
  const params = new URLSearchParams(path.split("?")[1]);
  if (params.get("slug")) list = list.filter((p) => p.slug === params.get("slug"));
  if (params.get("category"))
    list = list.filter((p) =>
      p.categories.some((c) => String((c as { id?: number }).id) === params.get("category")),
    );
  if (params.get("on_sale")) list = list.filter((p) => p.on_sale);
  const search = params.get("search")?.toLocaleLowerCase();
  if (search) list = list.filter((p) => strip(p.name).toLocaleLowerCase().includes(search));
  if (params.has("min_price"))
    list = list.filter((p) => Number(p.prices.price) >= Number(params.get("min_price")));
  if (params.has("max_price"))
    list = list.filter((p) => Number(p.prices.price) <= Number(params.get("max_price")));
  if (params.get("orderby") === "price")
    list.sort(
      (a, b) =>
        (Number(a.prices.price) - Number(b.prices.price)) *
        (params.get("order") === "desc" ? -1 : 1),
    );
  if (params.get("orderby") === "title") list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  return list;
}
