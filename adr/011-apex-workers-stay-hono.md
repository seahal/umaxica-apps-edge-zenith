# ADR 011: The apex Workers stay Hono

## Status

Accepted and retained for the five apex Workers.

## Context

Each package handles HTTP routing, middleware, health and revision responses, and a small server-
rendered HTML surface. These Workers use Hono and do not need a client-side application framework.
The app, com, org, net, and dev packages are standalone deployment units.

## Decision

1. Keep Hono as the runtime in `app/apex`, `com/apex`, `org/apex`, `net/apex`, and `dev/apex`.
2. Use Hono's JSX renderer for HTML. Keep the request boundary, security headers, structured logger,
   and rate-limit behavior in the Hono application.
3. Use Vite as the build and local development toolchain, not as a reason to add a browser framework.
4. Keep each package self-contained. Do not create shared implementation packages across Workers.

## Consequences

The five packages keep their own Hono entry points, dependencies, configuration, tests, and
static assets. The HTTP interface is tested through Hurl; internal Hono logic is tested with
Vitest. Production runs the generated Worker bundle and starts no Node process.

Vite's Worker build and static asset handling are recorded in [ADR 012](012-apex-vite-build-and-static-assets.md).
