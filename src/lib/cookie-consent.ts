export const COOKIE_NOTICE_DELAY_MS = 5000;
export const COOKIE_CONSENT_KEY = 'floukaa-cookie-consent';
export const COOKIE_SESSION_KEY = 'floukaa-cookie-session';
const VERSION = 1;

export type CookieConsent = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: number;
};
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function parseConsent(raw: string | null): CookieConsent | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (value?.version !== VERSION || value.necessary !== true ||
      typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean' ||
      typeof value.savedAt !== 'number' || !Number.isFinite(value.savedAt)) return null;
    return value;
  } catch { return null; }
}

export function readConsent(local: StorageLike | null, session: StorageLike | null): CookieConsent | null {
  for (const [storage, key] of [[local, COOKIE_CONSENT_KEY], [session, COOKIE_SESSION_KEY]] as const) {
    try {
      const consent = parseConsent(storage?.getItem(key) ?? null);
      if (consent) return consent;
    } catch { /* Try the session fallback when browser storage is blocked. */ }
  }
  return null;
}

export function saveConsent(local: StorageLike | null, session: StorageLike | null, analytics: boolean, marketing: boolean): CookieConsent {
  const consent: CookieConsent = { version: VERSION, necessary: true, analytics, marketing, savedAt: Date.now() };
  for (const [storage, key] of [[local, COOKIE_CONSENT_KEY], [session, COOKIE_SESSION_KEY]] as const) {
    try { storage?.setItem(key, JSON.stringify(consent)); } catch { /* The choice still applies in memory. */ }
  }
  return consent;
}

export function browserConsentStorage(): { local: StorageLike | null; session: StorageLike | null } {
  let local: StorageLike | null = null, session: StorageLike | null = null;
  try { local = window.localStorage; } catch { /* Private browser mode. */ }
  try { session = window.sessionStorage; } catch { /* Private browser mode. */ }
  return { local, session };
}

export function scheduleCookieNotice(show: () => void): () => void {
  const timer = setTimeout(show, COOKIE_NOTICE_DELAY_MS);
  return () => clearTimeout(timer);
}