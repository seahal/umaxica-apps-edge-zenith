# Repository guidance

Zenith contains five standalone Hono Workers: `app/apex`, `com/apex`, `org/apex`, `net/apex`, and `dev/apex`. Each builds through Vite+ and the Cloudflare Vite plugin and deploys independently to Cloudflare Workers.

## Package manager and setup

- pnpm 12.18.0 is the only package manager. Do not use npm, npx, yarn, or bun.
- Install with `pnpm install` from the workspace root.
- Node.js is pinned to 26.13.1. Keep `Containerfile`, `package.json`, and the CI setup aligned.
- `pnpm-workspace.yaml` lists the five deployment units. Each package owns its dependencies and its Vite, TypeScript, Vitest, Oxlint, Oxfmt, Knip, and Wrangler configuration.

## Commands

- `pnpm run format` / `pnpm run format:check` use Vite+ formatting.
- `pnpm run lint` fixes lint findings locally; `pnpm run lint:check` is read-only.
- `pnpm run typecheck` runs each package's Wrangler type generation and TypeScript check.
- `pnpm run test` runs the five unit suites and the root invariant suite.
- `pnpm run test:api` runs the Hurl HTTP contracts; `pnpm run test:e2e` runs Playwright.
- `pnpm run build` builds all five Workers. `pnpm run check:size` runs after a build.
- `pnpm run knip`, `check:architecture`, `check:deps`, `check:spelling`, and `check:workers` check repository and package boundaries.

Place tests by assertion. Internal logic belongs in `<workspace>/test/` with Vitest. HTTP response status, headers, body, cookies, and redirects belong in `<workspace>/api/` with Hurl. Browser rendering and accessibility behavior belong in `<workspace>/e2e/` with Playwright.

## Cloudflare boundary

Do not change a kept Worker name, production route, binding, rate-limit namespace, secret, or Wrangler environment as part of unrelated work. Never run deploy, remote Wrangler, or Cloudflare changes without explicit authorization. Do not print secrets or environment values. `wrangler types` generates local ignored type files and is used by typecheck.

Worker bundles are produced by Vite. Production runs no Node process. Keep the five apex packages independent; do not introduce imports or configuration paths between deployment units.

## Code conventions

- Do not call `console` directly. Use each apex package's structured logger.
- Server-side cookies use Hono's cookie helpers. Browser cookie access uses the Cookie Store API.
- Tailwind CSS v4 is the styling layer. Each package owns its stylesheet and theme.
- Keep composition modules side-effect-light. Export only the consumer-facing surface needed now.
- Before adding a static-analysis suppression, read `docs/development/static-analysis-and-hygiene.md`.

## Evidence

Keep useful records of checks actually performed in flat `evidence/YYYY-MM-DD-<topic>.md` files. Do not record intentions as completed work. Summarize large outputs instead of committing logs or generated artifacts.
