import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { NotFoundPage, RouteErrorPage } from '@/components/store/failure-page';
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/store/motion";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProduct, getRelated } from "@/lib/shopify";
import { optionLabel } from "@/lib/catalog/option-labels";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { useCompare } from '@/stores/compare';
import { CompareIcon } from '@/components/store/compare-icon';

const productQuery = (handle: string) => queryOptions({ queryKey: ['product', handle], queryFn: async () => { const product = await getProduct(handle); if (!product) throw notFound(); return product; }, retry: false });
export const Route = createFileRoute("/product/$handle")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQuery(params.handle)),
  errorComponent: RouteErrorPage,
  notFoundComponent: NotFoundPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'منتج'} — Floukaa` },
      { name: "description", content: loaderData?.description.slice(0, 160) || "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
      { property: "og:title", content: `${loaderData?.title ?? 'منتج'} — Floukaa` },
      { property: "og:description", content: loaderData?.description.slice(0, 160) || "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
      ...(loaderData?.images.edges[0]?.node.url.startsWith('https://') ? [{ property: 'og:image', content: loaderData.images.edges[0].node.url }, { name: 'twitter:image', content: loaderData.images.edges[0].node.url }] : []),
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(handle));
  const [img, setImg] = useState(0);
  const [sel, setSel] = useState<Record<string, string>>({});
  useEffect(() => { setImg(0); setSel({}); setQty(1); }, [handle]);
  const related = useQuery({ queryKey: ['related', handle], queryFn: () => getRelated(handle, 8) });
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.addItem);
  const busy = useCart((s) => s.busy);
  const wish = useWishlist();
  const compare = useCompare();

  const variants = p.variants.edges.map((e) => e.node);
  const chosen = Object.fromEntries(p.options.map((o) => [o.name, sel[o.name] ?? o.values[0]]));
  const v = variants.find((x) => x.selectedOptions.every((o) => chosen[o.name] === o.value)) ?? variants[0];
  const family = p.family ?? [];
  const current = family.find((f) => f.handle === p.handle);
  const images = p.images.edges.map((e) => e.node);
  const liked = wish.items.some((i) => i.id === p.id);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-6 sm:px-6 sm:py-10 md:grid-cols-2 md:gap-10 [&>*]:min-w-0">
      <Reveal>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          <AnimatePresence mode="wait">
            {images[img] && <motion.img key={images[img].url} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} src={images[img].url} alt={images[img].altText ?? p.title} className="size-full object-cover" />}
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((im, i) => (
              <motion.button whileTap={{ scale: 0.92 }} key={im.url} onClick={() => setImg(i)} aria-label={`صورة ${i + 1}`} className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-20 ${i === img ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={im.url} alt="" className="size-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </Reveal>
      <Reveal delay={0.1} className="md:self-start">
        <p className="text-xs font-bold text-accent">{p.productType || "إكسسوارات"}</p>
        <h1 className="mt-2 break-words text-2xl font-black sm:text-3xl">{p.title}</h1>
        <p className="mt-3 text-xl font-extrabold sm:mt-4 sm:text-2xl">{v ? formatCurrency(v.price) : formatCurrency(p.priceRange.minVariantPrice)}</p>
        {family.length > 1 && (
          <div className="mt-6">
            <p className="text-sm font-bold">اللون / الشكل: <span className="font-normal text-muted-foreground">{current?.label}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {family.map((f) => {
                const active = f.handle === p.handle;
                return (
                  <Link key={f.handle} to="/product/$handle" params={{ handle: f.handle }} replace resetScroll={false} title={`${f.label} — ${f.price} EGP`} aria-current={active ? "true" : undefined}
                    className={`relative w-[5.5rem] overflow-hidden rounded-xl border-2 bg-card text-center transition ${active ? "border-accent" : "border-border hover:border-foreground/40"} ${f.inStock ? "" : "opacity-50"}`}>
                    {f.image ? <img src={f.image} alt={f.label} loading="lazy" className="aspect-square w-full object-cover" /> : <div className="aspect-square w-full bg-muted" />}
                    <span className="flex items-center justify-center gap-1 px-1 py-1 text-[10px] font-bold leading-tight">
                      {f.swatch && <span className="size-2.5 shrink-0 rounded-full border border-border" style={{ background: f.swatch }} />}
                      <span className="truncate">{f.label}</span>
                    </span>
                    {active && <span className="absolute end-1 top-1 grid size-4 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="size-3" /></span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {p.options.map((o) => (
          <div key={o.name} className="mt-6">
            <p className="text-sm font-bold">{optionLabel(o.name)}: <span className="font-normal text-muted-foreground">{chosen[o.name]}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.values.map((val) => (
                <Button key={val} variant={chosen[o.name] === val ? "default" : "outline"} size="sm" className="max-w-full truncate" onClick={() => setSel((x) => ({ ...x, [o.name]: val }))}>{val}</Button>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
          <div className="flex items-center rounded-full border border-border">
            <Button size="icon" variant="ghost" onClick={() => setQty(qty + 1)} aria-label="زيادة"><Plus className="size-4" /></Button>
            <motion.span key={qty} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-6 text-center font-bold sm:w-8">{qty}</motion.span>
            <Button size="icon" variant="ghost" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="تقليل"><Minus className="size-4" /></Button>
          </div>
          <motion.div whileTap={{ scale: 0.97 }} className="min-w-0">
            <Button variant="accent" className="w-full" disabled={!v || busy || !v.availableForSale}
              onClick={() => v && add({ product: p, variantId: v.id, variantTitle: v.title, price: v.price, quantity: qty, selectedOptions: v.selectedOptions })}>
              <span className="truncate">{v?.availableForSale === false ? "غير متوفر" : "أضيفي للسلة"}</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.85 }}>
            <Button size="icon" variant="outline" onClick={() => wish.toggle(p)} aria-label="المفضلة">
              <Heart className={liked ? "size-5 fill-accent text-accent" : "size-5"} />
            </Button>
          </motion.div>
        </div>
        <Button variant="ghost" className="mt-4" onClick={() => compare.add(p)}><CompareIcon className="size-5" />مقارنة المنتجات</Button>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Truck className="size-4 shrink-0" /> شحن لجميع محافظات مصر</p>
        {p.description && <p className="mt-8 break-words leading-8 text-muted-foreground">{p.description}</p>}
        {!!p.specs?.length && (
          <dl className="mt-6 divide-y divide-border rounded-2xl border border-border text-sm">
            {p.specs.map((x) => (
              <div key={x.name} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 px-4 py-3"><dt className="font-bold">{x.name}</dt><dd className="text-muted-foreground">{x.value}</dd></div>
            ))}
          </dl>
        )}
      </Reveal>
      {!!related.data?.length && (
        <section className="md:col-span-2 mt-6">
          <h2 className="text-xl font-black sm:text-2xl">منتجات قد تعجبك</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.data.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
