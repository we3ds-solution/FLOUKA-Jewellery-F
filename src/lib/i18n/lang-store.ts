// SRP: language state + persistence. No dictionary data, no DOM queries,
// no React hooks — persistence and document update only.
import { create } from "zustand";
import type { Lang } from "./dictionary";
import { applyDocLang } from "./lang-dom";

type LangState = { lang: Lang; setLang(l: Lang): void };
export const useLang = create<LangState>((set) => ({
  lang: "ar",
  setLang: (lang) => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* storage unavailable */
    }
    applyDocLang(lang);
    set({ lang });
  },
}));
