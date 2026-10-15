// SRP: consent constants + shape only.
export const COOKIE_NOTICE_DELAY_MS = 5000;
export const COOKIE_CONSENT_KEY = "floukaa-cookie-consent";
export const COOKIE_SESSION_KEY = "floukaa-cookie-session";
export const CONSENT_VERSION = 1;

export type CookieConsent = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: number;
};
export type StorageLike = Pick<Storage, "getItem" | "setItem">;
