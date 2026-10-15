// SRP: storefront display names for Woo attribute names.
// The catalog carries one legacy artifact ("lمقاس غوايش"); an explicit map
// keeps it readable without a broad regex that would corrupt future
// l-leading names (e.g. "length"). Unknown names pass through untouched.
const LABELS: Record<string, string> = {
  "ring size": "مقاس الخاتم",
  "lمقاس غوايش": "مقاس غوايش",
};

export function optionLabel(name: string) {
  return LABELS[name] ?? name;
}
