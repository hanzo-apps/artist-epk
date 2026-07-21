# artist-epk (Pressroom) — agent notes

An electronic press kit + release hub for a musician, forked from the canonical
Hanzo app starter. Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam` (auth) +
`@hanzo/base` (data). Keep it REAL — every surface must build and run, no
fabricated UI or metrics.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam is what makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`. The
  IAM client id is `VITE_IAM_CLIENT_ID` (fallback `hanzo-app`).
- **Palette is one place** (`src/theme.ts`) — plain hex/rgba strings; no second
  styling system, no Tailwind.
- **UI is one system** — `@hanzo/gui` primitives only. Views: `public-landing`
  (signed out) and the signed-in `shell` switching `landing` / `releases` /
  `tour` / `admin`, with a shared `hero`.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`alignSelf`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`self`/
  `rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
- **`Button` is Stack-typed here.** It does NOT accept text props (`color`/
  `fontWeight`/`fontSize`) or `color` inside `hoverStyle`/`pressStyle` — put the
  label in a child `<Text>` and keep only frame props on the `Button` (see
  `PrimaryButton`/`GhostButton` in `src/components.tsx`). `Button` uses `onPress`;
  `Input` uses `value`/`onChangeText`; `Input.placeholderTextColor` wants a
  `ColorTokens` token, not an rgba string (so it's left default).
- **`LinearGradient`** comes from `@hanzo/gui/linear-gradient`; `start`/`end` are
  `[x, y]` tuples; `colors` accepts plain hex strings.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Keep it in
  lockstep with `src/lib/records.ts` and the Admin form writes (`releases`,
  `shows`, `press_assets`).

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage (the `*.hanzo.app` published-sites edge). No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped, IAM-native, rule `@request.auth.org_id = org`). Runtime read/write
  is browser → `VITE_HANZO_BASE_URL` with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Deploy provisions a per-app `artist-epk` client (or use a
  `https://*.hanzo.app/auth/callback` wildcard on the shared client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` · renders under Vite with zero
console errors (public landing verified headless at 1280×800) · `login()`
performs a real PKCE S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
