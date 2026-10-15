// SRP: WooCommerce → storefront product mapping. Pure transformation only —
// no fetching, no caching, no query parsing.
import { familyOf } from "./family";
import { strip } from "./html";
import type { WooProduct } from "./woo-types";

export function map(p: WooProduct) {
  const price = { amount: p.prices.price, currencyCode: p.prices.currency_code || "EGP" };
  const compare = p.on_sale
    ? { amount: p.prices.regular_price, currencyCode: price.currencyCode }
    : null;
  const varAttrs = p.attributes.filter((a) => a.has_variations);
  const variants =
    Array.isArray(p.variations) && p.variations.length
      ? p.variations.map((v) => ({
          id: String(v.id),
          availableForSale: p.is_in_stock,
          price,
          ...(() => {
            const opts = v.attributes.map((a) => {
              const attr =
                varAttrs.find((x) => x.name.toLowerCase() === a.name.toLowerCase()) ?? varAttrs[0];
              return {
                name: attr?.name ?? a.name,
                value: attr?.terms.find((t) => t.slug === a.value)?.name ?? a.value,
              };
            });
            return {
              title: opts.map((o) => o.value).join(" / ") || "Default",
              selectedOptions: opts,
            };
          })(),
        }))
      : optionVariants(p, varAttrs, price);
  return {
    id: String(p.id),
    title: strip(p.name),
    handle: p.slug,
    description: strip(p.description || p.short_description),
    productType: p.categories[0]?.name ?? "",
    tags: [...p.categories.map((c) => c.slug), ...p.tags.map((t) => t.slug)],
    priceRange: { minVariantPrice: price },
    compareAtPrice: compare,
    images: { edges: p.images.map((i) => ({ node: { url: i.src, altText: i.alt || null } })) },
    variants: { edges: variants.map((node) => ({ node })) },
    options: varAttrs.map((a) => ({ name: a.name, values: a.terms.map((t) => t.name) })),
    family: familyOf(p),
    specs: p.attributes
      .filter((a) => !a.has_variations && a.terms.length)
      .map((a) => ({ name: a.name, value: a.terms.map((t) => t.name).join("، ") })),
  };
}

// Variable products whose variation list is unavailable: build one choice per option combination.
export function optionVariants(
  p: WooProduct,
  attrs: WooProduct["attributes"],
  price: { amount: string; currencyCode: string },
) {
  const combos = attrs
    .reduce<Array<Array<{ name: string; value: string }>>>(
      (acc, a) => acc.flatMap((c) => a.terms.map((t) => [...c, { name: a.name, value: t.name }])),
      [[]],
    )
    .slice(0, 60);
  if (!attrs.length || !combos[0]?.length)
    return [
      {
        id: String(p.id),
        title: "Default Title",
        availableForSale: p.is_in_stock,
        price,
        selectedOptions: [],
      },
    ];
  return combos.map((opts) => ({
    id: `${p.id}:${opts.map((o) => o.value).join("|")}`,
    title: opts.map((o) => o.value).join(" / "),
    availableForSale: p.is_in_stock,
    price,
    selectedOptions: opts,
  }));
}
