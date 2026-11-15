# ADR 017: Edge self-health machine API

## Status

Implemented in the five apex Workers.

## Context

The Hono apex Workers need a machine-facing document that answers whether the Worker itself can
serve a request. It must remain independent from upstream applications and external bindings.

## Decision

1. Each Worker exposes `GET /api/v0/health.json` as an Edge-only JSON document.
2. The response does not read bindings, call another service, or include revision metadata. A
   dependency outage cannot change this response.
3. The document has exactly two top-level keys, `status` and `checks`. The current checks are
   `startup`, `liveness`, and `readiness`, each with status `pass` when the handler executes.
4. The response uses `application/json`, `Cache-Control: no-store`, and
   `X-Robots-Tag: noindex, nofollow`. It does not redirect or set a cookie.
5. `/health` and its operational probe paths remain separate `text/plain` responses.
6. Each Worker owns its implementation locally. Hurl owns the HTTP contract in
   `<workspace>/api/health-api.hurl`.

## Consequences

This response is a constant and does not claim that an external dependency is ready. Operators
must use dependency-specific checks where they need that information. The root invariant suite
checks that all five Hono applications expose the same route contract.

See [Edge self-health API](../docs/development/edge-self-health-api.md).
