// SRP: consent persistence (local + session fallback). No validation
// logic here beyond delegating to parseConsent; no UI timing.
import {
  COOKIE_CONSENT_KEY,
  COOKIE_SESSION_KEY,
  CONSENT_VERSION,
  type CookieConsent,
  type StorageLike,
} from "./consent-types";
import { parseConsent } from "./consent-validation";

export function readConsent(
  local: StorageLike | null,
  session: StorageLike | null,
): CookieConsent | null {
  for (const [storage, key] of [
    [local, COOKIE_CONSENT_KEY],
    [session, COOKIE_SESSION_KEY],
  ] as const) {
    try {
      const consent = parseConsent(storage?.getItem(key) ?? null);
      if (consent) return consent;
    } catch {
      /* Try the session fallback when browser storage is blocked. */
    }
  }
  return null;
}

export function saveConsent(
  local: StorageLike | null,
  session: StorageLike | null,
  analytics: boolean,
  marketing: boolean,
): CookieConsent {
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    savedAt: Date.now(),
  };
  for (const [storage, key] of [
    [local, COOKIE_CONSENT_KEY],
    [session, COOKIE_SESSION_KEY],
  ] as const) {
    try {
      storage?.setItem(key, JSON.stringify(consent));
    } catch {
      /* The choice still applies in memory. */
    }
  }
  return consent;
}

export function browserConsentStorage(): {
  local: StorageLike | null;
  session: StorageLike | null;
} {
  let local: StorageLike | null = null,
    session: StorageLike | null = null;
  try {
    local = window.localStorage;
  } catch {
    /* Private browser mode. */
  }
  try {
    session = window.sessionStorage;
  } catch {
    /* Private browser mode. */
  }
  return { local, session };
}
