import { IconButton } from '@/components/ui/icon-button'
import { useLang, useT } from '@/lib/i18n'

export function LangToggle({ tooltipSide = 'bottom' }: { tooltipSide?: 'top' | 'bottom' | 'left' | 'right' }) {
  const lang = useLang(s => s.lang), setLang = useLang(s => s.setLang)
  const t = useT()
  const next = lang === 'ar' ? 'en' : 'ar'
  const switchLang = () => {
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    const apply = () => setLang(next)
    if (d.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) d.startViewTransition(apply)
    else apply()
  }
  return (
    <IconButton variant="header" tooltipSide={tooltipSide} onClick={switchLang} label={`${t('تغيير اللغة')} · ${next === 'en' ? 'English' : 'العربية'}`} className="relative">
      <span className="text-[11px] font-black leading-none" aria-hidden="true">
        {next === 'en' ? 'EN' : 'ع'}
      </span>
    </IconButton>
  )
}
