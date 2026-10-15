// SRP: consent payload validation. Pure — no storage, no timers.
import { CONSENT_VERSION, type CookieConsent } from "./consent-types";

export function parseConsent(raw: string | null): CookieConsent | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (
      value?.version !== CONSENT_VERSION ||
      value.necessary !== true ||
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean" ||
      typeof value.savedAt !== "number" ||
      !Number.isFinite(value.savedAt)
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
