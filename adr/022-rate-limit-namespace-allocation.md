# ADR 022: Rate-limit namespaces are per Worker, with a region suffix

## Status

Accepted and implemented for the five apex Workers.

## Context

Cloudflare rate-limit counters are keyed by (`namespace_id`, key) and scoped to the account.
Bindings in separate Workers that share an id also share a counter. Each apex Worker has an
independent traffic profile, so its general limiter needs a unique id.

## Decision

The production general `RATE_LIMITER` namespace is:

```text
<development-port><region>
```

The region suffix is two digits. All current apex Workers are global and use `00`. Their
development port is formed from the TLD code and apex surface code `01`:

| TLD code | TLD    | Port | Worker     |
| -------- | ------ | ---: | ---------- |
| `51`     | `.com` | 5101 | `com/apex` |
| `52`     | `.net` | 5201 | `net/apex` |
| `53`     | `.org` | 5301 | `org/apex` |
| `54`     | `.app` | 5401 | `app/apex` |
| `55`     | `.dev` | 5501 | `dev/apex` |

Non-production environments prefix the six-digit production id:

| Prefix | Environment |
| ------ | ----------- |
| (none) | production  |
| `2`    | development |
| `3`    | test        |

The currently configured production ids are:

| Worker     | Production | Development |      Test |
| ---------- | ---------: | ----------: | --------: |
| `com/apex` |   `510100` |   `2510100` | `3510100` |
| `net/apex` |   `520100` |   `2520100` | `3520100` |
| `org/apex` |   `530100` |   `2530100` | `3530100` |
| `app/apex` |   `540100` |   `2540100` | `3540100` |
| `dev/apex` |   `550100` |   `2550100` | `3550100` |

Every binding uses the same `RATE_LIMITER` budget of 2000 requests per 60 seconds. Do not reuse an
id across Workers, add environment prefixes that are not declared by a package, or alter these
assignments without an owner decision.

## Consequences

The source of each port is the package's `scripts.dev --port`; the checker derives the namespace
using `tools/lib/rate-limit-namespaces.mjs` and verifies all five `wrangler.jsonc` files. The
assignment table is maintained in [rate-limit namespace allocation](../docs/operations/rate-limit-namespace-allocation.md).
