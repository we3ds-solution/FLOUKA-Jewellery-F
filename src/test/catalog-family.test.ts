import { describe, expect, it } from "vitest";
import { buildFamilies, dedupe, familyOf } from "@/lib/catalog/family";
import { map } from "@/lib/catalog/woo-map";
import { buildParams } from "@/lib/catalog/catalog-query";
import type { WooProduct } from "@/lib/catalog/woo-types";

const necklaces = { name: "سلاسل", slug: "necklaces" };
const rings = { name: "خواتم", slug: "rings" };

const woo = (over: Partial<WooProduct> & { id: number; name: string; slug: string }): WooProduct => ({
  description: "",
  short_description: "",
  on_sale: false,
  prices: { price: "100", regular_price: "100", currency_code: "EGP" },
  images: [{ src: "https://x/y.jpg", alt: "" }],
  categories: [necklaces],
  tags: [],
  attributes: [],
  variations: [],
  is_in_stock: true,
  ...over,
});

const gold = () => woo({ id: 1, name: "Gold Necklace", slug: "gold-necklace" });
const silver = () =>
  woo({ id: 2, name: "Silver Necklace", slug: "silver-necklace", categories: [necklaces] });
const ring = () =>
  woo({ id: 3, name: "Gold Ring", slug: "gold-ring", categories: [rings] });

describe("product families", () => {
  it("groups color variants and dedupes listings to one card per family", () => {
    const list = [gold(), silver(), ring()];
    buildFamilies(list);
    expect(familyOf(list[0]!).length).toBe(2);
    expect(familyOf(list[2]!).length).toBe(0);
    expect(dedupe(list).map((p) => p.slug)).toEqual(["gold-necklace", "gold-ring"]);
  });

  it("labels members by color", () => {
    const list = [gold(), silver()];
    buildFamilies(list);
    const colors = familyOf(list[0]!).map((m) => m.color).sort();
    expect(colors).toEqual(["ذهبي", "فضي"]);
  });

  it("maps products with family attached", () => {
    const list = [gold(), silver()];
    buildFamilies(list);
    const mapped = map(list[0]!);
    expect(mapped.id).toBe("1");
    expect(mapped.family).toHaveLength(2);
    expect(mapped.priceRange.minVariantPrice.amount).toBe("100");
  });
});

describe("buildParams", () => {
  it("maps tag queries to Woo params", () => {
    expect(buildParams(10, "tag:sale").get("on_sale")).toBe("true");
    expect(buildParams(10, "tag:necklaces").get("category")).toBe("207");
    expect(buildParams(10, "hello").get("search")).toBe("hello");
    expect(buildParams(10).get("per_page")).toBe("10");
  });
});
