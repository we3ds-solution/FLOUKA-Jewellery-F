import { useT } from '@/lib/i18n'
import { Link } from '@tanstack/react-router'
import { Heart, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { formatCurrency, type ShopifyProduct } from '@/lib/shopify'
import { useCart } from '@/stores/cart'
import { useWishlist } from '@/stores/wishlist'
import { useCompare } from '@/stores/compare'
import { CompareIcon } from './compare-icon'

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const t = useT()
  const compare = useCompare(), compared = compare.items.some(p => p.id === product.id)
  const wish = useWishlist(), liked = wish.items.some(i => i.id === product.id)
  const add = useCart(s => s.addItem), busy = useCart(s => s.busy)
  const v = product.variants.edges[0]?.node, img = product.images.edges[0]?.node
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-soft">
        <Link to="/product/$handle" params={{ handle: product.handle }}>
          {img
            ? <img src={img.url} alt={img.altText ?? product.title} className="size-full object-cover transition duration-700 group-hover:scale-[1.06]" loading="lazy" />
            : <div className="grid size-full place-items-center text-sm text-muted-foreground">{t("لا توجد صورة")}</div>}
        </Link>
        <motion.div whileTap={{ scale: 0.85 }} className="absolute end-2 top-2 grid gap-2 transition">
          <Button size="icon" variant="outline" className="size-9 rounded-full" aria-label={t("أضف للمفضلة")} aria-pressed={liked} onClick={() => wish.toggle(product)}>
            <Heart aria-hidden="true" className={liked ? 'size-4 fill-accent text-accent' : 'size-4'} />
          </Button>
          <Button size="icon" variant={compared ? 'accent' : 'outline'} className="size-9 rounded-full" aria-label={t(compared ? 'عرض المقارنة' : 'أضف للمقارنة')} aria-pressed={compared} title={t(compared ? 'عرض المقارنة' : 'أضف للمقارنة')} onClick={() => compare.add(product)}><CompareIcon className="size-4" /></Button>
        </motion.div>
        {product.tags.includes('new') && <span className="absolute start-2 top-2 rounded-full bg-background px-2.5 py-1 text-[11px] font-bold">{t("جديد")}</span>}
      </div>
      <div className="pt-3">
        <p className="truncate text-xs text-muted-foreground">{product.productType || t('إكسسوارات')}</p>
        <Link to="/product/$handle" params={{ handle: product.handle }} className="mt-1 block truncate text-sm font-bold hover:text-accent sm:text-base">{product.title}</Link>
        {!!product.family?.length && (
          <div className="mt-1.5 flex items-center gap-1" aria-label={`${product.family.length} اختيارات`}>
            {[...new Map(product.family.filter(f => f.swatch).map(f => [f.swatch, f])).values()].slice(0, 5).map(f => (
              <span key={f.handle} title={f.color ?? ''} className="size-3 rounded-full border border-border" style={{ background: f.swatch ?? undefined }} />
            ))}
            <span className="text-[11px] text-muted-foreground">{product.family.length} {t('اختيارات')}</span>
          </div>
        )}
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <span className="truncate text-sm font-extrabold sm:text-base">{formatCurrency(product.priceRange.minVariantPrice)}</span>
          <motion.div whileTap={{ scale: 0.85 }} className="shrink-0">
            <Button size="icon" variant="outline" className="size-9 rounded-full" aria-label={t("أضف للسلة")} disabled={!v || busy || !v.availableForSale} onClick={() => v && add({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions })}>
              <Plus aria-hidden="true" className="size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}
