# FLOUKA Jewellery — Code Review Open Issues

Audit of https://github.com/we3ds-solution/FLOUKA-Jewellery-F (storefront for floukaa.com).
Source: deep code review, Oct 2026.

Track these as GitHub Issues. Issue #2 already exists (title only; body should be replaced with §1).

---

## 1. [Critical] Replace demo auth — passwords stored in plain text in localStorage

**Priority:** Critical  
**Related:** `src/stores/account/account-store.ts`, `src/stores/account/demo-account.ts`, `src/integrations/supabase/client.ts`

### Problem
- Login compares plain-text passwords stored in the client profile.
- `register()` persists the password in localStorage via Zustand persist (`floukaa-account`).
- Demo credentials live in source.
- Notifications gated on `hydrated && signedIn` depend on this fake auth.

### Impact
Anyone with browser access can read stored passwords. No real session/JWT/server auth.

### Suggested fix
1. Switch to Supabase Auth (`signInWithPassword` / `signUp` / session listeners).
2. Never store passwords on the client.
3. Keep local profile/prefs only for non-sensitive data after a real session.
4. Guard demo credentials behind a `DEV` flag.

---

## 2. [High] Cart is local-only — no server validation before checkout

**Priority:** High  
**Related:** `src/stores/cart/cart-store.ts`, `src/stores/cart/checkout-url.ts`, `src/components/store/cart-drawer.tsx`

### Problem
- Cart is Zustand + localStorage (`floukaa-cart-v2`).
- `syncCart` is a no-op (deprecated stub).
- Checkout only builds a URL; no stock/price re-validation.

### Impact
Stale prices, out-of-stock items, DevTools cart manipulation, no multi-device sync.

### Suggested fix
Real cart API (Woo/Shopify/Supabase), re-validate before checkout, treat local cart as cache only.

---

## 3. [High] Catalog depends on external WooCommerce with limited failure handling

**Priority:** High  
**Related:** `src/lib/catalog/catalog-query.ts`, `src/lib/catalog/catalog-cache.ts`, `src/lib/catalog/woo-map.ts`

### Problem
- Catalog is a thin Woo client with Zod param validation (good) but limited offline/error UX.
- Family dedupe depends on upstream product shape.

### Impact
API outages or catalog shape changes break product/list pages.

### Suggested fix
Error boundaries, empty/offline states, rate-limit awareness, contract tests against Woo responses.

---

## 4. [Medium] Supabase client present but under-used / fragile env handling

**Priority:** Medium  
**Related:** `src/integrations/supabase/client.ts`, auth middleware/cron helpers

### Problem
- Complex proxy + server URL rewriting + new API key handling.
- Throws hard if env vars missing.
- Main account flow ignores Supabase Auth.

### Suggested fix
Wire real auth; soft-fail or clear UI when env missing in preview; document required env vars.

---

## 5. [Medium] Notifications are session-only (no real delivery)

**Priority:** Medium  
**Related:** `src/stores/notification-state.ts`, `src/stores/notify-adapter.ts`, `src/components/store/notification-button.tsx`

### Problem
Activity is session-only Zustand + Sonner. "Notification settings" are local prefs only.

### Suggested fix
Document as UI feedback only, or add remote/push/email when product requires it.

---

## 6. [Medium] Expand test coverage

**Priority:** Medium  
**Related:** `src/test/notifications.test.ts`, `src/test/app-routing.test.tsx`

### Problem
Only small Vitest coverage for notifications + routing. No cart/account/catalog/i18n tests.

### Suggested fix
Unit tests for cart store, account flows, catalog family logic; key i18n keys; critical E2E paths.

---

## 7. [Low] Footer social polish (roadmap)

**Priority:** Low  
**From:** `roadmap.md`

- Add footer YouTube and fix TikTok contrast with polished social animations.
- Verify footer social icons in both themes and reduced-motion mode.

---

## 8. [Low] Clean README and onboarding docs

**Priority:** Low  
**Related:** `README.md`

README is Lovable boilerplate + garbled English. Replace with stack overview, env setup, scripts, architecture links.

---

## Suggested GitHub labels

`critical` · `high` · `medium` · `low` · `security` · `bug` · `enhancement` · `docs`
