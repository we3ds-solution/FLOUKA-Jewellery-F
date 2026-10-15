import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { SocialIcon } from '@/components/store/social-icon'
import { LordIcon } from '@/components/store/lord-icon'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/stores/cart'
import { ThemeToggle } from './theme-toggle'
import { LangToggle } from './lang-toggle'
import { useT, useLang, useLangBootstrap } from '@/lib/i18n'
import { useMediaQuery } from '@/hooks/use-media-query'
import { PageFade } from './motion'
import { AccountDialog } from './account-dialog'
import { AccountButton } from './account-button'
import { NotificationButton } from './notification-button'
import { useAccount } from '@/stores/account'
import { useCompare } from '@/stores/compare'
import { HeaderNav } from './header-nav'
import { ScrollTop } from './scroll-top'
import { CookieNotice } from './cookie-notice'
import logoAsset from '@/assets/floukaa-header-logo.png.asset.json'
import { CompareIcon } from './compare-icon'
import { ComparePanel } from './compare-panel'
import { CartDrawer } from './cart-drawer'
import { SiteFooter } from './site-footer'
import { HEADER_SOCIALS } from './social-links'

export function SiteShell({ children }: { children: ReactNode }) {
  useLangBootstrap()
  const t = useT(), lang = useLang(s => s.lang)
  const setAccountOpen = useAccount(s => s.setDialogOpen)
  useEffect(() => { void useAccount.persist.rehydrate() }, [])
  const [scrolled, setScrolled] = useState(false)
  const desktop = useMediaQuery('(min-width: 1100px)')
  const compareCount = useCompare(s => s.items.length)
  const setCompareOpen = useCompare(s => s.setOpen)
  const [menu, setMenu] = useState(false), [searchOpen, setSearchOpen] = useState(false)
  const r = useRouter(), path = useRouterState({ select: s => s.location.pathname })
  const items = useCart(s => s.items), open = useCart(s => s.drawerOpen), setOpen = useCart(s => s.setDrawerOpen), sync = useCart(s => s.syncCart)
  const count = items.reduce((a, b) => a + b.quantity, 0)
  useEffect(() => { void sync(); const vis = () => document.visibilityState === 'visible' && void sync(); document.addEventListener('visibilitychange', vis); return () => document.removeEventListener('visibilitychange', vis) }, [sync])
  useEffect(() => { setSearchOpen(false); setMenu(false) }, [path])
  useEffect(() => {
    let frame = 0
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(previous => window.scrollY > (previous ? 48 : 160)))
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', updateScroll) }
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
            {HEADER_SOCIALS.map((s) => (
              <IconButton key={s.name} asChild variant="header" className="social-link" label={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer"><SocialIcon name={s.name} /></a></IconButton>
            ))}
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
      <SiteFooter />
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
