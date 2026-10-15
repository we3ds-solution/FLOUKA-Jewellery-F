import { useT } from '@/lib/i18n'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/ui/icon-button'

/** Floating back-to-top button with a scroll-progress ring. Appears after the first screen. */
export function ScrollTop() {
  const t = useT()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
        setVisible(window.scrollY > window.innerHeight * 0.6)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  const toTop = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.querySelector<HTMLElement>('.header-brand')?.focus({ preventScroll: true })
  }
  const c = 2 * Math.PI * 22
  return (
    <div className="scroll-top" data-visible={visible} inert={!visible}>
      <svg className="scroll-top-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="scroll-top-track" />
        <circle cx="24" cy="24" r="22" className="scroll-top-progress" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
      </svg>
      <IconButton variant="header" tooltipSide="top" label={t("للأعلى")} onClick={toTop}><ArrowUp /></IconButton>
    </div>
  )
}
