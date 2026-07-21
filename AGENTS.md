# Agent guide

Canonical instructions for this repo live in [`LLM.md`](./LLM.md) (and its
`CLAUDE.md` symlink). Read it before changing anything.

TL;DR: Pressroom — an artist EPK + release hub. Vite + React 19 + `@hanzo/gui` +
`@hanzo/iam` + `@hanzo/base`. Keep it minimal and real. `@hanzo/gui` needs the
react-native-web alias + Tamagui defines in `vite.config.ts` and uses Tamagui
LONGHAND props (tsc enforces this); `Button` is Stack-typed, so label styling
goes on a child `<Text>`, not the frame. `schema.sql` (`releases`, `shows`,
`press_assets`) is the Base data contract — keep it in lockstep with
`src/lib/records.ts`. Prove changes with `npm run build` (tsc + vite). Never
build a container image locally — Hanzo Cloud owns deploys.
