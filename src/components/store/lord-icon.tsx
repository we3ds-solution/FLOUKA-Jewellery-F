import { Heart, ShoppingCart, ShoppingBag, Search, UserRound, Trash2, Menu } from 'lucide-react'
import { AnimatedIcon } from './animated-icon'
import heart from '@/assets/icons/heart.json.asset.json'
import cart from '@/assets/icons/cart.json.asset.json'
import bag from '@/assets/icons/bag.json.asset.json'
import search from '@/assets/icons/search.json.asset.json'
import user from '@/assets/icons/user.json.asset.json'
import trash from '@/assets/icons/trash.json.asset.json'
import menu from '@/assets/icons/menu.json.asset.json'

// Free Lordicon animated icons (wired style), loaded from the Lordicon CDN.
// They animate on hover via trigger="hover".
export const LORD_ICONS = {
  heart: heart.url, cart: cart.url, bag: bag.url, search: search.url,
  user: user.url, trash: trash.url, menu: menu.url,
} as const

export type LordIconName = keyof typeof LORD_ICONS

const fallbacks = { heart: Heart, cart: ShoppingCart, bag: ShoppingBag, search: Search, user: UserRound, trash: Trash2, menu: Menu }

export function LordIcon({
  name,
  className,
  size = 22,
}: {
  name: LordIconName
  className?: string
  size?: number
}) {
  const Fallback = fallbacks[name]
  return <AnimatedIcon src={LORD_ICONS[name]} name={name} size={size} className={className} monochrome fallback={<Fallback />} />
}
