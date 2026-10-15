import { useT } from '@/lib/i18n'
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Gift, Network, ShieldCheck, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ProductCard } from "@/components/store/product-card";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { CategoryMap } from "@/components/store/category-map";
import { meta } from "@/lib/seo";
import heroAsset from "@/assets/floukaa-original-banner.webp.asset.json";
import { HeroSlider } from "@/components/store/hero-slider";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/store/motion";
import { FeedbackSection } from "@/components/store/feedback-section";

export const Route = createFileRoute("/")({
  head: () => {
    const metadata = meta("Floukaa — فلوكة للإكسسوارات والهدايا", "سلاسل، أساور، حلقان وخلاخيل بتصميمات جديدة. شحن لجميع محافظات مصر.");
    return { meta: [...metadata.meta, ...(heroAsset.url.startsWith('https://') ? [{ property: 'og:image', content: heroAsset.url }, { name: 'twitter:image', content: heroAsset.url }] : [])] };
  },
  component: Index,
});

const tabs = [["وصل حديثًا", "tag:new"], ["الأكثر مبيعًا", "tag:best"], ["متميز", "tag:featured"], ["عروض", "tag:sale"]] as const;

function Index() {
  const t = useT();
  const [showMap, setShowMap] = useState(false);
  const mapTrigger = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const closeMap = () => {
    setShowMap(false);
    mapTrigger.current?.focus({ preventScroll: true });
    mapTrigger.current?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "center" });
  };
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [loadError, setLoadError] = useState<unknown>(null);
  useEffect(() => {
    setProducts(null);
    let alive = true;
    void getProducts(10, tabs[tab]?.[1] || undefined).then(result => { if (alive) setProducts(result); }).catch(error => { if (alive) setLoadError(error); });
    return () => { alive = false; };
  }, [tab]);

  if (loadError) throw loadError;

  return (
    <>
      <HeroSlider />

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <Reveal className="mb-8 text-center">
          <p className="text-xs font-bold text-accent">{t("تشكيلات جديدة صيفية")}</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">{t("تسوقي حسب القسم")}</h2>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CATEGORIES.filter((c) => c.img).map((c) => (
            <StaggerItem key={c.slug}>
              <Link to="/category/$slug" params={{ slug: c.slug }} className="group block">
                <motion.div whileHover={{ y: -6 }} className="aspect-square overflow-hidden rounded-3xl bg-muted shadow-soft">
                  <img src={c.img} alt={t(c.title)} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" />
                </motion.div>
                <p className="mt-3 text-center text-base font-black transition-colors group-hover:text-accent sm:text-lg">{t(c.title)}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 text-center">
          <Button ref={mapTrigger} variant="outline" size="lg" onClick={() => setShowMap((v) => !v)} aria-expanded={showMap} aria-controls="category-map" className="category-map-trigger">
            <Network className="size-5" aria-hidden="true" />
            {t(showMap ? "إخفاء خريطة الأقسام" : "عرض خريطة الأقسام")}
            <ChevronDown className="category-map-chevron size-4" aria-hidden="true" />
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {showMap && (
            <motion.div
              key="category-map"
              id="category-map"
              role="region"
              aria-label={t("خريطة الأقسام")}
              onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeMap(); } }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, y: 0, scale: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 28, mass: 0.9 }}
              className="overflow-hidden"
            >
              <div className="mt-8"><CategoryMap /></div>
              <div className="category-map-footer">
                <IconButton variant="mapClose" label={t("إغلاق خريطة الأقسام")} tooltipSide="top" onClick={closeMap} aria-controls="category-map">
                  <X aria-hidden="true" />
                </IconButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Reveal className="mb-8 flex justify-center">
          <div role="tablist" className="grid w-full max-w-md grid-cols-4 gap-1 overflow-hidden rounded-full border border-border bg-card p-1">
            {tabs.map(([l], i) => (
              <Button variant="ghost" key={l} role="tab" aria-selected={i === tab} onClick={() => setTab(i)} className={`relative min-w-0 truncate whitespace-nowrap rounded-full px-1 py-2 text-xs font-bold sm:px-3 sm:text-sm transition-colors ${i === tab ? "text-primary-foreground hover:text-primary-foreground" : "hover:text-accent"}`}>
                {i === tab && <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative">{t(l)}</span>
              </Button>
            ))}
          </div>
        </Reveal>
        {products === null ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />)}</div>
        ) : (
          <Stagger key={tab} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5">{products.map((p) => <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>)}</Stagger>
        )}
        <Reveal className="mt-10 text-center"><Button asChild variant="outline"><Link to="/shop">{t("عرض كل المنتجات")}</Link></Button></Reveal>
      </section>

      <Stagger className="mx-auto mt-16 grid max-w-[1400px] gap-4 px-4 sm:mt-20 sm:grid-cols-3 sm:gap-6 sm:px-6">
        {[[Truck, "شحن لكل مصر", "توصيل لجميع المحافظات"], [Gift, "تغليف هدايا", "جاهزة تتهادى على طول"], [ShieldCheck, "استبدال سهل", "خلال 14 يوم من الاستلام"]].map(([I, T, d]) => {
          const Icon = I as typeof Truck;
          return (
            <StaggerItem key={T as string}>
              <motion.div whileHover={{ y: -4 }} className="flex h-full min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <Icon className="size-8 shrink-0 text-accent" />
                <div className="min-w-0"><p className="font-black">{t(T as string)}</p><p className="text-sm text-muted-foreground">{t(d as string)}</p></div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <FeedbackSection />
    </>
  );
}
