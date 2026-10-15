import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import type { AnimationItem } from 'lottie-web'
import { cn } from '@/lib/utils'
import { hoverSegment, loadAnimationData, prepareAnimation } from '@/lib/icon-animation'

let playerPromise: Promise<typeof import('lottie-web').default> | undefined
function getPlayer() {
  playerPromise ??= import('lottie-web/build/player/lottie_light').then(module => module.default).catch(error => { playerPromise = undefined; throw error })
  return playerPromise
}

export function AnimatedIcon({ src, name, size, className, fallback, monochrome = false, restAtEnd = false, restFrame }: {
  src: string; name: string; size: number; className?: string | undefined; fallback: ReactNode; monochrome?: boolean; restAtEnd?: boolean; restFrame?: number | undefined
}) {
  const host = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const element = host.current
    const canvas = element?.querySelector<HTMLElement>('.animated-icon-art')
    if (!element || !canvas) return
    setReady(false)
    let disposed = false
    let animation: AnimationItem | undefined
    let removeEvents = () => {}
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let loading = false
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) { animation?.pause(); return }
      if (animation || loading) return
      loading = true
      void Promise.all([getPlayer(), loadAnimationData(src)]).then(([player, raw]) => {
        if (disposed) return
        const data = prepareAnimation(raw)
        const segment = hoverSegment(data)
        animation = player.loadAnimation({ container: canvas, renderer: 'svg', loop: false, autoplay: false, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } })
        const item = animation
        const stop = () => { item.resetSegments(true); item.goToAndStop(restFrame ?? (restAtEnd ? segment[1] : segment[0]), true); element.dataset['playing'] = 'false' }
        const play = () => {
          if (motion.matches || document.hidden) return
          item.playSegments(restAtEnd ? [Math.min(segment[0] + 1, segment[1]), segment[1]] : segment, true)
          element.dataset['playing'] = 'true'
        }
        item.addEventListener('DOMLoaded', () => {
          stop()
          if (!monochrome && !restAtEnd) {
            canvas.querySelectorAll('path').forEach(path => {
              for (const paint of ['fill', 'stroke']) {
                const value = path.getAttribute(paint)
                const channels = value?.match(/[\d.]+/g)?.map(Number)
                if (!channels || channels.length < 3) continue
                const [red = 0, green = 0, blue = 0] = channels
                let token = ''
                if (name === 'instagram') token = '--social-instagram'
                else if (red > 240 && green > 240 && blue > 240) token = name === 'tiktok' ? '--social-ink' : '--social-on-brand'
                else if (name === 'facebook') token = '--social-facebook'
                else if (name === 'youtube') token = '--social-youtube'
                else if (name === 'tiktok') token = red > green ? '--social-tiktok-red' : '--social-tiktok-cyan'
                if (token) path.style.setProperty(paint, `var(${token})`)
              }
            })
          }
          // Never replace a visible fallback with a blank/invalid animation.
          const svg = canvas.querySelector('svg')
          const bounds = svg?.getBBox()
          const width = Number(data['w'])
          const height = Number(data['h'])
          const valid = bounds && Number.isFinite(bounds.width) && Number.isFinite(bounds.height) && bounds.width > 0 && bounds.height > 0 && bounds.width <= width * 2 && bounds.height <= height * 2
          if (valid && svg) {
            const padding = Math.max(bounds.width, bounds.height) * .08
            svg.setAttribute('viewBox', `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`)
          }
          setReady(Boolean(valid))
        })
        item.addEventListener('data_failed', () => setReady(false))
        item.addEventListener('error', () => setReady(false))
        item.addEventListener('complete', stop)
        const target = element.closest('button, a, [role="button"]') ?? element
        const visibility = () => { if (document.hidden) stop() }
        target.addEventListener('pointerenter', play)
        target.addEventListener('focus', play)
        target.addEventListener('pointerleave', stop)
        target.addEventListener('blur', stop)
        document.addEventListener('visibilitychange', visibility)
        motion.addEventListener('change', stop)
        removeEvents = () => {
          target.removeEventListener('pointerenter', play); target.removeEventListener('focus', play)
          target.removeEventListener('pointerleave', stop); target.removeEventListener('blur', stop)
          document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', stop)
        }
      }).catch(() => { loading = false; /* Keep the visible static icon on network failure. */ })
    }, { rootMargin: '100px' })
    observer.observe(element)
    return () => { disposed = true; observer.disconnect(); removeEvents(); animation?.destroy(); element.dataset['playing'] = 'false' }
  }, [src, name, monochrome, restAtEnd, restFrame])
  return <span ref={host} aria-hidden="true" data-icon={name} data-ready={ready} className={cn('animated-icon', monochrome && 'animated-icon-monochrome', className)} style={{ '--icon-size': `${size}px` } as CSSProperties}>
    <span className="animated-icon-fallback">{fallback}</span>
    <span className="animated-icon-art" />
  </span>
}