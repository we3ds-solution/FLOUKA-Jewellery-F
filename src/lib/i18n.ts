// Barrel: preserves the `@/lib/i18n` import surface.
// dictionary (data) → lang-dom (effect) → lang-store (state) → lang-hooks (React).
export { EN, translate } from "./i18n/dictionary";
export type { Lang } from "./i18n/dictionary";
export { applyDocLang } from "./i18n/lang-dom";
export { useLang } from "./i18n/lang-store";
export { LANG_BOOT_SCRIPT, useDir, useLangBootstrap, useT } from "./i18n/lang-hooks";
