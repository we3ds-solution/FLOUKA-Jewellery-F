import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/store/motion";
import { formatCurrency, getProduct } from "@/lib/shopify";
import { FamilySwatches } from "@/components/store/product/family-swatches";
import { ProductGallery } from "@/components/store/product/product-gallery";
import { ProductOptions } from "@/components/store/product/product-options";
import { PurchasePanel } from "@/components/store/product/purchase-panel";
import { RelatedRail } from "@/components/store/product/related-rail";
import { useProductVariant } from "@/components/store/product/use-product-variant";
import { NotFoundPage, RouteErrorPage } from "@/components/store/failure-page";

const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: async () => {
      const product = await getProduct(handle);
      if (!product) throw notFound();
      return product;
    },
    retry: false,
  });

export const Route = createFileRoute("/product/$handle")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQuery(params.handle)),
  errorComponent: RouteErrorPage,
  notFoundComponent: NotFoundPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "منتج"} — Floukaa` },
      {
        name: "description",
        content: loaderData?.description.slice(0, 160) || "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "منتج"} — Floukaa` },
      {
        property: "og:description",
        content: loaderData?.description.slice(0, 160) || "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا.",
      },
      ...(loaderData?.images.edges[0]?.node.url.startsWith("https://")
        ? [
            { property: "og:image", content: loaderData.images.edges[0].node.url },
            { name: "twitter:image", content: loaderData.images.edges[0].node.url },
          ]
        : []),
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(handle));
  const { chosen, variant, qty, setQty, pick } = useProductVariant(p, handle);
  const images = p.images.edges.map((e) => e.node);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-6 sm:px-6 sm:py-10 md:grid-cols-2 md:gap-10 [&>*]:min-w-0">
      <Reveal>
        <ProductGallery key={handle} images={images} title={p.title} />
      </Reveal>
      <Reveal delay={0.1} className="md:self-start">
        <p className="text-xs font-bold text-accent">{p.productType || "إكسسوارات"}</p>
        <h1 className="mt-2 break-words text-2xl font-black sm:text-3xl">{p.title}</h1>
        <p className="mt-3 text-xl font-extrabold sm:mt-4 sm:text-2xl">
          {variant ? formatCurrency(variant.price) : formatCurrency(p.priceRange.minVariantPrice)}
        </p>
        <FamilySwatches family={p.family ?? []} currentHandle={p.handle} />
        <ProductOptions options={p.options} chosen={chosen} onPick={pick} />
        <PurchasePanel product={p} variant={variant} qty={qty} onQty={setQty} />
        {p.description && (
          <p className="mt-8 break-words leading-8 text-muted-foreground">{p.description}</p>
        )}
        {!!p.specs?.length && (
          <dl className="mt-6 divide-y divide-border rounded-2xl border border-border text-sm">
            {p.specs.map((x) => (
              <div key={x.name} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 px-4 py-3">
                <dt className="font-bold">{x.name}</dt>
                <dd className="text-muted-foreground">{x.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Reveal>
      <RelatedRail handle={handle} />
    </div>
  );
}
