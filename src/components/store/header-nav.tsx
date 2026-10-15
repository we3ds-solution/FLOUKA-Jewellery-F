import { useT } from '@/lib/i18n'
import { Link } from '@tanstack/react-router'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUpLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { childrenOf, CATEGORY_TREE } from '@/lib/category-tree'
import { CATEGORIES } from '@/lib/categories'
import categoryImages from '@/assets/header/category-images.json'

type NavItem = { label: string; href: string; category?: number; children?: { label: string; href: string }[] }
const categoryLink = (id: number) => `/category/c${id}`
export const HEADER_NAV: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'UP TO 50%', href: '/offers' },
  { label: 'سلاسل', href: '/category/necklaces', category: 207 },
  { label: 'أساور', href: '/category/bracelets', category: 209 },
  { label: 'حلقان', href: '/category/earrings', category: 255 },
  { label: 'خلخال', href: '/category/anklets' },
  { label: 'خواتم', href: '/category/rings', category: 262 },
  { label: 'بيرسينج', href: categoryLink(302) },
  { label: 'مداليا', href: categoryLink(293) },
  { label: 'اطفال', href: '/category/kids', category: 309 },
  { label: 'منتجات أخرى', href: '/shop', children: CATEGORY_TREE.filter(c => c.parent === 0 && [328,661,308,334,322,333,335,578,271,337].includes(c.id)).map(c => ({label:c.name,href:categoryLink(c.id)})) },
  { label: 'عن فلوكة', href: '/about-us', children: [{label:'عن فلوكة',href:'/about-us'},{label:'تواصل معنا',href:'/contact'},{label:'الأسئلة الشائعة',href:'/faq'},{label:'الاستبدال والاسترجاع',href:'/returns'},{label:'تتبع الطلب',href:'/order-tracking'},{label:'سياسة الخصوصية',href:'/privacy-policy'},{label:'الشروط والأحكام',href:'/terms-and-conditions'}] },
]

export function HeaderNav({ path, mobile = false, onNavigate }: { path: string; mobile?: boolean; onNavigate?: () => void }) {
  const t = useT()
  const [expanded, setExpanded] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()
  const photos: Record<string, string> = categoryImages
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  const closeLater = () => { cancelClose(); closeTimer.current = setTimeout(() => setExpanded(null), 160) }
  useEffect(() => {
    setExpanded(null)
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !navRef.current?.contains(event.target)) setExpanded(null) }
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('pointerdown', outside); if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [path])
  const navigate = () => { cancelClose(); setExpanded(null); onNavigate?.() }
  function keyboard(event: KeyboardEvent<HTMLDivElement>, label: string) {
    if (event.key === 'Escape') {
      event.preventDefault(); cancelClose(); setExpanded(null)
      event.currentTarget.querySelector<HTMLButtonElement>('.nav-disclosure')?.focus()
    }
    if (event.key === 'ArrowDown' && event.target instanceof Element && event.target.closest('.nav-entry-row')) {
      event.preventDefault(); cancelClose(); setExpanded(label)
      const entry = event.currentTarget
      requestAnimationFrame(() => entry.querySelector<HTMLAnchorElement>('.nav-submenu a')?.focus())
    }
  }
  return <nav ref={navRef} aria-label={t(mobile ? 'القائمة الرئيسية للجوال' : 'القائمة الرئيسية')} className={mobile ? 'mobile-navigation' : 'desktop-navigation'}>
    {HEADER_NAV.map((item, index) => {
      const children = item.children ?? (item.category ? childrenOf(item.category).map(c => ({label:c.name,href:categoryLink(c.id)})) : [])
      const isOpen = expanded === item.label
      const photo = photos[String(item.category)] ?? CATEGORIES.find(c => item.href.endsWith(c.slug))?.img
      const submenuId = `${id}-${index}`
      const active = path === item.href || children.some(child => child.href === path)
      return <div key={item.label} className={`nav-entry ${isOpen ? 'is-open' : ''} ${active ? 'is-active' : ''}`}
        onPointerEnter={event => { if (!mobile && event.pointerType === 'mouse') { cancelClose(); setExpanded(children.length ? item.label : null) } }}
        onPointerLeave={event => { if (!mobile && event.pointerType === 'mouse') closeLater() }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeLater() }}
        onFocus={cancelClose} onKeyDown={event => keyboard(event, item.label)}>
        <div className="nav-entry-row">
          <Button asChild variant="navigation"><Link to={item.href} onClick={navigate} aria-current={path === item.href ? 'page' : undefined}>{t(item.label)}</Link></Button>
          {children.length > 0 && <Button variant="navDisclosure" size="icon" aria-label={`${t('أقسام')} ${t(item.label)}`} aria-controls={submenuId} aria-expanded={isOpen} onClick={() => { cancelClose(); setExpanded(isOpen ? null : item.label) }}><ChevronDown /></Button>}
        </div>
        {children.length > 0 && <div id={submenuId} className={`nav-submenu ${photo ? 'has-photo' : ''}`} aria-hidden={!isOpen} inert={!isOpen}>
          <div className="nav-submenu-inner">
            <div className="nav-submenu-links">{children.map(child => {
              const childPhoto = photos[child.href.replace('/category/c', '')]
              return <Button asChild variant="submenu" key={child.href}><Link to={child.href} onClick={navigate} aria-current={path === child.href ? 'page' : undefined}>
                {childPhoto && <img className="submenu-thumbnail" src={childPhoto} alt="" loading="lazy" width="56" height="56" />}
                <span>{t(child.label)}</span><ArrowUpLeft className="submenu-arrow" />
              </Link></Button>
            })}</div>
            {photo && <Link className="submenu-feature" to={item.href} onClick={navigate}><div className="submenu-feature-image"><img src={photo} alt={t(item.label)} loading="lazy" width="280" height="240" /></div><span>{t(item.label)}<ArrowUpLeft /></span></Link>}
          </div>
        </div>}
      </div>
    })}
  </nav>
}