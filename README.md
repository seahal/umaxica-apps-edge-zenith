# Umaxica Apps Edge Zenith

Zenith owns five Hono Workers for the Umaxica apex domains. Each package builds with Vite+ and the Cloudflare Vite plugin, and deploys independently through Wrangler.

| Workspace  | Host          | Local port |
| ---------- | ------------- | ---------: |
| `app/apex` | `umaxica.app` |       5401 |
| `com/apex` | `umaxica.com` |       5101 |
| `org/apex` | `umaxica.org` |       5301 |
| `net/apex` | `umaxica.net` |       5201 |
| `dev/apex` | `umaxica.dev` |       5501 |

Worker names, production routes, bindings, rate-limit namespaces, and Wrangler environments belong to each package's `wrangler.jsonc`.

## Setup

Use Node.js 26.13.1 and pnpm 12.18.0. Install dependencies at the repository root:

```sh
pnpm install
```

Start one Worker from the rootless Dev Container:

```sh
pnpm --dir app/apex run dev
```

The other packages use the same command with their workspace path. The standalone Compose profile can start each package as its own service; `podman compose --profile app up app-apex` starts the app apex Worker. The default Dev Container publishes the five local ports and Wrangler's login callback.

## Development commands

Vite+ (`vp`) provides formatting, linting, tests, and the Vite build. Each Worker keeps its own Vite configuration, test setup, lint settings, and format settings so it can be extracted as a standalone package.

```sh
pnpm run format:check
pnpm run lint:check
pnpm run typecheck
pnpm run knip
pnpm run test
pnpm run test:api
pnpm run test:e2e
pnpm run check:architecture
pnpm run check:deps
pnpm run check:spelling
pnpm run build
```

`pnpm run test` runs each Worker suite and the repository invariants. Vitest tests live in `<workspace>/test/`, Hurl response contracts in `<workspace>/api/`, and Playwright browser paths in `<workspace>/e2e/`. `pnpm run check` runs the static checks and unit suites. `pnpm run check:size` measures bundles after a build.

`pnpm run check:local` checks the five local `/api/v0/health.json` endpoints. `pnpm run login` opens Wrangler's browser login flow; `pnpm run login:device` uses the device authorization flow. Preview deployment is available through `pnpm run deploy:edge:preview -- <workspace>`.

## Worker contract

All five Workers use Hono and Vite. Vite builds the Worker bundle and fingerprinted static assets; production runs the Worker in Cloudflare and starts no Node server. Each package owns its own dependencies and configuration.

The apex Worker contract includes `/api/v0/health.json`, `/api/v0/revision.json`, `/revision`, the Hono structured logger, security headers, and first-touch rate limiting. Rails-backed Core and public content surfaces live in the Sphere and Press repositories.

Use `hono/cookie` for server-side cookie handling. Do not add browser cookie access without a concrete browser feature; browser code uses the Cookie Store API. Never log tokens, cookies, request bodies, user identifiers, hostnames, or free-form values.

## Architecture records

- [ADR 011](adr/011-apex-workers-stay-hono.md): Hono owns the apex Workers.
- [ADR 012](adr/012-apex-vite-build-and-static-assets.md): Vite builds each Worker and its static assets.
- [ADR 014](adr/014-edge-owned-development-tunnel.md): development Tunnel ownership.
- [ADR 017](adr/017-edge-self-health-api.md): Edge self-health API.
- [ADR 020](adr/020-wrangler-device-login.md): Wrangler login.
- [ADR 021](adr/021-hsts-preload.md): HSTS policy.
- [ADR 022](adr/022-rate-limit-namespace-allocation.md): rate-limit namespace allocation.
- [ADR 027](adr/027-reintroduce-app-com-org-apex-units.md): app/com/org apex units.

See [AGENTS.md](AGENTS.md) for repository workflow and boundaries. Evidence records live in `evidence/`.
