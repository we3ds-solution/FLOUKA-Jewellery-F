import { Heart, Minus, Plus, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/stores/cart";
import { useCompare } from "@/stores/compare";
import { useWishlist } from "@/stores/wishlist";
import { CompareIcon } from "../compare-icon";

type Variant = ShopifyProduct["variants"]["edges"][number]["node"];

// SRP: purchase actions only — quantity, add-to-cart, wishlist, compare.
// Owns its store subscriptions so the route stays a thin composition.
export function PurchasePanel({
  product,
  variant,
  qty,
  onQty,
}: {
  product: ShopifyProduct;
  variant: Variant | undefined;
  qty: number;
  onQty: (qty: number) => void;
}) {
  const add = useCart((s) => s.addItem);
  const busy = useCart((s) => s.busy);
  const wish = useWishlist();
  const compare = useCompare();
  const liked = wish.items.some((i) => i.id === product.id);

  return (
    <>
      <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
        <div className="flex items-center rounded-full border border-border">
          <Button size="icon" variant="ghost" onClick={() => onQty(qty + 1)} aria-label="زيادة">
            <Plus className="size-4" />
          </Button>
          <motion.span
            key={qty}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="w-6 text-center font-bold sm:w-8"
          >
            {qty}
          </motion.span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onQty(Math.max(1, qty - 1))}
            aria-label="تقليل"
          >
            <Minus className="size-4" />
          </Button>
        </div>
        <motion.div whileTap={{ scale: 0.97 }} className="min-w-0">
          <Button
            variant="accent"
            className="w-full"
            disabled={!variant || busy || !variant.availableForSale}
            onClick={() =>
              variant &&
              add({
                product,
                variantId: variant.id,
                variantTitle: variant.title,
                price: variant.price,
                quantity: qty,
                selectedOptions: variant.selectedOptions,
              })
            }
          >
            <span className="truncate">
              {variant?.availableForSale === false ? "غير متوفر" : "أضيفي للسلة"}
            </span>
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.85 }}>
          <Button
            size="icon"
            variant="outline"
            onClick={() => wish.toggle(product)}
            aria-label="المفضلة"
          >
            <Heart className={liked ? "size-5 fill-accent text-accent" : "size-5"} />
          </Button>
        </motion.div>
      </div>
      <Button variant="ghost" className="mt-4" onClick={() => compare.add(product)}>
        <CompareIcon className="size-5" />
        مقارنة المنتجات
      </Button>
      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Truck className="size-4 shrink-0" /> شحن لجميع محافظات مصر
      </p>
    </>
  );
}
