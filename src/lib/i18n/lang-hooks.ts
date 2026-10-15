// SRP: React bindings for language — translator hook, dir hook,
// hydration bootstrap, and the pre-paint boot script.
// State lives in lang-store, data in dictionary, DOM in lang-dom.
import { useEffect } from "react";
import { translate } from "./dictionary";
import { applyDocLang } from "./lang-dom";
import { useLang } from "./lang-store";

/** Returns a translator bound to the current language. Pass the Arabic source text. */
export function useT() {
  const lang = useLang((s) => s.lang);
  return (s: string) => translate(lang, s);
}

/** Mount once: restores the saved language after hydration. */
export function useLangBootstrap() {
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("lang");
    } catch {
      /* ignore */
    }
    if (saved === "en" || saved === "ar") {
      applyDocLang(saved);
      useLang.setState({ lang: saved });
    }
  }, []);
}

/** Script injected in <head> so dir/lang are correct before first paint. */
export const LANG_BOOT_SCRIPT =
  "try{var l=localStorage.lang;if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr'}}catch(e){}";

/** Current text direction for the active language. */
export function useDir(): "rtl" | "ltr" {
  return useLang((s) => s.lang) === "ar" ? "rtl" : "ltr";
}
