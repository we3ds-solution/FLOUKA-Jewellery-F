# FLOUKA Jewellery — Storefront

TanStack Start storefront for [floukaa.com](https://floukaa.com) — accessories and gifts (Arabic-first, RTL). Catalog data loads live from the WooCommerce export; checkout hands off to floukaa.com.

## Stack

- **TanStack Start + TanStack Router** (file routes in `src/routes`, see `src/routes/README.md`) **+ TanStack Query**
- **React 19**, **Tailwind CSS v4**, **shadcn-style ui** (`src/components/ui`), **Zustand** stores (`src/stores`)
- **Vite 8**, **Vitest**, **pnpm** (see `package.json` → `packageManager`)

## Prerequisites

- Node.js 24
- pnpm 10 via corepack (no global install needed):
  ```sh
  corepack enable
  corepack prepare pnpm@10.18.0 --activate
  ```

## Development

```sh
pnpm install
pnpm dev      # local dev on http://localhost:5173
pnpm build    # production build
pnpm preview  # preview the build
pnpm test     # vitest run
pnpm lint     # eslint
```

## Environment

| Variable | Required | Used by |
|---|---|---|
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` | Server contact form | `src/lib/support/contact.ts` via `src/integrations/supabase/client.server.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server contact form | Same as above (never exposed to the client) |

Without Supabase env, the contact form degrades to a friendly "unavailable" message instead of crashing. No `VITE_*` vars are required for the storefront itself.

## Architecture map

- `src/lib/catalog/*` — catalog data layer: `woo-types` (shapes) → `html` (text) → `family` (color/size grouping, one card per family) → `woo-map` (Woo → storefront) → `catalog-cache` (fetch + filter) → `catalog-query` (public API). `src/lib/floukaa.functions.ts` re-exports the surface.
- `src/lib/shopify.ts` — storefront facade (`getProducts` / `getProduct` / `getRelated`); money formatting lives in `src/lib/format.ts`.
- `src/lib/i18n/*` — dictionary → store → DOM → React hooks (`useT`, `useDir`).
- `src/stores/` — `account` (demo profile, hashed-at-rest), `cart` (local + catalog revalidation), `compare`, `wishlist`, `notifications` (see below).
- `src/components/store/` — header/shell, hero, catalog, product (`product/`), account UI.

## Scope notes (demo behavior, keep it)

- **Account** is a browser-local demo (`demo@floukaa.com`); passwords are stored as salted hashes only, never plain text. Real server auth is tracked in GitHub issue #2.
- **Notifications** are session-only activity + Sonner toasts — UI feedback, not delivery (issue #6).
- **Cart** is local with catalog revalidation on sync; checkout completes on floukaa.com (issue #3).

## Docs

- `docs/CODE_REVIEW_ISSUES.md` — audit backlog, each item tracked as a GitHub issue (#2–#9).
- `roadmap.md` — shipped vs remaining storefront checklist.
- `src/routes/README.md` — routing conventions (TanStack file routes — no Next.js/Remix patterns).
