import { AnimatedIcon } from './animated-icon'
import { cn } from '@/lib/utils'
import { siInstagram, siFacebook, siYoutube, siTiktok } from 'simple-icons'
import instagram from '@/assets/icons/instagram.json.asset.json'
import facebook from '@/assets/icons/facebook.json.asset.json'
import tiktok from '@/assets/icons/tiktok.json.asset.json'
import youtube from '@/assets/icons/youtube.json.asset.json'

// Free LottieFiles social icons (Lottie Simple License), played on hover.
const SOCIAL_ICONS = {
  instagram: instagram.url, facebook: facebook.url, tiktok: tiktok.url, youtube: youtube.url,
} as const

export type SocialIconName = keyof typeof SOCIAL_ICONS

const fallbacks = { instagram: siInstagram, facebook: siFacebook, youtube: siYoutube, tiktok: siTiktok }

export function SocialIcon({
  name,
  className,
  size = 22,
  animated = true,
}: {
  name: SocialIconName
  className?: string
  size?: number
  animated?: boolean
}) {
  const logo = fallbacks[name]
  if (!animated) return <span className={cn('animated-icon footer-social-logo', className)} data-icon={name} aria-hidden="true"><span className="animated-icon-fallback"><svg viewBox="0 0 24 24" fill="currentColor"><path d={logo.path} /></svg></span></span>
  return <AnimatedIcon src={SOCIAL_ICONS[name]} name={name} size={size} className={className} restAtEnd restFrame={name === 'youtube' ? 61 : undefined} fallback={<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={logo.path} /></svg>} />
}
