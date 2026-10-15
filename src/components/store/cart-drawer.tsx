// SRP: cart drawer only. Moved out of site-shell so header/footer changes
// never touch cart rendering. Props keep it controlled by the shell.
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/shopify";
import { useLang, useT } from "@/lib/i18n";
import { useCart } from "@/stores/cart";
import { LordIcon } from "./lord-icon";

export function CartDrawer({ open, setOpen }: { open: boolean; setOpen(v: boolean): void }) {
  const t = useT(),
    lang = useLang((s) => s.lang);
  const items = useCart((s) => s.items),
    busy = useCart((s) => s.busy),
    update = useCart((s) => s.updateQuantity),
    remove = useCart((s) => s.removeItem),
    url = useCart((s) => s.checkoutUrl);
  const total = items.reduce((a, b) => a + Number(b.price.amount) * b.quantity, 0);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        className="w-full gap-0 p-0 sm:max-w-md"
      >
        <div className="border-b border-border px-6 py-5">
          <SheetTitle className="text-xl font-black">{t("سلة التسوق")}</SheetTitle>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-3 py-3 sm:px-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid h-full place-items-center text-center text-muted-foreground"
            >
              <div>
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-muted"
                >
                  <LordIcon name="bag" size={36} />
                </motion.span>
                <p className="font-bold">{t("سلتك لسه فاضية")}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-3">
              <AnimatePresence initial={false}>
                {items.map((i) => (
                  <motion.div
                    layout
                    key={i.variantId}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60, height: 0 }}
                    className="flex gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3"
                  >
                    <img
                      src={i.product.images.edges[0]?.node.url}
                      alt=""
                      className="size-16 shrink-0 rounded-xl bg-muted object-cover sm:size-20"
                    />
                    <div className="min-w-0 flex-1">
                      <b className="line-clamp-2 text-sm">{i.product.title}</b>
                      <p className="my-1 truncate text-xs text-muted-foreground">
                        {i.variantTitle !== "Default Title" ? i.variantTitle : ""}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <b className="truncate text-sm">{formatCurrency(i.price)}</b>
                        <div className="flex shrink-0 items-center rounded-full border border-border">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            aria-label={t("تقليل")}
                            onClick={() =>
                              i.quantity === 1
                                ? remove(i.variantId)
                                : update(i.variantId, i.quantity - 1)
                            }
                          >
                            {i.quantity === 1 ? (
                              <LordIcon name="trash" size={14} />
                            ) : (
                              <Minus className="size-3" />
                            )}
                          </Button>
                          <motion.span
                            key={i.quantity}
                            initial={{ scale: 1.4 }}
                            animate={{ scale: 1 }}
                            className="w-6 text-center text-sm font-bold"
                          >
                            {i.quantity}
                          </motion.span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            aria-label={t("زيادة")}
                            onClick={() => update(i.variantId, i.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
            <div className="mb-4 flex justify-between text-lg font-black">
              <span>{t("الإجمالي")}</span>
              <span>
                {new Intl.NumberFormat(lang === "en" ? "en-EG" : "ar-EG", {
                  style: "currency",
                  currency: items[0]?.price.currencyCode ?? "EGP",
                  maximumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>
            <Button
              className="w-full"
              size="lg"
              disabled={busy || !url}
              onClick={() => url && window.open(url, "_blank")}
            >
              {t("إتمام الطلب بأمان")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
