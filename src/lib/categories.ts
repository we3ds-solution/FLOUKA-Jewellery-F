import necklacesAsset from "@/assets/necklaces.webp.asset.json";
import braceletsAsset from "@/assets/bracelets.webp.asset.json";
import earringsAsset from "@/assets/earrings.webp.asset.json";
import ankletsAsset from "@/assets/anklets.webp.asset.json";
export const CATEGORIES = [
  { slug: "necklaces", title: "سلاسل", img: necklacesAsset.url },
  { slug: "bracelets", title: "أساور", img: braceletsAsset.url },
  { slug: "earrings", title: "حلقان", img: earringsAsset.url },
  { slug: "anklets", title: "خلخال", img: ankletsAsset.url },
  { slug: "rings", title: "خواتم", img: "" },
  { slug: "kids", title: "أطفال", img: "" },
] as const;
