# ADR 003: Each apex package owns its Hono composition

## Status

Completed; current package boundaries confirmed after the 2026-11-14 split.

## Context

The original migration removed a shared `shared/apex` composition module and moved
`createApexApp` into the individual deployment packages. The later repository split kept those
packages independent. Their implementations must remain usable without importing another Worker
or a shared runtime package.

The current implementation keeps the request middleware in each package's
`src/create-apex-app.ts`. Its `src/index.tsx` passes that package's page routes to the local factory.
The five copies are intentional; they preserve the standalone deployment boundary.

## Decision

1. Each of the five apex packages owns its Hono app factory, middleware, routes, renderers and
   tests.
2. A package may compose its page routes through its own `createApexApp` callback. The factory
   does not import another unit or a root-level runtime helper.
3. Keep the five implementations converged through package-local changes and repository boundary
   checks, not a shared deployment package.

## Consequences

- Hono remains the runtime for all five Workers (ADR 011).
- Each package has its own `vite.config.ts` and tests, and can build independently.
- Vitest owns internal logic assertions; each package's Hurl suite owns its HTTP response contract.
