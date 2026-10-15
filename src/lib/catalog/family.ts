// SRP: product families only — groups items that differ by color/size words
// (same first category) so listings show one card per family.
// Owns the family index state; nothing here fetches or renders.
import { strip } from "./html";
import type { WooProduct } from "./woo-types";

export const COLORS: Record<string, [string, string]> = {
  "off white": ["أوف وايت", "#f3eee2"],
  gold: ["ذهبي", "#d4af37"],
  golden: ["ذهبي", "#d4af37"],
  silver: ["فضي", "#c0c0c0"],
  white: ["أبيض", "#ffffff"],
  black: ["أسود", "#111111"],
  pink: ["وردي", "#f4a7c0"],
  rose: ["روز", "#e8a0a8"],
  blue: ["أزرق", "#3b6fd8"],
  navy: ["كحلي", "#1f2a52"],
  green: ["أخضر", "#3e9b5a"],
  red: ["أحمر", "#d23b3b"],
  yellow: ["أصفر", "#f2cc3a"],
  brown: ["بني", "#7a4a2b"],
  beige: ["بيج", "#e3d1b0"],
  purple: ["موف", "#8a5bb8"],
  turquoise: ["تركواز", "#33b8b0"],
  orange: ["برتقالي", "#f08a2c"],
  grey: ["رمادي", "#8d8d8d"],
  gray: ["رمادي", "#8d8d8d"],
  hazel: ["عسلي", "#a8743a"],
  nude: ["نود", "#e0b89a"],
  colorful: ["ملون", "conic-gradient(#e44,#fc3,#3c6,#39f,#c4f,#e44)"],
  mix: ["مكس", "conic-gradient(#e44,#fc3,#3c6,#39f,#c4f,#e44)"],
  metallic: ["ميتاليك", "linear-gradient(135deg,#ddd,#888,#eee)"],
};
export const COLOR_RE = new RegExp(
  `\\b(${Object.keys(COLORS)
    .sort((a, b) => b.length - a.length)
    .join("|")})\\b`,
  "g",
);
export const SIZE_RE = /\b\d+(?:\.\d+)?\s*(?:mm|cm|g|gm|gram|grams)\b/g;
export const clean = (n: string) => strip(n).toLowerCase();

export type FamilyMember = {
  handle: string;
  title: string;
  color: string | null;
  swatch: string | null;
  size: string | null;
  label: string;
  price: string;
  image: string | null;
  inStock: boolean;
};

let familyIndex: Map<string, WooProduct[]> | null = null;
let keyById: Map<number, string> | null = null;

export function familyKey(p: WooProduct) {
  const n = clean(p.name)
    .replace(SIZE_RE, " ")
    .replace(COLOR_RE, " ")
    .replace(/[^\w\u0600-\u06ff]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cat = (p.categories[0] as { id?: number } | undefined)?.id ?? 0;
  return `${cat}:${n}`;
}

export function buildFamilies(list: WooProduct[]) {
  if (familyIndex) return;
  familyIndex = new Map();
  keyById = new Map();
  for (const p of list) {
    const k = familyKey(p);
    keyById.set(p.id, k);
    const f = familyIndex.get(k);
    if (f) f.push(p);
    else familyIndex.set(k, [p]);
  }
}

/** Family key for an already-indexed product id. */
export function familyKeyOf(id: number): string | undefined {
  return keyById?.get(id);
}

/** All indexed members sharing the product's family key. */
export function familyMembersOf(id: number): WooProduct[] | undefined {
  const k = keyById?.get(id);
  return k ? familyIndex?.get(k) : undefined;
}

export function familyOf(p: WooProduct): FamilyMember[] {
  const k = keyById?.get(p.id);
  const members = k ? familyIndex?.get(k) : undefined;
  if (!members || members.length < 2) return [];
  const seen = new Map<string, number>();
  return members.map((m) => {
    const n = clean(m.name);
    const colors = [...new Set(n.match(COLOR_RE) ?? [])];
    const size = n.match(SIZE_RE)?.[0]?.replace(/\s+/g, "") ?? null;
    const color = colors.length ? colors.map((c) => COLORS[c]?.[0] ?? c).join(" و ") : null;
    let label = [color, size].filter(Boolean).join(" · ") || "تصميم";
    const count = (seen.get(label) ?? 0) + 1;
    seen.set(label, count);
    if (count > 1 || label === "تصميم") label = `${label} ${count}`;
    return {
      handle: m.slug,
      title: strip(m.name),
      color,
      swatch: colors[0] ? (COLORS[colors[0]]?.[1] ?? null) : null,
      size,
      label,
      price: m.prices.price,
      image: m.images[0]?.src ?? null,
      inStock: m.is_in_stock,
    };
  });
}

// Listings show one card per family so color/size duplicates don't repeat.
export function dedupe(list: WooProduct[]) {
  const seen = new Set<string>();
  return list.filter((p) => {
    const k = keyById?.get(p.id) ?? String(p.id);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
