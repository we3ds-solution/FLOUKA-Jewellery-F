import { Link, useNavigate } from '@tanstack/react-router'
import { LogOut, MapPin, Package, Settings, User, Heart } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LordIcon } from './lord-icon'
import { useAccount } from '@/stores/account'
import { useDir, useT } from '@/lib/i18n'

export function AccountButton({ className, tooltipSide }: { className?: string; tooltipSide?: 'left' | 'bottom' }) {
  const t = useT()
  const dir = useDir()
  const inRail = tooltipSide === 'left'
  const signedIn = useAccount(s => s.hydrated && s.signedIn), profile = useAccount(s => s.profile)
  const setOpen = useAccount(s => s.setDialogOpen), logout = useAccount(s => s.logout)
  const navigate = useNavigate()
  if (!signedIn || !profile) return <IconButton variant="header" className={className} tooltipSide={tooltipSide ?? 'bottom'} label={t("حسابي")} onClick={() => setOpen(true)}><LordIcon name="user" /></IconButton>
  const links = [
    { to: '/account', label: 'حسابي', icon: User },
    { to: '/account/orders', label: 'طلباتي', icon: Package },
    { to: '/account/addresses', label: 'العناوين', icon: MapPin },
    { to: '/wishlist', label: 'المفضلة', icon: Heart },
    { to: '/account/settings', label: 'الإعدادات', icon: Settings },
  ] as const
  return <DropdownMenu dir={dir}>
    <DropdownMenuTrigger asChild>
      <IconButton variant="header" className={className} tooltipSide={tooltipSide ?? 'bottom'} label={t("حسابي")}><span className="account-chip account-trigger-avatar" aria-hidden="true">{profile.name.trim().charAt(0) || '؟'}</span></IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent side={inRail ? 'left' : 'bottom'} align={inRail ? 'center' : 'start'} sideOffset={10} collisionPadding={12} className="account-dropdown">
      <DropdownMenuLabel className="account-dropdown-label"><span className="block font-black">{profile.name}</span><span className="account-dropdown-email block text-xs font-normal text-muted-foreground" dir="ltr">{profile.email}</span></DropdownMenuLabel>
      <DropdownMenuSeparator />
      {links.map(l => <DropdownMenuItem key={l.to} asChild><Link to={l.to}><l.icon className="size-4" />{t(l.label)}</Link></DropdownMenuItem>)}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => { logout(); void navigate({ to: '/', replace: true }) }}><LogOut className="size-4" />{t("تسجيل الخروج")}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
