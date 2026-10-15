// SRP: notice display timing only. No validation, no storage.
import { COOKIE_NOTICE_DELAY_MS } from "./consent-types";

export function scheduleCookieNotice(show: () => void): () => void {
  const timer = setTimeout(show, COOKIE_NOTICE_DELAY_MS);
  return () => clearTimeout(timer);
}
