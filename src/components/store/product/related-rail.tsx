import { useQuery } from "@tanstack/react-query";
import { getRelated } from "@/lib/shopify";
import { ProductCard } from "../product-card";

// SRP: related-products rail only. Owns its query so the route doesn't
// mix recommendation fetching with page composition.
export function RelatedRail({ handle }: { handle: string }) {
  const related = useQuery({ queryKey: ["related", handle], queryFn: () => getRelated(handle, 8) });
  if (!related.data?.length) return null;
  return (
    <section className="md:col-span-2 mt-6">
      <h2 className="text-xl font-black sm:text-2xl">منتجات قد تعجبك</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {related.data.map((r) => (
          <ProductCard key={r.id} product={r} />
        ))}
      </div>
    </section>
  );
}
