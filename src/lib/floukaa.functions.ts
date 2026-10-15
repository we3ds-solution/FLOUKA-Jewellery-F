// Barrel: preserves the `@/lib/floukaa.functions` import surface.
// Implementation lives in `./catalog/*` — one responsibility per module:
// types → html → family → woo-map → catalog-cache → catalog-query.
export { CATALOG_CATEGORIES, CAT_IDS } from "./catalog/woo-types";
export type { WooImage, WooProduct } from "./catalog/woo-types";
export { strip } from "./catalog/html";
export {
  COLORS,
  COLOR_RE,
  SIZE_RE,
  clean,
  buildFamilies,
  dedupe,
  familyKey,
  familyKeyOf,
  familyMembersOf,
  familyOf,
} from "./catalog/family";
export type { FamilyMember } from "./catalog/family";
export { map, optionVariants } from "./catalog/woo-map";
export { optionLabel } from "./catalog/option-labels";
export { loadCatalog, woo } from "./catalog/catalog-cache";
export {
  buildParams,
  fetchCatalog,
  fetchProduct,
  fetchProducts,
  fetchRelated,
} from "./catalog/catalog-query";
export type { CatalogParams } from "./catalog/catalog-query";
