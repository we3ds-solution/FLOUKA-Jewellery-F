// SRP: DOM side-effect only — applies language direction to <html>.
// Kept separate so the store and hooks stay testable without a document.
import type { Lang } from "./dictionary";

export function applyDocLang(lang: Lang) {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
}
