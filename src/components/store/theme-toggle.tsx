import { useT } from '@/lib/i18n'
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { IconButton } from "@/components/ui/icon-button";

export function ThemeToggle({ tooltipSide = "bottom" }: { tooltipSide?: "top" | "bottom" | "left" | "right" }) {
  const t = useT();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      setDark(root.classList.contains("dark"));
      const color = getComputedStyle(root).getPropertyValue("--header").trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    const root = document.documentElement;
    root.style.setProperty("--tx", `${e.clientX}px`);
    root.style.setProperty("--ty", `${e.clientY}px`);
    const apply = () => {
      root.classList.toggle("dark", next);
      try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Theme still switches when storage is unavailable. */ }
      setDark(next);
    };
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) d.startViewTransition(apply);
    else apply();
  };

  return (
    <IconButton variant="header" tooltipSide={tooltipSide} onClick={toggle} label={t(dark ? 'الوضع الفاتح' : 'الوضع الداكن')} aria-pressed={dark} className="relative overflow-hidden">
      <Sun className={`size-5 transition-all duration-500 ${dark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute size-5 transition-all duration-500 ${dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
    </IconButton>
  );
}
