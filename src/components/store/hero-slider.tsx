import { useT, useLang } from '@/lib/i18n'
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { HERO_INTERVAL, HERO_SLIDES, nextHeroSlide } from '@/lib/hero-slides';

export function HeroSlider() {
  const t = useT()
  const lang = useLang(state => state.lang)
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = hydrated && prefersReducedMotion;
  const touchStart = useRef<number | null>(null);

  const slide = HERO_SLIDES[active] ?? HERO_SLIDES[0];
  const [manualPlay, setManualPlay] = useState(false);
  const playing = !paused && !interacting && !hidden && (!reduceMotion || manualPlay);

  useEffect(() => {
    setHydrated(true);
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 0));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive(value => nextHeroSlide(value, 1)), HERO_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, playing]);


  return (
    <div className="hero-layout">
    <section className="collection-hero" data-scrolled={scrolled} aria-label={t("تشكيلات فلوكة")} aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setActive(value => nextHeroSlide(value, (event.key === 'ArrowLeft') === (lang === 'ar') ? 1 : -1)); }
      }}
      onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={event => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) setActive(value => nextHeroSlide(value, (end > (touchStart.current ?? end)) === (lang === 'ar') ? 1 : -1));
        touchStart.current = null;
      }}>
      <div className="hero-scenes" aria-hidden="true">
        {HERO_SLIDES.map((item, index) => <div key={item.id} className="hero-scene" data-active={index === active}>
          <img src={item.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} width={item.width} height={item.height} decoding="async" />
        </div>)}
      </div>
      <div className="hero-cinema-shade" />
      <div className="hero-copy" key={slide.id} aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <p className="hero-eyebrow">{slide.eyebrow}</p>
        <h1><span>{t(slide.title).split(" — ")[0]}</span>{t(slide.title).includes(" — ") && <span className="hero-title-accent">{t(slide.title).split(" — ").slice(1).join(" — ")}</span>}</h1>
        <p className="hero-description">{t(slide.description)}</p>
        <div className="hero-links"><Button asChild variant="hero" size="lg"><Link to="/category/$slug" params={{ slug: slide.category }}>{t(slide.action)}<ArrowLeft className="size-5 ltr:-scale-x-100" /></Link></Button><Button asChild variant="heroSecondary" size="lg"><Link to="/shop">{t("كل المنتجات")}<ArrowUpRight className="size-4" /></Link></Button></div>
      </div>
      <div className="hero-bottom" dir="ltr">
        <span className="hero-counter"><b>{String(active + 1).padStart(2, '0')}</b><span>/ {String(HERO_SLIDES.length).padStart(2, '0')}</span></span>
        <div className="hero-playback">
          <span className="hero-progress-track" aria-hidden="true"><span key={`${active}-${playing}`} className="hero-slide-progress" data-playing={playing} /></span>
          <Button variant="heroControl" size="icon" aria-label={t("التشكيلة السابقة")} title={t("التشكيلة السابقة")} onClick={() => setActive(value => nextHeroSlide(value, -1))}><ChevronLeft /></Button>
          <div className="hero-dots" aria-label={t("اختيار التشكيلة")}>
            {HERO_SLIDES.map((item, index) => <Button key={item.id} variant="heroDot" size="icon" aria-label={`${t(item.label)} · ${index + 1} / ${HERO_SLIDES.length}`} title={t(item.label)} aria-pressed={index === active} onClick={() => setActive(index)} />)}
          </div>
          <Button variant="heroControl" size="icon" aria-label={t("التشكيلة التالية")} title={t("التشكيلة التالية")} onClick={() => setActive(value => nextHeroSlide(value, 1))}><ChevronRight /></Button>
          <Button variant="heroControl" size="icon" aria-label={t(playing ? 'إيقاف العرض' : 'تشغيل العرض')} title={t(playing ? 'إيقاف العرض' : 'تشغيل العرض')} aria-pressed={playing} onClick={() => { if (paused || reduceMotion && !manualPlay) { setPaused(false); setManualPlay(true); } else setPaused(true); }}>{paused || reduceMotion && !manualPlay ? <Play /> : <Pause />}</Button>
        </div>
      </div>
    </section>
    </div>
  );
}
