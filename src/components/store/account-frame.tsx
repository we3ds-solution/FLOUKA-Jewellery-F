import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount } from '@/stores/account'

const nav = [
  { to: '/account', label: 'نظرة عامة', icon: LayoutDashboard, exact: true },
  { to: '/account/orders', label: 'طلباتي', icon: Package },
  { to: '/account/addresses', label: 'العناوين', icon: MapPin },
  { to: '/wishlist', label: 'المفضلة', icon: Heart },
  { to: '/account/details', label: 'بيانات الحساب', icon: UserRound },
  { to: '/account/settings', label: 'الإعدادات', icon: Settings },
] as const

export function AccountFrame({ children, current }: { children: ReactNode; current?: string }) {
  const profile = useAccount(s => s.profile)
  const logout = useAccount(s => s.logout)
  const navigate = useNavigate()
  const path = useRouterState({ select: s => s.location.pathname })
  if (!profile) return null
  return <div className="account-page">
    <nav className="account-crumbs" aria-label="مسار الصفحة"><Link to="/">الرئيسية</Link><span>/</span>{current ? <><Link to="/account">حسابي</Link><span>/</span><span>{current}</span></> : <span>حسابي</span>}</nav>
    <div className="account-grid">
      <aside className="account-side" aria-label="قائمة الحساب">
        <div className="account-side-user"><span className="account-chip account-chip-lg">{profile.name.charAt(0)}</span><div className="min-w-0"><b className="block truncate">{profile.name}</b><span className="block truncate text-xs text-muted-foreground" dir="ltr">{profile.email}</span></div></div>
        <ul className="account-nav">
          {nav.map(n => { const active = 'exact' in n ? path === n.to || path === n.to + '/' : path.startsWith(n.to)
            return <li key={n.to}><Link to={n.to} data-active={active} aria-current={active ? 'page' : undefined}><n.icon className="size-4" />{n.label}</Link></li> })}
          <li><Button variant="ghost" onClick={() => { logout(); void navigate({ to: '/', replace: true }) }}><LogOut className="size-4" />تسجيل الخروج</Button></li>
        </ul>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  </div>
}