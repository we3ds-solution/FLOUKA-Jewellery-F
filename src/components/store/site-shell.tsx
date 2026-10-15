import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { ArrowUpLeft, Heart, Minus, Plus } from 'lucide-react'
import { SocialIcon } from '@/components/store/social-icon'
import { LordIcon } from '@/components/store/lord-icon'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { formatCurrency } from '@/lib/shopify'
import { useCart } from '@/stores/cart'
import { ThemeToggle } from './theme-toggle'
import { LangToggle } from './lang-toggle'
import { useT, useLang, useLangBootstrap } from '@/lib/i18n'
import { PageFade } from './motion'
import { AccountDialog } from './account-dialog'
import { AccountButton } from './account-button'
import { NotificationButton } from './notification-button'
import { useAccount } from '@/stores/account'
import { useCompare } from '@/stores/compare'
import { HeaderNav } from './header-nav'
import { ScrollTop } from './scroll-top'
import { CookieNotice, openCookieSettings } from './cookie-notice'
import logoAsset from '@/assets/floukaa-header-logo.png.asset.json'
import { CompareIcon } from './compare-icon'
import { ComparePanel } from './compare-panel'
import { PaymentMarks } from './payment-marks'
import { copyrightYear } from '@/lib/footer'

export function SiteShell({ children }: { children: ReactNode }) {
  useLangBootstrap()
  const t = useT(), lang = useLang(s => s.lang)
  const setAccountOpen = useAccount(s => s.setDialogOpen)
  useEffect(() => { void useAccount.persist.rehydrate() }, [])
  const [scrolled, setScrolled] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const compareCount = useCompare(s => s.items.length)
  const setCompareOpen = useCompare(s => s.setOpen)
  const [menu, setMenu] = useState(false), [searchOpen, setSearchOpen] = useState(false)
  const r = useRouter(), path = useRouterState({ select: s => s.location.pathname })
  const items = useCart(s => s.items), open = useCart(s => s.drawerOpen), setOpen = useCart(s => s.setDrawerOpen), sync = useCart(s => s.syncCart)
  const count = items.reduce((a, b) => a + b.quantity, 0)
  useEffect(() => { void sync(); const vis = () => document.visibilityState === 'visible' && void sync(); document.addEventListener('visibilitychange', vis); return () => document.removeEventListener('visibilitychange', vis) }, [sync])
  useEffect(() => { setSearchOpen(false); setMenu(false) }, [path])
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1100px)')
    const updateScreen = () => setDesktop(media.matches)
    let frame = 0
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(previous => window.scrollY > (previous ? 48 : 160)))
    }
    updateScreen(); updateScroll()
    media.addEventListener('change', updateScreen)
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', updateScreen); window.removeEventListener('scroll', updateScroll) }
  }, [])
  useEffect(() => { if (scrolled && desktop) setSearchOpen(false) }, [scrolled, desktop])
  const onSearch = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); void r.navigate({ to: '/search', search: { q: String(q ?? '') } }) }
  const searchForm = (cls: string) => (
    <form onSubmit={onSearch} className={`items-center rounded-full border border-input bg-card p-1 text-card-foreground ${cls}`}>
      <input name="q" className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder={t("إنتِ بتدوري على إيه؟")} />
      <Button size="icon" className="shrink-0 rounded-full" aria-label={t("بحث")}><LordIcon name="search" size={16} /></Button>
    </form>
  )
  return (
    <div className={`site-shell flex min-h-screen flex-col overflow-x-clip bg-background ${path === "/" ? "site-shell-home" : ""}`}>
      <TooltipProvider>
      <header className={`floukaa-header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-top" inert={scrolled && desktop} aria-hidden={scrolled && desktop ? true : undefined}>
          <div className="header-actions">
            <IconButton variant="header" className="mobile-menu-trigger" onClick={() => setMenu(true)} label={t("القائمة")} showTooltip={false}><LordIcon name="menu" /></IconButton>
            <IconButton variant="header" label={t("بحث")} aria-expanded={searchOpen} onClick={() => setSearchOpen(v => !v)}><LordIcon name="search" /></IconButton>
            <IconButton variant="header" className="desktop-action relative" label={t("مقارنة المنتجات")} onClick={() => setCompareOpen(true)}><CompareIcon />{compareCount > 0 && <span className="header-count">{compareCount}</span>}</IconButton>
            <IconButton asChild variant="header" className="desktop-action" label={t("المفضلة")}><Link to="/wishlist"><LordIcon name="heart" /></Link></IconButton>
            <IconButton variant="header" className="relative" onClick={() => setOpen(true)} label={t("السلة")}><LordIcon name="cart" />{count > 0 && <span className="header-count">{count}</span>}</IconButton>
            <AccountButton className="desktop-action" />
            <NotificationButton className="desktop-action" />
          </div>
          <Link to="/" className="header-brand" aria-label={t("فلوكة — الرئيسية")}><img src={logoAsset.url} width="513" height="637" alt="FLOUKAA" /></Link>
          <div className="header-social">
            <NotificationButton className="mobile-notification-trigger" />
            <IconButton asChild variant="header" className="social-link" label="TikTok"><a href="https://www.tiktok.com/@flouka_" target="_blank" rel="noopener noreferrer"><SocialIcon name="tiktok" /></a></IconButton>
            <IconButton asChild variant="header" className="social-link" label="YouTube"><a href="https://www.youtube.com/@flouka2214" target="_blank" rel="noopener noreferrer"><SocialIcon name="youtube" /></a></IconButton>
            <IconButton asChild variant="header" className="social-link" label="Instagram"><a href="https://www.instagram.com/flouka_/" target="_blank" rel="noopener noreferrer"><SocialIcon name="instagram" /></a></IconButton>
            <IconButton asChild variant="header" className="social-link" label="Facebook"><a href="https://www.facebook.com/FLOUKA10/" target="_blank" rel="noopener noreferrer"><SocialIcon name="facebook" /></a></IconButton>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="header-search-panel">
              <div className="mx-auto max-w-xl p-3">{searchForm('flex')}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="header-navigation"><HeaderNav path={path} /></div>
      </header>
      {/* Side rail: slides in from the right edge exactly when the top header hides. */}
      <nav className="header-rail" data-visible={scrolled && desktop} inert={!(scrolled && desktop)} aria-hidden={scrolled && desktop ? undefined : true} aria-label={t("اختصارات")}>
        <IconButton variant="header" tooltipSide="left" label={t("بحث")} onClick={() => void r.navigate({ to: '/search', search: { q: '' } })}><LordIcon name="search" /></IconButton>
        <IconButton variant="header" tooltipSide="left" className="relative" label={t("مقارنة المنتجات")} onClick={() => setCompareOpen(true)}><CompareIcon />{compareCount > 0 && <span className="header-count">{compareCount}</span>}</IconButton>
        <IconButton asChild variant="header" tooltipSide="left" label={t("المفضلة")}><Link to="/wishlist"><LordIcon name="heart" /></Link></IconButton>
        <IconButton variant="header" tooltipSide="left" className="relative" label={t("السلة")} onClick={() => setOpen(true)}><LordIcon name="cart" />{count > 0 && <span className="header-count">{count}</span>}</IconButton>
        <AccountButton tooltipSide="left" />
        <NotificationButton tooltipSide="left" />
        <span className="header-rail-divider" aria-hidden="true" />
        <LangToggle tooltipSide="left" />
        <ThemeToggle tooltipSide="left" />
      </nav>
      <ScrollTop />
      <CookieNotice />
      </TooltipProvider>
      <main className="flex-1"><PageFade id={path}>{children}</PageFade></main>
      <Footer />
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side={lang === 'ar' ? 'right' : 'left'} aria-describedby={undefined} className="mobile-menu-sheet w-[85vw] max-w-sm gap-0 p-0">
          <div className="border-b border-border px-6 py-5"><SheetTitle className="text-2xl font-black">FLOUKAA</SheetTitle><p className="text-xs font-bold text-accent">{t("فلوكة للإكسسوارات والهدايا")}</p></div>
          <div className="scroll-thin flex-1 overflow-y-auto p-3"><HeaderNav path={path} mobile onNavigate={() => setMenu(false)} /></div>
          <div className="mobile-menu-tools">
            <Button asChild variant="ghost"><Link to="/wishlist"><LordIcon name="heart" />{t("المفضلة")}</Link></Button>
            <Button variant="ghost" onClick={() => { setMenu(false); setCompareOpen(true); }}><CompareIcon />{t("المقارنة")}</Button>
            <Button variant="ghost" onClick={() => { setMenu(false); if (useAccount.getState().signedIn) void r.navigate({ to: '/account' }); else setAccountOpen(true) }}><LordIcon name="user" />{t("حسابي")}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <CartDrawer open={open} setOpen={setOpen} />
      <ComparePanel />
      <AccountDialog />
    </div>
  )
}

function CartDrawer({ open, setOpen }: { open: boolean; setOpen(v: boolean): void }) {
  const t = useT(), lang = useLang(s => s.lang)
  const items = useCart(s => s.items), busy = useCart(s => s.busy), update = useCart(s => s.updateQuantity), remove = useCart(s => s.removeItem), url = useCart(s => s.checkoutUrl)
  const total = items.reduce((a, b) => a + Number(b.price.amount) * b.quantity, 0)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="w-full gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5"><SheetTitle className="text-xl font-black">{t("سلة التسوق")}</SheetTitle></div>
        <div className="scroll-thin flex-1 overflow-y-auto px-3 py-3 sm:px-4">
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid h-full place-items-center text-center text-muted-foreground">
              <div>
                <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-muted"><LordIcon name="bag" size={36} /></motion.span>
                <p className="font-bold">{t("سلتك لسه فاضية")}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-3">
              <AnimatePresence initial={false}>
                {items.map(i => (
                  <motion.div layout key={i.variantId} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60, height: 0 }} className="flex gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3">
                    <img src={i.product.images.edges[0]?.node.url} alt="" className="size-16 shrink-0 rounded-xl bg-muted object-cover sm:size-20" />
                    <div className="min-w-0 flex-1">
                      <b className="line-clamp-2 text-sm">{i.product.title}</b>
                      <p className="my-1 truncate text-xs text-muted-foreground">{i.variantTitle !== 'Default Title' ? i.variantTitle : ''}</p>
                      <div className="flex items-center justify-between gap-2">
                        <b className="truncate text-sm">{formatCurrency(i.price)}</b>
                        <div className="flex shrink-0 items-center rounded-full border border-border">
                          <Button size="icon" variant="ghost" className="size-8" aria-label={t("تقليل")} onClick={() => i.quantity === 1 ? remove(i.variantId) : update(i.variantId, i.quantity - 1)}>{i.quantity === 1 ? <LordIcon name="trash" size={14} /> : <Minus className="size-3" />}</Button>
                          <motion.span key={i.quantity} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-6 text-center text-sm font-bold">{i.quantity}</motion.span>
                          <Button size="icon" variant="ghost" className="size-8" aria-label={t("زيادة")} onClick={() => update(i.variantId, i.quantity + 1)}><Plus className="size-3" /></Button>
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
            <div className="mb-4 flex justify-between text-lg font-black"><span>{t("الإجمالي")}</span><span>{new Intl.NumberFormat(lang === 'en' ? 'en-EG' : 'ar-EG', { style: 'currency', currency: items[0]?.price.currencyCode ?? 'EGP', maximumFractionDigits: 0 }).format(total)}</span></div>
            <Button className="w-full" size="lg" disabled={busy || !url} onClick={() => url && window.open(url, '_blank')}>{t("إتمام الطلب بأمان")}</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="floukaa-footer">
      <div className="footer-main-grid">
        <div className="footer-about">
          <Link to="/" className="footer-brand" aria-label={t("فلوكة — الرئيسية")}><img src={logoAsset.url} width={513} height={637} alt="FLOUKAA" /></Link>
          <p className="footer-about-copy">{t("تفاصيل صغيرة، فرحة كبيرة. اكتشفي سلاسل وأساور وخواتم وإكسسوارات تكمّل إطلالتك، وهدايا تفرّح اللي بتحبيهم.")}</p>
          <ul className="footer-brand-facts"><li>{t("إكسسوارات")}</li><li>{t("هدايا")}</li><li dir="ltr">@flouka_</li></ul>
          <div className="footer-socials" aria-label={t("تابعينا")}>
            <IconButton asChild variant="outline" className="footer-social" label="Instagram"><a href="https://www.instagram.com/flouka_/" target="_blank" rel="noopener noreferrer"><SocialIcon name="instagram" animated={false} /></a></IconButton>
            <IconButton asChild variant="outline" className="footer-social" label="Facebook"><a href="https://www.facebook.com/FLOUKA10/" target="_blank" rel="noopener noreferrer"><SocialIcon name="facebook" animated={false} /></a></IconButton>
            <IconButton asChild variant="outline" className="footer-social" label="TikTok"><a href="https://www.tiktok.com/@flouka_" target="_blank" rel="noopener noreferrer"><SocialIcon name="tiktok" animated={false} /></a></IconButton>
            <IconButton asChild variant="outline" className="footer-social" label="YouTube"><a href="https://www.youtube.com/@flouka2214" target="_blank" rel="noopener noreferrer"><SocialIcon name="youtube" animated={false} /></a></IconButton>
          </div>
        </div>
        <nav className="footer-link-group" aria-label={t("تسوقي")}><h3>{t("اكتشفي فلوكة")}</h3><Link to="/shop">{t("كل المنتجات")}</Link><Link to="/new-arrivals">{t("وصل حديثًا")}</Link><Link to="/best-sellers">{t("الأكثر مبيعًا")}</Link><Link to="/offers">{t("العروض")}</Link><Link to="/wishlist">{t("المفضلة")}</Link></nav>
        <nav className="footer-link-group" aria-label={t("خدمة العملاء")}><h3>{t("دايمًا معاكي")}</h3><Link to="/contact">{t("تواصل معنا")}</Link><Link to="/faq">{t("الأسئلة الشائعة")}</Link><Link to="/returns">{t("الاستبدال والاسترجاع")}</Link><Link to="/order-tracking">تتبع الطلب</Link><Link to="/privacy-policy">سياسة الخصوصية</Link><Link to="/terms-and-conditions">الشروط والأحكام</Link><button type="button" onClick={openCookieSettings} className="text-start">إعدادات ملفات الارتباط</button></nav>
        <div className="footer-subscribe"><h3>{t("خليكي قريبة")}</h3><p>{t("تشكيلات جديدة وقطع مميزة وهدايا لكل مناسبة.")}</p><form onSubmit={e => e.preventDefault()} className="footer-subscribe-form"><label htmlFor="footer-email" className="sr-only">{t("بريدك الإلكتروني")}</label><input id="footer-email" type="email" autoComplete="email" placeholder={t("بريدك الإلكتروني")} /><Button variant="accent" className="footer-subscribe-button">{t("اشتراك")}<ArrowUpLeft className="size-4 ltr:-scale-x-100" /></Button></form></div>
      </div>
      <div className="footer-bottom-strip" dir="ltr">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">© {copyrightYear()} Flouka Store, All Rights Reserved.</p>
          <PaymentMarks />
          <p className="footer-credit">Made With Love <Heart className="footer-love" aria-label="love" /> by <a href="https://m-said-marketplace.vercel.app" target="_blank" rel="noopener noreferrer">M.Said</a></p>
        </div>
      </div>
    </footer>
  )
}
