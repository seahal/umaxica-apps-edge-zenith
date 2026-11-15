# ADR 010: Rate limiting happens once at first touch

## Status

Accepted; implemented for the five apex Workers.

## Context

The apex Workers are independent Hono applications. Rate limiting belongs at their shared request
boundary so a path cannot bypass the limiter by reaching a different route handler. Every Worker
uses its own Cloudflare `RATE_LIMITER` namespace; cross-surface counter sharing would couple
independent applications and failure budgets.

## Decision

1. Each Hono application consults its `RATE_LIMITER` binding once before route dispatch, using the
   Cloudflare client IP as the key and a fixed fallback key when that header is unavailable.
2. `/health/startups`, `/health/livenesses`, and `/api/v0/health.json` are unmetered so rate limiting
   cannot make startup, liveness, or machine self-health appear unavailable.
3. A denied request receives a `429` HTML response with `Cache-Control: no-store`; the common
   security-header middleware decorates it.
4. The application continues without a limiter when the binding is absent in local Vite development.
5. Each apex package owns the same implementation locally. The general production budget is 2000
   requests per 60 seconds. Namespace assignment is defined by ADR 022.

## Consequences

The middleware and binding are configured in each package's `src/create-apex-app.ts` and
`wrangler.jsonc`. Vitest covers the key and denial behavior; HTTP response contracts belong to Hurl.
`tools/check-workers.mjs` enforces the binding, budget, and per-environment namespace uniqueness.
