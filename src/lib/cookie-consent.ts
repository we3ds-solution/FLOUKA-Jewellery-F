// Barrel: preserves the `@/lib/cookie-consent` import surface.
export {
  CONSENT_VERSION,
  COOKIE_CONSENT_KEY,
  COOKIE_NOTICE_DELAY_MS,
  COOKIE_SESSION_KEY,
} from "./consent/consent-types";
export type { CookieConsent, StorageLike } from "./consent/consent-types";
export { parseConsent } from "./consent/consent-validation";
export { browserConsentStorage, readConsent, saveConsent } from "./consent/consent-storage";
export { scheduleCookieNotice } from "./consent/consent-schedule";
