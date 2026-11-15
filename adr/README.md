# Architecture Decision Records

These records describe decisions that apply to Zenith's five apex Workers and their development
environment. The split work order and historical decisions are retained as context; their older
package counts and deployment inventories are not current configuration.

## Current decisions

- [ADR 010](010-first-touch-rate-limiting.md) — rate limiting at the Hono request boundary
- [ADR 011](011-apex-workers-stay-hono.md) — Hono remains the apex runtime
- [ADR 012](012-apex-vite-build-and-static-assets.md) — Vite builds Worker bundles and static assets
- [ADR 014](014-edge-owned-development-tunnel.md) — the development Tunnel belongs to this repository
- [ADR 017](017-edge-self-health-api.md) — Edge self-health response contract
- [ADR 020](020-wrangler-device-login.md) — Wrangler device authorization
- [ADR 021](021-hsts-preload.md) — HSTS response policy
- [ADR 022](022-rate-limit-namespace-allocation.md) — per-Worker rate-limit namespace allocation
- [ADR 027](027-reintroduce-app-com-org-apex-units.md) — app/com/org apex deployment units

## History

- [ADR 002](002-dev-apex-vercel.md) records the former Vercel deployment for `dev/apex`.
- [ADR 003](003-apex-direct-composition.md) records the Hono composition boundary.
- [ADR 008](008-edge-development-tunnel-exposure.md) records the earlier development-surface Tunnel design and its current Access policy.
- [ADR 024](024-retire-app-com-org-apex-units.md) is superseded by ADR 027 and remains as history.
