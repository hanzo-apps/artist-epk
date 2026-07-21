# Pressroom — Artist EPK & Releases

Your press kit, one link. A real, buildable **electronic press kit** and release
hub for a musician — fork it on [hanzo.app](https://hanzo.app) and deploy live on
Hanzo Cloud.

Fans and press land on a dark, neon pressroom: the artist hero, the latest
release, biography, streaming presence and a discography grid. Signed in, the
artist manages the catalogue — **releases**, **tour dates** and downloadable
**press assets** — all stored per-org in Hanzo Base.

- **UI** — [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui) (the Hanzo
  design system, Tamagui line) under Vite + React 19. One kit, no Tailwind.
- **Auth** — [`@hanzo/iam`](https://www.npmjs.com/package/@hanzo/iam), OAuth2
  **PKCE** against [hanzo.id](https://hanzo.id). No local passwords — IAM owns
  every credential interaction.
- **Data** — [`@hanzo/base`](https://www.npmjs.com/package/@hanzo/base), the
  IAM-native, org-scoped data plane. Releases, shows and press assets are real
  Base collections.

## Views

| View | What it shows |
| --- | --- |
| **Home** | Hero (oversized artist name, hook, bio), the latest release, biography and the downloadable press kit. |
| **Releases** | The discography as a rhythmic grid of cover art, each with a streaming link. |
| **Tour** | Upcoming shows (past dates fall off), a date ticker + ticket link per row. |
| **Admin** | Signed-in only — add / remove releases, shows and press assets. |

The signed-out landing is the public face (and the honest pre-auth thumbnail);
the catalogue + management live behind Hanzo sign-in.

## Stack (pinned)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `^19.2.4` |
| `@hanzo/gui` + `@hanzogui/config` | `7.3.0` |
| `@hanzo/iam` | `^0.13.1` |
| `@hanzo/base` | `^0.2.1` |
| `vite` | `^6` (`@vitejs/plugin-react`) |
| `react-native-web` | `^0.21.0` |
| `typescript` | `5.9.3` |

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # serve the production build (SPA fallback on)
```

Out of the box it runs against **live** Hanzo (hanzo.id + api.hanzo.ai) — no
config needed to see the sign-in flow. Copy `.env.example` to `.env` to point at
a different environment.

## Environment contract

Only `VITE_`-prefixed vars reach the browser (this is a static SPA — there is no
server). Defaults in parentheses.

| Var | Purpose |
| --- | --- |
| `VITE_HANZO_IAM_URL` (`https://hanzo.id`) | OIDC issuer. |
| `VITE_IAM_CLIENT_ID` (`hanzo-app`) | IAM application (`<org>-<app>`). Deploy provisions a per-app `artist-epk` client whose redirect-URI list allows this origin's `/auth/callback`. |
| `VITE_HANZO_REDIRECT_URI` (`${origin}/auth/callback`) | PKCE redirect. |
| `VITE_HANZO_BASE_URL` (`https://api.hanzo.ai`) | Browser-reachable Hanzo Base data plane. Deploy injects the provisioned URL. |

## How auth works — ambient IAM

`login()` starts an OAuth2 **PKCE S256** redirect to hanzo.id; hanzo.id returns
to `/auth/callback`, where `handleCallback()` exchanges the code for tokens
(stored in `localStorage`, refresh-aware via `offline_access`). Every deployed
app is a static site at `<slug>.hanzo.app`; there is **no server token** — the
SPA authenticates the user in the browser and carries the resulting IAM JWT to
Base. "Ambient" means the app just reads the signed-in user via that token.

The one deploy requirement: the IAM client (`VITE_IAM_CLIENT_ID`) must list this
origin's `/auth/callback` as an allowed redirect URI. Deploy provisions a
dedicated `artist-epk` client (or use the shared `hanzo-app` client with a
`https://*.hanzo.app/auth/callback` wildcard).

## How data works — Base from `schema.sql`

[`schema.sql`](./schema.sql) is the app's `databaseSchema` (SQL DDL) for three
collections — `releases`, `shows`, `press_assets`. On publish, Hanzo Cloud
translates each `CREATE TABLE` into a Hanzo Base collection
(`provisionBaseFromDDL`, additive + idempotent). Base manages
`id`/`created`/`updated`/`owner`/`org`, stamps `owner`+`org` from the verified
IAM principal, and scopes every row to the caller's org (rule
`@request.auth.org_id = org`) — a teammate in your org sees the row; other orgs
cannot. At runtime the views read/write through `@hanzo/base/react`
(`useQuery`/`useMutation`) carrying the IAM token. Keep `schema.sql` in lockstep
with [`src/lib/records.ts`](./src/lib/records.ts) and the Admin form writes.

## Deploy — Hanzo Cloud

[`hanzo.yml`](./hanzo.yml) declares a static build (`npm run build` → `dist/`,
served at `<slug>.hanzo.app`) plus the Base schema to provision and the env to
inject. Do **not** build a container image locally — Hanzo Cloud owns builds and
deploys. CI here only proves the template compiles green.

## Layout

```
src/
  main.tsx          entry
  providers.tsx     GuiProvider -> IamProvider -> BaseProvider(client=IAM-token)
  app.tsx           route (/auth/callback) + auth gate (public landing / shell)
  gui.config.ts     createGui(defaultConfig from @hanzogui/config/v5)
  iam.config.ts     IAM PKCE config
  env.ts            the VITE_ env contract, one place
  theme.ts          the neon palette (hex/rgba, one place)
  content.ts        static artist identity (name, bio, genres)
  components.tsx    the @hanzo/gui design pieces (buttons, cover art, chips…)
  lib/base.ts       BaseClient carrying the IAM bearer token
  lib/records.ts    row shapes for the three collections
  lib/format.ts     date + link helpers
  auth/callback.tsx PKCE return leg
  views/            public-landing · shell · hero · landing · releases · tour · admin
schema.sql          databaseSchema -> Base collections on publish
hanzo.yml           Hanzo Cloud build/deploy manifest
```
